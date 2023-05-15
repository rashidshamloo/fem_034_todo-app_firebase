import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDp68-ShVJcHt9aXULkyc0h56M62hkX3QQ',
  authDomain: 'fem-034-todo-list.firebaseapp.com',
  projectId: 'fem-034-todo-list',
  storageBucket: 'fem-034-todo-list.appspot.com',
  messagingSenderId: '888514457501',
  appId: '1:888514457501:web:6236be390fed4eaf034974',
  measurementId: 'G-M6KZD9TKF3',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth(app);
export const db = getFirestore(app);
