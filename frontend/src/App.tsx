import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [status, setStatus] = useState<string>('Testing connection...');

  useEffect(() => {
    supabase.auth.getSession()
      .then(() => setStatus('Supabase Client Connected Successfully'))
      .catch((err: any) => setStatus(`Connection Error: ${err?.message || String(err)}`));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>PS-09 Frontend</h1>
      <p><strong>Supabase Connection Status:</strong> {status}</p>
    </div>
  );
}

export default App;
