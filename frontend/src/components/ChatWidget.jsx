import React, { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ChatWidget({ onViewProperty }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m your property search assistant. Tell me what you\'re looking for, like "2BHK near metro under 20k" or "apartments in Bangalore for sale".' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionToken, setSessionToken] = useState(null);
    const [properties, setProperties] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
        return `₹${price?.toLocaleString() || 0}`;
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    sessionToken: sessionToken
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSessionToken(data.sessionToken);
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
                setProperties(data.properties || []);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.'
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Unable to connect. Please check your connection.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickPrompts = [
        '2BHK under ₹15L in Bangalore',
        'Pet-friendly rentals near metro',
        'Furnished apartments under 20k'
    ];

    return (
        <div className="chat-widget">
            {/* Chat Button */}
            <button
                className={`chat-widget__toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg className="chat-widget__sparkle" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
                        </svg>
                        <span className="chat-widget__text">ASK AI</span>
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-widget__window">
                    <div className="chat-widget__header">
                        <div className="chat-widget__header-info">
                            <span className="chat-widget__avatar">R</span>
                            <div>
                                <h4>ResiDo Assistant</h4>
                                <span className="chat-widget__status">AI-Powered Search</span>
                            </div>
                        </div>
                        <button className="chat-widget__close" onClick={() => setIsOpen(false)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="chat-widget__messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message chat-message--${msg.role}`}>
                                <div className="chat-message__content">
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Property Results */}
                        {properties.length > 0 && (
                            <div className="chat-properties">
                                {properties.slice(0, 3).map(property => (
                                    <div
                                        key={property.id}
                                        className="chat-property-card"
                                        onClick={() => onViewProperty && onViewProperty(property.id)}
                                    >
                                        {property.image && (
                                            <img src={property.image} alt={property.title} />
                                        )}
                                        <div className="chat-property-card__info">
                                            <span className="chat-property-card__price">
                                                {formatPrice(property.price)}
                                                {property.listing_type === 'rent' && '/mo'}
                                            </span>
                                            <span className="chat-property-card__title">{property.title}</span>
                                            <span className="chat-property-card__location">
                                                {property.locality}, {property.city}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {properties.length > 3 && (
                                    <div className="chat-properties__more">
                                        +{properties.length - 3} more results
                                    </div>
                                )}
                            </div>
                        )}

                        {isLoading && (
                            <div className="chat-message chat-message--assistant">
                                <div className="chat-message__content chat-message__typing">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    {messages.length <= 2 && (
                        <div className="chat-widget__prompts">
                            {quickPrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setInput(prompt); }}
                                    className="chat-prompt-btn"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="chat-widget__input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Describe your ideal property..."
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            className="chat-widget__send"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatWidget;
