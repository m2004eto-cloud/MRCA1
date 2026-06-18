import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import { LanguageProvider } from './contexts/language';
import { AuthProvider } from './contexts/auth';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
