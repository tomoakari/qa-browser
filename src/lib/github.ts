import { Octokit } from 'octokit';

// 環境変数から値を取得（ブラウザとサーバーの両方で動作するように）
const getGithubToken = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env && process.env.VITE_GITHUB_TOKEN) {
    return process.env.VITE_GITHUB_TOKEN;
  }
  // クライアントサイドの場合
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GITHUB_TOKEN) {
    return import.meta.env.VITE_GITHUB_TOKEN;
  }
  // 環境変数が設定されていない場合
  return null;
};

const getRepoOwner = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env && process.env.VITE_GITHUB_REPO_OWNER) {
    return process.env.VITE_GITHUB_REPO_OWNER;
  }
  // クライアントサイドの場合
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GITHUB_REPO_OWNER) {
    return import.meta.env.VITE_GITHUB_REPO_OWNER;
  }
  // 環境変数が設定されていない場合
  return null;
};

const getRepoName = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env && process.env.VITE_GITHUB_REPO_NAME) {
    return process.env.VITE_GITHUB_REPO_NAME;
  }
  // クライアントサイドの場合
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GITHUB_REPO_NAME) {
    return import.meta.env.VITE_GITHUB_REPO_NAME;
  }
  // 環境変数が設定されていない場合
  return null;
};

const githubToken = getGithubToken();
const repoOwner = getRepoOwner();
const repoName = getRepoName();

// デフォルト値を設定（開発環境用）
const defaultToken = '';
const defaultOwner = 'my-org';
const defaultRepo = 'my-qa-repo';

export const octokit = new Octokit({
  auth: githubToken || defaultToken
});

/**
 * リポジトリ内のファイル一覧を取得する
 * @returns ファイル一覧
 */
export async function getRepositoryFiles(path = '') {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: repoOwner || defaultOwner,
      repo: repoName || defaultRepo,
      path: path
    });
    
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to fetch repository files:', error);
    return { data: null, error };
  }
}

/**
 * リポジトリ内のファイル内容を取得する
 * @param path ファイルパス
 * @returns ファイル内容
 */
export async function getFileContent(path: string) {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: repoOwner || defaultOwner,
      repo: repoName || defaultRepo,
      path: path
    });
    
    // ファイルの内容はBase64でエンコードされているのでデコードする
    if ('content' in response.data && !Array.isArray(response.data)) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return { data: content, error: null };
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error(`Failed to fetch file content for ${path}:`, error);
    return { data: null, error };
  }
}

/**
 * リポジトリ内のファイルを検索する
 * @param query 検索クエリ
 * @returns 検索結果
 */
export async function searchRepository(query: string) {
  try {
    const response = await octokit.rest.search.code({
      q: `${query} repo:${repoOwner || defaultOwner}/${repoName || defaultRepo}`
    });
    
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to search repository:', error);
    return { data: null, error };
  }
}

/**
 * Secret Managerから認証情報を取得して更新する関数のインターフェース
 * 注意: この関数はサーバーサイドでのみ実行される
 */
export async function initGithubWithSecretManager(projectId?: string): Promise<void> {
  // クライアントサイドでは何もしない
  if (typeof window !== 'undefined') {
    console.warn('initGithubWithSecretManager関数はクライアントサイドでは使用できません');
    return;
  }
  
  // サーバーサイドでは実際の実装を使用
  const { initGithubWithSecretManager: serverInitGithub } = await import('./server/github');
  return serverInitGithub(projectId);
}
