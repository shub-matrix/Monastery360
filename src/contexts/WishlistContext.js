import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, toggleWishlist } from '../services/wishlistAPI';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchWishlist = async () => {
        if (!isAuthenticated) return;
        
        try {
            setLoading(true);
            const data = await getWishlist();
            // Note: The backend expects Review objects, but we're using monastery data
            // You may need to update your backend model to reference monasteries instead of reviews
            setWishlistItems(data.wishlist || []);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            setWishlistItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [isAuthenticated]);

    const toggleWishlistItem = async (monasteryId) => {
        if (!isAuthenticated) {
            console.warn('User not authenticated - cannot toggle wishlist');
            return false;
        }
        
        // Validate monasteryId
        const numericId = parseInt(monasteryId);
        if (isNaN(numericId) || numericId <= 0) {
            console.error('Invalid monastery ID:', monasteryId);
            return false;
        }
        
        console.log('Toggling wishlist for monastery ID:', numericId);
        
        try {
            setLoading(true);
            const response = await toggleWishlist(numericId);
            console.log('Toggle wishlist response:', response);
            
            if (response && response.wishlist) {
                setWishlistItems(response.wishlist);
                return response.isInWishlist;
            } else {
                console.warn('Invalid response format:', response);
                // Refresh the entire wishlist to get current state
                await fetchWishlist();
                return !isInWishlist(numericId);
            }
        } catch (error) {
            console.error('Failed to toggle wishlist item:', error);
            
            // Log additional error information
            if (error.response) {
                console.error('Error response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            }
            
            return false;
        } finally {
            setLoading(false);
        }
    };

    const isInWishlist = (monasteryId) => {
        // Check if monastery ID exists in wishlist (compare as numbers)
        const numId = parseInt(monasteryId);
        return wishlistItems.some(item => 
            parseInt(item) === numId
        );
    };

    const getWishlistCount = () => {
        return wishlistItems.length;
    };

    const value = {
        wishlistItems,
        loading,
        toggleWishlistItem,
        isInWishlist,
        getWishlistCount,
        fetchWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};