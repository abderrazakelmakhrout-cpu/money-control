// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD96LYWo2w914A-H0UWGMtcRjzGns72v4g",
    authDomain: "money-control-pro-39eaf.firebaseapp.com",
    projectId: "money-control-pro-39eaf",
    storageBucket: "money-control-pro-39eaf.firebasestorage.app",
    messagingSenderId: "631933178769",
    appId: "1:631933178769:web:b35ea0547739cfc8a20030"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Configuration Google Auth
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Activer la persistance hors ligne
db.enablePersistence().catch(err => console.log(err));

console.log("✅ Firebase connecté !");
