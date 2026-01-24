import { settingsStorage } from '@/utils/storage';
import { evaluateKeyEvent } from '@/utils/interceptor';

export default defineContentScript({
  matches: [
    'https://chat.google.com/*',
    'https://mail.google.com/*',
    'https://gemini.google.com/*',
    'https://chatgpt.com/*',
    'https://docs.google.com/spreadsheets/*'
  ],
  allFrames: true,
  runAt: 'document_start',
  async main() {
    let currentSettings = await settingsStorage.getValue();

    settingsStorage.watch((newSettings) => {
      currentSettings = newSettings;
    });

    const isSheets = window.location.hostname === 'docs.google.com' && window.location.pathname.startsWith('/spreadsheets');

    const handleEvent = (event: KeyboardEvent) => {
      // Don't intercept if it's our own synthesized event
      if ((event as any)._isSynthesized) return;

      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform) || /Mac/.test(navigator.userAgent);
      const result = evaluateKeyEvent(event, currentSettings.sendingMode, isMac);

      if (result.action === 'block') {
        event.stopImmediatePropagation();
        event.preventDefault();

        if (result.insertNewline && event.target instanceof HTMLElement) {
          // Sheets uses Alt+Enter for newline, others use Shift+Enter
          const modifierKey = isSheets ? 'altKey' : 'shiftKey';
          const newlineEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            [modifierKey]: true,
            bubbles: true,
            cancelable: true,
          } as any);
          (newlineEvent as any)._isSynthesized = true;
          event.target.dispatchEvent(newlineEvent);
        }
      } else if (result.action === 'allow' && event.type === 'keydown') {
        if (event.target instanceof HTMLElement) {
          const newEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          } as any);
          (newEvent as any)._isSynthesized = true;
          
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
