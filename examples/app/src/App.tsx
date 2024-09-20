import { useRef } from 'react';
import useClipboardApi from 'use-clipboard-api';

function App() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [copiedValue, copy, error] = useClipboardApi();

  const handleCopy = async () => {
    if (inputRef.current) {
      const valueToCopy = inputRef.current.value;
      const success = await copy(valueToCopy);

      if (success) {
        console.log('Text copied:', copiedValue);
      } else {
        console.error('Copy failed:', error);
      }
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type something to copy" />
      <button onClick={handleCopy}>Copy to Clipboard</button>
      {copiedValue && <p>Copied: {copiedValue}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default App;
