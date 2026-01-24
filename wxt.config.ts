import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Google Chat 誤送信防止「enter2ctrlEnter」",
    permissions: ["storage"],
    host_permissions: [
      "https://chat.google.com/*",
      "https://gemini.google.com/*",
      "https://chatgpt.com/*",
    ],
  },
  // --- ここから加筆 ---
  webExt: {
    // 開発用ブラウザのプロファイルを永続化（ログイン状態を保持）
    // 'user' は .wxt/user-data/chromium に保存される
    dataPersistence: 'user',
    // 自動操作によるログインブロックを回避するためのフラグ
    chromiumArgs: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
    ],
    // 起動時に自動で開くページ
    startUrls: [
      'https://chat.google.com',
      'https://gemini.google.com',
      'https://chatgpt.com',
    ],
  },
  // --- ここまで加筆 ---
});
