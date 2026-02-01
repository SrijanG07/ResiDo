import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import '../styles/luxury-theme.css';
import './PropertyNews.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
    { id: 'all', label: 'All News' },
    { id: 'Market Trends', label: 'Market Trends' },
    { id: 'Legal & Tax Updates', label: 'Legal & Tax' },
    { id: 'Buying & Selling Tips', label: 'Buying & Selling' },
    { id: 'Rental Market', label: 'Rentals' },
    { id: 'Infrastructure & Development', label: 'Infrastructure' },
    { id: 'Home Investment Advice', label: 'Investment' }
];

function PropertyNews({ onNavigate }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // Set SEO meta tags
        document.title = 'Property News & Market Insights | ResiDo';

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content',
                'Stay updated with the latest real estate news, property market trends, home buying tips, and investment advice in India.'
            );
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [activeCategory, page]);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);

        try {
            let url = `${API_BASE_URL}/news?page=${page}&limit=12`;
            if (activeCategory !== 'all') {
                url = `${API_BASE_URL}/news/category/${encodeURIComponent(activeCategory)}?page=${page}&limit=12`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch news');

            const data = await response.json();

            if (page === 1) {
                setArticles(data.articles);
            } else {
                setArticles(prev => [...prev, ...data.articles]);
            }

            setHasMore(data.pagination?.hasMore ?? false);
        } catch (err) {
            setError(err.message);
            console.error('News fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setPage(1);
        setArticles([]);
    };

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    return (
        <div className="property-news-page">
            {/* Navigation Bar */}
            <nav className="news-navbar">
                <a href="#" className="news-navbar__logo" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
                    ResiDo
                </a>
                <div className="news-navbar__links">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('browse'); }}>Properties</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('tour'); }}>Virtual Tours</a>
                    <a href="#" className="active">News</a>
                </div>
                <div className="news-navbar__actions">
                    <button className="news-navbar__cta" onClick={() => onNavigate('owner-landing')}>
                        List Property
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="news-hero">
                <div className="container">
                    <h1>Property News & Market Insights</h1>
                    <p>Stay informed with the latest real estate trends, market analysis, and expert advice</p>
                </div>
            </section>

            {/* Category Tabs */}
            <nav className="news-categories">
                <div className="container">
                    <div className="category-tabs">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* News Grid */}
            <main className="news-content">
                <div className="container">
                    {error && (
                        <div className="news-error">
                            <span>!</span>
                            <p>{error}</p>
                            <button onClick={fetchNews}>Try Again</button>
                        </div>
                    )}

                    {!error && articles.length === 0 && !loading && (
                        <div className="news-empty">
                            <span>N</span>
                            <p>No news articles available yet.</p>
                            <small>News will be fetched automatically. Check back soon!</small>
                        </div>
                    )}

                    <div className="news-grid">
                        {articles.map(article => (
                            <NewsCard key={article.id} article={article} />
                        ))}
                    </div>

                    {loading && (
                        <div className="news-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading news...</p>
                        </div>
                    )}

                    {!loading && hasMore && articles.length > 0 && (
                        <div className="news-load-more">
                            <button onClick={loadMore}>Load More Articles</button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default PropertyNews;
