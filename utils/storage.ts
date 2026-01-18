import { storage } from 'wxt/utils/storage';

export type SendingMode = 'enter' | 'ctrl+enter' | 'meta+enter';

export interface Settings {
  sendingMode: SendingMode;
}

export const settingsStorage = storage.defineItem<Settings>('local:settings', {
  defaultValue: {
    sendingMode: 'ctrl+enter',
  },
});
