import { Octokit } from 'octokit';

// 開発環境用のダミー値を設定
const githubToken = import.meta.env.GITHUB_TOKEN || 'dummy-token';
const repoOwner = import.meta.env.GITHUB_REPO_OWNER || 'my-org';
const repoName = import.meta.env.GITHUB_REPO_NAME || 'my-qa-repo';

export const octokit = new Octokit({
  auth: githubToken
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
