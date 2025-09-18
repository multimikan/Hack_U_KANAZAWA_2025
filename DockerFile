# ベースイメージ
FROM node:18-alpine

# アプリ用作業ディレクトリ
WORKDIR /usr/src/app

# package*.json をサブディレクトリからコピー
COPY hacku_kanazawa_2025_app/package*.json ./

# 依存をインストール
RUN npm ci

# アプリケーション全体をコピー
COPY hacku_kanazawa_2025_app/ ./

# ビルド実行
RUN npm run build

# ポート開放
EXPOSE 3000

# 起動コマンド
CMD ["npm", "start"]
