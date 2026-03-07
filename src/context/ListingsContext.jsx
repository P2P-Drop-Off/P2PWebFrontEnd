import React, { createContext, useContext, useState, useEffect } from "react";
import { getPartners } from "../functions/firebase";

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

  // Stores: derived from Firebase partners (approved only for display)
  const [stores, setStores] = useState([]);

  // Auth
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // Fetch partners from Firebase (partners collection) and use for listings + stores
  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8080/api/items");

      if (!res.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await res.json();

      setListings(data);

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
          address: [p.street, p.suite, p.city, p.state, p.zip]
            .filter(Boolean)
            .join(", "),
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
    fetchListings();
    fetchStores();
  }, []);

  // Add new listing (POST)
  const addListing = async (newListing) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/items", {
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
        setListings,
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