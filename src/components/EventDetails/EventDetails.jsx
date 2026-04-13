import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import festivalsData from '../../data/festivals.json';
import './EventDetails.css';

const EventDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    // Find the event by ID
    const event = festivalsData.find(festival => festival.id === parseInt(eventId));

    if (!event) {
        return (
            <div className="event-details-container">
                <div className="event-not-found">
                    <h1>Event Not Found</h1>
                    <p>The requested event could not be found.</p>
                    <button className="back-button" onClick={() => navigate(-1)}>
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Adjust date to current year
    const currentYear = new Date().getFullYear();
    const eventDate = new Date(event.date);
    const adjustedDate = new Date(currentYear, eventDate.getMonth(), eventDate.getDate());
    
    let adjustedEndDate = null;
    if (event.endDate) {
        const originalEndDate = new Date(event.endDate);
        adjustedEndDate = new Date(currentYear, originalEndDate.getMonth(), originalEndDate.getDate());
    }

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getEventTypeClass = (type) => {
        if (type.toLowerCase().includes('major')) return 'major';
        if (type.toLowerCase().includes('religious')) return 'religious';
        if (type.toLowerCase().includes('cultural')) return 'cultural';
        return 'monthly';
    };

    return (
        <div className="event-details-container">
            <div className="event-details-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back to Calendar
                </button>
                
                <div className={`event-hero ${getEventTypeClass(event.type)}`}>
                    <div className="hero-content">
                        <span className={`event-type-badge ${getEventTypeClass(event.type)}`}>
                            {event.type}
                        </span>
                        <h1 className="event-title">{event.name}</h1>
                        <div className="event-date-hero">
                            <span className="date-icon">📅</span>
                            <span className="date-text">
                                {formatDate(adjustedDate)}
                                {adjustedEndDate && ` - ${formatDate(adjustedEndDate)}`}
                            </span>
                        </div>
                    </div>
                    <div className="hero-pattern"></div>
                </div>
            </div>

            <div className="event-details-content">
                <div className="content-grid">
                    {/* Main Content */}
                    <div className="main-content">
                        <div className="content-section">
                            <h2 className="section-title">
                                <span className="section-icon">📜</span>
                                Description
                            </h2>
                            <p className="event-description">{event.description}</p>
                        </div>

                        <div className="content-section">
                            <h2 className="section-title">
                                <span className="section-icon">✨</span>
                                Significance
                            </h2>
                            <p className="event-significance">{event.significance}</p>
                        </div>

                        {event.culturalHighlights && (
                            <div className="content-section">
                                <h2 className="section-title">
                                    <span className="section-icon">🎨</span>
                                    Cultural Highlights
                                </h2>
                                <p className="cultural-highlights">{event.culturalHighlights}</p>
                            </div>
                        )}

                        {event.activities && event.activities.length > 0 && (
                            <div className="content-section">
                                <h2 className="section-title">
                                    <span className="section-icon">🎭</span>
                                    Festival Activities
                                </h2>
                                <div className="activities-grid">
                                    {event.activities.map((activity, index) => (
                                        <div key={index} className="activity-card">
                                            <span className="activity-text">{activity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar-content">
                        <div className="info-card">
                            <h3 className="info-card-title">
                                <span className="info-icon">⏰</span>
                                Event Details
                            </h3>
                            <div className="info-item">
                                <span className="info-label">Duration:</span>
                                <span className="info-value">{event.timing}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Type:</span>
                                <span className={`info-badge ${getEventTypeClass(event.type)}`}>
                                    {event.type}
                                </span>
                            </div>
                        </div>

                        <div className="info-card">
                            <h3 className="info-card-title">
                                <span className="info-icon">🏯</span>
                                Participating Monasteries
                            </h3>
                            <div className="monasteries-list">
                                {event.monasteries.map((monastery, index) => (
                                    <div key={index} className="monastery-item">
                                        <span className="monastery-name">{monastery}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {event.visitorInfo && (
                            <div className="info-card visitor-info-card">
                                <h3 className="info-card-title">
                                    <span className="info-icon">👥</span>
                                    Visitor Information
                                </h3>
                                <div className="visitor-details">
                                    <div className="visitor-item">
                                        <span className="visitor-label">Best Time to Visit:</span>
                                        <span className="visitor-value">{event.visitorInfo.bestTime}</span>
                                    </div>
                                    <div className="visitor-item">
                                        <span className="visitor-label">Dress Code:</span>
                                        <span className="visitor-value">{event.visitorInfo.dress}</span>
                                    </div>
                                    <div className="visitor-item">
                                        <span className="visitor-label">Photography:</span>
                                        <span className="visitor-value">{event.visitorInfo.photography}</span>
                                    </div>
                                    <div className="visitor-item">
                                        <span className="visitor-label">Entry Fee:</span>
                                        <span className="visitor-value">{event.visitorInfo.fee}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="action-card">
                            <h3 className="action-title">Plan Your Visit</h3>
                            <p className="action-description">
                                Experience the rich cultural heritage of Sikkim's monasteries during this sacred celebration.
                            </p>
                            <button 
                                className="action-button"
                                onClick={() => navigate('/monasteries')}
                            >
                                Explore Monasteries
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;