import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';

try {
  const html = renderToString(
    <AuthProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </AuthProvider>
  );
  console.log('RENDER SUCCESS, output length:', html.length);
} catch (e) {
  console.error('RENDER ERROR:', e);
}
