<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';

  let username = '';
  let password = '';
  let loading = false;
  let error = '';

  // 簡易的なログイン処理
  async function handleLogin() {
    loading = true;
    error = '';

    try {
      // Supabaseのログイン機能を使用
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: username,
        password: password
      });

      if (loginError) {
        throw loginError;
      }

      // ログイン成功時はホームページに遷移
      goto('/');
    } catch (err) {
      console.error('Login error:', err);
      error = err instanceof Error ? err.message : '認証に失敗しました。';
    } finally {
      loading = false;
    }
  }

  // ページロード時に既にログインしているかチェック
  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      // 既にログインしている場合はホームページに遷移
      goto('/');
    }
  });
</script>

<div class="flex items-center justify-center min-h-screen bg-background">
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle>QA Browser</CardTitle>
      <CardDescription>アカウントにログインしてください</CardDescription>
    </CardHeader>
    <CardContent>
      <form on:submit|preventDefault={handleLogin} class="space-y-4">
        <div class="space-y-2">
          <label for="username" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            ユーザー名
          </label>
          <Input
            id="username"
            bind:value={username}
            placeholder="username@example.com"
            required
            autocomplete="username"
          />
        </div>
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            パスワード
          </label>
          <Input
            id="password"
            type="password"
            bind:value={password}
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>
        {#if error}
          <div class="text-sm text-destructive">{error}</div>
        {/if}
        <Button type="submit" class="w-full" disabled={loading}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>
    </CardContent>
    <CardFooter class="flex justify-center">
      <p class="text-sm text-muted-foreground">
        QA Browserは社内専用ツールです
      </p>
    </CardFooter>
  </Card>
</div>
