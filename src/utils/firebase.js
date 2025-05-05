// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Replace this with your Firebase project config
const firebaseConfig = {
	apiKey: "AIzaSyCjJdOtg7kIICgfKnzWa4HadsJJ-3BeuYY",
	authDomain: "asl-database-f6d86.firebaseapp.com",
	projectId: "asl-database-f6d86",
	storageBucket: "asl-database-f6d86.firebasestorage.app",
	messagingSenderId: "94023610155",
	appId: "1:94023610155:web:4fd274caaa3e32c5321f6e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
