import { SendingMode } from './storage';

export interface InterceptionResult {
  action: 'block' | 'allow' | 'ignore';
  insertNewline?: boolean;
}

export function evaluateKeyEvent(
  event: Pick<KeyboardEvent, 'key' | 'isComposing' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'type'>,
  sendingMode: SendingMode,
  isMac: boolean = false,
): InterceptionResult {
  if (event.key !== 'Enter') return { action: 'ignore' };
  if (event.isComposing) return { action: 'ignore' };

  // If mode is ctrl+enter:
  // - on Mac: treat as meta+enter
  // - on Win/Linux: treat as ctrl+enter
  // If mode is meta+enter (explicit):
  // - treat as meta+enter (regardless of OS, though unusual for Windows)
  
  let isCtrlReq = false;
  let isMetaReq = false;

  if (sendingMode === 'ctrl+enter') {
    if (isMac) {
      isMetaReq = true;
    } else {
      isCtrlReq = true;
    }
  } else if (sendingMode === 'meta+enter') {
    isMetaReq = true;
  }

  const hasCtrl = event.ctrlKey;
  const hasMeta = event.metaKey;
  const hasShift = event.shiftKey;

  // Should we block this event? (modifier missing but required)
  if ((isCtrlReq && !hasCtrl && !hasShift && !hasMeta) || 
      (isMetaReq && !hasMeta && !hasShift && !hasCtrl)) {
    return {
      action: 'block',
      insertNewline: event.type === 'keydown',
    };
  }

  // Should we allow/force this event? (modifier present and required)
  if ((isCtrlReq && hasCtrl) || (isMetaReq && hasMeta)) {
    // We used to synthesize a plain 'Enter' here (action: 'allow').
    // However, most chat apps (Google Chat, etc.) natively support Ctrl+Enter/Cmd+Enter.
    // Synthesizing an event often fails (untrusted event) or is unnecessary.
    // We should just pass through (ignore) the native event.
    return { action: 'ignore' };
  }

  return { action: 'ignore' };
}
