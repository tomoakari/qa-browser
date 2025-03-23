import { Octokit } from 'octokit';
import { getSecret } from './secretManager';

/**
 * Secret Managerから機密情報を取得するための関数
 * @param projectId プロジェクトID（省略可）
 * @returns GitHub認証情報
 */
export async function getGithubCredentials(projectId?: string): Promise<{ token: string; owner: string; repo: string }> {
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

/**
 * Secret Managerから認証情報を取得して環境変数に設定する関数
 * @param projectId プロジェクトID（省略可）
 */
export async function initGithubWithSecretManager(projectId?: string): Promise<void> {
  try {
    // Secret Managerから認証情報を取得
    const { token, owner, repo } = await getGithubCredentials(projectId);
    
    // 環境変数に設定
    process.env.VITE_GITHUB_TOKEN = token;
    process.env.VITE_GITHUB_REPO_OWNER = owner;
    process.env.VITE_GITHUB_REPO_NAME = repo;
    
    console.log('GitHub認証情報をSecret Managerから取得しました');
  } catch (error) {
    console.error('GitHub認証情報の初期化に失敗しました:', error);
  }
}

// サーバーサイドでのGitHubクライアント
// 環境変数から値を取得
const githubToken = process.env.VITE_GITHUB_TOKEN;
const repoOwner = process.env.VITE_GITHUB_REPO_OWNER;
const repoName = process.env.VITE_GITHUB_REPO_NAME;

// デフォルト値を設定（開発環境用）
const defaultToken = '';
const defaultOwner = 'my-org';
const defaultRepo = 'my-qa-repo';

export const octokit = new Octokit({
  auth: githubToken || defaultToken
});
