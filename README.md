# Google Chat 誤送信防止「enter2ctrlEnter」

Google Chat, Gemini, ChatGPT 等のチャットサービスにおいて、Enter キーによる意図しないメッセージ送信を防止し、Ctrl+Enter (Macの場合は Cmd+Enter) 等での送信に挙動をカスタマイズするブラウザ拡張機能です。

## 主な機能

- **誤送信防止**: 単体 Enter での送信をブロックし、代わりに改行（Shift+Enter 相当）を挿入します。
- **送信モードの切り替え**: ポップアップ UI から以下の送信モードを選択可能です。
  - **Enter**: 標準の挙動（拡張機能を一時的に無効化したい場合に便利）
  - **Ctrl + Enter**: Ctrl / Cmd キーを押しながら Enter で送信
  - **⌘ / Win + Enter**: Commandキー（Mac）または Windowsキー（Win）を押しながら Enter で送信
- **高度な OS 対応**: 送信モードが `Ctrl+Enter` に設定されている場合、Mac 環境では自動的に `Cmd+Enter` を送信キーとして認識します（Windows/Linux では `Ctrl+Enter`）。
- **マルチサイト対応**:
  - Google Chat (`chat.google.com`)
  - Gmail 内統合チャット (`mail.google.com`)
  - Gemini (`gemini.google.com`)
  - ChatGPT (`chatgpt.com`)
- **IME 配慮**: 日本語入力中の Enter による確定操作を邪魔しません。

## 技術スタック

- **Framework**: [WXT](https://wxt.dev/) (Web Extension Toolbox)
- **Frontend**: React 19, Tailwind CSS
- **Language**: TypeScript
- **Testing**:
  - **Unit**: Vitest (判定ロジックの検証)
  - **E2E**: Playwright (ブラウザ上での動作検証)
- **Storage**: WXT `storage` API による設定の同期

## ディレクトリ構成

- `entrypoints/`: 拡張機能のエントリーポイント
  - `content.ts`: 各チャットサイトに注入され、キーイベントを制御する Content Script
  - `popup/`: 設定変更を行うポップアップ UI (React)
  - `background.ts`: Service Worker
- `utils/`: 共通ユーティリティ
  - `interceptor.ts`: キーイベントの判定ロジック（プラットフォーム依存処理含む）
  - `storage.ts`: 設定項目と初期値の定義
- `tests/`: テストコード
  - `e2e/`: Playwright によるブラウザテスト
- `assets/` & `public/`: 画像、アイコン等の静的リソース

## セットアップ・開発

### 依存関係のインストール

```bash
npm install
```

### 開発用サーバーの起動

```bash
npm run dev
```

起動後、開発用の専用プロファイルでブラウザが立ち上がります。

- `.wxt/user-data` にプロファイルが保存されるため、Google アカウント等のログイン状態が維持されます。
- `wxt.config.ts` の `startUrls` 設定に基づき、Google Chat 等のページが自動的に開きます。

### テストの実行

```bash
# ユニットテスト
npm test

# E2Eテスト
npm run test:e2e
```

### ビルドとパッケージング

```bash
# 本番用ビルド (.output/chrome-mv3)
npm run build

# 配布用 ZIP の作成 (.output/*.zip)
npm run zip
```

## ライセンス

MIT License
