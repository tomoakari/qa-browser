import { createClient } from '@supabase/supabase-js';

// 環境変数から値を取得
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// 環境変数が設定されていない場合はエラーを表示
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase環境変数が設定されていません。');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
