import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

// 認証状態を管理するストア
export const authStore = writable<{
  user: User | null;
  session: Session | null;
  loading: boolean;
}>({
  user: null,
  session: null,
  loading: true
});

// 認証状態を初期化する関数
export async function initAuth() {
  // 現在のセッションを取得
  const { data } = await supabase.auth.getSession();
  
  // ストアを更新
  authStore.update(state => ({
    ...state,
    user: data.session?.user || null,
    session: data.session,
    loading: false
  }));

  // 認証状態の変更を監視
  supabase.auth.onAuthStateChange((event, session) => {
    authStore.update(state => ({
      ...state,
      user: session?.user || null,
      session: session
    }));
  });
}

// ログアウト処理
export async function logout() {
  await supabase.auth.signOut();
}
