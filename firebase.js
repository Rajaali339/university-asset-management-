import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyD1k8Wqnpt0NZJIhHPO-nj0EGDxQpX-utM",

    authDomain:
    "university-asset-managem-ac884.firebaseapp.com",

    projectId:
    "university-asset-managem-ac884",

    storageBucket:
    "university-asset-managem-ac884.firebasestorage.app",

    messagingSenderId:
    "780188949188",

    appId:
    "1:780188949188:web:32be5bdc19b25f686f8791",

    measurementId:
    "G-5737DENJNH"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export {
    app,
    auth,
    db,

    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,

    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
};