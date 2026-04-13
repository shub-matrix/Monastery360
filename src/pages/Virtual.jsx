import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useMonasteryData from '../hooks/useMonasteryData';
import './Virtual.css';

const Virtual = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { monasteries, loading, error } = useMonasteryData();
    const [monastery, setMonastery] = useState(null);
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchProgress, setLaunchProgress] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (monasteries.length > 0) {
            const selectedMonastery = monasteries.find(m => m.id === parseInt(id));
            if (selectedMonastery) {
                setMonastery(selectedMonastery);
            } else {
                // Redirect to monasteries page if monastery not found
                navigate('/monasteries');
            }
        }
    }, [monasteries, id, navigate]);

    const launchVirtualTour = () => {
        if (!monastery) return;

        setIsLaunching(true);
        setLaunchProgress(0);

        // Animate progress bar
        const progressInterval = setInterval(() => {
            setLaunchProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 60);

        // Generate Google Earth URL
        let googleEarthUrl;
        if (monastery.latitude && monastery.longitude) {
            googleEarthUrl = `https://earth.google.com/web/@${monastery.latitude},${monastery.longitude},2000a,35y,45h,60t,0r`;
        } else {
            googleEarthUrl = `https://earth.google.com/web/search/${encodeURIComponent(monastery.name + ' ' + monastery.location)}`;
        }

        // Launch after progress completes
        setTimeout(() => {
            // Open Google Earth in the same tab
            window.location.href = googleEarthUrl;
        }, 3000);
    };

    if (loading) {
        return (
            <div className="virtual-loading">
                <div className="loading-spinner"></div>
                <h3>Loading Virtual Tour...</h3>
            </div>
        );
    }

    if (error || !monastery) {
        return (
            <div className="virtual-error">
                <div className="error-icon">⚠️</div>
                <h3>Virtual Tour Not Available</h3>
                <p>Sorry, We couldn't load the virtual tour for this monastery.</p>
                <Link to="/monasteries" className="btn btn-primary">
                    ← Back to Monasteries
                </Link>
            </div>
        );
    }

    return (
        <div className="virtual-page">
            {/* Hero Section */}
            <div className="virtual-hero">
                <div className="hero-background">
                    <img 
                        src={`/images/${monastery.imageName}`}
                        alt={monastery.name}
                        className="hero-bg-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <div className="hero-overlay"></div>
                </div>
                
                <div className="hero-content">
                    <div className="monastery-title">
                        <h1>{monastery.name}</h1>
                        <div className="monastery-meta">
                            <span>📍 {monastery.location}</span>
                            <span>🏛️ Est. {monastery.established}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="virtual-content">
                <div className="container">
                    <div className="content-grid">
                        {/* Left Column - Information */}
                        <div className="info-section">
                            <div className="info-card">
                                <h2>🌍 Virtual Earth Experience</h2>
                                <p>Embark on an extraordinary journey through Google Earth's immersive 3D environment and explore {monastery.name} from breathtaking aerial perspectives.</p>
                                
                                <div className="features-grid">
                                    <div className="feature-card">
                                        <div className="feature-icon">🛰️</div>
                                        <h3>Satellite Imagery</h3>
                                        <p>High-resolution satellite views showing the monastery and surrounding landscape</p>
                                    </div>
                                    
                                    <div className="feature-card">
                                        <div className="feature-icon">🏔️</div>
                                        <h3>3D Terrain</h3>
                                        <p>Explore the mountainous terrain and valleys that surround this sacred place</p>
                                    </div>
                                    
                                    <div className="feature-card">
                                        <div className="feature-icon">🧭</div>
                                        <h3>360° Navigation</h3>
                                        <p>Navigate freely around the monastery with smooth 360-degree controls</p>
                                    </div>
                                    
                                    <div className="feature-card">
                                        <div className="feature-icon">🖥️</div>
                                        <h3>Fullscreen Mode</h3>
                                        <p>Dedicated fullscreen window for the most immersive viewing experience</p>
                                    </div>
                                </div>

                                <div className="monastery-history">
                                    <h3>About {monastery.name}</h3>
                                    <p>{monastery.history}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Virtual Tour Launch */}
                        <div className="tour-section">
                            <div className="tour-card">
                                <div className="monastery-preview">
                                    <img 
                                        src={`/images/${monastery.imageName}`}
                                        alt={monastery.name}
                                        className="monastery-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.classList.add('image-error');
                                        }}
                                    />
                                    <div className="image-overlay">
                                        <div className="coordinates">
                                            <span>📍 {monastery.latitude}°, {monastery.longitude}°</span>
                                        </div>
                                    </div>
                                </div>

                                {!isLaunching ? (
                                    <div className="launch-section">
                                        <h3>🚀 Launch Virtual Tour</h3>
                                        <p>Ready to explore {monastery.name} in 3D? Click below to open Google Earth in a dedicated fullscreen window.</p>
                                        
                                        <button 
                                            className="launch-btn"
                                            onClick={launchVirtualTour}
                                        >
                                            <span className="btn-icon">🌍</span>
                                            Start Virtual Earth Tour
                                        </button>

                                        <div className="instructions">
                                            <h4>Navigation Tips:</h4>
                                            <ul>
                                                <li>🖱️ <strong>Click & Drag</strong> to rotate the view</li>
                                                <li>🔍 <strong>Scroll</strong> to zoom in and out</li>
                                                <li>⌨️ <strong>Arrow Keys</strong> for precise navigation</li>
                                                <li>🏛️ <strong>Search</strong> for nearby landmarks</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="launching-section">
                                        <div className="earth-animation">
                                            <div className="earth-spinner">🌍</div>
                                            <h3>Launching Virtual Tour...</h3>
                                        </div>
                                        
                                        <div className="progress-container">
                                            <div className="progress-bar">
                                                <div 
                                                    className="progress-fill"
                                                    style={{ width: `${launchProgress}%` }}
                                                ></div>
                                            </div>
                                            <p className="progress-text">
                                                {launchProgress < 50 ? 'Connecting to Google Earth...' :
                                                 launchProgress < 80 ? 'Loading monastery location...' :
                                                 'Opening fullscreen window...'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="tour-actions">
                                    <Link to={`/monasteries/${monastery.id}`} className="btn btn-secondary">
                                        📖 Learn More
                                    </Link>
                                    <Link to="/monasteries" className="btn btn-outline">
                                        ← All Monasteries
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Virtual;