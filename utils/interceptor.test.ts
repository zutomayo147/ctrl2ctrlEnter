import { describe, it, expect } from 'vitest';
import { evaluateKeyEvent } from './interceptor';

describe('evaluateKeyEvent', () => {
  describe('ctrl+enter mode', () => {
    const mode = 'ctrl+enter';

    describe('on Windows/Linux (isMac=false)', () => {
      const isMac = false;

      it('should block simple Enter and suggest newline', () => {
        const event = { key: 'Enter', type: 'keydown', ctrlKey: false, metaKey: false, shiftKey: false, isComposing: false } as any;
        const result = evaluateKeyEvent(event, mode, isMac);
        expect(result.action).toBe('block');
        expect(result.insertNewline).toBe(true);
      });

      it('should allow Ctrl+Enter', () => {
        const event = { key: 'Enter', type: 'keydown', ctrlKey: true, metaKey: false, shiftKey: false, isComposing: false } as any;
        const result = evaluateKeyEvent(event, mode, isMac);
        expect(result.action).toBe('ignore');
      });

      it('should ignore Meta+Enter', () => {
        const event = { key: 'Enter', type: 'keydown', ctrlKey: false, metaKey: true, shiftKey: false, isComposing: false } as any;
        const result = evaluateKeyEvent(event, mode, isMac);
        expect(result.action).toBe('ignore');
      });
    });

    describe('on Mac (isMac=true)', () => {
      const isMac = true;

      it('should block simple Enter and suggest newline', () => {
        const event = { key: 'Enter', type: 'keydown', ctrlKey: false, metaKey: false, shiftKey: false, isComposing: false } as any;
        const result = evaluateKeyEvent(event, mode, isMac);
        expect(result.action).toBe('block');
        expect(result.insertNewline).toBe(true);
      });

      it('should allow Meta+Enter (Cmd+Enter) - actually pass through (ignore)', () => {
        const event = { key: 'Enter', type: 'keydown', ctrlKey: false, metaKey: true, shiftKey: false, isComposing: false } as any;
        const result = evaluateKeyEvent(event, mode, isMac);
        expect(result.action).toBe('ignore');
      });

      it('should ignore Ctrl+Enter', () => {
        const event = { key: 'Enter', type: 'keydown', ctrlKey: true, metaKey: false, shiftKey: false, isComposing: false } as any;
        const result = evaluateKeyEvent(event, mode, isMac);
        expect(result.action).toBe('ignore');
      });
    });

    it('should ignore other keys', () => {
      const event = { key: 'a', type: 'keydown', ctrlKey: false, metaKey: false, shiftKey: false, isComposing: false } as any;
      const result = evaluateKeyEvent(event, mode);
      expect(result.action).toBe('ignore');
    });

    it('should ignore Enter during IME composition', () => {
      const event = { key: 'Enter', type: 'keydown', ctrlKey: false, metaKey: false, shiftKey: false, isComposing: true } as any;
      const result = evaluateKeyEvent(event, mode);
      expect(result.action).toBe('ignore');
    });
  });

  describe('enter mode', () => {
    const mode = 'enter';

    it('should ignore simple Enter', () => {
      const event = { key: 'Enter', type: 'keydown', ctrlKey: false, metaKey: false, shiftKey: false, isComposing: false } as any;
      const result = evaluateKeyEvent(event, mode);
      expect(result.action).toBe('ignore');
    });
  });

  describe('meta+enter mode', () => {
    const mode = 'meta+enter';

    it('should block simple Enter', () => {
      const event = { key: 'Enter', type: 'keydown', ctrlKey: false, metaKey: false, shiftKey: false, isComposing: false } as any;
      const result = evaluateKeyEvent(event, mode);
      expect(result.action).toBe('block');
    });

    it('should allow Meta+Enter regardless of OS (pass through on Mac)', () => {
      const event = { key: 'Enter', type: 'keydown', ctrlKey: false, metaKey: true, shiftKey: false, isComposing: false } as any;
      
      // Mac - Ignore/Passthrough
      expect(evaluateKeyEvent(event, mode, true).action).toBe('ignore');
      // Windows - Allow/Force -> Ignore/Passthrough
      expect(evaluateKeyEvent(event, mode, false).action).toBe('ignore');
    });
  });
});
