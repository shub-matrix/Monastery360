
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useMonasteryData from '../hooks/useMonasteryData';
import './DirectionsPage.css';

const DirectionsPage = () => {
    const { monasteryId } = useParams();
    const navigate = useNavigate();
    const { monasteries } = useMonasteryData();
    const [monastery, setMonastery] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [routeOptions, setRouteOptions] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState('car');

    useEffect(() => {
        if (monasteries.length > 0 && monasteryId) {
            const foundMonastery = monasteries.find(m => m.id === parseInt(monasteryId));
            if (foundMonastery) {
                setMonastery(foundMonastery);
            } else {
                setError('Monastery not found');
                setLoading(false);
            }
        }
    }, [monasteries, monasteryId]);

    useEffect(() => {
        if (monastery) {
            getCurrentLocation();
        }
    }, [monastery]);

    const getCurrentLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                calculateRoutes({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error('Error getting location:', error);
                setError('Unable to get your current location. Please enable location services.');
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    };

    const calculateRoutes = (userPos) => {
        if (!monastery) return;
        const monasteryCoords = getMonasteryCoordinates(monastery.name);
        const distance = calculateDistance(userPos, monasteryCoords);
        const routes = [
            {
                type: 'car',
                icon: '🚗',
                name: 'By Car',
                distance: `${distance.toFixed(1)} km`,
                duration: `${Math.round(distance / 40)} hrs ${Math.round((distance / 40 - Math.floor(distance / 40)) * 60)} mins`,
                cost: `₹${(distance * 8).toFixed(0)}`,
                description: 'Fuel cost estimate',
                details: 'Drive via NH10 and local roads. Parking available at monastery.',
                tips: ['Check road conditions in monsoon', 'Carry valid driving license', 'Fuel up in Gangtok']
            },
            {
                type: 'bike',
                icon: '🏍️',
                name: 'By Motorcycle',
                distance: `${distance.toFixed(1)} km`,
                duration: `${Math.round(distance / 35)} hrs ${Math.round((distance / 35 - Math.floor(distance / 35)) * 60)} mins`,
                cost: `₹${(distance * 3).toFixed(0)}`,
                description: 'Fuel cost estimate',
                details: 'Scenic mountain routes with winding roads. Helmet mandatory.',
                tips: ['Wear protective gear', 'Check weather conditions', 'Carry rain gear']
            },
            {
                type: 'train',
                icon: '🚂',
                name: 'By Train + Local Transport',
                distance: `${(distance * 1.2).toFixed(1)} km`,
                duration: `${Math.round(distance / 25)} hrs ${Math.round((distance / 25 - Math.floor(distance / 25)) * 60)} mins`,
                cost: `₹${(distance * 2.5).toFixed(0)}`,
                description: 'To New Jalpaiguri + taxi',
                details: 'Train to NJP, then shared taxi or bus to monastery location.',
                tips: ['Book train tickets in advance', 'Arrange local transport', 'Keep warm clothes']
            },
            {
                type: 'flight',
                icon: '✈️',
                name: 'By Flight + Road',
                distance: `${(distance * 0.8).toFixed(1)} km`,
                duration: `${Math.round(distance / 500)} hrs ${Math.round((distance / 500 - Math.floor(distance / 500)) * 60)} mins + road time`,
                cost: `₹${(distance * 12 + 2000).toFixed(0)}`,
                description: 'Via Bagdogra Airport + taxi',
                details: 'Fly to Bagdogra, then taxi or bus to monastery (2-3 hours drive).',
                tips: ['Book flights early for better rates', 'Check weather for delays', 'Pre-book airport transfer']
            }
        ];
        setRouteOptions(routes);
        setLoading(false);
    };

    const getMonasteryCoordinates = (monasteryName) => {
        const monasteryCoords = {
            'Rumtek Monastery': { lat: 27.3389, lng: 88.5603 },
            'Enchey Monastery': { lat: 27.3389, lng: 88.6065 },
            'Pemayangtse Monastery': { lat: 27.2109, lng: 88.2464 },
            'Tashiding Monastery': { lat: 27.3497, lng: 88.2658 },
            'Dubdi Monastery': { lat: 27.2971, lng: 88.3683 }
        };
        return monasteryCoords[monasteryName] || { lat: 27.3389, lng: 88.5603 };
    };

    const calculateDistance = (pos1, pos2) => {
        const R = 6371;
        const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
        const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const openInGoogleMaps = (routeType = 'driving') => {
        if (!userLocation || !monastery) return;
        const origin = `${userLocation.lat},${userLocation.lng}`;
        const destination = encodeURIComponent(`${monastery.name}, ${monastery.location}`);
        const mode = routeType === 'car' ? 'driving' : routeType === 'bike' ? 'driving' : 'transit';
        const directionsUrl = `https://www.google.com/maps/dir/${origin}/${destination}/@${userLocation.lat},${userLocation.lng},12z/data=!3m1!4b1!4m2!4m1!3e${mode === 'driving' ? '0' : '3'}`;
        window.open(directionsUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="directions-page loading">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <h2>Getting Your Location...</h2>
                    <p>Calculating the best routes to your destination</p>
                </div>
                <div className="bottom-back-btn-container" style={{ textAlign: 'center', margin: '2rem 0' }}>
                    <button onClick={() => navigate(-1)} className="back-button bottom-back-button">
                        ← Back
                    </button>
                </div>
            </div>
        );
    }

    if (error || !monastery) {
        return (
            <div className="directions-page error">
                <div className="error-content">
                    <div className="error-icon">⚠️</div>
                    <h2>Unable to Get Directions</h2>
                    <p>{error || 'Monastery not found'}</p>
                    <div className="error-actions">
                        <button onClick={getCurrentLocation} className="retry-btn">
                            Try Again
                        </button>
                        <button onClick={() => navigate('/monasteries')} className="back-btn">
                            Back to Monasteries
                        </button>
                    </div>
                    {/* Back Button inside error-content */}
                    <div className="bottom-back-btn-container" style={{ textAlign: 'center', margin: '2rem 0' }}>
                        <button onClick={() => navigate(-1)} className="back-button bottom-back-button">
                            ← Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
            <div className="directions-page">
                <div className="top-back-btn-container" style={{ textAlign: 'center', margin: '2rem 0' }}>
                    <button onClick={() => navigate(-1)} className="back-button top-back-button">
                        ← Back
                    </button>
                </div>

                <div className="directions-header">
                <div className="header-content">
                    <div className="destination-info">
                        <h1>Directions to {monastery.name}</h1>
                        <p className="location">📍 {monastery.location}</p>
                    </div>
                </div>
            </div>

            <div className="directions-content">
                <div className="map-section">
                    <div className="map-container">
                        <iframe
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(monastery.name + ', ' + monastery.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            width="100%"
                            height="500"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Location of ${monastery.name}`}
                        ></iframe>
                    </div>
                    <div className="map-controls">
                        <button 
                            onClick={() => openInGoogleMaps(selectedRoute)}
                            className="open-maps-btn"
                        >
                            🗺️ Open in Google Maps
                        </button>
                    </div>
                </div>

                <div className="route-section">
                    <h2>Choose Your Route</h2>
                    <div className="route-tabs">
                        {routeOptions.map((route) => (
                            <button
                                key={route.type}
                                className={`route-tab ${selectedRoute === route.type ? 'active' : ''}`}
                                onClick={() => setSelectedRoute(route.type)}
                            >
                                <span className="tab-icon">{route.icon}</span>
                                <span className="tab-name">{route.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="selected-route-details">
                        {routeOptions.map((route) => (
                            selectedRoute === route.type ? (
                                <div key={route.type} className="route-details">
                                    <div className="route-overview">
                                        <div className="overview-item">
                                            <span className="label">Distance</span>
                                            <span className="value">{route.distance}</span>
                                        </div>
                                        <div className="overview-item">
                                            <span className="label">Duration</span>
                                            <span className="value">{route.duration}</span>
                                        </div>
                                        <div className="overview-item">
                                            <span className="label">Cost</span>
                                            <span className="value cost">{route.cost}</span>
                                        </div>
                                    </div>
                                    <div className="route-description">
                                        <h3>Route Details</h3>
                                        <p>{route.details}</p>
                                    </div>
                                    <div className="travel-tips">
                                        <h3>Travel Tips</h3>
                                        <ul>
                                            {route.tips.map((tip, index) => (
                                                <li key={index}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="route-actions">
                                        <button 
                                            onClick={() => openInGoogleMaps(route.type)}
                                            className="start-journey-btn"
                                        >
                                            🚀 Start Journey
                                        </button>
                                        <button className="share-route-btn">
                                            📤 Share Route
                                        </button>
                                    </div>
                                </div>
                            ) : null
                        ))}
                    </div>
                </div>

                <div className="location-section">
                    <div className="location-grid">
                        <div className="location-card">
                            <h3>📍 Your Current Location</h3>
                            <p>Lat: {userLocation?.lat.toFixed(6)}</p>
                            <p>Lng: {userLocation?.lng.toFixed(6)}</p>
                            <button onClick={getCurrentLocation} className="refresh-location">
                                🔄 Refresh Location
                            </button>
                        </div>
                        <div className="location-card">
                            <h3>🎯 Destination</h3>
                            <h4>{monastery.name}</h4>
                            <p>{monastery.location}</p>
                            <p>Established: {monastery.established}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectionsPage;