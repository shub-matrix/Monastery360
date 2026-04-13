import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import useMonasteryData from '../../hooks/useMonasteryData';
import ImageSlideshow from './ImageSlideshow';
import ReviewSection from './ReviewSection';
import { useAuth } from '../../contexts/AuthContext';
import ChatBot from '../ChatBot/ChatBot';
import './MonasteryDetails.css';

const MonasteryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { monasteries, loading, error } = useMonasteryData();
    const { isAuthenticated } = useAuth();
    const [monastery, setMonastery] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const handleReviewButtonClick = () => {
        console.log('Review button clicked, current tab:', activeTab);
        setActiveTab('reviews');
        console.log('Tab set to reviews');
        
        setTimeout(() => {
            const tabNavigation = document.querySelector('.tab-navigation');
            if (tabNavigation) {
                tabNavigation.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                console.log('Scrolled to tab navigation');
            }
        }, 100);
    };

    useEffect(() => {
        if (monasteries.length > 0) {
            const foundMonastery = monasteries.find(m => m.id === parseInt(id));
            if (foundMonastery) {
                setMonastery(foundMonastery);
            }
        }
    }, [id, monasteries]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [id, monastery]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam === 'reviews') {
            setActiveTab('reviews');
            setTimeout(() => {
                const tabNavigation = document.querySelector('.tab-navigation');
                if (tabNavigation) {
                    tabNavigation.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 500);
        }
    }, [location.search]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <h3>Loading monastery details...</h3>
            </div>
        );
    }

    if (!monastery) {
        return (
            <div className="error-container">
                <h3>Monastery not found</h3>
                <Link to="/monasteries" className="btn btn-primary">Back to Monasteries</Link>
            </div>
        );
    }

    const handleGetDirections = () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(monastery.name + ', ' + monastery.location)}`;
        window.open(googleMapsUrl, '_blank');
    };

        const handleViewRoutes = (monastery) => {
            navigate(`/directions/${monastery.id}`);
        };

    const handleBookTour = () => {
        alert('Booking feature coming soon! Please contact us at +91-9876543210');
    };

    const handleWeatherUpdate = (monastery) => {
        navigate(`/weather/${monastery.id}`);
    };

    
    const detailedInfo = {
        significance: monastery.name === "Rumtek Monastery" ? 
            "Rumtek Monastery holds immense significance as the seat-in-exile of the Gyalwang Karmapa, the head of the Karma Kagyu school. It houses precious relics including the Black Crown, sacred scriptures, and thankas. The monastery is considered the most important Karma Kagyu monastery outside Tibet." :
            monastery.name === "Pemayangtse Monastery" ?
            "Pemayangtse means 'Perfect Sublime Lotus' and is one of the premier monasteries of Sikkim. Only pure-blooded Bhutias can become monks here. It houses the famous seven-tiered wooden sculpture depicting Guru Rinpoche's celestial palace called 'Sanghthokpalri'." :
            `${monastery.name} is a sacred center of Buddhist learning and meditation, preserving ancient traditions and serving as a spiritual beacon for devotees and visitors from around the world.`,
        
        architecture: monastery.name === "Rumtek Monastery" ?
            "The monastery showcases traditional Tibetan architecture with intricate wood carvings, golden roofs, and colorful murals. The main temple features a three-story structure with assembly hall, shrines, and meditation rooms." :
            "Built in traditional Sikkimese-Tibetan architectural style with wooden structures, sloping roofs, and ornate decorations. The monastery features prayer halls, meditation chambers, and residential quarters for monks.",
        
        festivals: monastery.name === "Rumtek Monastery" ?
            ["Losar (Tibetan New Year) - February/March", "Buddha Jayanti - May", "Kagyu Monlam - Winter", "Cham Dance Festival - Various dates"] :
            monastery.name === "Pemayangtse Monastery" ?
            ["Chaang Lo (Sikkimese New Year) - December", "Buddha Purnima - May", "Bumchu Festival - February/March", "Pang Lhabsol - August/September"] :
            ["Buddha Jayanti - May", "Losar Festival - February/March", "Dukpa Tse-Shi - June", "Local monastery celebrations"],
        
        timings: "Daily: 6:00 AM - 6:00 PM\nPrayer Times: 6:00 AM, 12:00 PM, 6:00 PM\nVisiting Hours: 9:00 AM - 5:00 PM",
        
        entryFee: "Indians: ₹20\nForeigners: ₹50\nCamera: ₹30\nVideo: ₹100\nGuided Tour: ₹200",
        
        bestTime: {
            season: "October to March (Peak Season)\nApril to June (Pleasant Weather)\nJuly to September (Monsoon - Limited Access)",
            timing: "Early Morning (6:00-9:00 AM) for prayers\nLate Afternoon (4:00-6:00 PM) for golden hour photography"
        },
        
        routes: [
            {
                from: "Gangtok",
                distance: monastery.location.includes("East Sikkim") ? "24 km" : "45-70 km",
                duration: monastery.location.includes("East Sikkim") ? "45 minutes" : "1.5-2 hours",
                mode: "Taxi/Car",
                cost: monastery.location.includes("East Sikkim") ? "₹800-1200" : "₹1500-2500",
                route: monastery.location.includes("East Sikkim") ? 
                    "Gangtok → MG Marg → Rumtek Road → Monastery" :
                    "Gangtok → Singtam → Legship → Pelling → Monastery"
            },
            {
                from: "Siliguri/NJP",
                distance: "120-150 km",
                duration: "4-5 hours",
                mode: "Taxi/Bus",
                cost: "₹3000-5000 (Taxi), ₹200-400 (Bus)",
                route: "Siliguri → Rangpo → Gangtok → Monastery"
            },
            {
                from: "Bagdogra Airport",
                distance: "125-155 km",
                duration: "4.5-5.5 hours",
                mode: "Taxi/Helicopter",
                cost: "₹3500-6000 (Taxi), ₹15000+ (Helicopter)",
                route: "Airport → Siliguri → Rangpo → Gangtok → Monastery"
            }
        ],
        
        nearbyAttractions: monastery.location.includes("East Sikkim") ? 
            ["Gangtok City", "Tsomgo Lake", "Baba Mandir", "Nathula Pass", "Hanuman Tok"] :
            ["Pelling Skywalk", "Khecheopalri Lake", "Kanchenjunga Falls", "Sangachoeling Monastery", "Yuksom"],
        
        accommodation: [
            { type: "Luxury Hotels", range: "₹3000-8000/night", examples: ["Mayfair Spa Resort", "The Elgin Mount Pandim"] },
            { type: "Mid-Range Hotels", range: "₹1500-3000/night", examples: ["Hotel Sonam Delek", "Summit Newa Regency"] },
            { type: "Budget Options", range: "₹500-1500/night", examples: ["Zostel", "Local Homestays"] },
            { type: "Monastery Stay", range: "₹300-800/night", examples: ["Guest rooms (if available)"] }
        ]
    };

    

    return (
            <div className="monastery-details">
                <div className="top-nav-bar">
                    <div className="top-nav-left">
                        <button className="btn btn-outline back-btn-small" onClick={() => navigate('/monasteries')}>
                            ← Back
                        </button>
                    </div>
                    <div className="top-nav-right">
                        <Link to="/monasteries" className="nav-link">All Monasteries</Link>
                    </div>
                </div>

            <div className="detail-hero">
                <ImageSlideshow 
                    monasteryName={monastery.name} 
                    imageName={monastery.imageName} 
                    imageName2={monastery.imageName2} 
                    imageName3={monastery.imageName3} 
                />
            </div>

            
            <div className="quick-info">
                <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">📍 {monastery.location}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Established</span>
                    <span className="info-value">{monastery.established}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Best Time</span>
                    <span className="info-value">Oct - Mar</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Entry Fee</span>
                    <span className="info-value">₹20-50</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Duration</span>
                    <span className="info-value">2-3 hours</span>
                </div>
            </div>

            
            <div className="action-buttons">
                <div className="action-btn-group">
                    <button onClick={() => handleViewRoutes(monastery)} className="btn btn-primary action-btn">
                        <i>🗺️</i> Get Directions
                    </button>
                    <button onClick={handleBookTour} className="btn btn-secondary action-btn">
                        <i>📅</i> Book Guided Tour
                    </button>
                    <button 
                        className="btn btn-outline action-btn"
                        onClick={() => handleWeatherUpdate(monastery)}
                    >
                        <i>🌤️</i> Weather update
                    </button>
                    <button 
                        className="btn btn-outline action-btn"
                        onClick={() => navigate(`/virtual/${monastery.id}`)}
                    >
                        <i>📸</i> Virtual Tour
                    </button>
                </div>
            </div>

            
            <div className="tab-navigation">
                <button 
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    History & Significance
                </button>
                <button 
                    className={`tab ${activeTab === 'visit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('visit')}
                >
                    Plan Your Visit
                </button>
                <button 
                    className={`tab ${activeTab === 'routes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('routes')}
                >
                    Routes & Transport
                </button>
                <button 
                    className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews & Experiences
                </button>
            </div>

            
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-content">
                        <div className="content-grid">
                            <div className="main-content">
                                <section className="section">
                                    <h2>About {monastery.name}</h2>
                                    <p>{monastery.history}</p>
                                </section>

                                <section className="section">
                                    <h2>Why Visit?</h2>
                                    <p>{detailedInfo.significance}</p>
                                </section>

                                <section className="section">
                                    <h2>Architecture & Art</h2>
                                    <p>{detailedInfo.architecture}</p>
                                </section>

                                <section className="section">
                                    <h2>Festivals & Events</h2>
                                    <ul className="festival-list">
                                        {detailedInfo.festivals.map((festival, index) => (
                                            <li key={index}>{festival}</li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            <div className="sidebar-content">
                                <div className="info-card">
                                    <h3>Quick Facts</h3>
                                    <div className="fact-item">
                                        <strong>Founded:</strong> {monastery.established}
                                    </div>
                                    <div className="fact-item">
                                        <strong>Location:</strong> {monastery.location}
                                    </div>
                                    <div className="fact-item">
                                        <strong>Sect:</strong> Kagyu/Nyingma Buddhism
                                    </div>
                                    <div className="fact-item">
                                        <strong>Altitude:</strong> 1,500-2,500m
                                    </div>
                                </div>

                                <div className="info-card">
                                    <h3>Nearby Attractions</h3>
                                    <ul className="attraction-list">
                                        {detailedInfo.nearbyAttractions.map((attraction, index) => (
                                            <li key={index}>{attraction}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="history-content">
                        <section className="section">
                            <h2>Historical Background</h2>
                            <p>{monastery.history}</p>
                        </section>

                        <section className="section">
                            <h2>Spiritual Significance</h2>
                            <p>{detailedInfo.significance}</p>
                        </section>

                        <section className="section">
                            <h2>Cultural Importance</h2>
                            <p>This monastery plays a crucial role in preserving Tibetan Buddhist culture and traditions in Sikkim. It serves as a center for religious studies, meditation practices, and cultural festivals that attract devotees and scholars from around the world.</p>
                        </section>

                        <section className="section">
                            <h2>Notable Features</h2>
                            <ul>
                                <li>Ancient Buddhist scriptures and manuscripts</li>
                                <li>Traditional Tibetan architectural elements</li>
                                <li>Sacred relics and religious artifacts</li>
                                <li>Meditation halls and prayer wheels</li>
                                <li>Monks' residential quarters and study areas</li>
                            </ul>
                        </section>
                    </div>
                )}

                {activeTab === 'visit' && (
                    <div className="visit-content">
                        <div className="content-grid">
                            <div className="main-content">
                                <section className="section">
                                    <h2>Opening Hours & Timings</h2>
                                    <pre className="timing-info">{detailedInfo.timings}</pre>
                                </section>

                                <section className="section">
                                    <h2>Entry Fees</h2>
                                    <pre className="fee-info">{detailedInfo.entryFee}</pre>
                                </section>

                                <section className="section">
                                    <h2>Best Time to Visit</h2>
                                    <div className="best-time">
                                        <h4>Seasonal Guide:</h4>
                                        <pre>{detailedInfo.bestTime.season}</pre>
                                        
                                        <h4>Best Timing During Day:</h4>
                                        <pre>{detailedInfo.bestTime.timing}</pre>
                                    </div>
                                </section>

                                <section className="section">
                                    <h2>What to Expect</h2>
                                    <ul>
                                        <li>Guided tours available in English and Hindi</li>
                                        <li>Photography allowed in most areas (additional fee)</li>
                                        <li>Peaceful meditation sessions</li>
                                        <li>Traditional butter tea and local snacks</li>
                                        <li>Souvenir shop with Buddhist artifacts</li>
                                    </ul>
                                </section>
                            </div>

                            <div className="sidebar-content">
                                <div className="info-card">
                                    <h3>Visitor Guidelines</h3>
                                    <ul>
                                        <li>Dress modestly</li>
                                        <li>Maintain silence in prayer halls</li>
                                        <li>Remove shoes before entering temples</li>
                                        <li>Don't touch religious artifacts</li>
                                        <li>Follow photography rules</li>
                                    </ul>
                                </div>

                                <div className="info-card">
                                    <h3>What to Bring</h3>
                                    <ul>
                                        <li>Comfortable walking shoes</li>
                                        <li>Light jacket (high altitude)</li>
                                        <li>Water bottle</li>
                                        <li>Camera (with extra fee)</li>
                                        <li>Cash for donations</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'routes' && (
                    <div className="routes-content">
                        <section className="section">
                            <h2>How to Reach</h2>
                            <div className="routes-grid">
                                {detailedInfo.routes.map((route, index) => (
                                    <div key={index} className="route-card">
                                        <h3>From {route.from}</h3>
                                        <div className="route-details">
                                            <div className="route-info">
                                                <span className="label">Distance:</span>
                                                <span className="value">{route.distance}</span>
                                            </div>
                                            <div className="route-info">
                                                <span className="label">Duration:</span>
                                                <span className="value">{route.duration}</span>
                                            </div>
                                            <div className="route-info">
                                                <span className="label">Mode:</span>
                                                <span className="value">{route.mode}</span>
                                            </div>
                                            <div className="route-info">
                                                <span className="label">Cost:</span>
                                                <span className="value">{route.cost}</span>
                                            </div>
                                            <div className="route-path">
                                                <span className="label">Route:</span>
                                                <span className="value">{route.route}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="section">
                            <h2>Accommodation Options</h2>
                            <div className="accommodation-grid">
                                {detailedInfo.accommodation.map((acc, index) => (
                                    <div key={index} className="accommodation-card">
                                        <h4>{acc.type}</h4>
                                        <div className="price-range">{acc.range}</div>
                                        <div className="examples">
                                            {acc.examples.map((example, i) => (
                                                <span key={i} className="example">{example}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="section">
                            <h2>Travel Tips</h2>
                            <ul>
                                <li>Book permits in advance for restricted areas</li>
                                <li>Carry valid ID proof (mandatory)</li>
                                <li>Check weather conditions before traveling</li>
                                <li>Book accommodation in advance during peak season</li>
                                <li>Keep emergency contacts handy</li>
                                <li>Respect local customs and traditions</li>
                            </ul>
                        </section>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <ReviewSection monasteryId={monastery.id} monasteryName={monastery.name} />
                )}
            </div>

            
            <div className="gallery-section">
                <div className="gallery-header">
                    <h2 className="gallery-title">
                        <span className="gallery-icon">📸</span>
                        Photo Gallery
                    </h2>
                    <p className="gallery-description">
                        Explore the serene beauty and architectural magnificence of {monastery.name} through our curated collection of images
                    </p>
                </div>
                <div className="image-gallery-cards">
                    {[1, 2, 3].map((imageNum) => {
                        let imagePath;
                        const nameMapping = {
                            'Rumtek Monastery': 'Rumtek-Monastery',
                            'Pemayangtse Monastery': 'Pemangytse',
                            'Tashiding Monastery': 'Tashiding-Monastery',
                            'Enchey Monastery': 'Enchey-Monastery',
                            'Dubdi Monastery': 'Dubdi Monastery',
                            'Phodong Monastery': 'Phodong-Monastery',
                            'Ralang Monastery': 'Ralang-Monastery',
                            'Tsuklakhang Gonpa': 'Tsuklakhang-Gonpa',
                            'Kathog Lake Monastery': 'Kathog',
                            'Lingdum Zurmang Monastery': 'Lingdum-Zurmang',
                            'Bumtar Namdroling Monastery': 'Bumtar Namdroling Monastery',
                            'Doling Monastery': 'Doling-Monastery',
                            'Karma Raptenling Monastery': 'Karma-Raptenling-Monastery',
                            'Ngadag Monastery': 'Ngadag-Monastery',
                            'Aden Wolung Monastery': 'ADEN WOLUNG',
                            'Chakung Monastery': 'CHAKUNG',
                            'Dodak Tamu Monastery': 'DODAK TAMU',
                            'Druk Monastery': 'Druk',
                            'Hungri Monastery': 'HUNGRI',
                            'Khachoedpalri Monastery': 'KHACHOEDPALRI',
                            'Lhuntse Monastery': 'LHUNTSE',
                            'Melli-Atsing Monastery': 'MELLI-ATSING',
                            'Nubling Monastery': 'NUBLING',
                            'Okhery Monastery': 'OKHERY',
                            'Pegmantysse Monastery': 'pegmantysse',
                            'Rinchen Choling Monastery': 'RINCHEN CHOLING',
                            'Rinchenpung Monastery': 'RINCHENPUNG',
                            'Sinon Monastery': 'Sinon',
                            'Sri Badam Monastery': 'SRI BADAM',
                            'Tashi Samboling Monastery': 'TASHI SAMBOLING',
                            'Kathog Dorjeden Monastery': 'Kathog-Dorjeden-Monastery',
                            'Lingdok Tsangkhar Monastery': 'Lingdok-Tsangkhar-Monastery',
                            'Linkoed Monastery': 'Linkoed-Monastery',
                            'Old Rumtek Monastery': 'Old-Rumtek-Monastery',
                            'Pabyuk Monastery': 'Pabyuk-Monastery',
                            'Ray Mindu Katenling Monastery': 'Ray-Mindu-Katenling-Monastery',
                            'Tsuklakhang Monastery': 'Tsuklakhang-Monastery',
                            'Labrang Monastery': 'LABRANG MONASTEY',
                            'Lachen Ngodub Choling Monastery': 'LACHEN NGODUB CHOLING MONASTERY',
                            'Lachen Thangu Monastery': 'LACHEN THANGU MONASTERY',
                            'Lingthem Gonpa Chophel Dargyeling': 'LINGTHEM GONPA CHOPHEL DARGYELING',
                            'Phensang Monastery': 'Phensang Monastery',
                            'Phodong Karma Tashi Chokhorling Monastery': 'PHODONG KARMA TASHI CHOKHORLING MONASTERY',
                            'Silem Phagyal Tashi Dargyeling Monastery': 'SILEM PHAGYAL TASHI DARGYELING MONASTERY',
                            'Singchit Ngadag Monastery': 'SINGCHIT NGADAG MONASTERY',
                            'Tholung Monastery': 'THOLUNG MONASTERY',
                            'Tingbung Monastery': 'TINGBUNG MONASTERY',
                            'Choten Monastery': 'Choten-Monastery',
                            'Kagon Tshechhogling Monastery': 'Kagon-Tshechhogling-Monastery',
                            'Lingdum Zurmang Kharwang Gonpa Monastery': 'Lingdum-Zurmang-Kharwang-Gonpa-Monastery',
                            'Raloong Monastery': 'Raloong-Monastery',
                            'Rumtek Dharma Chakra Centre Monastery': 'Rumtek-Dharma-Chakra-Centre-Monastey',
                            'Sang Ngor Monastery': 'Sang-Ngor-Monastery',
                            'Sichey Dechen Choling Monastery': 'Sichey-Dechen-Choling-Monastery',
                            'Tashi Palden Monastery': 'Tashi-Palden-Monastery',
                            'Tinkye Gonjang Monastery': 'Tinkye-Gonjang-Monastery'
                        };

                        const baseName = nameMapping[monastery.name] || monastery.name.replace(/ /g, '-');

                        if (monastery.name === 'Bumtar Namdroling Monastery') {
                            imagePath = `/images/Bumtar Namdroling Monastery${imageNum}.jpg`;
                        } else if (['Doling Monastery', 'Karma Raptenling Monastery', 'Ngadag Monastery'].includes(monastery.name)) {
                            imagePath = `/images/${baseName}${imageNum}.jpg`;
                        } else if (['Aden Wolung Monastery', 'Dodak Tamu Monastery', 'Lhuntse Monastery', 'Rinchen Choling Monastery', 'Tashi Samboling Monastery'].includes(monastery.name)) {
                            imagePath = imageNum === 1 ? `/images/${baseName}.jfif` : `/images/${baseName}${imageNum}.jfif`;
                        } else if (monastery.name === 'Chakung Monastery') {
                            const extensions = ['.jfif', ' 1.jfif', ' 2.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Druk Monastery') {
                            const extensions = ['.jfif', '1.jfif', '2.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Melli-Atsing Monastery') {
                            const extensions = ['.jfif', '1.jfif', '2.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Hungri Monastery') {
                            const extensions = ['.jpg', '1.jpg', '2.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Khachoedpalri Monastery') {
                            const extensions = ['.jpg', '1.JPG', '2.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Nubling Monastery') {
                            const extensions = ['.jpg', '1.jfif', '2.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Okhery Monastery') {
                            const extensions = ['.jpg', '1.jfif', '2.jfif'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Pegmantysse Monastery') {
                            const extensions = ['.jpg', '1.jfif', '2.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Rinchenpung Monastery') {
                            const extensions = ['.jpg', '1.jfif', '2.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Sri Badam Monastery') {
                            const extensions = ['.jpg', '1.jpg', '2.png'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Sinon Monastery') {
                            const extensions = ['.png', '1.png', '2.png'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Kathog Dorjeden Monastery') {
                            imagePath = `/images/${baseName}${imageNum}.jpg`;
                        } else if (monastery.name === 'Lingdok Tsangkhar Monastery') {
                            const extensions = ['1.jpg', '2.png', '3.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Linkoed Monastery') {
                            const extensions = ['1.png', '2.jpg', '3.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Old Rumtek Monastery') {
                            imagePath = `/images/${baseName}${imageNum}.png`;
                        } else if (monastery.name === 'Pabyuk Monastery') {
                            imagePath = `/images/${baseName}${imageNum}.png`;
                        } else if (monastery.name === 'Ray Mindu Katenling Monastery') {
                            imagePath = `/images/${baseName}${imageNum}.png`;
                        } else if (monastery.name === 'Tsuklakhang Monastery') {
                            imagePath = `/images/${baseName}${imageNum}.png`;
                        } else if (monastery.name === 'Labrang Monastery') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (monastery.name === 'Lachen Ngodub Choling Monastery') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (monastery.name === 'Lachen Thangu Monastery') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (monastery.name === 'Lingthem Gonpa Chophel Dargyeling') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (monastery.name === 'Phensang Monastery') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (monastery.name === 'Phodong Karma Tashi Chokhorling Monastery') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (monastery.name === 'Silem Phagyal Tashi Dargyeling Monastery') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (monastery.name === 'Singchit Ngadag Monastery') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (monastery.name === 'Tholung Monastery') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (monastery.name === 'Tingbung Monastery') {
                            imagePath = `/images/${baseName} ${imageNum}.jpg`;
                        } else if (['Choten Monastery', 'Kagon Tshechhogling Monastery', 'Lingdum Zurmang Kharwang Gonpa Monastery', 'Rumtek Dharma Chakra Centre Monastery', 'Tashi Palden Monastery', 'Tinkye Gonjang Monastery'].includes(monastery.name)) {
                            imagePath = `/images/${baseName}${imageNum}.png`;
                        } else if (monastery.name === 'Sang Ngor Monastery') {
                            imagePath = imageNum <= 4 ? `/images/${baseName}${imageNum}.png` : `/images/${monastery.imageName}`;
                        } else if (monastery.name === 'Raloong Monastery') {
                            const extensions = ['1.png', '2.png', '3.jpg'];
                            imagePath = `/images/${baseName}${extensions[imageNum - 1]}`;
                        } else if (monastery.name === 'Sichey Dechen Choling Monastery') {
                            imagePath = imageNum <= 2 ? `/images/${baseName}${imageNum}.png` : `/images/${monastery.imageName}`;
                        } else if (monastery.name === 'Sichey Dechen Choling Monastery') {
                            imagePath = imageNum <= 2 ? `/images/${baseName}${imageNum}.png` : `/images/${monastery.imageName}`;
                        } else {
                            
                            const mainImageExt = monastery.imageName ? monastery.imageName.split('.').pop().toLowerCase() : 'jpg';
                            if (['png', 'jpg', 'jfif'].includes(mainImageExt)) {
                                imagePath = `/images/${baseName}${imageNum}.${mainImageExt}`;
                            } else {
                                imagePath = `/images/slide/${baseName}${imageNum}.jpg`;
                            }
                        }

                        return (
                            <div key={imageNum} className="gallery-card">
                                <div className="gallery-card-image">
                                    <img
                                        src={imagePath}
                                        alt={`${monastery.name} - View ${imageNum}`}
                                        onError={(e) => {
                                            e.target.src = `/images/${monastery.imageName}`;
                                            e.target.onerror = () => {
                                                e.target.src = `/images/Home1.jpg`;
                                            };
                                        }}
                                    />
                                    <div className="gallery-card-overlay">
                                        <div className="gallery-card-info">
                                            <h4>{monastery.name}</h4>
                                            <p>View {imageNum}</p>
                                        </div>
                                        <button className="gallery-card-view-btn">
                                            <span>🔍</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="gallery-card-content">
                                    <h5>{monastery.name}</h5>
                                    <p>Architectural View {imageNum}</p>
                                    <div className="gallery-card-tags">
                                        <span className="tag">Architecture</span>
                                        <span className="tag">Sacred</span>
                                        <span className="tag">Heritage</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="quick-review-section">
                <div className="quick-review-header">
                    <h2>
                        <span className="review-icon">⭐</span>
                        Share Your Experience
                    </h2>
                    <p>Help fellow travelers by sharing your visit experience at {monastery.name}</p>
                </div>

                <div className="quick-review-content">
                    
                    <div className="review-actions-preview">
                        {isAuthenticated ? (
                            <>
                                <button 
                                    className="btn btn-primary review-btn"
                                    onClick={handleReviewButtonClick}
                                >
                                    Write a Review
                                </button>
                                <button 
                                    className="btn btn-outline review-btn"
                                    onClick={handleReviewButtonClick}
                                >
                                    Read All Reviews
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-primary review-btn">
                                    Login to Review
                                </Link>
                                <button 
                                    className="btn btn-outline review-btn"
                                    onClick={handleReviewButtonClick}
                                >
                                    Read Reviews
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            
            <div className="cta-section">
                <h2>Ready to Visit {monastery.name}?</h2>
                <p>Plan your spiritual journey to this sacred monastery</p>
                <div className="cta-buttons">
                    <button onClick={handleBookTour} className="btn btn-cta">
                        Book Guided Tour
                    </button>
                    <button onClick={handleGetDirections} className="btn btn-outline-cta">
                        Get Directions
                    </button>
                </div>
            </div>
            
            <ChatBot />
        </div>
    );
};

export default MonasteryDetails;