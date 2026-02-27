import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';

const ListingCreated = () => {
    const { id } = useParams();

    const listingUrl = `${window.location.origin}/listing/${id}`;

    return (
        <div>
            <Header />

            <div style={{
                textAlign: 'center',
                padding: '80px 20px'
            }}>
                <h1>🎉 Listing Created!</h1>
                <p>Your item is now live.</p>

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    borderRadius: '16px',
                    background: '#F3F4F6'
                }}>
                    <p style={{ fontWeight: 600 }}>Share this link:</p>
                    <input
                        value={listingUrl}
                        readOnly
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                        }}
                        onClick={(e) => e.target.select()}
                    />
                </div>

                <Link
                    to={`/listing/${id}`}
                    style={{
                        display: 'inline-block',
                        marginTop: '30px',
                        padding: '12px 24px',
                        borderRadius: '999px',
                        background: 'linear-gradient(to right, #60A5FA, #A78BFA)',
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: 700
                    }}
                >
                    View Listing
                </Link>
            </div>
        </div>
    );
};

export default ListingCreated;