import { githubMcpServer } from './github-server';

// MCPサーバーを起動する
export function startMcpServers() {
  try {
    githubMcpServer.run().catch(console.error);
    console.log('MCP servers started');
  } catch (error) {
    console.error('Failed to start MCP servers:', error);
  }
}
