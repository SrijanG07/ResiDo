import React, { useState, useEffect } from 'react';
import './ReviewSection.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ReviewSection({ propertyId, isOwner = false }) {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, title: '', content: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [propertyId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/property/${propertyId}`);
            const data = await response.json();
            setReviews(data.reviews || []);
            setAverageRating(data.averageRating || 0);
            setTotalReviews(data.totalReviews || 0);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('ResiDo_token');
        if (!token) {
            alert('Please login to submit a review');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/reviews/property/${propertyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newReview)
            });

            if (response.ok) {
                setShowForm(false);
                setNewReview({ rating: 5, title: '', content: '' });
                fetchReviews();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Submit review error:', error);
            alert('Failed to submit review');
        }
    };

    const handleOwnerResponse = async (reviewId, response) => {
        const token = localStorage.getItem('ResiDo_token');
        try {
            await fetch(`${API_BASE_URL}/reviews/${reviewId}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ response })
            });
            fetchReviews();
        } catch (error) {
            console.error('Owner response error:', error);
        }
    };

    const renderStars = (rating, interactive = false, onChange = null) => {
        return (
            <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
                        onClick={() => interactive && onChange && onChange(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return <div className="review-section loading">Loading reviews...</div>;
    }

    return (
        <div className="review-section">
            <div className="review-header">
                <div className="review-summary">
                    <h3>Reviews & Ratings</h3>
                    <div className="rating-overview">
                        <span className="big-rating">{averageRating}</span>
                        {renderStars(Math.round(averageRating))}
                        <span className="review-count">({totalReviews} reviews)</span>
                    </div>
                </div>
                {!isOwner && (
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Write Review'}
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showForm && (
                <form className="review-form" onSubmit={handleSubmitReview}>
                    <div className="form-group">
                        <label>Your Rating</label>
                        {renderStars(newReview.rating, true, (r) => setNewReview({...newReview, rating: r}))}
                    </div>
                    <div className="form-group">
                        <label>Title (optional)</label>
                        <input
                            type="text"
                            placeholder="Summarize your experience"
                            value={newReview.title}
                            onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Your Review *</label>
                        <textarea
                            placeholder="Share details of your experience with this property..."
                            value={newReview.content}
                            onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                            rows={4}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Review</button>
                </form>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <div className="no-reviews">
                        <span>R</span>
                        <p>No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-top">
                                <div className="reviewer-info">
                                    <div className="reviewer-avatar">
                                        {review.reviewer?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <span className="reviewer-name">{review.reviewer?.name || 'Anonymous'}</span>
                                        <span className="review-date">{formatDate(review.created_at)}</span>
                                    </div>
                                </div>
                                {renderStars(review.rating)}
                            </div>
                            {review.title && <h4 className="review-title">{review.title}</h4>}
                            <p className="review-content">{review.content}</p>

                            {/* Owner Response */}
                            {review.owner_response && (
                                <div className="owner-response">
                                    <span className="response-label">Owner's Response:</span>
                                    <p>{review.owner_response}</p>
                                    <span className="response-date">{formatDate(review.response_date)}</span>
                                </div>
                            )}

                            {/* Owner Response Form */}
                            {isOwner && !review.owner_response && (
                                <OwnerResponseForm 
                                    reviewId={review.id} 
                                    onSubmit={handleOwnerResponse}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function OwnerResponseForm({ reviewId, onSubmit }) {
    const [response, setResponse] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (response.trim()) {
            onSubmit(reviewId, response);
            setResponse('');
            setShowForm(false);
        }
    };

    if (!showForm) {
        return (
            <button className="btn btn-outline btn-sm" onClick={() => setShowForm(true)}>
                Reply to Review
            </button>
        );
    }

    return (
        <form className="owner-response-form" onSubmit={handleSubmit}>
            <textarea
                placeholder="Write your response..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={2}
            />
            <div className="form-actions">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                    Submit Response
                </button>
            </div>
        </form>
    );
}

export default ReviewSection;
