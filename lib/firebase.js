import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCf4_nGBeP5fjxY_oVCMIHNq4JKq0JMWco",
  authDomain: "parkpay-d2583.firebaseapp.com",
  projectId: "parkpay-d2583",
  storageBucket: "parkpay-d2583.firebasestorage.app",
  messagingSenderId: "869416929237",
  appId: "1:869416929237:web:1d2a53c2c42fb1d48c9f5c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
