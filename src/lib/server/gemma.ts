import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSecret } from './secretManager';

/**
 * Secret Managerから機密情報を取得するための関数
 * @param projectId プロジェクトID（省略可）
 * @returns Google AI API認証情報
 */
export async function getGemmaCredentials(projectId?: string): Promise<{ apiKey: string }> {
  try {
    // Secret Managerからシークレットを取得
    const apiKey = await getSecret('VITE_GOOGLE_AI_API_KEY', projectId);
    
    return { apiKey };
  } catch (error) {
    console.error('Google AI API認証情報の取得に失敗しました:', error);
    
    // デフォルト値を返す（開発環境用）
    return {
      apiKey: 'dummy-api-key'
    };
  }
}

/**
 * Secret Managerから認証情報を取得して環境変数に設定する関数
 * @param projectId プロジェクトID（省略可）
 */
export async function initGemmaWithSecretManager(projectId?: string): Promise<void> {
  try {
    // Secret Managerから認証情報を取得
    const { apiKey } = await getGemmaCredentials(projectId);
    
    // 環境変数に設定
    process.env.VITE_GOOGLE_AI_API_KEY = apiKey;
    
    console.log('Google AI API認証情報をSecret Managerから取得しました');
  } catch (error) {
    console.error('Google AI API認証情報の初期化に失敗しました:', error);
  }
}

// サーバーサイドでのGoogle AI APIクライアント
// 環境変数から値を取得
const apiKey = process.env.VITE_GOOGLE_AI_API_KEY;

// デフォルト値を設定（開発環境用）
const defaultApiKey = 'dummy-api-key';

// 環境変数が設定されていない場合はデフォルト値を使用
export const genAI = new GoogleGenerativeAI(apiKey || defaultApiKey);
