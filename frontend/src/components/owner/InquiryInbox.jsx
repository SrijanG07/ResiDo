import React, { useState } from 'react';
import './InquiryInbox.css';

// Mock inquiry data
const MOCK_INQUIRIES = [
    {
        id: 1,
        sender: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '9876543210',
        property: '3 BHK Apartment in Koramangala',
        propertyId: 1,
        message: 'Hi, I am interested in this property. Is it still available? I would like to schedule a visit this weekend if possible.',
        date: '2026-01-28T14:30:00',
        isRead: false,
        isArchived: false
    },
    {
        id: 2,
        sender: 'Priya Patel',
        email: 'priya.patel@yahoo.com',
        phone: '9876543211',
        property: '2 BHK Flat in Indiranagar',
        propertyId: 2,
        message: 'What is the best price you can offer? I am a serious buyer and can close the deal within 2 weeks.',
        date: '2026-01-28T10:15:00',
        isRead: false,
        isArchived: false
    },
    {
        id: 3,
        sender: 'Amit Kumar',
        email: 'amit.kumar@outlook.com',
        phone: '9876543212',
        property: '4 BHK Villa in Whitefield',
        propertyId: 3,
        message: 'Is the property near any IT parks? Also, is there a gym and swimming pool in the society?',
        date: '2026-01-27T16:45:00',
        isRead: true,
        isArchived: false
    },
    {
        id: 4,
        sender: 'Sneha Reddy',
        email: 'sneha.reddy@gmail.com',
        phone: '9876543213',
        property: '3 BHK Apartment in Koramangala',
        propertyId: 1,
        message: 'Can you share more photos of the kitchen and bathrooms? Also, what is the age of the building?',
        date: '2026-01-27T09:20:00',
        isRead: true,
        isArchived: false
    },
    {
        id: 5,
        sender: 'Vikram Singh',
        email: 'vikram.singh@hotmail.com',
        phone: '9876543214',
        property: '2 BHK Flat in Indiranagar',
        propertyId: 2,
        message: 'I visited the property yesterday. Very interested! Can we discuss the payment terms?',
        date: '2026-01-26T11:00:00',
        isRead: true,
        isArchived: false
    }
];

const QUICK_REPLIES = [
    "Thank you for your interest! Yes, the property is still available. When would be a convenient time for you to visit?",
    "I appreciate your inquiry. I'll get back to you with more details shortly.",
    "The property has great connectivity to major IT parks. Would you like to schedule a visit?",
    "I can offer a 2% discount for a quick closure. Let me know if you're interested."
];

function InquiryInbox() {
    const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [filter, setFilter] = useState('all'); // all, unread, archived
    const [replyText, setReplyText] = useState('');

    const unreadCount = inquiries.filter(i => !i.isRead && !i.isArchived).length;

    const filteredInquiries = inquiries.filter(inquiry => {
        if (filter === 'unread') return !inquiry.isRead && !inquiry.isArchived;
        if (filter === 'archived') return inquiry.isArchived;
        return !inquiry.isArchived;
    });

    const handleSelectInquiry = (inquiry) => {
        setSelectedInquiry(inquiry);
        // Mark as read
        if (!inquiry.isRead) {
            setInquiries(prev => prev.map(i =>
                i.id === inquiry.id ? { ...i, isRead: true } : i
            ));
        }
    };

    const handleArchive = (id) => {
        setInquiries(prev => prev.map(i =>
            i.id === id ? { ...i, isArchived: true } : i
        ));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
    };

    const handleQuickReply = (reply) => {
        setReplyText(reply);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return date.toLocaleDateString('en-IN', { weekday: 'short' });
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    };

    return (
        <div className="inquiry-inbox">
            {/* Inbox Header */}
            <div className="inbox-header">
                <div className="inbox-tabs">
                    <button
                        className={`tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Inquiries
                    </button>
                    <button
                        className={`tab ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </button>
                    <button
                        className={`tab ${filter === 'archived' ? 'active' : ''}`}
                        onClick={() => setFilter('archived')}
                    >
                        Archived
                    </button>
                </div>
            </div>

            <div className="inbox-content">
                {/* Inquiry List */}
                <div className="inquiry-list">
                    {filteredInquiries.length === 0 ? (
                        <div className="empty-list">
                            <span>📭</span>
                            <p>No inquiries found</p>
                        </div>
                    ) : (
                        filteredInquiries.map(inquiry => (
                            <div
                                key={inquiry.id}
                                className={`inquiry-item ${!inquiry.isRead ? 'unread' : ''} ${selectedInquiry?.id === inquiry.id ? 'selected' : ''}`}
                                onClick={() => handleSelectInquiry(inquiry)}
                            >
                                <div className="inquiry-avatar">
                                    {inquiry.sender.charAt(0)}
                                </div>
                                <div className="inquiry-preview">
                                    <div className="inquiry-header">
                                        <span className="sender-name">{inquiry.sender}</span>
                                        <span className="inquiry-date">{formatDate(inquiry.date)}</span>
                                    </div>
                                    <div className="inquiry-property">{inquiry.property}</div>
                                    <div className="inquiry-snippet">{inquiry.message.substring(0, 60)}...</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Inquiry Detail */}
                <div className="inquiry-detail">
                    {selectedInquiry ? (
                        <>
                            <div className="detail-header">
                                <div className="sender-info">
                                    <div className="sender-avatar">{selectedInquiry.sender.charAt(0)}</div>
                                    <div>
                                        <h3>{selectedInquiry.sender}</h3>
                                        <p>{selectedInquiry.email} • {selectedInquiry.phone}</p>
                                    </div>
                                </div>
                                <div className="detail-actions">
                                    <button className="btn btn-outline btn-sm" onClick={() => handleArchive(selectedInquiry.id)}>
                                        📥 Archive
                                    </button>
                                </div>
                            </div>

                            <div className="detail-property">
                                <span className="property-label">Regarding:</span>
                                <span className="property-name">{selectedInquiry.property}</span>
                            </div>

                            <div className="detail-message">
                                <p>{selectedInquiry.message}</p>
                                <span className="message-date">
                                    {new Date(selectedInquiry.date).toLocaleString('en-IN')}
                                </span>
                            </div>

                            <div className="quick-replies">
                                <h4>Quick Replies</h4>
                                <div className="reply-options">
                                    {QUICK_REPLIES.map((reply, i) => (
                                        <button key={i} className="quick-reply" onClick={() => handleQuickReply(reply)}>
                                            {reply.substring(0, 50)}...
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="reply-box">
                                <textarea
                                    placeholder="Type your reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={3}
                                />
                                <button className="btn btn-primary">
                                    ✉️ Send Reply
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-selection">
                            <span>📬</span>
                            <p>Select an inquiry to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InquiryInbox;
