import { Octokit } from 'octokit';
import { getSecret } from './secretManager';

// Secret Managerから機密情報を取得するための関数
async function getGithubCredentials(projectId?: string): Promise<{ token: string; owner: string; repo: string }> {
  try {
    // Secret Managerからシークレットを取得
    const token = await getSecret('VITE_GITHUB_TOKEN', projectId);
    const owner = await getSecret('VITE_GITHUB_REPO_OWNER', projectId);
    const repo = await getSecret('VITE_GITHUB_REPO_NAME', projectId);
    
    return { token, owner, repo };
  } catch (error) {
    console.error('GitHub認証情報の取得に失敗しました:', error);
    
    // デフォルト値を返す（開発環境用）
    return {
      token: '',
      owner: 'my-org',
      repo: 'my-qa-repo'
    };
  }
}

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
 * Secret Managerから認証情報を取得して更新する関数
 * @param projectId プロジェクトID（省略可）
 */
export async function initGithubWithSecretManager(projectId?: string): Promise<void> {
  try {
    // Secret Managerから認証情報を取得
    const { token, owner, repo } = await getGithubCredentials(projectId);
    
    // 環境変数に設定
    if (typeof process !== 'undefined' && process.env) {
      process.env.VITE_GITHUB_TOKEN = token;
      process.env.VITE_GITHUB_REPO_OWNER = owner;
      process.env.VITE_GITHUB_REPO_NAME = repo;
    }
    
    console.log('GitHub認証情報をSecret Managerから取得しました');
  } catch (error) {
    console.error('GitHub認証情報の初期化に失敗しました:', error);
  }
}
