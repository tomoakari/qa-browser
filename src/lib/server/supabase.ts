import { createClient } from '@supabase/supabase-js';
import { getSecret } from './secretManager';

/**
 * Secret Managerから機密情報を取得するための関数
 * @param projectId プロジェクトID（省略可）
 * @returns Supabase認証情報
 */
export async function getSupabaseCredentials(projectId?: string): Promise<{ url: string; key: string }> {
  try {
    // Secret Managerからシークレットを取得
    const url = await getSecret('PUBLIC_SUPABASE_URL', projectId);
    const key = await getSecret('PUBLIC_SUPABASE_ANON_KEY', projectId);
    
    return { url, key };
  } catch (error) {
    console.error('Supabase認証情報の取得に失敗しました:', error);
    
    // デフォルト値を返す（開発環境用）
    return {
      url: 'https://example.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjQyMjU4MCwiZXhwIjoxOTMyMDAwMDAwfQ.example'
    };
  }
}

/**
 * Secret Managerから認証情報を取得して環境変数に設定する関数
 * @param projectId プロジェクトID（省略可）
 */
export async function initSupabaseWithSecretManager(projectId?: string): Promise<void> {
  try {
    // Secret Managerから認証情報を取得
    const { url, key } = await getSupabaseCredentials(projectId);
    
    // 環境変数に設定
    process.env.PUBLIC_SUPABASE_URL = url;
    process.env.PUBLIC_SUPABASE_ANON_KEY = key;
    
    console.log('Supabase認証情報をSecret Managerから取得しました');
  } catch (error) {
    console.error('Supabase認証情報の初期化に失敗しました:', error);
  }
}

// サーバーサイドでのSupabaseクライアント
// 環境変数から値を取得
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

// デフォルト値を設定（開発環境用）
const defaultUrl = 'https://example.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjQyMjU4MCwiZXhwIjoxOTMyMDAwMDAwfQ.example';

// 環境変数が設定されていない場合はデフォルト値を使用
export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultAnonKey
);
