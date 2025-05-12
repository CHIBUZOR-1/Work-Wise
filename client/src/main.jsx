import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { persistor, store } from './Redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { WorkContextProvider } from './Context/WiseContext.jsx'
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <WorkContextProvider>
              <App /> 
            </WorkContextProvider>
          </BrowserRouter> 
        </PersistGate>
      </Provider>
    </HelmetProvider>
    
  </StrictMode>,
)

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

