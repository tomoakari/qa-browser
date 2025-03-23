<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { initAuth, authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { initSupabaseWithSecretManager } from '$lib/supabase';
  import { initGithubWithSecretManager } from '$lib/github';
  import { initGemmaWithSecretManager } from '$lib/gemma';
  import { browser } from '$app/environment';

  // 認証状態を初期化
  onMount(async () => {
    // サーバーサイドでのみSecret Managerから機密情報を取得
    if (!browser) {
      try {
        // GCPプロジェクトIDを指定（環境変数から取得するか、ハードコードする）
        const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id';
        
        // 各サービスの認証情報を取得
        await Promise.all([
          initSupabaseWithSecretManager(projectId),
          initGithubWithSecretManager(projectId),
          initGemmaWithSecretManager(projectId)
        ]);
        
        console.log('すべての認証情報をSecret Managerから取得しました');
      } catch (error) {
        console.error('Secret Managerからの機密情報取得に失敗しました:', error);
      }
    }
    
    // 認証状態を初期化
    initAuth();
  });

  // 認証状態に基づいてリダイレクト
  $: {
    if (!$authStore.loading) {
      // ログインしていない場合、ログインページ以外へのアクセスをログインページにリダイレクト
      if (!$authStore.user && $page.url.pathname !== '/login') {
        goto('/login');
      }
    }
  }
</script>

<slot />
