# ビルドステージ
FROM node:20-alpine AS build

WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm ci

# ソースコードをコピー
COPY . .

# 環境変数を設定（ビルド時に使用）
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ARG VITE_GITHUB_TOKEN
ARG VITE_GITHUB_REPO_OWNER
ARG VITE_GITHUB_REPO_NAME
ARG VITE_GOOGLE_AI_API_KEY

ENV PUBLIC_SUPABASE_URL=${PUBLIC_SUPABASE_URL}
ENV PUBLIC_SUPABASE_ANON_KEY=${PUBLIC_SUPABASE_ANON_KEY}
ENV VITE_GITHUB_TOKEN=${VITE_GITHUB_TOKEN}
ENV VITE_GITHUB_REPO_OWNER=${VITE_GITHUB_REPO_OWNER}
ENV VITE_GITHUB_REPO_NAME=${VITE_GITHUB_REPO_NAME}
ENV VITE_GOOGLE_AI_API_KEY=${VITE_GOOGLE_AI_API_KEY}

# アプリケーションをビルド
RUN npm run build

# 実行ステージ
FROM node:20-alpine AS runtime

WORKDIR /app

# 本番環境の依存関係のみをインストール
COPY package*.json ./
RUN npm ci --omit=dev

# ビルドステージからビルド済みのアプリケーションをコピー
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json

# 環境変数を設定
ENV NODE_ENV=production
ENV PORT=8080

# アプリケーションを実行
CMD ["node", "build/index.js"]

# Dockerコンテナがリッスンするポートを指定
EXPOSE 8080
