// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOvrVrkde__Q5Lk4_xWFATr8h5yiNMpcM",
  authDomain: "caminhantes-finance.firebaseapp.com",
  projectId: "caminhantes-finance",
  storageBucket: "caminhantes-finance.appspot.com",
  messagingSenderId: "236405005812",
  appId: "1:236405005812:web:0a3477904f810ab6f2ada1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export function to initialize Firebase
export const initFirebase = () => {
  return app;
};