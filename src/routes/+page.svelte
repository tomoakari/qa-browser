<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { authStore, logout } from '$lib/stores/auth';
  import { getRepositoryFiles, getFileContent, searchRepository } from '$lib/github';
  import { generateAnswer } from '$lib/gemma';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let question = '';
  let answer = '';
  let loading = false;
  let error = '';
  let context = '';
  let searchResults: any[] = [];

  // ログアウト処理
  async function handleLogout() {
    await logout();
    goto('/login');
  }

  // 質問を送信して回答を取得する
  async function handleSubmit() {
    if (!question.trim()) {
      error = '質問を入力してください';
      return;
    }

    loading = true;
    error = '';
    answer = '';
    context = '';
    searchResults = [];

    try {
      // Githubリポジトリを検索
      const searchResponse = await searchRepository(question);
      if (searchResponse.error) {
        throw new Error('リポジトリの検索に失敗しました');
      }

      searchResults = searchResponse.data?.items || [];

      // 検索結果からコンテキスト情報を取得
      let contextData = '';
      for (let i = 0; i < Math.min(searchResults.length, 3); i++) {
        const item = searchResults[i];
        const fileResponse = await getFileContent(item.path);
        if (fileResponse.data) {
          contextData += `## ${item.path}\n\n${fileResponse.data}\n\n`;
        }
      }

      context = contextData;

      // コンテキスト情報がない場合
      if (!context) {
        context = '関連情報が見つかりませんでした。';
      }

      // Gemma3を使用して回答を生成
      const answerResponse = await generateAnswer(question, context);
      if (answerResponse.error) {
        throw new Error('回答の生成に失敗しました');
      }

      answer = answerResponse.data || '回答を生成できませんでした。';
    } catch (err) {
      console.error('Error:', err);
      error = err instanceof Error ? err.message : '処理中にエラーが発生しました';
    } finally {
      loading = false;
    }
  }
</script>

<div class="container mx-auto py-8 px-4">
  <header class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">QA Browser</h1>
    <div class="flex items-center gap-4">
      {#if $authStore.user}
        <span class="text-sm text-muted-foreground">
          {$authStore.user.email}
        </span>
        <Button variant="outline" size="sm" on:click={handleLogout}>
          ログアウト
        </Button>
      {/if}
    </div>
  </header>

  <Card class="mb-8">
    <CardHeader>
      <CardTitle>質問を入力</CardTitle>
      <CardDescription>
        Githubリポジトリ（my-org/my-qa-repo）の情報をもとに回答します
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div class="space-y-2">
          <label for="question" class="text-sm font-medium leading-none">
            質問
          </label>
          <Textarea
            id="question"
            bind:value={question}
            placeholder="質問を入力してください..."
            rows={3}
            required
          />
        </div>
        {#if error}
          <div class="text-sm text-destructive">{error}</div>
        {/if}
        <Button type="submit" disabled={loading}>
          {loading ? '処理中...' : '質問する'}
        </Button>
      </form>
    </CardContent>
  </Card>

  {#if loading}
    <div class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  {:else if answer}
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>回答</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="prose max-w-none">
          {#each answer.split('\n') as line}
            <p>{line}</p>
          {/each}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>参照情報</CardTitle>
        <CardDescription>
          回答の生成に使用された情報
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#if searchResults.length > 0}
            <h3 class="text-lg font-medium">検索結果</h3>
            <ul class="space-y-2">
              {#each searchResults as result, i}
                {#if i < 5}
                  <li>
                    <div class="text-sm font-medium">{result.path}</div>
                    <div class="text-xs text-muted-foreground">{result.repository.full_name}</div>
                  </li>
                {/if}
              {/each}
            </ul>
          {:else}
            <p class="text-sm text-muted-foreground">検索結果はありません</p>
          {/if}
        </div>
      </CardContent>
    </Card>
  {/if}
</div>
