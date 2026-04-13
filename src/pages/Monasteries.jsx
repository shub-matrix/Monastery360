import React, { useState, useEffect, useRef } from 'react';
import useMonasteryData from '../hooks/useMonasteryData';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import '../styles/Monasteries.css';
import ChatBot from '../components/ChatBot/ChatBot';

const Monasteries = () => {
    const { monasteries, loading, error } = useMonasteryData();
    const { isAuthenticated, user } = useAuth();
    const { toggleWishlistItem, isInWishlist, loading: wishlistLoading } = useWishlist();
    const navigate = useNavigate();
    const [filteredMonasteries, setFilteredMonasteries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPage = parseInt(queryParams.get('page')) || 1;
    const initialRegion = queryParams.get('region') || 'All';
    const [currentPage, setCurrentPage] = useState(initialPage);
    const monasteriesPerPage = 9;
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (initialRegion !== 'All' && initialRegion !== selectedRegion) {
            setSelectedRegion(initialRegion);
        }
    }, [initialRegion, selectedRegion]);

    const prevFilterRef = useRef({ searchTerm, selectedRegion });
    useEffect(() => {
        let filtered = monasteries;
        if (searchTerm) {
            filtered = filtered.filter(monastery =>
                monastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                monastery.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedRegion !== 'All') {
            filtered = filtered.filter(monastery =>
                monastery.location.includes(selectedRegion)
            );
        }
        setFilteredMonasteries(filtered);
        if (
            prevFilterRef.current.searchTerm !== searchTerm ||
            prevFilterRef.current.selectedRegion !== selectedRegion
        ) {
            setCurrentPage(1);
        }
        prevFilterRef.current = { searchTerm, selectedRegion };
    }, [monasteries, searchTerm, selectedRegion]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (currentPage > 1) {
            params.set('page', currentPage);
        } else {
            params.delete('page');
        }
        if (params.toString() !== location.search.replace(/^\?/, '')) {
            navigate({ search: params.toString() ? `?${params.toString()}` : '' }, { replace: true });
        }
    }, [currentPage, navigate, location.search]);

    const handleViewRoutes = (monastery) => {
        navigate(`/directions/${monastery.id}`);
    };

    const handleWeatherUpdate = (monastery) => {
        navigate(`/weather/${monastery.id}`);
    };

    const handleVirtualTour = (monastery) => {
        navigate(`/virtual/${monastery.id}`);
    };

    const handleReviewClick = (monastery) => {
        navigate(`/monasteries/${monastery.id}?tab=reviews`);
    };

    const handleToggleWishlist = async (e, monasteryId) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        console.log('Monasteries page: Toggling wishlist for monastery:', monasteryId);
        
        try {
            const result = await toggleWishlistItem(monasteryId);
            if (result !== false) {
                console.log('Wishlist toggle successful');
            }
        } catch (error) {
            console.error('Error in handleToggleWishlist:', error);
        }
    };

    const regions = [
        { name: 'All', icon: '🏛️' },
        { name: 'East Sikkim', icon: '🌅' },
        { name: 'West Sikkim', icon: '🌄' },
        { name: 'North Sikkim', icon: '🏔️' },
        { name: 'South Sikkim', icon: '🌲' }
    ];

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            
            if (currentPage <= 3) {
                endPage = 4;
            }
            
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }
            
            if (startPage > 2) {
                pages.push('...');
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            
            pages.push(totalPages);
        }
        
        return pages;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        navigate({ search: `?page=${pageNumber}` }, { replace: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isAuthenticated) {
        return (
            <div className="auth-required-container">
                <div className="auth-prompt">
                    <div className="auth-icon">
                        <span className="emoji-icon xxl">🏛️</span>
                    </div>
                    <h2>Authentication Required</h2>
                    <p>Please log in to explore the sacred monasteries of Sikkim</p>
                    <div className="auth-benefits">
                        <h3>What you'll get access to:</h3>
                        <ul>
                            <li><span className="emoji-icon small">🌍</span> Interactive 3D virtual tours</li>
                            <li><span className="emoji-icon small">📍</span> Detailed directions to monasteries</li>
                            <li><span className="emoji-icon small">🌤️</span> Real-time weather updates</li>
                            <li><span className="emoji-icon small">🎧</span> Audio guides and historical insights</li>
                            <li><span className="emoji-icon small">📱</span> Personalized monastery recommendations</li>
                        </ul>
                    </div>
                    <div className="auth-actions">
                        <button 
                            onClick={() => navigate('/login')}
                            className="btn btn-primary auth-btn"
                        >
                            Login to Continue
                        </button>
                        <p className="auth-signup">
                            Don't have an account? 
                            <Link to="/register" className="signup-link"> Sign up here</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <h3>Discovering Sacred Places...</h3>
                <p>Loading Sikkim's ancient monasteries</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>Error loading monasteries: {error.message}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    const totalPages = Math.ceil(filteredMonasteries.length / monasteriesPerPage);
    const startIdx = (currentPage - 1) * monasteriesPerPage;
    const endIdx = startIdx + monasteriesPerPage;
    const pagedMonasteries = filteredMonasteries.slice(startIdx, endIdx);

    return (
        <div className="monasteries-page" style={{ padding: '0', margin: '0' }}>
            <div className="hero-section" style={{
                background: `
                    linear-gradient(135deg, 
                        #100db8 0%, 
                        #100db8 50%,
                        #100db8 100%
                    )
                `,
                position: 'relative',
                overflow: 'hidden',
                color: 'white',
                padding: '40px 20px',
                textAlign: 'center',
                borderRadius: '0 0 20px 20px',
                boxShadow: '0 8px 25px rgba(46, 125, 50, 0.2)',
                marginBottom: '20px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px),
                        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px, 40px 40px',
                    opacity: 0.6,
                    pointerEvents: 'none'
                }}></div>

                <div className="hero-content" style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                    <h1 className="hero-title" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        fontWeight: '700',
                        marginBottom: '15px',
                        lineHeight: '1.2',
                        color: '#fff',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                        Sacred Monasteries of Sikkim
                        <span className="subtitle" style={{
                            display: 'block',
                            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                            fontWeight: '400',
                            marginTop: '10px',
                            color: 'rgba(255, 255, 255, 0.95)',
                            opacity: '0.9'
                        }}>
                            Discover 200+ Ancient Buddhist Heritage Sites
                        </span>
                    </h1>
                    
                    <div className="hero-stats" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        marginTop: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div className="stat" style={{
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            minWidth: '120px'
                        }}>
                            <span className="stat-number" style={{
                                display: 'block',
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#fff',
                                textShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>{monasteries.length}</span>
                            <span className="stat-label" style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: '500'
                            }}>Monasteries</span>
                        </div>
                        <div className="stat" style={{
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            minWidth: '120px'
                        }}>
                            <span className="stat-number" style={{
                                display: 'block',
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#fff',
                                textShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>300+</span>
                            <span className="stat-label" style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: '500'
                            }}>Years of History</span>
                        </div>
                        <div className="stat" style={{
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            minWidth: '120px'
                        }}>
                            <span className="stat-number" style={{
                                display: 'block',
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#fff',
                                textShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}>4</span>
                            <span className="stat-label" style={{
                                fontSize: '0.85rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontWeight: '500'
                            }}>Regions</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="controls-section" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '15px 20px',
                borderRadius: '15px',
                margin: '0 20px 20px 20px',
                boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="filter-controls" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    flexWrap: 'wrap',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div className="region-filter" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        minWidth: '200px'
                    }}>
                        <label style={{
                            fontWeight: '600',
                            color: '#2e7d32',
                            fontSize: '1rem',
                            whiteSpace: 'nowrap'
                        }}>Region:</label>
                        <select 
                            value={selectedRegion} 
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="region-select"
                            style={{
                                padding: '10px 15px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '25px',
                                fontSize: '1rem',
                                background: 'white',
                                color: '#2e7d32',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                minWidth: '150px',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#4caf50';
                                e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            {regions.map(region => (
                                <option key={region.name} value={region.name}>
                                    {region.icon} {region.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="search-container" style={{
                        flex: '1',
                        maxWidth: '400px',
                        minWidth: '250px'
                    }}>
                        <div className="search-box" style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <i className="search-icon" style={{
                                position: 'absolute',
                                left: '15px',
                                fontSize: '1.2rem',
                                color: '#4caf50',
                                zIndex: 1
                            }}>🔍</i>
                            <input
                                type="text"
                                placeholder="Search monasteries by name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                style={{
                                    width: '100%',
                                    padding: '12px 20px 12px 50px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '25px',
                                    fontSize: '1rem',
                                    background: 'white',
                                    color: '#333',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4caf50';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <div className="view-toggle" style={{
                        display: 'flex',
                        gap: '5px',
                        background: '#f5f5f5',
                        borderRadius: '25px',
                        padding: '5px',
                        minWidth: '160px'
                    }}>
                        <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: viewMode === 'grid' ? 'linear-gradient(135deg, #2e7d32, #4caf50)' : 'transparent',
                                color: viewMode === 'grid' ? 'white' : '#666',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                            onMouseEnter={(e) => {
                                if (viewMode !== 'grid') {
                                    e.target.style.background = '#e8f5e8';
                                    e.target.style.color = '#2e7d32';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (viewMode !== 'grid') {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#666';
                                }
                            }}
                        >
                            <i>⊞</i> Grid
                        </button>
                        <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: viewMode === 'list' ? 'linear-gradient(135deg, #2e7d32, #4caf50)' : 'transparent',
                                color: viewMode === 'list' ? 'white' : '#666',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                            onMouseEnter={(e) => {
                                if (viewMode !== 'list') {
                                    e.target.style.background = '#e8f5e8';
                                    e.target.style.color = '#2e7d32';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (viewMode !== 'list') {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#666';
                                }
                            }}
                        >
                            <i>☰</i> List
                        </button>
                    </div>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '1rem',
                    color: '#666',
                    fontWeight: '500'
                }}>
                    Showing <span style={{ color: '#2e7d32', fontWeight: '700' }}>{startIdx + 1}-{Math.min(endIdx, filteredMonasteries.length)}</span> of <span style={{ color: '#2e7d32', fontWeight: '700' }}>{filteredMonasteries.length}</span> {filteredMonasteries.length === 1 ? 'monastery' : 'monasteries'}
                </div>
            </div>

            <div style={{
                padding: '0 20px',
                margin: '0 auto',
                maxWidth: '1200px'
            }}>
                {filteredMonasteries.length === 0 ? (
                    <div className="no-results" style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏛️</div>
                        <h3 style={{ fontSize: '1.8rem', color: '#2e7d32', marginBottom: '10px' }}>No monasteries found</h3>
                        <p style={{ fontSize: '1.1rem', color: '#666' }}>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <>
                    <div style={{
                        display: viewMode === 'grid' ? 'grid' : 'flex',
                        gridTemplateColumns: viewMode === 'grid' 
                            ? (isMobile ? '1fr' : 'repeat(3, 1fr)')
                            : 'none',
                        flexDirection: viewMode === 'list' ? 'column' : 'row',
                        gap: '25px',
                        marginBottom: '40px',
                        width: '100%',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        justifyItems: 'center'
                    }}>
                        {pagedMonasteries.map((monastery, index) => (
                            <div 
                                key={monastery.id}
                                className="monastery-card"
                                style={{ 
                                    animationDelay: `${index * 0.1}s`,
                                    background: 'white',
                                    borderRadius: '15px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease',
                                    display: viewMode === 'list' ? 'flex' : 'block',
                                    flexDirection: viewMode === 'list' ? (isMobile ? 'column' : 'row') : 'column',
                                    height: 'auto',
                                    width: '100%',
                                    maxWidth: '100%'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                <div className="monastery-image" style={{ 
                                    position: 'relative', 
                                    height: viewMode === 'list' && !isMobile ? '220px' : '200px',
                                    width: viewMode === 'list' && !isMobile ? '300px' : '100%',
                                    minWidth: viewMode === 'list' && !isMobile ? '300px' : 'auto',
                                    maxWidth: viewMode === 'list' && !isMobile ? '300px' : '100%',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                }}>
                                    <Link to={`/monasteries/${monastery.id}`}>
                                        <img 
                                            src={`/images/${monastery.imageName || 'Home1.jpg'}`} 
                                            alt={monastery.name}
                                            loading="lazy"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease'
                                            }}
                                            onError={(e) => {
                                                e.target.src = '/images/Home1.jpg';
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            background: 'rgba(46, 125, 50, 0.95)',
                                            color: 'white',
                                            padding: '8px 15px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            Est. {monastery.established}
                                        </div>
                                    </Link>
                                </div>

                                <div style={{ 
                                    padding: '18px',
                                    flex: viewMode === 'list' && !isMobile ? '1' : 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    width: '100%'
                                }}>
                                    <div>
                                        <Link 
                                            to={`/monasteries/${monastery.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <h2 style={{
                                                fontSize: isMobile ? '1.2rem' : '1.3rem',
                                                fontWeight: '700',
                                                color: '#2e7d32',
                                                marginBottom: '8px',
                                                fontFamily: "'Playfair Display', serif",
                                                lineHeight: '1.3',
                                                cursor: 'pointer',
                                                transition: 'color 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = '#4caf50';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = '#2e7d32';
                                            }}
                                            >
                                                {monastery.name}
                                            </h2>
                                        </Link>

                                        <div style={{
                                            display: 'flex',
                                            gap: '12px',
                                            marginBottom: '10px',
                                            fontSize: '0.87rem',
                                            color: '#666',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <i>📍</i> {monastery.location}
                                            </span>
                                        </div>

                                        <Link 
                                            to={`/monasteries/${monastery.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <p style={{
                                                fontSize: '0.9rem',
                                                color: '#555',
                                                lineHeight: '1.55',
                                                marginBottom: '12px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: viewMode === 'list' && !isMobile ? 2 : 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'color 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = '#2e7d32';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = '#555';
                                            }}
                                            >
                                                {monastery.history}
                                            </p>
                                        </Link>

                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'nowrap',
                                            gap: '6px',
                                            marginBottom: '12px',
                                            overflow: 'hidden'
                                        }}>
                                            <span 
                                                onClick={() => handleVirtualTour(monastery)}
                                                style={{
                                                    padding: '6px 10px',
                                                    background: 'rgba(46, 125, 50, 0.08)',
                                                    color: '#2e7d32',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    flex: '1',
                                                    textAlign: 'center',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = '#4caf50';
                                                    e.target.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = 'rgba(46, 125, 50, 0.08)';
                                                    e.target.style.color = '#2e7d32';
                                                }}
                                            >
                                                🌍 3D Tour
                                            </span>
                                            <span 
                                                onClick={() => handleReviewClick(monastery)}
                                                style={{
                                                    padding: '6px 10px',
                                                    background: 'rgba(46, 125, 50, 0.08)',
                                                    color: '#2e7d32',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    flex: '1',
                                                    textAlign: 'center',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = '#4caf50';
                                                    e.target.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = 'rgba(46, 125, 50, 0.08)';
                                                    e.target.style.color = '#2e7d32';
                                                }}
                                            >
                                                📝 Check Review
                                            </span>
                                            <span 
                                                onClick={() => handleVirtualTour(monastery)}
                                                style={{
                                                    padding: '6px 10px',
                                                    background: 'rgba(46, 125, 50, 0.08)',
                                                    color: '#2e7d32',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    flex: '1',
                                                    textAlign: 'center',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = '#4caf50';
                                                    e.target.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = 'rgba(46, 125, 50, 0.08)';
                                                    e.target.style.color = '#2e7d32';
                                                }}
                                            >
                                                🔄 360°
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            marginBottom: '12px',
                                            flexWrap: 'wrap'
                                        }}>
                                        <Link 
                                            to={`/monasteries/${monastery.id}`}
                                            style={{
                                                flex: '1 1 calc(50% - 4px)',
                                                minWidth: '110px',
                                                padding: '10px 12px',
                                                textAlign: 'center',
                                                background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontSize: '0.82rem',
                                                fontWeight: '600',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '5px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 3px 10px rgba(46, 125, 50, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            <i>👁️</i> <span>Explore</span>
                                        </Link>
                                        <button 
                                            onClick={() => handleViewRoutes(monastery)}
                                            style={{
                                                flex: '1 1 calc(50% - 4px)',
                                                minWidth: '110px',
                                                padding: '10px 12px',
                                                background: 'transparent',
                                                color: '#2e7d32',
                                                border: '2px solid #2e7d32',
                                                borderRadius: '8px',
                                                fontSize: '0.82rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '5px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = '#2e7d32';
                                                e.target.style.color = 'white';
                                                e.target.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'transparent';
                                                e.target.style.color = '#2e7d32';
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <i>🗺️</i> <span>Directions</span>
                                        </button>
                                    </div>

                                    <button 
                                        onClick={(e) => handleToggleWishlist(e, monastery.id)}
                                        disabled={wishlistLoading}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            fontSize: '0.87rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            cursor: wishlistLoading ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            background: isInWishlist(monastery.id) 
                                                ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' 
                                                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                            opacity: wishlistLoading ? 0.7 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!wishlistLoading) {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.15)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!wishlistLoading) {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
                                            }
                                        }}
                                    >
                                        <span style={{ fontSize: '1rem' }}>
                                            {isInWishlist(monastery.id) ? '❤️' : '🤍'}
                                        </span>
                                        <span>
                                            {isInWishlist(monastery.id) ? 'In Wishlist' : 'Add to Wishlist'}
                                        </span>
                                    </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: isMobile ? '6px' : '8px',
                            marginTop: isMobile ? '25px' : '40px',
                            marginBottom: isMobile ? '25px' : '40px',
                            flexWrap: 'wrap',
                            padding: isMobile ? '5px' : '10px'
                        }}>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={{
                                    width: isMobile ? '40px' : '48px',
                                    height: isMobile ? '40px' : '48px',
                                    minWidth: isMobile ? '40px' : '48px',
                                    minHeight: isMobile ? '40px' : '48px',
                                    background: currentPage === 1 ? '#f5f5f5' : 'linear-gradient(135deg, #2e7d32, #4caf50)',
                                    color: currentPage === 1 ? '#bbb' : 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    fontSize: isMobile ? '1rem' : '1.3rem',
                                    fontWeight: '700',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: currentPage === 1 ? 'none' : '0 2px 10px rgba(46, 125, 50, 0.2)',
                                    flexShrink: 0,
                                    opacity: currentPage === 1 ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    touchAction: 'manipulation',
                                    WebkitTapHighlightColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== 1 && !isMobile) {
                                        e.target.style.transform = 'scale(1.1)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(46, 125, 50, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== 1 && !isMobile) {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = '0 2px 10px rgba(46, 125, 50, 0.2)';
                                    }
                                }}
                            >
                                ←
                            </button>

                            {getPageNumbers().map((pageNum, index) => (
                                pageNum === '...' ? (
                                    <span
                                        key={`ellipsis-${index}`}
                                        style={{
                                            padding: isMobile ? '0 2px' : '0 5px',
                                            color: '#999',
                                            fontSize: isMobile ? '0.85rem' : '1rem',
                                            fontWeight: 'bold',
                                            userSelect: 'none'
                                        }}
                                    >
                                        •••
                                    </span>
                                ) : (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        style={{
                                            width: isMobile ? '40px' : '48px',
                                            height: isMobile ? '40px' : '48px',
                                            minWidth: isMobile ? '40px' : '48px',
                                            minHeight: isMobile ? '40px' : '48px',
                                            background: currentPage === pageNum
                                                ? 'linear-gradient(135deg, #2e7d32, #4caf50)'
                                                : 'white',
                                            color: currentPage === pageNum ? 'white' : '#2e7d32',
                                            border: currentPage === pageNum ? 'none' : '2px solid #e0e0e0',
                                            borderRadius: '50%',
                                            fontSize: isMobile ? '0.85rem' : '1rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: currentPage === pageNum 
                                                ? '0 4px 15px rgba(46, 125, 50, 0.3)' 
                                                : '0 2px 8px rgba(0, 0, 0, 0.08)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            touchAction: 'manipulation',
                                            WebkitTapHighlightColor: 'transparent'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (currentPage !== pageNum && !isMobile) {
                                                e.target.style.background = '#e8f5e8';
                                                e.target.style.borderColor = '#4caf50';
                                                e.target.style.transform = 'scale(1.1)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(46, 125, 50, 0.2)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (currentPage !== pageNum && !isMobile) {
                                                e.target.style.background = 'white';
                                                e.target.style.borderColor = '#e0e0e0';
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                                            }
                                        }}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={{
                                    width: isMobile ? '40px' : '48px',
                                    height: isMobile ? '40px' : '48px',
                                    minWidth: isMobile ? '40px' : '48px',
                                    minHeight: isMobile ? '40px' : '48px',
                                    background: currentPage === totalPages ? '#f5f5f5' : 'linear-gradient(135deg, #2e7d32, #4caf50)',
                                    color: currentPage === totalPages ? '#bbb' : 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    fontSize: isMobile ? '1rem' : '1.3rem',
                                    fontWeight: '700',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: currentPage === totalPages ? 'none' : '0 2px 10px rgba(46, 125, 50, 0.2)',
                                    flexShrink: 0,
                                    opacity: currentPage === totalPages ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    touchAction: 'manipulation',
                                    WebkitTapHighlightColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== totalPages && !isMobile) {
                                        e.target.style.transform = 'scale(1.1)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(46, 125, 50, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== totalPages && !isMobile) {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = '0 2px 10px rgba(46, 125, 50, 0.2)';
                                    }
                                }}
                            >
                                →
                            </button>
                        </div>
                    )}
                    </>
                )}
            </div>

            <div 
                className="cta-section"
                style={{
                    background: 'linear-gradient(135deg, #000000 0%, #000000 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '60px 20px',
                    margin: '40px 0 0 0'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'rgba(255,255,255,0.05)',
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                    backgroundSize: '30px 30px',
                    pointerEvents: 'none'
                }}></div>
                
                <div 
                    className="cta-content"
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}
                >
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '20px',
                        letterSpacing: '0.5px'
                    }}>
                        Plan Your Spiritual Journey
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '40px',
                        lineHeight: '1.6',
                        fontWeight: '400'
                    }}>
                        Discover the ancient wisdom and breathtaking architecture of Sikkim's monasteries
                    </p>
                    
                    <div 
                        className="cta-buttons"
                        style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginBottom: '30px'
                        }}
                    >
                        <button 
                            className="btn btn-cta"
                            style={{
                                background: '#ffffff',
                                color: '#667eea',
                                padding: '15px 35px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                minWidth: '200px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                                e.target.style.background = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                                e.target.style.background = '#ffffff';
                            }}
                        >
                            📱 Download Mobile App
                        </button>
                        <button 
                            className="btn btn-outline-cta"
                            style={{
                                background: 'transparent',
                                color: 'white',
                                padding: '15px 35px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                border: '2px solid white',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                minWidth: '200px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'white';
                                e.target.style.color = '#667eea';
                                e.target.style.transform = 'translateY(-3px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            🎯 Book Guided Tour
                        </button>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '30px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>⭐</span>
                            4.9/5 Rating
                        </div>
                        <div style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>📲</span>
                            100k+ Downloads
                        </div>
                        <div style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>🎧</span>
                            Audio Guides
                        </div>
                    </div>
                </div>
            </div>
            
            <ChatBot />
        </div>
    );
};

export default Monasteries;