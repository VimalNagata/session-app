import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import App from './App';

const authConfig = {
  authority: "https://auth.sessions.red",
  client_id: "2fpemjqos4302bfaf65g06l8g0",
  redirect_uri: "https://sessions.red",
  scope: "openid profile email",
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider {...authConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);