import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { HelmetProvider } from 'react-helmet-async';  // 👈 Add this

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <HelmetProvider> {/* 👈 Wrap your App in HelmetProvider */}
        <App />
      </HelmetProvider>
    </Provider>
  </BrowserRouter>
);
