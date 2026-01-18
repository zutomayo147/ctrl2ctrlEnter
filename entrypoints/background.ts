import { settingsStorage } from '@/utils/storage';

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (detail) => {
    if (detail.reason === 'install') {
      console.log('Extension installed, initializing settings...');
      // Ensure defaults are set
      await settingsStorage.getValue();
    }
  });
});
