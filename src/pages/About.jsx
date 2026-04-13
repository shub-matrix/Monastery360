import React from 'react';
import './About.css';

const About = () => {
    const teamMembers = [
        { name: "Kaifee Azam", role: "Web Developer" },
        { name: "Sonal Kumar", role: "Web Developer" },
        { name: "Shubham Sharma", role: "Cyber Security" },
        { name: "Baibhavi Pandey", role: "Web Developer" },
        { name: "Abdul Yahiya", role: "Web Developer" },
        { name: "Himanshu Raj", role: "Data Science" }
    ];

    return (
        <div className="about-container">
            <section className="about-hero">
                <div className="hero-content">
                    <h1 className="about-title">
                        🕍 About Us
                        <span className="subtitle">Monasteries of Sikkim</span>
                    </h1>
                </div>
            </section>

            <div className="about-content">
                <section className="intro-section">
                    <div className="content-card">
                        <p className="intro-text">
                            Welcome to <strong>Monasteries of Sikkim</strong>, a cultural and tourism initiative 
                            dedicated to showcasing the rich spiritual heritage, history, and architectural beauty 
                            of the monasteries nestled in the serene hills of Sikkim.
                        </p>
                        
                        <p className="description-text">
                            Sikkim, often called the <em>Land of Monasteries</em>, is home to centuries-old 
                            Buddhist monasteries that stand as living symbols of peace, faith, and tradition. 
                            Through our platform, we aim to offer travelers, culture enthusiasts, and researchers 
                            a deeper insight into the stories, rituals, festivals, and legacy preserved within 
                            these sacred spaces.
                        </p>

                        <p className="description-text">
                            From the historic Enchey Monastery to the majestic Rumtek, each monastery reflects 
                            a unique blend of art, culture, and spirituality. By exploring these places, visitors 
                            not only witness stunning Himalayan landscapes but also connect with Sikkim's timeless 
                            spiritual essence.
                        </p>
                    </div>
                </section>

                <section className="team-section">
                    <div className="content-card">
                        <h2 className="section-title">
                            <span className="emoji">👥</span>
                            Our Team
                        </h2>
                        
                        <p className="team-intro">
                            Our dedicated team of five has come together with a shared vision to preserve 
                            and promote Sikkim's monastery culture:
                        </p>
                        
                        <div className="team-grid">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="team-member">
                                    <div className="member-avatar">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <h3 className="member-name">{member.name}</h3>
                                    <p className="member-role">{member.role}</p>
                                </div>
                            ))}
                        </div>
                        
                        <p className="team-description">
                            We work passionately to research, document, and present authentic information, 
                            images, and stories, helping you experience these sacred sites virtually and 
                            inspiring real-world exploration.
                        </p>
                    </div>
                </section>

                <section className="mission-section">
                    <div className="content-card mission-card">
                        <h2 className="section-title">
                            <span className="emoji">🌐</span>
                            Our Mission
                        </h2>
                        
                        <div className="mission-content">
                            <p className="mission-text">
                                To celebrate, conserve, and promote the monasteries of Sikkim as pillars of 
                                cultural identity, spiritual learning, and sustainable tourism.
                            </p>
                            
                            <div className="mission-values">
                                <div className="value-item">
                                    <div className="value-icon">🏛️</div>
                                    <h4>Cultural Preservation</h4>
                                    <p>Safeguarding ancient traditions and architectural heritage</p>
                                </div>
                                
                                <div className="value-item">
                                    <div className="value-icon">🧘</div>
                                    <h4>Spiritual Learning</h4>
                                    <p>Sharing wisdom and teachings from centuries of Buddhist practice</p>
                                </div>
                                
                                <div className="value-item">
                                    <div className="value-icon">🌱</div>
                                    <h4>Sustainable Tourism</h4>
                                    <p>Promoting responsible travel that benefits local communities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;