const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Extract property search filters from natural language query
 */
async function extractSearchIntent(userMessage, conversationHistory = []) {
    const systemPrompt = `You are a property search assistant for RoomGi, a real estate platform in India.
Your job is to understand user queries and extract property search filters.

Available filters:
- city: string (Bangalore, Delhi, Mumbai, Pune, Hyderabad, Chennai)
- bedrooms: integer (1, 2, 3, 4+)
- min_price: integer (in rupees)
- max_price: integer (in rupees)
- property_type: string (apartment, villa, house, pg, hostel)
- listing_type: string (sale, rent)
- near_metro: boolean
- pet_friendly: boolean
- bachelor_friendly: boolean
- furnished: string (furnished, semi-furnished, unfurnished)
- locality: string (area name)

Price understanding:
- "20k" = 20000
- "20 lakhs" or "20L" = 2000000
- "1 crore" or "1Cr" = 10000000
- For rent: typically 5000-100000/month
- For sale: typically 20 lakhs - 5 crores

IMPORTANT: 
1. Return a JSON object with only the filters you can extract.
2. If asking about rent, set listing_type to "rent"
3. If asking to buy, set listing_type to "sale"
4. Consider conversation context for follow-up queries like "show cheaper" or "with parking"

Examples:
- "2BHK near metro under 20k" → {"bedrooms": 2, "near_metro": true, "max_price": 20000, "listing_type": "rent"}
- "Show me apartments in Bangalore for sale under 50 lakhs" → {"city": "Bangalore", "listing_type": "sale", "max_price": 5000000, "property_type": "apartment"}`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6), // Last 6 messages for context
        { role: 'user', content: userMessage }
    ];

    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            temperature: 0.1,
            max_tokens: 500,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content || '{}';
        const filters = JSON.parse(content);

        return {
            success: true,
            filters: filters,
            raw_response: content
        };
    } catch (error) {
        console.error('Groq API error:', error);
        return {
            success: false,
            filters: {},
            error: error.message
        };
    }
}

/**
 * Generate a friendly response based on search results
 */
async function generateResponse(userMessage, filters, resultsCount, conversationHistory = []) {
    const systemPrompt = `You are a friendly property search assistant for RoomGi.
Keep responses concise (max 2 sentences). Be helpful and natural.
If you found properties, tell the user how many you found.
If no properties found, suggest adjusting filters.
Never mention technical terms like "filters" or "database".`;

    const contextMessage = `User asked: "${userMessage}"
Extracted search criteria: ${JSON.stringify(filters)}
Properties found: ${resultsCount}`;

    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.slice(-4),
                { role: 'user', content: contextMessage }
            ],
            temperature: 0.7,
            max_tokens: 150
        });

        return response.choices[0]?.message?.content || `I found ${resultsCount} properties matching your criteria.`;
    } catch (error) {
        console.error('Groq response generation error:', error);
        if (resultsCount > 0) {
            return `I found ${resultsCount} properties matching your criteria!`;
        }
        return `I couldn't find exact matches. Try adjusting your requirements.`;
    }
}

module.exports = {
    extractSearchIntent,
    generateResponse
};
