import React, { createContext, useContext, useState, useEffect } from 'react';

const ListingsContext = createContext();

export const useListings = () => useContext(ListingsContext);

export const ListingsProvider = ({ children }) => {
  // Initialize from localStorage or empty array
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('listings');
    return saved ? JSON.parse(saved) : [];
  });

  const [watching, setWatching] = useState(() => {
    const saved = localStorage.getItem('watching');
    return saved ? JSON.parse(saved) : [];
  });

  // Authentication State with Persistence
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Sync listings and watching to localStorage
  useEffect(() => {
    localStorage.setItem('listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('watching', JSON.stringify(watching));
  }, [watching]);

  // Shared store locations
  const [stores] = useState([
    { id: 1, name: 'North District Store', address: 'Main St & 5th Ave 10001', price: '$5/mo storage', lat: 37.7850, lng: -122.4200 },
    { id: 2, name: 'East Quarter Shop', address: 'Market St Plaza 10002', price: '$8/mo storage', lat: 37.7700, lng: -122.3900 },
    { id: 3, name: 'Downtown Center', address: 'Central Square 10003', price: '$10/mo storage', lat: 37.7749, lng: -122.4194 },
    { id: 4, name: 'West Side Location', address: 'Oak Ave & Elm St 10004', price: '$6/mo storage', lat: 37.7600, lng: -122.4400 },
  ]);

  const addListing = (newListing) => {
    setListings(prev => [
      {
        ...newListing,
        id: Date.now(),
        views: 0,
        comments: 0,
        status: 'active'
      },
      ...prev
    ]);
  };

  const stats = {
    itemsWatching: watching.length,
    activeListings: listings.length,
    totalEarnings: 0, // Reset earnings since lists are cleared
    totalViews: 0     // Reset views
  };

  return (
    <ListingsContext.Provider value={{ listings, watching, stats, addListing, stores, currentUser, login, logout }}>
      {children}
    </ListingsContext.Provider>
  );
};
