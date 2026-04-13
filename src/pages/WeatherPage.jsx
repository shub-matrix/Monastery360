import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getWeatherData } from '../services/weatherApi';
import useMonasteryData from '../hooks/useMonasteryData';
import './WeatherPage.css';

const WeatherPage = () => {
    const { monasteryId } = useParams();
    const navigate = useNavigate();
    const { monasteries } = useMonasteryData();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [monastery, setMonastery] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        if (monasteries.length > 0 && monasteryId) {
            // Convert monasteryId to number since URL params are strings but data IDs are numbers
            const numericId = parseInt(monasteryId);
            const foundMonastery = monasteries.find(m => m.id === numericId);
            
            if (foundMonastery) {
                setMonastery(foundMonastery);
                fetchWeatherData(foundMonastery.location);
            } else {
                console.error(`Monastery with ID ${numericId} not found. Available IDs:`, monasteries.map(m => m.id));
                setError(`Monastery not found. Please check the monastery ID.`);
                setLoading(false);
            }
        } else if (monasteries.length > 0 && !monasteryId) {
            setError('No monastery ID provided');
            setLoading(false);
        } else if (!monasteries.length) {
            // Still loading monasteries data
            setLoading(true);
        }
    }, [monasteryId, monasteries]);

    const fetchWeatherData = async (location) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWeatherData(location);
            setWeatherData(data);
        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
            console.error('Weather fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getWeatherIcon = (condition) => {
        const icons = {
            'clear sky': '☀️',
            'few clouds': '🌤️',
            'scattered clouds': '⛅',
            'broken clouds': '☁️',
            'shower rain': '🌦️',
            'rain': '🌧️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'mist': '🌫️',
            'overcast clouds': '☁️'
        };
        return icons[condition.toLowerCase()] || '🌤️';
    };

    const getRainProbability = (weather) => {
        if (weather.rain) return Math.min(weather.clouds.all + 20, 90);
        return Math.max(weather.clouds.all - 20, 10);
    };

    const getWindDirection = (deg) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(deg / 45) % 8];
    };

    if (loading && !error) {
        return (
            <div className="weather-page loading-state">
                <div className="loading-animation">
                    <div className="weather-loader">
                        <div className="sun">☀️</div>
                        <div className="clouds">
                            <span>☁️</span>
                            <span>☁️</span>
                            <span>☁️</span>
                        </div>
                    </div>
                    <h2>Fetching Weather Data...</h2>
                    <p>Getting live weather information{monastery?.name ? ` for ${monastery.name}` : '...'}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="weather-page error-state">
                <div className="error-container">
                    <div className="error-animation">⛈️</div>
                    <h2>Weather Unavailable</h2>
                    <p>{error}</p>
                    <div className="error-actions">
                        {monastery?.location && (
                            <button onClick={() => fetchWeatherData(monastery.location)} className="retry-button">
                                🔄 Try Again
                            </button>
                        )}
                        <Link to="/monasteries" className="back-button">
                            ← Back to Monasteries
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="weather-page">
            {/* Header */}
            <div className="weather-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    ← Back
                </button>
                <h1>Weather Update</h1>
                <div className="refresh-btn" onClick={() => fetchWeatherData(monastery?.location)}>
                    🔄
                </div>
            </div>

            {/* Hero Weather Section */}
            <div className="weather-hero">
                <div className="weather-hero-bg">
                    <div className="floating-elements">
                        <div className="floating-cloud cloud-1">☁️</div>
                        <div className="floating-cloud cloud-2">⛅</div>
                        <div className="floating-cloud cloud-3">☁️</div>
                        <div className="floating-sun">☀️</div>
                    </div>
                </div>
                <div className="weather-hero-content">
                    <div className="location-info">
                        <div className="monastery-badge">
                            <span className="badge-icon">🏛️</span>
                            <span className="badge-text">Sacred Monastery</span>
                        </div>
                        <h2 className="monastery-title">{monastery?.name}</h2>
                        <div className="location-details">
                            <div className="location-item">
                                <span className="location-icon">📍</span>
                                <span className="location-text">{monastery?.location}</span>
                            </div>
                            <div className="date-item">
                                <span className="date-icon">📅</span>
                                <span className="current-date">{formatDate(Date.now() / 1000)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="current-weather-display">
                        <div className="weather-main-card">
                            <div className="weather-icon-container">
                                <div className="weather-icon-large">
                                    {getWeatherIcon(weatherData?.weather[0]?.description)}
                                </div>
                                <div className="weather-particles">
                                    <span className="particle">✨</span>
                                    <span className="particle">⭐</span>
                                    <span className="particle">✨</span>
                                </div>
                            </div>
                            <div className="temp-main">
                                <div className="temperature-container">
                                    <span className="temperature-big">
                                        {Math.round(weatherData?.main?.temp || 0)}
                                    </span>
                                    <span className="temperature-unit">°C</span>
                                </div>
                                <div className="weather-condition">
                                    <span className="condition-text">
                                        {weatherData?.weather[0]?.description}
                                    </span>
                                    <div className="feels-like-container">
                                        <span className="feels-like-icon">🌡️</span>
                                        <span className="feels-like">
                                            Feels like {Math.round(weatherData?.main?.feels_like || 0)}°C
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="temp-range-hero">
                        <div className="day-night-display">
                            <div className="temp-display day-temp">
                                <div className="temp-icon-wrapper">
                                    <span className="temp-icon">🌅</span>
                                </div>
                                <div className="temp-info">
                                    <span className="temp-label">Daytime</span>
                                    <span className="temp-value">{Math.round(weatherData?.main?.temp_max || 0)}°C</span>
                                    <span className="temp-description">High</span>
                                </div>
                            </div>
                            <div className="temp-divider">
                                <div className="divider-line"></div>
                                <span className="divider-icon">⚡</span>
                            </div>
                            <div className="temp-display night-temp">
                                <div className="temp-icon-wrapper">
                                    <span className="temp-icon">🌙</span>
                                </div>
                                <div className="temp-info">
                                    <span className="temp-label">Nighttime</span>
                                    <span className="temp-value">{Math.round(weatherData?.main?.temp_min || 0)}°C</span>
                                    <span className="temp-description">Low</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weather Insights Section */}
            <div className="weather-cards-section">
                <div className="section-header">
                    <h3 className="section-title">
                        <span className="title-icon">🌈</span>
                        Weather Insights
                        <span className="title-decoration"></span>
                    </h3>
                    <p className="section-subtitle">Real-time atmospheric conditions</p>
                </div>
                
                <div className="weather-cards-container">
                    <div className="weather-card sunny-card animated-card">
                        <div className="card-background-pattern"></div>
                        <div className="card-header">
                            <div className="card-icon-container">
                                <span className="card-icon">☀️</span>
                                <div className="icon-glow sunny-glow"></div>
                            </div>
                            <span className="card-title">Sunshine</span>
                        </div>
                        <div className="card-content">
                            <div className="card-value">{100 - (weatherData?.clouds?.all || 0)}%</div>
                            <div className="card-subtitle">Clear sky visibility</div>
                            <div className="progress-bar">
                                <div className="progress-fill sunny-fill" style={{width: `${100 - (weatherData?.clouds?.all || 0)}%`}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card cloudy-card animated-card">
                        <div className="card-background-pattern"></div>
                        <div className="card-header">
                            <div className="card-icon-container">
                                <span className="card-icon">☁️</span>
                                <div className="icon-glow cloudy-glow"></div>
                            </div>
                            <span className="card-title">Cloud Cover</span>
                        </div>
                        <div className="card-content">
                            <div className="card-value">{weatherData?.clouds?.all || 0}%</div>
                            <div className="card-subtitle">Sky coverage</div>
                            <div className="progress-bar">
                                <div className="progress-fill cloudy-fill" style={{width: `${weatherData?.clouds?.all || 0}%`}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card rain-card animated-card">
                        <div className="card-background-pattern"></div>
                        <div className="card-header">
                            <div className="card-icon-container">
                                <span className="card-icon">🌧️</span>
                                <div className="icon-glow rain-glow"></div>
                            </div>
                            <span className="card-title">Rain Chance</span>
                        </div>
                        <div className="card-content">
                            <div className="card-value">{getRainProbability(weatherData || {})}%</div>
                            <div className="card-subtitle">Precipitation probability</div>
                            <div className="progress-bar">
                                <div className="progress-fill rain-fill" style={{width: `${getRainProbability(weatherData || {})}%`}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="weather-card humidity-card animated-card">
                        <div className="card-background-pattern"></div>
                        <div className="card-header">
                            <div className="card-icon-container">
                                <span className="card-icon">💧</span>
                                <div className="icon-glow humidity-glow"></div>
                            </div>
                            <span className="card-title">Humidity</span>
                        </div>
                        <div className="card-content">
                            <div className="card-value">{weatherData?.main?.humidity || 0}%</div>
                            <div className="card-subtitle">Air moisture level</div>
                            <div className="progress-bar">
                                <div className="progress-fill humidity-fill" style={{width: `${weatherData?.main?.humidity || 0}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sun Times Section */}
            <div className="sun-times-section">
                <div className="section-header">
                    <h3 className="section-title">
                        <span className="title-icon">🌅</span>
                        Solar Schedule
                        <span className="title-decoration"></span>
                    </h3>
                    <p className="section-subtitle">Daily light cycle for {monastery?.location}</p>
                </div>
                
                <div className="sun-times-container">
                    <div className="sun-cycle-visualization">
                        <div className="sun-arc">
                            <div className="sun-path"></div>
                            <div className="sun-position sunrise-pos">
                                <div className="sun-marker">🌅</div>
                                <div className="sun-label">Sunrise</div>
                            </div>
                            <div className="sun-position noon-pos">
                                <div className="sun-marker">☀️</div>
                                <div className="sun-label">Noon</div>
                            </div>
                            <div className="sun-position sunset-pos">
                                <div className="sun-marker">🌇</div>
                                <div className="sun-label">Sunset</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="sun-times-grid">
                        <div className="sun-time-card sunrise-card">
                            <div className="sun-time-header">
                                <div className="sun-time-icon-container">
                                    <div className="sun-time-icon">🌅</div>
                                    <div className="sunrise-rays"></div>
                                </div>
                                <div className="sun-time-info">
                                    <div className="sun-time-label">Sunrise</div>
                                    <div className="sun-time-value">{formatTime(weatherData?.sys?.sunrise)}</div>
                                </div>
                            </div>
                            <div className="sun-time-details">
                                <span className="detail-item">🌄 Dawn begins</span>
                                <span className="detail-item">🔆 Natural light</span>
                            </div>
                        </div>
                        
                        <div className="sun-time-card sunset-card">
                            <div className="sun-time-header">
                                <div className="sun-time-icon-container">
                                    <div className="sun-time-icon">🌇</div>
                                    <div className="sunset-rays"></div>
                                </div>
                                <div className="sun-time-info">
                                    <div className="sun-time-label">Sunset</div>
                                    <div className="sun-time-value">{formatTime(weatherData?.sys?.sunset)}</div>
                                </div>
                            </div>
                            <div className="sun-time-details">
                                <span className="detail-item">🌆 Golden hour</span>
                                <span className="detail-item">🌙 Night begins</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Atmospheric Conditions */}
            <div className="additional-weather-section">
                <div className="section-header">
                    <h3 className="section-title">
                        <span className="title-icon">🌍</span>
                        Atmospheric Conditions
                        <span className="title-decoration"></span>
                    </h3>
                    <p className="section-subtitle">Environmental measurements and air quality</p>
                </div>
                
                <div className="weather-details-grid">
                    <div className="detail-item wind-item">
                        <div className="detail-card-header">
                            <div className="detail-icon-container">
                                <div className="detail-icon">🌪️</div>
                                <div className="wind-animation"></div>
                            </div>
                            <div className="detail-title">Wind Conditions</div>
                        </div>
                        <div className="detail-content">
                            <div className="detail-value">
                                {weatherData?.wind?.speed || 0} m/s
                            </div>
                            <div className="detail-secondary">
                                Direction: {getWindDirection(weatherData?.wind?.deg || 0)}
                            </div>
                            <div className="wind-gauge">
                                <div className="gauge-fill" style={{width: `${Math.min((weatherData?.wind?.speed || 0) * 10, 100)}%`}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="detail-item pressure-item">
                        <div className="detail-card-header">
                            <div className="detail-icon-container">
                                <div className="detail-icon">�</div>
                                <div className="pressure-waves"></div>
                            </div>
                            <div className="detail-title">Air Pressure</div>
                        </div>
                        <div className="detail-content">
                            <div className="detail-value">{weatherData?.main?.pressure || 0}</div>
                            <div className="detail-secondary">hPa</div>
                            <div className="pressure-indicator">
                                <span className={`pressure-status ${(weatherData?.main?.pressure || 0) > 1013 ? 'high' : 'normal'}`}>
                                    {(weatherData?.main?.pressure || 0) > 1013 ? '⬆️ High' : '➡️ Normal'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-item visibility-item">
                        <div className="detail-card-header">
                            <div className="detail-icon-container">
                                <div className="detail-icon">👁️</div>
                                <div className="visibility-rings"></div>
                            </div>
                            <div className="detail-title">Visibility Range</div>
                        </div>
                        <div className="detail-content">
                            <div className="detail-value">{((weatherData?.visibility || 0) / 1000).toFixed(1)}</div>
                            <div className="detail-secondary">kilometers</div>
                            <div className="visibility-scale">
                                <div className="scale-marker" data-range="Excellent">
                                    <span className={((weatherData?.visibility || 0) / 1000) > 10 ? 'active' : ''}>🌟</span>
                                </div>
                                <div className="scale-marker" data-range="Good">
                                    <span className={((weatherData?.visibility || 0) / 1000) > 5 ? 'active' : ''}>👍</span>
                                </div>
                                <div className="scale-marker" data-range="Fair">
                                    <span className={((weatherData?.visibility || 0) / 1000) > 2 ? 'active' : ''}>⚠️</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="detail-item uv-item">
                        <div className="detail-card-header">
                            <div className="detail-icon-container">
                                <div className="detail-icon">🌞</div>
                                <div className="uv-rays"></div>
                            </div>
                            <div className="detail-title">UV Index</div>
                        </div>
                        <div className="detail-content">
                            <div className="detail-value">5</div>
                            <div className="detail-secondary">Moderate</div>
                            <div className="uv-protection">
                                <span className="protection-tip">🧴 Use sunscreen</span>
                                <span className="protection-tip">🕶️ Wear sunglasses</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer with Actions */}
            <div className="weather-footer">
                <div className="weather-footer-content">
                    <p className="last-updated">
                        Last updated: {new Date().toLocaleTimeString()}
                    </p>
                    <div className="footer-actions">
                        <Link to={`/monasteries/${monasteryId}`} className="action-btn primary">
                            🏛️ View Monastery
                        </Link>
                        <Link to={`/directions/${monasteryId}`} className="action-btn secondary">
                            🗺️ Get Directions
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherPage;