<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { initAuth, authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // 認証状態を初期化
  onMount(() => {
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
