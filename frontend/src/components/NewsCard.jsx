import React from 'react';
import './NewsCard.css';

function NewsCard({ article }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Market Trends': '#00ff88',
            'Legal & Tax Updates': '#ff6b6b',
            'Buying & Selling Tips': '#4ecdc4',
            'Rental Market': '#ffe66d',
            'Infrastructure & Development': '#95e1d3',
            'Home Investment Advice': '#dda0dd'
        };
        return colors[category] || '#00ff88';
    };

    return (
        <article className="news-card">
            <a href={article.source_url} target="_blank" rel="noopener noreferrer">
                <div className="news-card-image">
                    {article.image_url ? (
                        <img src={article.image_url} alt={article.title} loading="lazy" />
                    ) : (
                        <div className="news-placeholder-image">
                            <span>N</span>
                        </div>
                    )}
                    <span
                        className="news-category-badge"
                        style={{ backgroundColor: getCategoryColor(article.category) }}
                    >
                        {article.category}
                    </span>
                </div>
                <div className="news-card-content">
                    <h3 className="news-title">{article.title}</h3>
                    <p className="news-description">
                        {article.description?.slice(0, 150)}
                        {article.description?.length > 150 ? '...' : ''}
                    </p>
                    <div className="news-meta">
                        <span className="news-source">{article.source_name}</span>
                        <span className="news-date">{formatDate(article.published_at)}</span>
                    </div>
                </div>
            </a>
        </article>
    );
}

export default NewsCard;
