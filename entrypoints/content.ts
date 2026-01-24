import { settingsStorage } from '@/utils/storage';
import { evaluateKeyEvent } from '@/utils/interceptor';

export default defineContentScript({
  matches: [
    'https://chat.google.com/*',
    'https://mail.google.com/*',
    'https://gemini.google.com/*',
    'https://chatgpt.com/*'
  ],
  allFrames: true,
  runAt: 'document_start',
  async main() {
    let currentSettings = await settingsStorage.getValue();

    settingsStorage.watch((newSettings) => {
      currentSettings = newSettings;
    });

    const handleEvent = (event: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform) || /Mac/.test(navigator.userAgent);
      const result = evaluateKeyEvent(event, currentSettings.sendingMode, isMac);

      if (result.action === 'block') {
        event.stopImmediatePropagation();
        event.preventDefault();

        if (result.insertNewline && event.target instanceof HTMLElement) {
          const shiftEnter = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            shiftKey: true,
            bubbles: true,
            cancelable: true,
          });
          event.target.dispatchEvent(shiftEnter);
        }
      } else if (result.action === 'allow' && event.type === 'keydown') {
        // We only "force" on keydown to avoid duplicates
        if (event.target instanceof HTMLElement) {
          const newEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          });
          
          event.preventDefault();
          event.stopImmediatePropagation();
          event.target.dispatchEvent(newEvent);
        }
      }
    };

    window.addEventListener('keydown', handleEvent, true);
    window.addEventListener('keypress', handleEvent, true);
    window.addEventListener('keyup', handleEvent, true);
  },
});
