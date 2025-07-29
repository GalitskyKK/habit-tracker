import '@app/styles/index.css';
import { AuthProvider } from '@/shared/hooks/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
