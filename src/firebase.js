// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyB1vo5edRbWPFV4XeYw2Hc648DRytmaaxQ',
    authDomain: 'react-firebase-chat-app-a324a.firebaseapp.com',
    projectId: 'react-firebase-chat-app-a324a',
    storageBucket: 'react-firebase-chat-app-a324a.appspot.com',
    messagingSenderId: '823322500591',
    appId: '1:823322500591:web:3d89415efe900775202a1a'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const database = getDatabase(app);
