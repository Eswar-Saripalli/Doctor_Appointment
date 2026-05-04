import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "Mee_kotha_API_key_ikkada_untundi",
  authDomain: "medflow-app-6fba3.firebaseapp.com",
  projectId: "medflow-app-6fba3",
  storageBucket: "medflow-app-6fba3.firebasestorage.app",
  messagingSenderId: "1037291462778",
  appId: "1:1037291462778:web:...",
  measurementId: "G-..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();
