import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

let response = fetch('/__/firebase/init.json');
let app;
let auth;
let functions;
let storage;
if (response.ok) {
  response = await response.json();
  app = initializeApp(response);
  auth = getAuth(app);
  functions = getFunctions(app);
  storage = getStorage(app);
} else {
  response = {
    apiKey: 'test-api-key',
    authDomain: 'http://127.0.0.1:9099',
    locationId: 'europe-west',
    messagingSenderId: '872004267669',
    projectId: 'distributed-421517',
    storageBucket: 'distributed-421517.appspot.com',
  };

  app = initializeApp(response);
  auth = getAuth(app);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  functions = getFunctions();
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  storage = getStorage(app);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}

function getCallable(name) {
  return httpsCallable(functions, name);
}
export { app, auth, getCallable, storage };
