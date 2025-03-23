import { createClient } from '@supabase/supabase-js';

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

/**
 * Secret Managerから認証情報を取得して更新する関数のインターフェース
 * 注意: この関数はサーバーサイドでのみ実行される
 */
export async function initSupabaseWithSecretManager(projectId?: string): Promise<void> {
  // クライアントサイドでは何もしない
  if (typeof window !== 'undefined') {
    console.warn('initSupabaseWithSecretManager関数はクライアントサイドでは使用できません');
    return;
  }
  
  // サーバーサイドでは実際の実装を使用
  const { initSupabaseWithSecretManager: serverInitSupabase } = await import('./server/supabase');
  return serverInitSupabase(projectId);
}
