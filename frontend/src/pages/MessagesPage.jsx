import React, { useState, useEffect, useRef } from 'react';
import '../styles/luxury-theme.css';
import './MessagesPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function MessagesPage({ onBack, onNavigate }) {
    const [conversations, setConversations] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const token = localStorage.getItem('ResiDo_token');
    const currentUser = JSON.parse(localStorage.getItem('ResiDo_user') || '{}');

    useEffect(() => {
        if (token) {
            fetchConversations();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/inquiries`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (inquiryId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${inquiryId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const selectConversation = (inquiry) => {
        setSelectedInquiry(inquiry);
        fetchMessages(inquiry.id);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedInquiry) return;

        setSending(true);
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    inquiry_id: selectedInquiry.id,
                    content: newMessage.trim()
                })
            });

            if (response.ok) {
                const message = await response.json();
                setMessages(prev => [...prev, message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (!token) {
        return (
            <div className="messages-page">
                <div className="messages-header">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <h1>Messages</h1>
                </div>
                <div className="empty-state">
                    <span className="empty-icon">⚿</span>
                    <h2>Please Login</h2>
                    <p>Login to view your messages</p>
                    <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('owner-login')}>
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="messages-page">
                <div className="messages-header">
                    <button className="back-btn" onClick={onBack}>← Back</button>
                    <h1>Messages</h1>
                </div>
                <div className="loading-state">Loading conversations...</div>
            </div>
        );
    }

    return (
        <div className="messages-page">
            <div className="messages-header">
                <button className="back-btn" onClick={onBack}>← Back</button>
                <h1>Messages</h1>
                <span className="conversation-count">{conversations.length} conversations</span>
            </div>

            <div className="messages-container">
                {/* Conversations List */}
                <div className={`conversations-list ${selectedInquiry ? 'hide-mobile' : ''}`}>
                    {conversations.length === 0 ? (
                        <div className="no-conversations">
                            <span>✉</span>
                            <p>No conversations yet</p>
                            <small>Start a conversation by contacting a property owner</small>
                        </div>
                    ) : (
                        conversations.map(inquiry => (
                            <div 
                                key={inquiry.id}
                                className={`conversation-item ${selectedInquiry?.id === inquiry.id ? 'active' : ''}`}
                                onClick={() => selectConversation(inquiry)}
                            >
                                <div className="conversation-avatar">
                                    {inquiry.property?.title?.charAt(0) || 'P'}
                                </div>
                                <div className="conversation-info">
                                    <div className="conversation-header">
                                        <h3>{inquiry.property?.title || 'Property'}</h3>
                                        <span className="conversation-time">
                                            {formatTime(inquiry.updated_at || inquiry.created_at)}
                                        </span>
                                    </div>
                                    <p className="conversation-preview">
                                        {inquiry.message?.substring(0, 50)}...
                                    </p>
                                    <span className={`status-badge ${inquiry.status}`}>
                                        {inquiry.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Thread */}
                <div className={`message-thread ${selectedInquiry ? 'show-mobile' : ''}`}>
                    {!selectedInquiry ? (
                        <div className="no-selection">
                            <span>✉</span>
                            <p>Select a conversation to view messages</p>
                        </div>
                    ) : (
                        <>
                            <div className="thread-header">
                                <button className="back-btn-mobile" onClick={() => setSelectedInquiry(null)}>
                                    ← Back
                                </button>
                                <div className="thread-info">
                                    <h2>{selectedInquiry.property?.title}</h2>
                                    <p>{selectedInquiry.property?.locality}, {selectedInquiry.property?.city}</p>
                                </div>
                            </div>

                            <div className="messages-list">
                                {/* Initial inquiry message */}
                                <div className={`message ${selectedInquiry.sender_id === currentUser.id ? 'sent' : 'received'}`}>
                                    <div className="message-content">
                                        <p>{selectedInquiry.message}</p>
                                        <span className="message-time">
                                            {formatTime(selectedInquiry.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Thread messages */}
                                {messages.map(msg => (
                                    <div 
                                        key={msg.id}
                                        className={`message ${msg.sender_id === currentUser.id ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            <p>{msg.content}</p>
                                            <span className="message-time">
                                                {formatTime(msg.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="message-input" onSubmit={sendMessage}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    disabled={sending}
                                />
                                <button type="submit" disabled={sending || !newMessage.trim()}>
                                    {sending ? '...' : '➤'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
