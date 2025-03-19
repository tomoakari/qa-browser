# QA Browser

QA Browserは、特定のGitHubリポジトリ内のデータをもとに質問に回答するWEBアプリケーションです。

## 機能

- ID・パスワードによる簡易的なログイン機構
- 特定のプライベートGitHubリポジトリ（my-org/my-qa-repo）に接続
- 質問入力フォームと回答表示機能
- Google Gemma3 LLMを利用した回答生成
- MCPを利用したGitHubデータアクセス

## 技術スタック

- フロントエンド: SvelteKit, TypeScript, Tailwind CSS, shadcn-svelte
- バックエンド: Supabase
- LLM: Google Gemma3
- デプロイ: GitHub Actions, GCP Cloud Run

## 環境変数

アプリケーションを実行するには、以下の環境変数を設定する必要があります：

```
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub
GITHUB_TOKEN=your_github_token
GITHUB_REPO_OWNER=my-org
GITHUB_REPO_NAME=my-qa-repo

# Google Gemma3
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

## 開発環境のセットアップ

1. リポジトリをクローン

```bash
git clone https://github.com/your-username/qabrowser.git
cd qabrowser
```

2. 依存関係をインストール

```bash
npm install
```

3. 環境変数を設定

`.env`ファイルを作成し、必要な環境変数を設定します。

4. 開発サーバーを起動

```bash
npm run dev
```

## デプロイ

このプロジェクトはGitHub ActionsとGCP Cloud Runを使用して自動的にデプロイされます。

1. GCPプロジェクトを設定
2. GitHub Secretsに必要な環境変数を設定
3. mainブランチにプッシュすると自動的にデプロイされます

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
