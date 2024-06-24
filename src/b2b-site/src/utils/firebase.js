import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';

let app;
let auth;
let functions;
let storage;
let check;

if (import.meta.env.PROD) {
  app = initializeApp({
    apiKey: '',
    authDomain: 'distributed-421517.firebaseapp.com',
    projectId: 'distributed-421517',
    storageBucket: 'distributed-421517.appspot.com',
    messagingSenderId: '872004267669',
    appId: '1:872004267669:web:be16d50843b2bddcb2759c',
    measurementId: 'G-J2JKEQ802Q',
  });
  auth = getAuth(app);
  functions = getFunctions(app, 'europe-west1');
  storage = getStorage(app);
  check = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider('6LcD0PwpAAAAAJS_dqQU7tndXlN8esC2-rkkHD46'),
    isTokenAutoRefreshEnabled: true,
  });
} else {
  app = initializeApp({
    apiKey: '',
    projectId: 'distributed-421517',
    storageBucket: 'distributed-421517.appspot.com',
    messagingSenderId: '872004267669',
    appId: '1:872004267669:web:be16d50843b2bddcb2759c',
    measurementId: 'G-J2JKEQ802Q',
    authDomain: 'http://127.0.0.1:9099',
    locationId: 'europe-west',
  });
  auth = getAuth(app);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  functions = getFunctions(app, 'europe-west1');
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  storage = getStorage(app);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  check = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider('6LcD0PwpAAAAAJS_dqQU7tndXlN8esC2-rkkHD46'),
    isTokenAutoRefreshEnabled: true,
  });
}

function getCallable(name) {
  return httpsCallable(functions, name);
}
export { app, auth, getCallable, storage };
