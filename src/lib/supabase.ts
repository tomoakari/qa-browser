import { createClient } from '@supabase/supabase-js';
import { getSecret } from './secretManager';

// Secret Managerから機密情報を取得するための関数
async function getSupabaseCredentials(projectId?: string): Promise<{ url: string; key: string }> {
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

// 環境変数から値を取得（ブラウザとサーバーの両方で動作するように）
const getSupabaseUrl = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env && process.env.PUBLIC_SUPABASE_URL) {
    return process.env.PUBLIC_SUPABASE_URL;
  }
  // クライアントサイドの場合
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SUPABASE_URL) {
    return import.meta.env.PUBLIC_SUPABASE_URL;
  }
  // 環境変数が設定されていない場合
  return null;
};

const getSupabaseAnonKey = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env && process.env.PUBLIC_SUPABASE_ANON_KEY) {
    return process.env.PUBLIC_SUPABASE_ANON_KEY;
  }
  // クライアントサイドの場合
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SUPABASE_ANON_KEY) {
    return import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  }
  // 環境変数が設定されていない場合
  return null;
};

// 環境変数から値を取得
const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// デフォルト値を設定（開発環境用）
const defaultUrl = 'https://example.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjQyMjU4MCwiZXhwIjoxOTMyMDAwMDAwfQ.example';

// 環境変数が設定されていない場合はデフォルト値を使用
export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultAnonKey
);

// Secret Managerから認証情報を取得して更新する関数
export async function initSupabaseWithSecretManager(projectId?: string): Promise<void> {
  try {
    // Secret Managerから認証情報を取得
    const { url, key } = await getSupabaseCredentials(projectId);
    
    // 環境変数に設定
    if (typeof process !== 'undefined' && process.env) {
      process.env.PUBLIC_SUPABASE_URL = url;
      process.env.PUBLIC_SUPABASE_ANON_KEY = key;
    }
    
    console.log('Supabase認証情報をSecret Managerから取得しました');
  } catch (error) {
    console.error('Supabase認証情報の初期化に失敗しました:', error);
  }
}
