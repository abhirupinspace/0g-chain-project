// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBZQ6tplDaaR0TG1SKwlUiOUL7h_rIZX6E",
    authDomain: "kofta-8732d.firebaseapp.com",
    projectId: "kofta-8732d",
    storageBucket: "kofta-8732d.appspot.com",
    messagingSenderId: "999675051928",
    appId: "1:999675051928:web:ddef8a53896adb90b5b5ed",
    measurementId: "G-0WQL285G28"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };