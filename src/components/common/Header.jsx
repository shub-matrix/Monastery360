import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import './Header.css';
import CulturalCalendar from '../CulturalCalendar/CulturalCalendar';
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();
    const { getWishlistCount } = useWishlist();
    const dropdownRef = useRef(null);

    useEffect(() => {
        console.log("Header - isAuthenticated:", isAuthenticated);
        console.log("Header - user data:", user);
        console.log("Header - user role:", user?.role);
    }, [isAuthenticated, user]);

    useEffect(() => {
        // Prevent body scroll when menu is open on mobile
        if (isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
        
        // Cleanup on unmount
        return () => {
            document.body.classList.remove('menu-open');
        };
    }, [isMenuOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
        setIsUserDropdownOpen(false);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const closeUserDropdown = () => {
        setIsUserDropdownOpen(false);
    };

    const getUserInitial = () => {
        if (user?.name) {
            return user.name.charAt(0).toUpperCase();
        } else if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    return (
        <header className="header">
            <div className="nav glass-nav">
                <Link to="/" className="logo animated-gradient" onClick={closeMenu}>Monastery360</Link>
                <button 
                    className="menu-toggle" 
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
                {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-links">
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/monasteries" onClick={closeMenu}>Historic Places</Link></li>
                        <li><Link to="/cultural-calendar" onClick={closeMenu}>Cultural Calendar</Link></li>
                        <li>
                            <Link to="/wishlist" onClick={closeMenu} className="wishlist-link">
                                Wishlist
                                {getWishlistCount() > 0 && (
                                    <span className="wishlist-badge">{getWishlistCount()}</span>
                                )}
                            </Link>
                        </li>
                        <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
                       
                        {!isAuthenticated ? (
                            <li><Link to="/login" onClick={closeMenu}>Login/Signup</Link></li>
                        ) : (
                            <>
                                <li className="user-avatar-container" ref={dropdownRef}>
                                    <div className="user-avatar" onClick={toggleUserDropdown}>
                                        {getUserInitial()}
                                    </div>
                                    {isUserDropdownOpen && (
                                        <div className="user-dropdown">
                                            <Link to="/profile" onClick={() => { closeMenu(); closeUserDropdown(); }}>Profile</Link>
                                            {/* Wishlist link moved to main navbar */}
                                            <Link to="/contact" onClick={() => { closeMenu(); closeUserDropdown(); }}>Contact us</Link>
                                            {user?.role === 'admin' && (
                                                <Link to="/admin" onClick={() => { closeMenu(); closeUserDropdown(); }} className="dropdown-admin-link">Admin Panel</Link>
                                            )}
                                            <button onClick={handleLogout} className="dropdown-logout-btn">Logout</button>
                                        </div>
                                    )}
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;