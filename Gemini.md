# Gemini.md

## 0. 前提（言語）

- 回答・作業記述は **日本語** で行うこと

---

## 1. プロジェクト概要

このプロジェクトは、Google Chat, Gemini, ChatGPT 等のチャットサービスにおいて、`Enter` キーで改行し、`Ctrl+Enter` (Macの場合は `Cmd+Enter`) で送信するための Chrome 拡張機能 `enter2ctrlEnter` です。
フレームワークとして **WXT (Web Extension Toolbox)** を使用し、**React** と **TypeScript** で開発されています。

### 1.1 ポート・環境

- WXT 開発サーバー: デフォルト設定を使用。
- **ログイン状態の維持**: `npm run dev` 実行時、`.wxt/user-data` にブラウザプロファイルが保存されます。初回起動時に Google アカウント等にログインすると、次回以降もログイン状態が維持されます。

### 1.2 技術スタック

- **Framework**: [WXT](https://wxt.dev/)
- **Frontend**: React 19, Tailwind CSS (推奨)
- **Language**: TypeScript
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Storage**: WXT の `storage` モジュールを使用して設定を同期。

### 1.3 動作対象サイト

- `https://chat.google.com/*`
- `https://gemini.google.com/*`
- `https://chatgpt.com/*`

---

## 2. コンテキスト制御（AIルール）

### 2.1 `.geminiignore` の遵守

- `node_modules/`, `.wxt/`, `dist/` 等の自動生成物は AI コンテキストから除外します。
- 原則として除外対象は **list / read / search / attach** しないでください。

---

## 3. 開発・Git運用規約

### 3.1 ブランチ運用（必須）

- **mainブランチでの直接作業は禁止** です。
- 新機能や修正の際は必ず専用ブランチ (`feat-xxx`, `fix-xxx`) を作成してください

### 3.3 コミットメッセージ

- 1行目に簡潔な要約。
- 本文に変更内容のサマリを箇条書きで記載する。

---

## 4. Chrome拡張機能開発のベストプラクティス

- **Content Scripts**: ターゲットサイトの DOM 干渉を最小限に抑える。
- **Permissions**: `manifest` (in `wxt.config.ts`) には最小限の権限のみを定義する。
- **Security**: `eval()` の使用禁止、信頼できないソースからのスクリプト読み込み禁止。
- **Performance**: 重い処理は Background (Service Worker) で行い、Content Script のイベントリスナーは効率的に実装する。

---

## 5. 検証・テスト手順

### 5.1 ユニットテスト

- 実行: `npm test`
- 監視モード: `npm run test:watch`
- `utils/*.test.ts` にロジックのテストを記述してください。

### 5.2 E2Eテスト

- 実行: `npm run test:e2e`
- Playwright を使用してブラウザ上での動作を検証します。
- テストファイルは `tests/e2e/` に配置してください。

### 5.3 動作確認

- `npm run dev` で拡張機能を起動し、対象サイトで動作を確認してください。

---

## TODO（作業時のチェックリスト）

- [ ] ブランチ作成 (`feat-` / `fix-`)
- [ ] 実装
- [ ] 実装内容のテスト / 動作確認
- [ ] `git add -A`
- [ ] コミット（本文に変更サマリを記載）
