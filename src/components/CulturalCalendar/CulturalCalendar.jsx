import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import festivalsData from '../../data/festivals.json';
import ChatBot from '../ChatBot/ChatBot';
import './CulturalCalendar.css';

const CulturalCalendar = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterType, setFilterType] = useState('all');
    const [filterMonastery, setFilterMonastery] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

    // Get current year festivals (adjust dates to current year)
    const currentYearFestivals = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return festivalsData.map(festival => {
            const festivalDate = new Date(festival.date);
            const adjustedDate = new Date(currentYear, festivalDate.getMonth(), festivalDate.getDate());
            
            let endDate = null;
            if (festival.endDate) {
                const originalEndDate = new Date(festival.endDate);
                endDate = new Date(currentYear, originalEndDate.getMonth(), originalEndDate.getDate());
            }

            return {
                ...festival,
                date: adjustedDate.toISOString().split('T')[0],
                endDate: endDate ? endDate.toISOString().split('T')[0] : null,
                dateObj: adjustedDate,
                endDateObj: endDate
            };
        });
    }, []);

    const filteredFestivals = useMemo(() => {
        return currentYearFestivals.filter(festival => {
            const matchesSearch = searchTerm === '' || 
                festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                festival.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesType = filterType === 'all' || 
                festival.type.toLowerCase().includes(filterType.toLowerCase());
            
            const matchesMonastery = filterMonastery === 'all' || 
                (festival.monasteries || []).some(monastery => 
                    monastery.toLowerCase().includes(filterMonastery.toLowerCase())
                );

            return matchesSearch && matchesType && matchesMonastery;
        });
    }, [currentYearFestivals, searchTerm, filterType, filterMonastery]);

    const monasteryOptions = useMemo(() => {
        const monasteries = new Set();
        festivalsData.forEach(festival => {
            (festival.monasteries || []).forEach(monastery => {
                if (monastery !== "All Monasteries") {
                    monasteries.add(monastery);
                }
            });
        });
        return Array.from(monasteries).sort();
    }, []);

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const today = new Date();
        
        const days = [];
        
        const prevMonth = new Date(year, month - 1, 0);
        const prevMonthDays = prevMonth.getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonthDays - i)
            });
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push({
                day,
                isCurrentMonth: true,
                date,
                isToday: date.toDateString() === today.toDateString(),
                events: getEventsForDate(date)
            });
        }
        
        const totalCells = Math.ceil(days.length / 7) * 7;
        const remainingCells = totalCells - days.length;
        for (let day = 1; day <= remainingCells; day++) {
            days.push({
                day,
                isCurrentMonth: false,
                date: new Date(year, month + 1, day)
            });
        }
        
        return days;
    };

    const getEventsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return filteredFestivals.filter(festival => {
            if (festival.endDate) {
                return dateStr >= festival.date && dateStr <= festival.endDate;
            }
            return festival.date === dateStr;
        });
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
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

    const calendarDays = generateCalendarDays();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (!isAuthenticated) {
        return (
            <div className="cultural-calendar">
                <div className="calendar-header">
                    <h1 className="calendar-title">Sikkim Monastery Cultural Calendar</h1>
                    <p className="calendar-subtitle">
                        Please login to access the cultural calendar and discover sacred festivals across Sikkim's monasteries
                    </p>
                </div>
                <div className="login-prompt">
                    <div className="login-card">
                        <h3>Authentication Required</h3>
                        <p>You need to be logged in to view the cultural calendar and festival information.</p>
                        <button 
                            className="nav-button login-button" 
                            onClick={() => navigate('/login')}
                        >
                            Click Here to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cultural-calendar">
            <div className="calendar-header">
                <h1 className="calendar-title">Sikkim Monastery Cultural Calendar</h1>
                <p className="calendar-subtitle">
                    Discover sacred festivals, celebrations, and cultural events across Sikkim's monasteries
                </p>
            </div>

            <div className="calendar-controls">
                <div className="month-navigation">
                    
                    <button className="nav-button" onClick={() => navigateMonth(-1)}>
                        ← Previous
                    </button>
                    <div className="current-month">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <button className="nav-button" onClick={() => navigateMonth(1)}>
                        Next →
                    </button>
                </div>

                <div className="filter-controls">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search festivals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select
                        className="filter-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="major">Major Festivals</option>
                        <option value="religious">Religious Festivals</option>
                        <option value="cultural">Cultural Festivals</option>
                        <option value="monthly">Monthly Observances</option>
                    </select>

                    <select
                        className="filter-select"
                        value={filterMonastery}
                        onChange={(e) => setFilterMonastery(e.target.value)}
                    >
                        <option value="all">All Monasteries</option>
                        {monasteryOptions.map(monastery => (
                            <option key={monastery} value={monastery}>
                                {monastery}
                            </option>
                        ))}
                    </select>

                    <button
                        className="nav-button"
                        onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
                    >
                        {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
                    </button>
                </div>
            </div>

            {viewMode === 'calendar' && (
                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="calendar-day-header">
                            {day}
                        </div>
                    ))}
                    
                    {calendarDays.map((dayInfo, index) => (
                        <div
                            key={index}
                            className={`calendar-day ${!dayInfo.isCurrentMonth ? 'other-month' : ''} ${dayInfo.isToday ? 'today' : ''}`}
                        >
                            <div className="day-number">{dayInfo.day}</div>
                            {dayInfo.events && (
                                <div className="event-indicators">
                                    {dayInfo.events.slice(0, 3).map((event, eventIndex) => (
                                        <div
                                            key={eventIndex}
                                            className={`event-dot ${getEventTypeClass(event.type)}`}
                                            title={event.name}
                                            onClick={() => navigate(`/event/${event.id}`)}
                                        />
                                    ))}
                                    {dayInfo.events.length > 3 && (
                                        <div className="event-dot" title={`+${dayInfo.events.length - 3} more events`} />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="events-list">
                {filteredFestivals.map(festival => (
                    <div
                        key={festival.id}
                        className={`event-card ${getEventTypeClass(festival.type)}`}
                        onClick={() => navigate(`/event/${festival.id}`)}
                    >
                        <div className="event-header">
                            <h3 className="event-title">{festival.name}</h3>
                            <span className={`event-type ${getEventTypeClass(festival.type)}`}>
                                {festival.type}
                            </span>
                        </div>
                        
                        <div className="event-date">
                            📅 {formatDate(festival.date)}
                            {festival.endDate && ` - ${formatDate(festival.endDate)}`}
                        </div>
                        
                        <p className="event-description">{festival.description}</p>
                        
                        <div className="event-monasteries">
                            <strong>🏯 Monasteries:</strong>
                            <div style={{ marginTop: '0.5rem' }}>
                                {(festival.monasteries || []).map((monastery, index) => (
                                    <span key={index} className="monastery-tag">
                                        {monastery}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        {festival.activities && (
                            <div className="event-activities">
                                <strong>🎭 Activities:</strong>
                                <div className="activities-list">
                                    {festival.activities.slice(0, 4).map((activity, index) => (
                                        <span key={index} className="activity-tag">
                                            {activity}
                                        </span>
                                    ))}
                                    {festival.activities.length > 4 && (
                                        <span className="activity-tag">+{festival.activities.length - 4} more</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="calendar-legend">
                <div className="legend-item">
                    <div className="legend-color major"></div>
                    <span>Major Festivals</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color religious"></div>
                    <span>Religious Festivals</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color cultural"></div>
                    <span>Cultural Festivals</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color monthly"></div>
                    <span>Monthly Observances</span>
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

export default CulturalCalendar;