import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAqe0VInDdtNj-r1b36BdpqU_fVkdHV6w",
  authDomain: "d-bubble-siparis.firebaseapp.com",
  projectId: "d-bubble-siparis",
  storageBucket: "d-bubble-siparis.firebasestorage.app",
  messagingSenderId: "616058010861",
  appId: "1:616058010861:web:bcb3b459981b5962dd60e4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);