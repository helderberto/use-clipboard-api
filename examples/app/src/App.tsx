import useClipboardApi from 'use-clipboard-api';

function App() {
  const [value, copy] = useClipboardApi();

  return (
    <div>
      <button onClick={() => copy('Test text')}>Click to copy</button>
      <p>Copied value: {value}</p>
    </div>
  );
}

export default App;
