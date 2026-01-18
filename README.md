# Google Chat 誤送信防止「enter2ctrlEnter」

Google Chat において、Enter キーによる意図しないメッセージ送信を防止し、Ctrl+Enter 等での送信に挙動をカスタマイズするブラウザ拡張機能です。

## 主な機能

- **誤送信防止**: 単体 Enter での送信をブロックし、代わりに改行（Shift+Enter 挙動）を挿入します。
- **送信モードの切り替え**: ポップアップ UI から以下の送信モードを選択可能です。
  - **Enter**: 標準の挙動
  - **Ctrl + Enter**: Ctrlキーを押しながら Enter で送信
  - **⌘ / Win + Enter**: Commandキー（Mac）または Windowsキー（Win）を押しながら Enter で送信
- **Gmail 対応**: ブラウザ版 Google Chat だけでなく、Gmail 内に統合されたチャット画面でも動作します。
- **IME 配慮**: 日本語入力中の Enter による確定操作を邪魔しません。

## インストール・開発方法

本プロジェクトは [WXT](https://wxt.dev/) フレームワークを使用しています。

### セットアップ

```bash
npm install
```

### 開発用サーバーの起動

```bash
npm run dev
```

起動後、自動的にブラウザが立ち上がり、拡張機能がロードされます。`wxt.config.ts` の設定により、自動的に `https://chat.google.com` が開きます。

### 本番用ビルド

```bash
npm run build
```

`.output/chrome-mv3` にビルド済みのファイルが生成されます。

### 配布用パッケージの作成

```bash
npm run zip
```

`.output` ディレクトリに `.zip` ファイルが生成されます。このファイルは Chrome ウェブストアへのアップロードなどに使用できます。

## テスト

判定ロジックの正確性を保証するために Vitest による単体テストを導入しています。

```bash
npx vitest run
```

## アーキテクチャ

- **utils/interceptor.ts**: キーイベントの判定ロジック（テスト可能）。
- **entrypoints/content.ts**: Google Chat への介入。`document_start` かつ `allFrames: true` で動作し、キャプチャフェーズでイベントを捕捉します。
- **entrypoints/popup/**: React による設定 UI。
- **utils/storage.ts**: `wxt/storage` を利用した設定の永続化。
