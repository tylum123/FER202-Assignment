import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzp6P0gsCYu6o0dG8d7r-nSBNFHPjoCHo",
  authDomain: "labfinal-cdcae.firebaseapp.com",
  projectId: "labfinal-cdcae",
  storageBucket: "labfinal-cdcae.appspot.com",
  messagingSenderId: "1056166596604",
  appId: "1:1056166596604:web:a3ae904f826508871e2c79",
  measurementId: "G-DYFSZ5KYSE",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth, createUserWithEmailAndPassword }; 
