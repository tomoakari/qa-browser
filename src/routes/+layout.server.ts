import type { LayoutServerLoad } from './$types';

/**
 * サーバーサイドでのみ実行される処理
 * 環境変数はGitHub Actionsのsecretsから直接設定されるため、
 * Secret Managerは使用しない
 */
export const load: LayoutServerLoad = async () => {
  try {
    // 環境変数が設定されているか確認
    const envVars = [
      'PUBLIC_SUPABASE_URL',
      'PUBLIC_SUPABASE_ANON_KEY',
      'VITE_GITHUB_TOKEN',
      'VITE_GITHUB_REPO_OWNER',
      'VITE_GITHUB_REPO_NAME',
      'VITE_GOOGLE_AI_API_KEY'
    ];
    
    // 環境変数の確認（デバッグ用）
    const missingVars = envVars.filter(name => !process.env[name]);
    if (missingVars.length > 0) {
      console.warn(`以下の環境変数が設定されていません: ${missingVars.join(', ')}`);
    } else {
      console.log('すべての環境変数が正しく設定されています');
    }
  } catch (error) {
    console.error('環境変数の確認中にエラーが発生しました:', error);
  }
  
  // クライアントサイドに渡すデータ（今回は何も渡さない）
  return {};
};
