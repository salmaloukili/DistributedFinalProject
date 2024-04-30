import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app'
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';

fetch('/__/firebase/init.json').then(async response => {
  if (response.ok) {
    initializeApp(await response.json());
  } else {
    initializeApp({
      apiKey: "test-api-key",
      authDomain: "http://127.0.0.1:9099",
      locationId: "europe-west",
      messagingSenderId: "872004267669",
      projectId: "distributed-421517",
      storageBucket: "distributed-421517.appspot.com",
    });
  }
}).catch(async error => {
  console.log(error)
});

// ----------------------------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <App />
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
