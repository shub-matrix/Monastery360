import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import knowledgeBase from '../../services/chatbotKnowledgeBase';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeResponse = knowledgeBase.getDefaultResponse();
            setMessages([{
                id: 1,
                text: welcomeResponse.message,
                type: 'bot',
                timestamp: new Date()
            }]);
            setSuggestions(welcomeResponse.suggestions || []);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            setUnreadCount(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setSuggestions([]);
        handleSendMessage(suggestion);
    };

    const handleSendMessage = async (messageText = null) => {
        const message = messageText || inputValue.trim();
        if (!message) return;

        const userMessage = {
            id: Date.now(),
            text: message,
            type: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);
        setSuggestions([]);
        if (inputRef.current) inputRef.current.style.height = 'auto';

        try {
            const response = await knowledgeBase.processQuery(message);
            setTimeout(() => {
                const botMessage = {
                    id: Date.now() + 1,
                    text: response.message,
                    type: 'bot',
                    timestamp: new Date(),
                    data: response.data
                };
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
                if (response.suggestions) setSuggestions(response.suggestions);
                if (!isOpen) setUnreadCount(prev => prev + 1);
            }, 800 + Math.random() * 800);
        } catch (error) {
            console.error('Error processing message:', error);
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "Sorry, I encountered an error processing your request. Please try again.",
                    type: 'bot',
                    timestamp: new Date()
                }]);
                setIsTyping(false);
            }, 800);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimestamp = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const clearChat = () => {
        setMessages([]);
        setSuggestions([]);
        const welcomeResponse = knowledgeBase.getDefaultResponse();
        setMessages([{
            id: Date.now(),
            text: welcomeResponse.message,
            type: 'bot',
            timestamp: new Date()
        }]);
        setSuggestions(welcomeResponse.suggestions || []);
    };

    const renderMessage = (message) => {
        const isBot = message.type === 'bot';
        return (
            <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                    {isBot ? '🏛️' : '👤'}
                </div>
                <div className="message-content">
                    <div className="message-text">
                        {message.text.split('\n').map((line, index) => {
                            if (line.startsWith('**') && line.endsWith('**')) {
                                return <div key={index} className="message-bold">{line.slice(2, -2)}</div>;
                            } else if (line.startsWith('•')) {
                                return <div key={index} className="message-bullet">{line}</div>;
                            } else if (line.includes('**')) {
                                const parts = line.split(/\*\*(.*?)\*\*/g);
                                return (
                                    <div key={index}>
                                        {parts.map((part, i) =>
                                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                        )}
                                    </div>
                                );
                            } else if (line.trim()) {
                                return <div key={index}>{line}</div>;
                            } else {
                                return <br key={index} />;
                            }
                        })}
                    </div>
                    <div className="message-time">{formatTimestamp(message.timestamp)}</div>
                </div>
            </div>
        );
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'active' : ''}`}>
            <div className={`chat-toggle ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
                <div className="chat-toggle-icon">
                    <span>💬</span>
                    {!isOpen && unreadCount > 0 && (
                        <div className="unread-badge">{unreadCount}</div>
                    )}
                </div>
                {!isOpen && (
                    <div className="chat-toggle-tooltip">
                        <div className="tooltip-title"><span>🏛️</span> Monastery Guide</div>
                        <div className="tooltip-subtitle">Ask me about monasteries, weather & festivals!</div>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <span>🏛️</span>
                            <h4>Monastery360 AI</h4>
                            <span className="chatbot-status">
                                {isTyping ? 'Typing...' : 'Online'}
                            </span>
                        </div>
                        <div className="chatbot-controls">
                            <button className="chatbot-clear" onClick={clearChat} title="Clear conversation">
                                🗑️
                            </button>
                            <button className="chatbot-close" onClick={toggleChat}>
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map(renderMessage)}

                        {isTyping && (
                            <div className="message bot typing">
                                <div className="message-avatar">🏛️</div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {suggestions.length > 0 && !isTyping && (
                        <div className="chatbot-suggestions">
                            <div className="suggestions-header">
                                <span>Quick Questions:</span>
                                <button 
                                    className="suggestions-close"
                                    onClick={() => setSuggestions([])}
                                    title="Hide suggestions"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="suggestions-grid">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        className="suggestion-chip"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="chatbot-input-container">
                        <div className="chatbot-input-wrapper">
                            <textarea
                                ref={inputRef}
                                className="chatbot-input"
                                placeholder="Ask about monasteries, weather, festivals..."
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                rows="1"
                                disabled={isTyping}
                            />
                            <button
                                className="chatbot-send"
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim() || isTyping}
                                title="Send message"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22,2 15,22 11,13 2,9"></polygon>
                                </svg>
                            </button>
                        </div>
                        <div className="chatbot-footer">
                            Powered by Monastery360 AI • Ask about monasteries, weather & more
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
