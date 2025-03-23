import { loadSecretsToEnv } from '$lib/server/secretManager';
import type { LayoutServerLoad } from './$types';

/**
 * サーバーサイドでのみ実行される処理
 * アプリケーションの起動時にSecret Managerから機密情報を取得する
 */
export const load: LayoutServerLoad = async () => {
  try {
    // GCPプロジェクトIDを指定（環境変数から取得するか、ハードコードする）
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id';
    
    // 必要なシークレットの名前を指定
    const secretNames = [
      'PUBLIC_SUPABASE_URL',
      'PUBLIC_SUPABASE_ANON_KEY',
      'VITE_GITHUB_TOKEN',
      'VITE_GITHUB_REPO_OWNER',
      'VITE_GITHUB_REPO_NAME',
      'VITE_GOOGLE_AI_API_KEY'
    ];
    
    // Secret Managerからシークレットを取得して環境変数に設定
    await loadSecretsToEnv(secretNames, projectId);
    
    console.log('Secret Managerからすべての機密情報を取得しました');
  } catch (error) {
    console.error('Secret Managerからの機密情報取得に失敗しました:', error);
  }
  
  // クライアントサイドに渡すデータ（今回は何も渡さない）
  return {};
};
