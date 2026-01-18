import { useEffect, useState } from 'react';
import './App.css';
import { settingsStorage, SendingMode } from '@/utils/storage';

function App() {
  const [sendingMode, setSendingMode] = useState<SendingMode>('ctrl+enter');

  useEffect(() => {
    settingsStorage.getValue().then((settings) => {
      setSendingMode(settings.sendingMode);
    });
  }, []);

  const handleModeChange = async (mode: SendingMode) => {
    setSendingMode(mode);
    await settingsStorage.setValue({ sendingMode: mode });
  };

  return (
    <div className="container">
      <h1>Enter to Send</h1>
      <p className="description">Choose how you want to send messages in Google Chat.</p>
      
      <div className="options">
        <label className={`option ${sendingMode === 'enter' ? 'active' : ''}`}>
          <input
            type="radio"
            name="sendingMode"
            value="enter"
            checked={sendingMode === 'enter'}
            onChange={() => handleModeChange('enter')}
          />
          <div className="option-content">
            <span className="key-combo">Enter</span>
            <span className="key-desc">Standard behavior</span>
          </div>
        </label>

        <label className={`option ${sendingMode === 'ctrl+enter' ? 'active' : ''}`}>
          <input
            type="radio"
            name="sendingMode"
            value="ctrl+enter"
            checked={sendingMode === 'ctrl+enter'}
            onChange={() => handleModeChange('ctrl+enter')}
          />
          <div className="option-content">
            <span className="key-combo">Ctrl + Enter</span>
            <span className="key-desc">Prevent accidental sends</span>
          </div>
        </label>

        <label className={`option ${sendingMode === 'meta+enter' ? 'active' : ''}`}>
          <input
            type="radio"
            name="sendingMode"
            value="meta+enter"
            checked={sendingMode === 'meta+enter'}
            onChange={() => handleModeChange('meta+enter')}
          />
          <div className="option-content">
            <span className="key-combo">⌘ / Win + Enter</span>
            <span className="key-desc">Alternative shortcut</span>
          </div>
        </label>
      </div>

      <div className="footer">
        <p>Refresh Google Chat to apply changes</p>
      </div>
    </div>
  );
}

export default App;
