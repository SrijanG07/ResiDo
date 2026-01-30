const Groq = require('groq-sdk');
const { Property } = require('../models');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Cache for property inventory
let propertyCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all properties from database for AI context
 */
async function getPropertyInventory() {
    const now = Date.now();

    // Return cached data if still valid
    if (propertyCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        return propertyCache;
    }

    try {
        const properties = await Property.findAll({
            attributes: ['id', 'title', 'city', 'locality', 'bedrooms', 'price', 'listing_type', 'property_type', 'near_metro', 'pet_friendly', 'bachelor_friendly', 'furnished'],
            where: { status: 'available' },
            raw: true
        });

        propertyCache = properties;
        cacheTimestamp = now;
        console.log(`Property cache loaded: ${properties.length} properties`);
        return properties;
    } catch (error) {
        console.error('Error fetching property inventory:', error);
        return [];
    }
}

/**
 * Parse user message locally to extract search criteria
 */
function parseMessageLocally(message) {
    const lowerMsg = message.toLowerCase();
    const filters = {};

    // Extract city
    const cities = ['bangalore', 'delhi', 'mumbai', 'pune', 'hyderabad', 'chennai', 'kolkata', 'ahmedabad', 'jaipur', 'chandigarh'];
    for (const city of cities) {
        if (lowerMsg.includes(city)) {
            filters.city = city.charAt(0).toUpperCase() + city.slice(1);
            break;
        }
    }

    // Extract bedrooms (BHK)
    const bhkMatch = lowerMsg.match(/(\d)\s*bhk/i);
    if (bhkMatch) {
        filters.bedrooms = parseInt(bhkMatch[1]);
    }

    // Extract price - handle lakhs (L) and thousands (k)
    const pricePatterns = [
        { regex: /under\s*(?:rs\.?|₹)?\s*(\d+)\s*l(?:akhs?)?/i, multiplier: 100000 },
        { regex: /below\s*(?:rs\.?|₹)?\s*(\d+)\s*l(?:akhs?)?/i, multiplier: 100000 },
        { regex: /(\d+)\s*l(?:akhs?)?\s*(?:or\s*)?(?:under|below|less)/i, multiplier: 100000 },
        { regex: /under\s*(?:rs\.?|₹)?\s*(\d+)\s*k/i, multiplier: 1000 },
        { regex: /below\s*(?:rs\.?|₹)?\s*(\d+)\s*k/i, multiplier: 1000 },
        { regex: /(\d+)\s*k/i, multiplier: 1000 }
    ];

    for (const pattern of pricePatterns) {
        const match = lowerMsg.match(pattern.regex);
        if (match) {
            filters.max_price = parseInt(match[1]) * pattern.multiplier;
            break;
        }
    }

    // Determine listing type
    if (lowerMsg.includes('rent') || lowerMsg.includes('pg') || lowerMsg.includes('hostel')) {
        filters.listing_type = 'rent';
    } else if (lowerMsg.includes('buy') || lowerMsg.includes('sale') || lowerMsg.includes('purchase')) {
        filters.listing_type = 'sale';
    }

    // Default: if price is under 100000, assume rent
    if (!filters.listing_type && filters.max_price) {
        filters.listing_type = filters.max_price <= 100000 ? 'rent' : 'sale';
    }

    // Furnished status
    if (lowerMsg.includes('furnished') && !lowerMsg.includes('unfurnished')) {
        filters.furnished = true;
    }

    // Special features
    if (lowerMsg.includes('metro')) filters.near_metro = true;
    if (lowerMsg.includes('pet')) filters.pet_friendly = true;
    if (lowerMsg.includes('bachelor')) filters.bachelor_friendly = true;

    return filters;
}

/**
 * Score a property based on how well it matches the filters
 * Higher score = better match
 */
