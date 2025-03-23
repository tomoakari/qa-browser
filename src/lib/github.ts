import { Octokit } from 'octokit';

// 環境変数から値を取得（ブラウザとサーバーの両方で動作するように）
const getGithubToken = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_GITHUB_TOKEN;
  }
  // クライアントサイドの場合
  return import.meta.env.VITE_GITHUB_TOKEN;
};

const getRepoOwner = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_GITHUB_REPO_OWNER;
  }
  // クライアントサイドの場合
  return import.meta.env.VITE_GITHUB_REPO_OWNER;
};

const getRepoName = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_GITHUB_REPO_NAME;
  }
  // クライアントサイドの場合
  return import.meta.env.VITE_GITHUB_REPO_NAME;
};

const githubToken = getGithubToken();
const repoOwner = getRepoOwner();
const repoName = getRepoName();

// 環境変数が設定されていない場合はエラーを表示
if (!githubToken || !repoOwner || !repoName) {
  console.error('GitHub環境変数が設定されていません。');
  console.error('TOKEN:', githubToken ? '設定済み' : '未設定');
  console.error('OWNER:', repoOwner ? '設定済み' : '未設定');
  console.error('REPO:', repoName ? '設定済み' : '未設定');
}

export const octokit = new Octokit({
  auth: githubToken || ''
});

/**
 * リポジトリ内のファイル一覧を取得する
 * @returns ファイル一覧
 */
export async function getRepositoryFiles(path = '') {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: repoOwner,
      repo: repoName,
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
      owner: repoOwner,
      repo: repoName,
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
      q: `${query} repo:${repoOwner}/${repoName}`
    });
    
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Failed to search repository:', error);
    return { data: null, error };
  }
}
