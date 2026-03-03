import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
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

export const submitPartnerApplication = async (form) => {
  try {
    const docRef = await addDoc(collection(db, "partners"), {
      ...form,
      status: "unapproved",
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting partner application:", error);
    throw error;
  }
};

export const getPartners = async () => {
  const snapshot = await getDocs(collection(db, "partners"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updatePartnerStatus = async (partnerId, status) => {
  await updateDoc(doc(db, "partners", partnerId), { status });
};

export const deletePartner = async (partnerId) => {
  await deleteDoc(doc(db, "partners", partnerId));
};

// --- Listings (Create Listing flow) ---
export const createListing = async (listing) => {
  const docRef = await addDoc(collection(db, "listings"), {
    title: listing.title || "Untitled Item",
    description: listing.description || "",
    price: listing.price ?? 0,
    location: listing.location ?? "No location selected",
    locationId: listing.locationId ?? null,
    image: listing.image ?? null,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export { auth, db };