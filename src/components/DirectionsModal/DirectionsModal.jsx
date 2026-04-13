import React, { useState, useEffect } from 'react';
import './DirectionsModal.css';

const DirectionsModal = ({ isOpen, onClose, monastery }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [routeOptions, setRouteOptions] = useState([]);

    useEffect(() => {
        if (isOpen && monastery) {
            getCurrentLocation();
        }
    }, [isOpen, monastery]);

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
        // Mock distance calculation (in real app, you'd use Google Maps API or similar)
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
                description: 'Fuel cost estimate'
            },
            {
                type: 'bike',
                icon: '🏍️',
                name: 'By Bike',
                distance: `${distance.toFixed(1)} km`,
                duration: `${Math.round(distance / 35)} hrs ${Math.round((distance / 35 - Math.floor(distance / 35)) * 60)} mins`,
                cost: `₹${(distance * 3).toFixed(0)}`,
                description: 'Fuel cost estimate'
            },
            {
                type: 'train',
                icon: '🚂',
                name: 'By Train',
                distance: `${(distance * 1.2).toFixed(1)} km`,
                duration: `${Math.round(distance / 25)} hrs ${Math.round((distance / 25 - Math.floor(distance / 25)) * 60)} mins`,
                cost: `₹${(distance * 2.5).toFixed(0)}`,
                description: 'Nearest railway station'
            },
            {
                type: 'flight',
                icon: '✈️',
                name: 'By Flight',
                distance: `${(distance * 0.8).toFixed(1)} km`,
                duration: `${Math.round(distance / 500)} hrs ${Math.round((distance / 500 - Math.floor(distance / 500)) * 60)} mins`,
                cost: `₹${(distance * 12 + 2000).toFixed(0)}`,
                description: 'Via nearest airport'
            }
        ];

        setRouteOptions(routes);
        setLoading(false);
    };

    const getMonasteryCoordinates = (monasteryName) => {
        // Mock coordinates for monasteries (in real app, you'd have actual coordinates)
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
        const R = 6371; // Earth's radius in kilometers
        const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
        const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const getMapUrl = () => {
        if (!userLocation || !monastery) return '';
        
        const origin = `${userLocation.lat},${userLocation.lng}`;
        const destination = encodeURIComponent(`${monastery.name}, ${monastery.location}`);
        
        // Use the standard Google Maps embed URL format without API key for basic functionality
        return `https://www.google.com/maps?q=${destination}&output=embed`;
    };

    if (!isOpen) return null;

    return (
        <div className="directions-modal-overlay" onClick={onClose}>
            <div className="directions-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Directions to {monastery?.name}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    {loading ? (
                        <div className="loading-section">
                            <div className="loading-spinner"></div>
                            <p>Getting your location and calculating routes...</p>
                        </div>
                    ) : error ? (
                        <div className="error-section">
                            <div className="error-icon">⚠️</div>
                            <p>{error}</p>
                            <button onClick={getCurrentLocation} className="retry-btn">
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="map-section">
                                <div className="map-container">
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(monastery.name + ', ' + monastery.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                        width="100%"
                                        height="300"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Location of ${monastery.name}`}
                                    ></iframe>
                                </div>
                                <div className="directions-link">
                                    <button 
                                        onClick={() => {
                                            const origin = `${userLocation.lat},${userLocation.lng}`;
                                            const destination = encodeURIComponent(`${monastery.name}, ${monastery.location}`);
                                            const directionsUrl = `https://www.google.com/maps/dir/${origin}/${destination}`;
                                            window.open(directionsUrl, '_blank');
                                        }}
                                        className="open-directions-btn"
                                    >
                                        🗺️ Open Full Directions in Google Maps
                                    </button>
                                </div>
                            </div>

                            <div className="route-options">
                                <h3>Route Options</h3>
                                <div className="options-grid">
                                    {routeOptions.map((option, index) => (
                                        <div key={index} className="route-option">
                                            <div className="option-icon">{option.icon}</div>
                                            <div className="option-details">
                                                <h4>{option.name}</h4>
                                                <div className="route-info">
                                                    <span className="distance">
                                                        <strong>Distance:</strong> {option.distance}
                                                    </span>
                                                    <span className="duration">
                                                        <strong>Duration:</strong> {option.duration}
                                                    </span>
                                                    <span className="cost">
                                                        <strong>Cost:</strong> {option.cost}
                                                    </span>
                                                    <span className="description">{option.description}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="location-info">
                                <div className="current-location">
                                    <h4>📍 Your Current Location</h4>
                                    <p>Lat: {userLocation?.lat.toFixed(6)}, Lng: {userLocation?.lng.toFixed(6)}</p>
                                </div>
                                <div className="destination">
                                    <h4>🎯 Destination</h4>
                                    <p>{monastery.name}, {monastery.location}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DirectionsModal;