import { createClient } from '@supabase/supabase-js';

// 開発環境用のダミー値を設定
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
