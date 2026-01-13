import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDP1_yG4H6ge9NoKC3qvPtnQnQSUf5_Ncg",
  authDomain: "p2pdropoff.firebaseapp.com",
  projectId: "p2pdropoff",
  storageBucket: "p2pdropoff.firebasestorage.app",
  messagingSenderId: "50280716786",
  appId: "1:50280716786:web:8f4d7998144043b551336b",
  measurementId: "G-ELL8TS3YV4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Authentication helper functions ---
export const signUp = async (email, password, firstName, lastName, city, state, zip, interests) => {

  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User credential:", userCredential);

    if (!userCredential || !userCredential.user) {
      throw new Error("Failed to create user account");
    }
    const uid = userCredential.user.uid;
    console.log("User UID:", uid);

    await setDoc(doc(db, "users", userCredential.user.uid), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      city: city || "",
      state: state || "",
      zip: zip || "",
      interests: interests || [],
      createdAt: new Date().toISOString()
    });

    return userCredential;

  } catch (error) {
    // If user was created but profile failed, delete
    if (error.code?.includes('firestore') && auth.currentUser) {
      await auth.currentUser.delete();
    }
    throw error;
  }

  return userCredential;

};

export const logIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};

export { auth, db };