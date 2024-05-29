import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

let response = fetch('/__/firebase/init.json');

if (response.ok) {
  response = await response.json();
  console.log(response);
} else {
  response = {
    apiKey: 'test-api-key',
    authDomain: 'http://127.0.0.1:9099',
    locationId: 'europe-west',
    messagingSenderId: '872004267669',
    projectId: 'distributed-421517',
    storageBucket: 'distributed-421517.appspot.com',
  };
}
const app = initializeApp(response);
const auth = getAuth(app);

connectAuthEmulator(auth, 'http://127.0.0.1:9099');

export { app, auth };
