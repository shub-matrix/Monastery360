import React, { useEffect, useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useMonasteryData from '../hooks/useMonasteryData';
import '../styles/Wishlist.css';

const Wishlist = () => {
    const { wishlistItems, loading, toggleWishlistItem } = useWishlist();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { monasteries } = useMonasteryData();
    const [wishlistMonasteries, setWishlistMonasteries] = useState([]);

    useEffect(() => {
        if (wishlistItems.length > 0 && monasteries.length > 0) {
            // Match wishlist items with monastery data
            const matchedMonasteries = monasteries.filter(monastery => 
                wishlistItems.includes(monastery.id.toString()) ||
                wishlistItems.includes(monastery.id) ||
                wishlistItems.some(item => 
                    (typeof item === 'object' && (item._id === monastery.id || item.id === monastery.id)) ||
                    item === monastery.id.toString()
                )
            );
            setWishlistMonasteries(matchedMonasteries);
        } else {
            setWishlistMonasteries([]);
        }
    }, [wishlistItems, monasteries]);

    if (!isAuthenticated) {
        return (
            <div className="auth-required-container">
                <div className="auth-prompt">
                    <div className="auth-icon">💝</div>
                    <h2>Authentication Required</h2>
                    <p>Please log in to view your wishlist</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="btn btn-primary auth-btn"
                    >
                        Login to Continue
                    </button>
                </div>
            </div>
        );
    }

    const handleRemoveFromWishlist = async (monasteryId) => {
        await toggleWishlistItem(monasteryId);
    };

    const handleExploreMonastery = (monasteryId) => {
        navigate(`/monasteries/${monasteryId}`);
    };

    if (loading) {
        return (
            <div className="wishlist-loading">
                <div className="loading-spinner"></div>
                <p>Loading your wishlist...</p>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            <div className="wishlist-hero">
                <h1 className="wishlist-title">
                    <span className="wishlist-icon">💝</span>
                    My Wishlist
                </h1>
                <p className="wishlist-subtitle">
                    Your saved monasteries and sacred places
                </p>
                <div className="wishlist-count-display">
                    {wishlistMonasteries.length} {wishlistMonasteries.length === 1 ? 'monastery' : 'monasteries'} saved
                </div>
            </div>
            
            <div className="wishlist-content">
                {wishlistMonasteries.length === 0 ? (
                    <div className="empty-wishlist">
                        <div className="empty-wishlist-icon">🏛️</div>
                        <h3>Your wishlist is empty</h3>
                        <p>Start adding monasteries to your wishlist to keep track of places you want to visit</p>
                        <button 
                            onClick={() => navigate('/monasteries')}
                            className="btn btn-primary"
                        >
                            Explore Monasteries
                        </button>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlistMonasteries.map((monastery) => (
                            <div key={monastery.id} className="wishlist-item">
                                <div className="wishlist-item-image">
                                    <img 
                                        src={`/images/${monastery.imageName || 'default-monastery.jpg'}`} 
                                        alt={monastery.name}
                                        onError={(e) => {
                                            e.target.src = '/images/default-monastery.jpg';
                                        }}
                                    />
                                    <div className="wishlist-overlay">
                                        <span className="monastery-est">Est. {monastery.established}</span>
                                    </div>
                                </div>
                                
                                <div className="wishlist-item-content">
                                    <h3 className="wishlist-item-title">{monastery.name}</h3>
                                    <div className="wishlist-item-meta">
                                        <span className="wishlist-item-location">
                                            📍 {monastery.location}
                                        </span>
                                        <span className="wishlist-item-established">
                                            🏛️ {monastery.established}
                                        </span>
                                    </div>
                                    
                                    {monastery.history && (
                                        <p className="wishlist-item-description">
                                            {monastery.history.length > 150 
                                                ? `${monastery.history.substring(0, 150)}...`
                                                : monastery.history
                                            }
                                        </p>
                                    )}
                                    
                                    <div className="wishlist-item-actions">
                                        <button
                                            onClick={() => handleExploreMonastery(monastery.id)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Explore
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromWishlist(monastery.id)}
                                            className="btn btn-danger btn-sm"
                                            disabled={loading}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;