// src/pages/Terms.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../css/style.css';
import '../css/terms.css';

export default function Terms() {
  const navigate = useNavigate();

    return (
    <div className="terms-page">
        <Header />

        <main className="terms-content">
            <h1>Terms of Service</h1>
            <p>Placeholder for terms of service page.</p>
        </main>

        {/*
        <footer className="site-footer">
            <p>© {new Date().getFullYear()} Peer to Peer Drop Off · All rights reserved</p>
        </footer>
        */}
        

    </div>
  );  
}