function scoreProperty(property, filters) {
    let score = 0;
    let maxScore = 0;

    // City match (high priority)
    if (filters.city) {
        maxScore += 10;
        if (property.city.toLowerCase() === filters.city.toLowerCase()) {
            score += 10;
        }
    }

    // Bedrooms match
    if (filters.bedrooms) {
        maxScore += 5;
        if (property.bedrooms === filters.bedrooms) {
            score += 5;
        } else if (Math.abs(property.bedrooms - filters.bedrooms) === 1) {
            score += 2; // Close match
        }
    }

    // Price match
    if (filters.max_price) {
        maxScore += 5;
        if (property.price <= filters.max_price) {
            score += 5;
        } else if (property.price <= filters.max_price * 1.2) {
            score += 2; // Slightly over budget
        }
    }

    // Listing type match
    if (filters.listing_type) {
        maxScore += 8;
        if (property.listing_type === filters.listing_type) {
            score += 8;
        }
    }

    // Furnished match
    if (filters.furnished) {
        maxScore += 3;
        if (property.furnished === 'fully-furnished' || property.furnished === 'semi-furnished') {
            score += 3;
        }
    }

    // Special features
    if (filters.near_metro) {
        maxScore += 3;
        if (property.near_metro) score += 3;
    }
    if (filters.pet_friendly) {
        maxScore += 3;
        if (property.pet_friendly) score += 3;
    }
    if (filters.bachelor_friendly) {
        maxScore += 3;
        if (property.bachelor_friendly) score += 3;
    }

    return { score, maxScore, percentage: maxScore > 0 ? (score / maxScore) * 100 : 100 };
}

/**
 * Filter and rank properties based on criteria
 * More flexible - returns partial matches too
 */
function filterPropertiesFlexibly(properties, filters) {
    // Score all properties
    const scoredProperties = properties.map(p => ({
        ...p,
        matchScore: scoreProperty(p, filters)
    }));

    // Sort by score (descending)
    scoredProperties.sort((a, b) => b.matchScore.score - a.matchScore.score);

    // Filter to properties with at least some match (score > 0 or if no filters, just return top 6)
    const hasFilters = Object.keys(filters).length > 0;

    if (!hasFilters) {
        // No filters - return random 6 properties
        return scoredProperties.slice(0, 6);
    }

    // Return top matches with score > 0
    const matches = scoredProperties.filter(p => p.matchScore.score > 0);

    if (matches.length === 0) {
        // No matches at all - return top 6 anyway as suggestions
        console.log('No exact matches, returning top suggestions');
        return scoredProperties.slice(0, 6);
    }

    return matches.slice(0, 6);
}

/**
 * Extract property search filters and find matching properties from inventory
 */
async function extractSearchIntent(userMessage, conversationHistory = []) {
    // Get all properties from database
    const allProperties = await getPropertyInventory();

    if (allProperties.length === 0) {
        console.error('No properties in database!');
        return {
            success: false,
            matching_ids: [],
            filters: {},
            ai_message: 'No properties available in the database.',
            fallback: true
        };
    }

    // Use local parsing (reliable, no API dependency)
    const filters = parseMessageLocally(userMessage);
    console.log('Parsed filters:', filters);

    const matchingProperties = filterPropertiesFlexibly(allProperties, filters);
    const matchingIds = matchingProperties.map(p => p.id);

    console.log(`Found ${matchingIds.length} properties matching criteria`);

    // Generate appropriate message
    let message;
    if (matchingIds.length > 0) {
        const cityInfo = filters.city ? ` in ${filters.city}` : '';
        const bhkInfo = filters.bedrooms ? `${filters.bedrooms}BHK ` : '';
        message = `Found ${matchingIds.length} ${bhkInfo}properties${cityInfo}!`;
    } else {
        message = 'No properties found. Try different criteria.';
    }

    return {
        success: true,
        matching_ids: matchingIds,
        filters: filters,
        ai_message: message,
        fallback: true
    };
}

/**
 * Generate a friendly response based on search results
 */
async function generateResponse(userMessage, filters, properties, conversationHistory = []) {
    if (properties.length === 0) {
        return `I couldn't find exact matches. Here are some suggestions: try searching in a specific city like "apartments in Bangalore" or "2BHK in Mumbai for rent".`;
    }

    const cityInfo = filters.city ? ` in ${filters.city}` : '';
    const bhkInfo = filters.bedrooms ? `${filters.bedrooms}BHK ` : '';
    const priceInfo = filters.max_price
        ? (filters.max_price >= 100000
            ? ` under ₹${(filters.max_price / 100000).toFixed(0)}L`
            : ` under ₹${(filters.max_price / 1000).toFixed(0)}k`)
        : '';

    return `I found ${properties.length} ${bhkInfo}properties${cityInfo}${priceInfo}! Here are the best matches:`;
}

module.exports = {
    extractSearchIntent,
    generateResponse,
    getPropertyInventory
};
