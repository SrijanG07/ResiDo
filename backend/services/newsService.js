/**
 * NewsAPI Service
 * Fetches, filters, and categorizes real estate news
 */

const PropertyNews = require('../models/PropertyNews');
const { Op } = require('sequelize');

const NEWSAPI_BASE_URL = 'https://newsapi.org/v2/everything';

// Keywords for filtering relevant articles
const REAL_ESTATE_KEYWORDS = [
    'real estate', 'property market', 'housing prices', 'home prices',
    'mortgage', 'home loan', 'stamp duty', 'property tax',
    'rental market', 'property investment', 'housing demand',
    'infrastructure development', 'metro project', 'smart city',
    'RERA', 'property sale', 'home buying', 'property developer'
];

// Keywords to reject articles
const REJECT_KEYWORDS = [
    'celebrity home', 'interior design', 'home decor',
    'gossip', 'entertainment', 'bollywood'
];

// Category keywords mapping
const CATEGORY_KEYWORDS = {
    'Market Trends': ['market', 'prices', 'demand', 'forecast', 'trend', 'growth', 'decline'],
    'Legal & Tax Updates': ['stamp duty', 'tax', 'legal', 'regulation', 'RERA', 'GST', 'policy'],
    'Buying & Selling Tips': ['buying', 'selling', 'tips', 'guide', 'first-time', 'buyer', 'seller'],
    'Rental Market': ['rental', 'rent', 'lease', 'tenant', 'landlord', 'PG', 'hostel'],
    'Infrastructure & Development': ['infrastructure', 'metro', 'development', 'project', 'highway', 'airport'],
    'Home Investment Advice': ['investment', 'ROI', 'wealth', 'returns', 'portfolio', 'NRI']
};

// Indian cities for city-based filtering
const INDIAN_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Noida',
    'Gurgaon', 'Gurugram', 'Thane', 'Navi Mumbai', 'Goa', 'Chandigarh'
];

/**
 * Fetch articles from NewsAPI
 */
async function fetchFromNewsAPI() {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
        console.error('❌ NEWSAPI_KEY not configured');
        return [];
    }

    // Build search query
    const query = 'real estate OR property market OR housing prices OR home loan India';

    // Calculate date range (last 7 days)
    const toDate = new Date().toISOString().split('T')[0];
    const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const url = `${NEWSAPI_BASE_URL}?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=100&from=${fromDate}&to=${toDate}`;

    try {
        const response = await fetch(url, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ NewsAPI error:', error.message);
            return [];
        }

        const data = await response.json();
        console.log(`📰 Fetched ${data.articles?.length || 0} articles from NewsAPI`);
        return data.articles || [];
    } catch (error) {
        console.error('❌ Failed to fetch from NewsAPI:', error.message);
        return [];
    }
}

/**
 * Filter relevant articles only
 */
function filterRelevantArticles(articles) {
    return articles.filter(article => {
        const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();

        // Reject if contains unwanted keywords
        if (REJECT_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()))) {
            return false;
        }

        // Must contain at least one relevant keyword
        return REAL_ESTATE_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
    });
}

/**
 * Categorize an article based on content
 */
function categorizeArticle(article) {
    const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();

    let bestCategory = 'Market Trends';
    let bestScore = 0;

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        const score = keywords.filter(kw => text.includes(kw.toLowerCase())).length;
        if (score > bestScore) {
            bestScore = score;
            bestCategory = category;
        }
    }

    return bestCategory;
}

/**
 * Extract mentioned cities from article
 */
function extractCities(article) {
    const text = `${article.title || ''} ${article.description || ''}`;
    return INDIAN_CITIES.filter(city =>
        text.toLowerCase().includes(city.toLowerCase())
    );
}

/**
 * Save articles to database
 */
async function saveArticles(articles) {
    let saved = 0;
    let skipped = 0;

    for (const article of articles) {
        try {
            // Check if already exists
            const exists = await PropertyNews.findOne({
                where: { source_url: article.url }
            });

            if (exists) {
                skipped++;
                continue;
            }

            // Create new article
            await PropertyNews.create({
                title: article.title,
                description: article.description,
                source_name: article.source?.name,
                source_url: article.url,
                image_url: article.urlToImage,
                published_at: article.publishedAt,
                category: categorizeArticle(article),
                city_mentions: extractCities(article),
                keywords: REAL_ESTATE_KEYWORDS.filter(kw =>
                    `${article.title} ${article.description}`.toLowerCase().includes(kw.toLowerCase())
                )
            });
            saved++;
        } catch (error) {
            // Likely duplicate, skip
            skipped++;
        }
    }

    console.log(`✅ Saved ${saved} new articles, ${skipped} duplicates skipped`);
    return { saved, skipped };
}

/**
 * Delete articles older than 7 days
 */
async function cleanupOldArticles() {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const deleted = await PropertyNews.destroy({
        where: {
            created_at: { [Op.lt]: cutoffDate }
        }
    });

    if (deleted > 0) {
        console.log(`🧹 Cleaned up ${deleted} old articles`);
    }
    return deleted;
}

/**
 * Main function to fetch and process news
 */
async function refreshNews() {
    console.log('🔄 Starting news refresh...');

    // Fetch from API
    const articles = await fetchFromNewsAPI();

    // Filter relevant only
    const relevant = filterRelevantArticles(articles);
    console.log(`📋 ${relevant.length} relevant articles after filtering`);

    // Save to database
    const result = await saveArticles(relevant);

    // Cleanup old articles
    await cleanupOldArticles();

    console.log('✅ News refresh complete');
    return result;
}

module.exports = {
    fetchFromNewsAPI,
    filterRelevantArticles,
    categorizeArticle,
    saveArticles,
    cleanupOldArticles,
    refreshNews
};
