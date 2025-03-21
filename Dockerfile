# ビルドステージ
FROM node:20-alpine AS build

WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm ci

# ソースコードをコピー
COPY . .

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
