import React, { createContext, useContext, useState, useEffect } from "react";
import { getPartners, logIn, logOut } from "../functions/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ListingsContext = createContext();
export const useListings = () => useContext(ListingsContext);

export const statusLabels = {
        active: "Available",
        approved_by_buyer: "Buyer Confirmed Transaction - Awaiting Drop Off",
        dropped_off: "Dropped Off",
        paid_ready_for_pickup: "Payment Recieved by Seller - Awaiting Pickup",
    };

export const ListingsProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [watching, setWatching] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse currentUser", e);
      return null;
    }
  });

  const [stores, setStores] = useState([]);

  // -------------------- Firebase Auth Listener --------------------
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userWithUid = {
          uid: user.uid,
          name: user.displayName || user.email.split("@")[0],
          email: user.email,
        };
        setCurrentUser(userWithUid);
        localStorage.setItem("currentUser", JSON.stringify(userWithUid));
      } else {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      }
    });

    return () => unsubscribe(); // clean up listener
  }, []);

  // -------------------- Auth Helpers --------------------
  const loginUser = async (email, password) => {
    try {
      await logIn(email, password);
      // No need to manually set currentUser — listener updates it
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await logOut();
      // listener will update currentUser
    } catch (err) {
      console.error("Logout failed:", err);
      throw err;
    }
  };

  // -------------------- Fetch Listings --------------------
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User not logged in");

      const token = await user.getIdToken(); // get Firebase ID token

      const res = await fetch("http://localhost:8080/api/items", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // include token, send to backend
        },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch listings");
    }

    const data = await res.json();
    const myListings = data.filter(item => item.ownerUid === currentUser.uid);
    setListings(myListings);

  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const fetchStores = async () => {
    try {
      const partners = await getPartners();
      const approved = partners.filter((p) => p.status === "approved");
      setStores(
        approved.map((p) => ({
          id: p.id,
          name: p.storeName,
          address: [p.street, p.suite, p.city, p.state, p.zip].filter(Boolean).join(", "),
          price: p.space ? `${p.space} sq ft` : "",
          lat: p.lat,
          lng: p.lng,
        }))
      );
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  useEffect(() => {
    // Fetch listings when currentUser exists
    if (currentUser) {
      fetchListings(); // fetch and filter by currentUser.uid
    }

    // Stores fetched on mount
    fetchStores();
  }, [currentUser]);

  // -------------------- Add Listing --------------------
  const addListing = async (newListing) => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User not logged in");

      const token = await user.getIdToken();

      const listingWithOwner = { ...newListing, ownerUid: currentUser.uid };

      const res = await fetch("http://localhost:8080/api/items", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(listingWithOwner),
      });

      const text = await res.text();
      if (!res.ok) {
        console.error("Status:", res.status);
        console.error("Raw response:", text);
        throw new Error(`Server error: ${res.status}`);
      }

      const created = JSON.parse(text);
      setListings((prev) => [created, ...prev]);
    } catch (err) {
      console.error("FULL ERROR OBJECT:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Stats --------------------
  const stats = {
    itemsWatching: watching.length,
    activeListings: listings.length,
    totalEarnings: 0, // extend if tracking earnings
    totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
  };

  useEffect(() => {
        console.log("All listings:", listings);
      }, [listings]); // get rid of after debug
  return (
    <ListingsContext.Provider
      value={{
        listings,
        setListings,
        watching,
        stores,
        stats,
        addListing,
        currentUser,
        loginUser,
        logoutUser,
        loading,
        error,
        setWatching,
        fetchListings,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

