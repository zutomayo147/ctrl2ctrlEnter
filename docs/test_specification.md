# テスト仕様書: Keyboard Event Interceptor

## 1. 概要

本ドキュメントは、ブラウザ拡張機能におけるキーボードイベントの制御ロジック（`evaluateKeyEvent`）のテスト仕様を定義する。

## 2. テスト対象

- **関数**: `evaluateKeyEvent(event, mode, isMac)`
- **責務**: 入力されたキーイベントと設定モード、OS環境に基づいて、ブラウザのデフォルト動作をブロックするか（必要に応じて改行を挿入するか）、あるいはそのまま通すか（無視するか）を決定する。

## 3. テスト項目一覧

### 3.1 モード: `ctrl+enter` (デフォルト)

このモードでは、通常の Enter キー入力をブロックし、特定の修飾キーとの組み合わせのみを許可する。

#### Windows / Linux 環境 (`isMac = false`)

| ケース ID | 入力キー | 修飾キー | IME状態 | 期待されるアクション | 改行挿入 | 備考 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CE-WIN-01 | Enter | なし | OFF | **Block** | Yes | 単体Enterは送信を防止 |
| CE-WIN-02 | Enter | Ctrl | OFF | **Ignore** | No | Ctrl+Enterで送信 |
| CE-WIN-03 | Enter | Meta | OFF | **Ignore** | No | Meta+EnterはOS標準動作を想定 |

#### Mac 環境 (`isMac = true`)

| ケース ID | 入力キー | 修飾キー | IME状態 | 期待されるアクション | 改行挿入 | 備考 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CE-MAC-01 | Enter | なし | OFF | **Block** | Yes | 単体Enterは送信を防止 |
| CE-MAC-02 | Enter | Meta | OFF | **Ignore** | No | Cmd+Enterで送信 |
| CE-MAC-03 | Enter | Ctrl | OFF | **Ignore** | No | Ctrl+EnterはOS標準動作を想定 |

### 3.2 モード: `enter`

このモードでは、拡張機能による介入を行わない。

| ケース ID | 入力キー | 修飾キー | 期待されるアクション | 改行挿入 | 備考 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| E-01 | Enter | なし | **Ignore** | No | 通常通り送信される |

### 3.3 モード: `meta+enter`

Macでの Cmd+Enter または Windowsでの Win+Enter を送信キーとする設定。

| ケース ID | 入力キー | 修飾キー | OS | 期待されるアクション | 備考 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ME-01 | Enter | なし | Any | **Block** | 単体Enterはブロック |
| ME-02 | Enter | Meta | Mac | **Ignore** | Cmd+Enterを許可 |
| ME-03 | Enter | Meta | Win | **Ignore** | Win+Enterを許可 |

### 3.4 共通・特殊ケース

| ケース ID | 入力キー | IME状態 | 期待されるアクション | 備考 |
| :--- | :--- | :--- | :--- | :--- |
| COM-01 | a, b, c... | OFF | **Ignore** | Enter以外のキーには干渉しない |
| COM-02 | Enter | **ON** | **Ignore** | 漢字変換等の確定時は送信されないよう無視 |

## 4.用語定義

- **Block**: `event.preventDefault()` を呼び出し、ブラウザの既定の動作（送信等）を停止する。
- **Ignore**: 何もせず、イベントをそのままブラウザに渡す（パススルー）。
- **改行挿入 (InsertNewline)**: ブロックした際、代わりにカーソル位置に改行コードを挿入するフラグ。
