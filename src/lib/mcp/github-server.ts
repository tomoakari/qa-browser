import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Octokit } from 'octokit';

class GithubMcpServer {
  private server: Server;
  private octokit: Octokit;
  private repoOwner: string;
  private repoName: string;

  constructor() {
    this.server = new Server(
      {
        name: 'github-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // 開発環境用のダミー値を設定
    const githubToken = process.env.GITHUB_TOKEN || 'dummy-token';
    this.repoOwner = process.env.GITHUB_REPO_OWNER || 'my-org';
    this.repoName = process.env.GITHUB_REPO_NAME || 'my-qa-repo';

    this.octokit = new Octokit({
      auth: githubToken
    });

    this.setupResourceHandlers();
    this.setupToolHandlers();
    
    // エラーハンドリング
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: `github://${this.repoOwner}/${this.repoName}/files`,
          name: `Files in ${this.repoOwner}/${this.repoName}`,
          mimeType: 'application/json',
          description: 'List of files in the repository',
        },
      ],
    }));

    this.server.setRequestHandler(
      ReadResourceRequestSchema,
      async (request) => {
        const match = request.params.uri.match(
          /^github:\/\/([^/]+)\/([^/]+)\/files$/
        );
        if (!match) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            `Invalid URI format: ${request.params.uri}`
          );
        }
        
        const owner = match[1];
        const repo = match[2];

        try {
          const response = await this.octokit.rest.repos.getContent({
            owner,
            repo,
            path: ''
          });
          
          return {
            contents: [
              {
                uri: request.params.uri,
                mimeType: 'application/json',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new McpError(
              ErrorCode.InternalError,
              `GitHub API error: ${error.message}`
            );
          }
          throw error;
        }
      }
    );
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_file_content',
          description: 'Get content of a file from the repository',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Path to the file in the repository',
              },
            },
            required: ['path'],
          },
        },
        {
          name: 'search_repository',
          description: 'Search for files in the repository',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query',
              },
            },
            required: ['query'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'get_file_content') {
        const { path } = request.params.arguments as { path: string };
        
        try {
          const response = await this.octokit.rest.repos.getContent({
            owner: this.repoOwner,
            repo: this.repoName,
            path,
          });
          
          if ('content' in response.data && !Array.isArray(response.data)) {
            const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
            return {
              content: [
                {
                  type: 'text',
                  text: content,
                },
              ],
            };
          }
          
          return {
            content: [
              {
                type: 'text',
                text: 'Not a file or file content could not be retrieved',
              },
            ],
            isError: true,
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error fetching file content: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      } else if (request.params.name === 'search_repository') {
        const { query } = request.params.arguments as { query: string };
        
        try {
          const response = await this.octokit.rest.search.code({
            q: `${query} repo:${this.repoOwner}/${this.repoName}`,
          });
          
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error searching repository: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
            isError: true,
          };
        }
      } else {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP server running on stdio');
  }
}

export const githubMcpServer = new GithubMcpServer();
