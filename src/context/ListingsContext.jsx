import React, { createContext, useContext, useState, useEffect } from "react";

const ListingsContext = createContext();
export const useListings = () => useContext(ListingsContext);

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

  // Stores 
  const [stores] = useState([
    { id: 1, name: "North District Store", address: "Main St & 5th Ave 10001", price: "$5/mo storage", lat: 37.7850, lng: -122.4200 },
    { id: 2, name: "East Quarter Shop", address: "Market St Plaza 10002", price: "$8/mo storage", lat: 37.7700, lng: -122.3900 },
    { id: 3, name: "Downtown Center", address: "Central Square 10003", price: "$10/mo storage", lat: 37.7749, lng: -122.4194 },
    { id: 4, name: "West Side Location", address: "Oak Ave & Elm St 10004", price: "$6/mo storage", lat: 37.7600, lng: -122.4400 },
  ]);

  // Auth
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // Fetch all listings from backend 
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/items");

      const text = await res.text(); // read raw response first

      if (!res.ok) {
        console.error("Status:", res.status);
        console.error("Raw response:", text);
        throw new Error(`Server error: ${res.status}`);
      }

      // Only parse JSON if status is OK
      const data = JSON.parse(text);
      setListings(data);

    } catch (err) {
      console.error("FULL ERROR OBJECT:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Add new listing (POST)
  const addListing = async (newListing) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newListing),
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

  // --- Stats (derived state) ---
  const stats = {
    itemsWatching: watching.length,
    activeListings: listings.length,
    totalEarnings: 0, // Update if tracking earnings
    totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
  };

  return (
    <ListingsContext.Provider
      value={{
        listings,
        watching,
        stores,
        stats,
        addListing,
        currentUser,
        login,
        logout,
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