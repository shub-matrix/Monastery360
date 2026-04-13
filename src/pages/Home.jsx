import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import VirtualTour from '../components/VirtualTour/VirtualTour';
import InteractiveMap from '../components/InteractiveMap/InteractiveMap';
import CulturalCalendar from '../components/CulturalCalendar/CulturalCalendar';
import ChatBot from '../components/ChatBot/ChatBot';

const Home = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        '/images/Home1.jpg',
        '/images/Home2.jpg',
        '/images/Home3.jpg',
        '/images/Home4.jpg',
        '/images/Home5.jpg'
    ];

    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            if (!isPaused) setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(slideInterval);
    }, [slides.length, isPaused]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const handleRegionClick = (region) => {
        navigate(`/monasteries?region=${region}`);
    };

    return (
        <div className="home-container">
           
            <div className="hero-slideshow" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                <div className="slideshow-container">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${slide})` }}
                        >
                            {index === 0 && (
                                <div className="slide-overlay">
                                    <h1 style={{ color: 'yellow' }}>Welcome to Monastery360</h1>
                                    <p style={{ color: 'yellow' }}>Explore the rich heritage of Sikkim's monasteries.</p>
                                    <div className="slide-cta">
                                        <button className="cta-button" onClick={() => window.location.href = '/monasteries'}>Explore Monasteries</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <div className="dots-container">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            ></span>
                        ))}
                    </div>

                    <div className="slideshow-progress">
                        <div className="progress-bar" style={{ animationDuration: `${isPaused ? 0 : 4}s` }} data-active={currentSlide}></div>
                    </div>
                </div>
            </div>

            <hr className="slideshow-divider" />

            {/* Scrolling Monastery Names Marquee */}
            <div className="monastery-marquee-container">
                <div className="monastery-marquee">
                    <div className="marquee-content">
                        <span className="monastery-name">Rumtek Monastery</span>
                        <span className="monastery-name">Pemayangtse Monastery</span>
                        <span className="monastery-name">Tashiding Monastery</span>
                        <span className="monastery-name">Dubdi Monastery</span>
                        <span className="monastery-name">Ralang Monastery</span>
                        <span className="monastery-name">Kathog Lake Monastery</span>
                        <span className="monastery-name">Lingdum Zurmang Monastery</span>
                        <span className="monastery-name">Bumtar Namdroling Monastery</span>
                        <span className="monastery-name">Doling Monastery</span>
                        <span className="monastery-name">Karma Raptenling Monastery</span>
                        <span className="monastery-name">Ngadag Monastery</span>
                        <span className="monastery-name">Aden Wolung Monastery</span>
                        <span className="monastery-name">Chakung Monastery</span>
                        <span className="monastery-name">Dodak Tamu Monastery</span>
                        <span className="monastery-name">Druk Monastery</span>
                        <span className="monastery-name">Hungri Monastery</span>
                        <span className="monastery-name">Khachoedpalri Monastery</span>
                        <span className="monastery-name">Lhuntse Monastery</span>
                        <span className="monastery-name">Melli-Atsing Monastery</span>
                        <span className="monastery-name">Nubling Monastery</span>
                        <span className="monastery-name">Okhery Monastery</span>
                        <span className="monastery-name">Pegmantysse Monastery</span>
                        <span className="monastery-name">Rinchen Choling Monastery</span>
                        <span className="monastery-name">Rinchenpung Monastery</span>
                        <span className="monastery-name">Sinon Monastery</span>
                        <span className="monastery-name">Sri Badam Monastery</span>
                        <span className="monastery-name">Tashi Samboling Monastery</span>
                        <span className="monastery-name">Enchey Monastery</span>
                        <span className="monastery-name">Lingdok Tsangkhar Monastery</span>
                        <span className="monastery-name">Linkoed Monastery</span>
                        <span className="monastery-name">Pabyuk Monastery</span>
                        <span className="monastery-name">Ray Mindu Katenling Monastery</span>
                        <span className="monastery-name">Labrang Monastery</span>
                        <span className="monastery-name">Lachen Ngodub Choling Monastery</span>
                        <span className="monastery-name">Lachen Thangu Monastery</span>
                        <span className="monastery-name">Lingthem Gonpa Chophel Dargyeling</span>
                        <span className="monastery-name">Phensang Monastery</span>
                        <span className="monastery-name">Phodong Karma Tashi Chokhorling Monastery</span>
                        <span className="monastery-name">Silem Phagyal Tashi Dargyeling Monastery</span>
                        <span className="monastery-name">Singchit Ngadag Monastery</span>
                        <span className="monastery-name">Tholung Monastery</span>
                        <span className="monastery-name">Tingbung Monastery</span>
                        <span className="monastery-name">Choten Monastery</span>
                        <span className="monastery-name">Kagon Tshechhogling Monastery</span>
                        <span className="monastery-name">Lingdum Zurmang Kharwang Gonpa Monastery</span>
                        <span className="monastery-name">Raloong Monastery</span>
                        <span className="monastery-name">Rumtek Dharma Chakra Centre Monastery</span>
                        <span className="monastery-name">Sang Ngor Monastery</span>
                        <span className="monastery-name">Sichey Dechen Choling Monastery</span>
                        <span className="monastery-name">Tashi Palden Monastery</span>
                        <span className="monastery-name">Tinkye Gonjang Monastery</span>
                        <span className="monastery-name">Ringyim Rigdzin Tharling Monastery</span>
                        <span className="monastery-name">Gor Rinchen Khando Monastery</span>
                        <span className="monastery-name">Barphog Chhodub Dargyeling Monastery</span>
                        <span className="monastery-name">Shagyong Monastery</span>
                        <span className="monastery-name">Tsawang Choling Monastery</span>
                        <span className="monastery-name">Kabi Sanga Dargyeling Monastery</span>
                        <span className="monastery-name">Sontam Tensung Monastery</span>
                        <span className="monastery-name">Tsungthang Monastery</span>
                        <span className="monastery-name">Tareng Gonpa Dargye Choling Monastery</span>
                        <span className="monastery-name">Martam Namdzong Monastery</span>
                        <span className="monastery-name">Amba Mamring Monastery</span>
                        <span className="monastery-name">Radong Tensung Monastery</span>
                        <span className="monastery-name">Bakcham Monastery</span>
                        <span className="monastery-name">Taktse Ani Gonpa Ugen Chokhorling Monastery</span>
                        <span className="monastery-name">Khatek Pema Choling Monastery</span>
                        <span className="monastery-name">Taglung Domsumling Monastery</span>
                        <span className="monastery-name">Dolepchen Boudha Sanskrit Monastery</span>
                        <span className="monastery-name">Singtam Gonpa Karma Thuje Choling Monastery</span>
                        <span className="monastery-name">Burtuk Ugen Pema Choling Tamu Monastery</span>
                        <span className="monastery-name">Duchi Gyalon Monastery</span>
                        <span className="monastery-name">Bongyong Ani Gonpa Rinak Monastery</span>
                        <span className="monastery-name">Simig Monastery</span>
                        <span className="monastery-name">Pathing Matsang Monastery</span>
                        <span className="monastery-name">Tsangek Monastery</span>
                        <span className="monastery-name">Sang Monastery</span>
                        <span className="monastery-name">Sumon Thubten Gatsalling Monastery</span>
                        <span className="monastery-name">Martam Tsangkhar Monastery</span>
                    </div>
                    <div className="marquee-content" aria-hidden="true">
                        <span className="monastery-name">Rumtek Monastery</span>
                        <span className="monastery-name">Pemayangtse Monastery</span>
                        <span className="monastery-name">Tashiding Monastery</span>
                        <span className="monastery-name">Dubdi Monastery</span>
                        <span className="monastery-name">Ralang Monastery</span>
                        <span className="monastery-name">Kathog Lake Monastery</span>
                        <span className="monastery-name">Lingdum Zurmang Monastery</span>
                        <span className="monastery-name">Bumtar Namdroling Monastery</span>
                        <span className="monastery-name">Doling Monastery</span>
                        <span className="monastery-name">Karma Raptenling Monastery</span>
                        <span className="monastery-name">Ngadag Monastery</span>
                        <span className="monastery-name">Aden Wolung Monastery</span>
                        <span className="monastery-name">Chakung Monastery</span>
                        <span className="monastery-name">Dodak Tamu Monastery</span>
                        <span className="monastery-name">Druk Monastery</span>
                        <span className="monastery-name">Hungri Monastery</span>
                        <span className="monastery-name">Khachoedpalri Monastery</span>
                        <span className="monastery-name">Lhuntse Monastery</span>
                        <span className="monastery-name">Melli-Atsing Monastery</span>
                        <span className="monastery-name">Nubling Monastery</span>
                        <span className="monastery-name">Okhery Monastery</span>
                        <span className="monastery-name">Pegmantysse Monastery</span>
                        <span className="monastery-name">Rinchen Choling Monastery</span>
                        <span className="monastery-name">Rinchenpung Monastery</span>
                        <span className="monastery-name">Sinon Monastery</span>
                        <span className="monastery-name">Sri Badam Monastery</span>
                        <span className="monastery-name">Tashi Samboling Monastery</span>
                        <span className="monastery-name">Enchey Monastery</span>
                        <span className="monastery-name">Lingdok Tsangkhar Monastery</span>
                        <span className="monastery-name">Linkoed Monastery</span>
                        <span className="monastery-name">Pabyuk Monastery</span>
                        <span className="monastery-name">Ray Mindu Katenling Monastery</span>
                        <span className="monastery-name">Labrang Monastery</span>
                        <span className="monastery-name">Lachen Ngodub Choling Monastery</span>
                        <span className="monastery-name">Lachen Thangu Monastery</span>
                        <span className="monastery-name">Lingthem Gonpa Chophel Dargyeling</span>
                        <span className="monastery-name">Phensang Monastery</span>
                        <span className="monastery-name">Phodong Karma Tashi Chokhorling Monastery</span>
                        <span className="monastery-name">Silem Phagyal Tashi Dargyeling Monastery</span>
                        <span className="monastery-name">Singchit Ngadag Monastery</span>
                        <span className="monastery-name">Tholung Monastery</span>
                        <span className="monastery-name">Tingbung Monastery</span>
                        <span className="monastery-name">Choten Monastery</span>
                        <span className="monastery-name">Kagon Tshechhogling Monastery</span>
                        <span className="monastery-name">Lingdum Zurmang Kharwang Gonpa Monastery</span>
                        <span className="monastery-name">Raloong Monastery</span>
                        <span className="monastery-name">Rumtek Dharma Chakra Centre Monastery</span>
                        <span className="monastery-name">Sang Ngor Monastery</span>
                        <span className="monastery-name">Sichey Dechen Choling Monastery</span>
                        <span className="monastery-name">Tashi Palden Monastery</span>
                        <span className="monastery-name">Tinkye Gonjang Monastery</span>
                        <span className="monastery-name">Ringyim Rigdzin Tharling Monastery</span>
                        <span className="monastery-name">Gor Rinchen Khando Monastery</span>
                        <span className="monastery-name">Barphog Chhodub Dargyeling Monastery</span>
                        <span className="monastery-name">Shagyong Monastery</span>
                        <span className="monastery-name">Tsawang Choling Monastery</span>
                        <span className="monastery-name">Kabi Sanga Dargyeling Monastery</span>
                        <span className="monastery-name">Sontam Tensung Monastery</span>
                        <span className="monastery-name">Tsungthang Monastery</span>
                        <span className="monastery-name">Tareng Gonpa Dargye Choling Monastery</span>
                        <span className="monastery-name">Martam Namdzong Monastery</span>
                        <span className="monastery-name">Amba Mamring Monastery</span>
                        <span className="monastery-name">Radong Tensung Monastery</span>
                        <span className="monastery-name">Bakcham Monastery</span>
                        <span className="monastery-name">Taktse Ani Gonpa Ugen Chokhorling Monastery</span>
                        <span className="monastery-name">Khatek Pema Choling Monastery</span>
                        <span className="monastery-name">Taglung Domsumling Monastery</span>
                        <span className="monastery-name">Dolepchen Boudha Sanskrit Monastery</span>
                        <span className="monastery-name">Singtam Gonpa Karma Thuje Choling Monastery</span>
                        <span className="monastery-name">Burtuk Ugen Pema Choling Tamu Monastery</span>
                        <span className="monastery-name">Duchi Gyalon Monastery</span>
                        <span className="monastery-name">Bongyong Ani Gonpa Rinak Monastery</span>
                        <span className="monastery-name">Simig Monastery</span>
                        <span className="monastery-name">Pathing Matsang Monastery</span>
                        <span className="monastery-name">Tsangek Monastery</span>
                        <span className="monastery-name">Sang Monastery</span>
                        <span className="monastery-name">Sumon Thubten Gatsalling Monastery</span>
                        <span className="monastery-name">Martam Tsangkhar Monastery</span>
                    </div>
                </div>
            </div>

            <VirtualTour />

            <div className="regions-section">
                <h2 className="regions-title">Explore Sikkim by Regions</h2>
                <div className="regions-container">
                    <div className="region-oval" onClick={() => handleRegionClick('East Sikkim')}>
                        <img src="/images/Ovel/East.jpg" alt="East Sikkim" className="region-image" />
                        <div className="region-overlay">
                            <h3 className="region-name">East</h3>
                        </div>
                    </div>
                    <div className="region-oval" onClick={() => handleRegionClick('West Sikkim')}>
                        <img src="/images/Ovel/West.jpg" alt="West Sikkim" className="region-image" />
                        <div className="region-overlay">
                            <h3 className="region-name">West</h3>
                        </div>
                    </div>
                    <div className="region-oval" onClick={() => handleRegionClick('North Sikkim')}>
                        <img src="/images/Ovel/North.jpg" alt="North Sikkim" className="region-image" />
                        <div className="region-overlay">
                            <h3 className="region-name">North</h3>
                        </div>
                    </div>
                    <div className="region-oval" onClick={() => handleRegionClick('South Sikkim')}>
                        <img src="/images/Ovel/South.jpg" alt="South Sikkim" className="region-image" />
                        <div className="region-overlay">
                            <h3 className="region-name">South</h3>
                        </div>
                    </div>
                </div>
            </div>
                <ChatBot />
        </div>
    );
};

export default Home;
