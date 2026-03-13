// src/pages/ListingCreated.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import '../css/listing-created.css';

const ListingCreated = () => {
    const { id } = useParams();
    const [copied, setCopied] = useState(false);

    const listingUrl = `${window.location.origin}/listing/${id}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(listingUrl);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 4000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div>
            <Header />

            <div className="listing-created-page">
                <h1>🎉 Listing Created!</h1>
                <p>Your item is now live.</p>

                <div className="share-box">
                    <p className="share-label">Share this link:</p>

                    <div className="share-input-container">
                        <input
                            className="share-input"
                            value={listingUrl}
                            readOnly
                            onClick={(e) => e.target.select()}
                        />

                        <button
                            className="copy-btn"
                            onClick={handleCopy}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                <Link
                    to={`/selling`}
                    className="view-listing-btn"
                >
                    Selling Dashboard
                </Link>
            </div>
        </div>
    );
};

export default ListingCreated;