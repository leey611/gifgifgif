import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, addDoc, doc, setDoc, updateDoc, deleteDoc, collection, onSnapshot, query } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app)
export const videosRef = collection(db, "videos")
export { getDocs as getDocs }
export { doc as doc }
export { setDoc as setDoc }
export { addDoc as addDoc }
export { updateDoc as updateDoc }
export { deleteDoc as deleteDoc }
export { collection as collection }
export { onSnapshot as onSnapshot }
export { query as query }

export const addDocToFirebase = async (id, data) => {
    await setDoc(doc(db, "videos", id), data);
}

export const getDocsFromFirebase = async () => {
    const querySnapshot = await getDocs(collection(db, "videos"))
}