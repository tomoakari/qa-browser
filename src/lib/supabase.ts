import { createClient } from '@supabase/supabase-js';

// 環境変数から値を取得（ブラウザとサーバーの両方で動作するように）
const getSupabaseUrl = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env) {
    return process.env.PUBLIC_SUPABASE_URL;
  }
  // クライアントサイドの場合
  return import.meta.env.PUBLIC_SUPABASE_URL;
};

const getSupabaseAnonKey = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env) {
    return process.env.PUBLIC_SUPABASE_ANON_KEY;
  }
  // クライアントサイドの場合
  return import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
};

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// 環境変数が設定されていない場合はエラーを表示
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase環境変数が設定されていません。');
  console.error('URL:', supabaseUrl ? '設定済み' : '未設定');
  console.error('ANON_KEY:', supabaseAnonKey ? '設定済み' : '未設定');
}

// デフォルト値を設定（開発環境用）
const defaultUrl = 'https://example.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjQyMjU4MCwiZXhwIjoxOTMyMDAwMDAwfQ.example';

// 環境変数が設定されていない場合はデフォルト値を使用
export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultAnonKey
);
