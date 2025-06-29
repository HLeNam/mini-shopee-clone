import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import router from '~/routes';
import { AppProvider } from '~/contexts';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
      <ToastContainer />
    </QueryClientProvider>
  </StrictMode>
);
