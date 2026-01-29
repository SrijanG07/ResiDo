/**
 * Price Prediction Service
 * ML-style regression model for Indian real estate market
 */

// City-wise base prices per sq.ft (in INR)
const CITY_BASE_PRICES = {
    'Mumbai': 25000,
    'Delhi': 18000,
    'Bangalore': 12000,
    'Hyderabad': 8000,
    'Chennai': 9000,
    'Pune': 10000,
    'Kolkata': 7000,
    'default': 8000
};

// Locality multipliers (premium areas)
const LOCALITY_MULTIPLIERS = {
    // Mumbai
    'Bandra': 1.8, 'Juhu': 2.0, 'Powai': 1.4, 'Andheri': 1.3,
    // Bangalore
    'Koramangala': 1.5, 'Indiranagar': 1.6, 'Whitefield': 1.2, 'HSR Layout': 1.3, 'Jayanagar': 1.4,
    // Delhi
    'South Delhi': 1.7, 'Dwarka': 1.2, 'Gurgaon': 1.4, 'Noida': 1.1,
    // Hyderabad
    'Banjara Hills': 1.6, 'Jubilee Hills': 1.7, 'Gachibowli': 1.3, 'Hitech City': 1.4,
    'default': 1.0
};

// Property type multipliers
const PROPERTY_TYPE_MULTIPLIERS = {
    'villa': 1.5,
    'home': 1.2,
    'flat': 1.0,
    'commercial': 1.3,
    'plot': 0.6,
    'pg': 0.4,
    'hostel': 0.4,
    'room': 0.3
};

// Feature coefficients
const FEATURE_COEFFICIENTS = {
    bedroom: 500000,      // Per bedroom premium
    bathroom: 200000,     // Per bathroom premium
    furnished: {
        'unfurnished': 0,
        'semi-furnished': 300000,
        'fully-furnished': 600000
    },
    amenities: {
        'gym': 100000,
        'swimming_pool': 200000,
        'parking': 150000,
        'security': 100000,
        'power_backup': 80000,
        'lift': 120000,
        'garden': 100000,
        'clubhouse': 150000
    },
    near_metro: 300000,
    pet_friendly: 50000,
    bachelor_friendly: -50000,  // Usually lower demand
    age_depreciation: 0.02     // 2% per year
};

class PricePredictionService {
    /**
     * Predict property price based on features
     * @param {Object} propertyData - Property features
     * @returns {Object} Prediction result with confidence
     */
    static predict(propertyData) {
        try {
            const {
                city = 'Bangalore',
                locality = '',
                property_type = 'flat',
                size = 1000,
                bedrooms = 2,
                bathrooms = 1,
                furnished = 'unfurnished',
                amenities = [],
                near_metro = false,
                pet_friendly = false,
                bachelor_friendly = true,
                building_age = 0,
                listing_type = 'sale'
            } = propertyData;

            // Base calculation
            const cityBase = CITY_BASE_PRICES[city] || CITY_BASE_PRICES['default'];
            const localityMultiplier = LOCALITY_MULTIPLIERS[locality] || LOCALITY_MULTIPLIERS['default'];
            const typeMultiplier = PROPERTY_TYPE_MULTIPLIERS[property_type] || 1.0;

            // Calculate base price
            let predictedPrice = size * cityBase * localityMultiplier * typeMultiplier;

            // Add bedroom/bathroom premiums
            predictedPrice += (bedrooms || 0) * FEATURE_COEFFICIENTS.bedroom;
            predictedPrice += (bathrooms || 0) * FEATURE_COEFFICIENTS.bathroom;

            // Furnished status
            predictedPrice += FEATURE_COEFFICIENTS.furnished[furnished] || 0;

            // Amenities
            if (Array.isArray(amenities)) {
                amenities.forEach(amenity => {
                    const amenityValue = FEATURE_COEFFICIENTS.amenities[amenity.toLowerCase().replace(' ', '_')];
                    if (amenityValue) predictedPrice += amenityValue;
                });
            }

            // Location features
            if (near_metro) predictedPrice += FEATURE_COEFFICIENTS.near_metro;
            if (pet_friendly) predictedPrice += FEATURE_COEFFICIENTS.pet_friendly;
            if (bachelor_friendly) predictedPrice += FEATURE_COEFFICIENTS.bachelor_friendly;

            // Age depreciation
            if (building_age > 0) {
                predictedPrice *= (1 - (building_age * FEATURE_COEFFICIENTS.age_depreciation));
            }

            // For rent, calculate monthly rent (typically 0.3-0.5% of property value)
            if (listing_type === 'rent') {
                predictedPrice = Math.round(predictedPrice * 0.004); // 0.4% of value as monthly rent
            }

            // Calculate confidence based on data completeness
            const confidence = this.calculateConfidence(propertyData);

            // Market comparison
            const marketComparison = this.getMarketComparison(predictedPrice, city, property_type, size);

            // Price range (±10%)
            const priceRange = {
                low: Math.round(predictedPrice * 0.9),
                high: Math.round(predictedPrice * 1.1)
            };

            return {
                success: true,
                predictedPrice: Math.round(predictedPrice),
                priceRange,
                confidence,
                marketComparison,
                factors: this.getPriceFactors(propertyData)
            };
        } catch (error) {
            console.error('Price prediction error:', error);
            return {
                success: false,
                error: 'Failed to predict price'
            };
        }
    }

    /**
     * Calculate confidence score based on input data completeness
     */
    static calculateConfidence(data) {
        let score = 50; // Base confidence

        if (data.city) score += 10;
        if (data.locality) score += 10;
        if (data.size > 0) score += 10;
        if (data.bedrooms > 0) score += 5;
        if (data.bathrooms > 0) score += 5;
        if (data.furnished) score += 5;
        if (data.amenities?.length > 0) score += 5;

        return Math.min(score, 95); // Max 95% confidence
    }

    /**
     * Get market comparison data
     */
    static getMarketComparison(price, city, propertyType, size) {
        const baseAvg = (CITY_BASE_PRICES[city] || CITY_BASE_PRICES['default']) * size;
        const percentDiff = ((price - baseAvg) / baseAvg) * 100;

        let status, message;
        if (percentDiff > 20) {
            status = 'above_market';
            message = 'Premium property - priced above market average';
        } else if (percentDiff < -20) {
            status = 'below_market';
            message = 'Great value - priced below market average';
        } else {
            status = 'at_market';
            message = 'Priced at market rate';
        }

        return {
            status,
            message,
            percentFromAverage: Math.round(percentDiff),
            cityAverage: Math.round(baseAvg)
        };
    }

    /**
     * Get breakdown of price factors
     */
    static getPriceFactors(data) {
        const factors = [];
        
        if (data.city) {
            factors.push({
                factor: 'City',
                value: data.city,
                impact: CITY_BASE_PRICES[data.city] > 10000 ? 'high' : 'medium'
            });
        }
        
        if (data.locality && LOCALITY_MULTIPLIERS[data.locality]) {
            factors.push({
                factor: 'Premium Locality',
                value: data.locality,
                impact: 'high'
            });
        }

        if (data.near_metro) {
            factors.push({
                factor: 'Metro Proximity',
                value: 'Near Metro Station',
                impact: 'medium'
            });
        }

        if (data.furnished === 'fully-furnished') {
            factors.push({
                factor: 'Furnished',
                value: 'Fully Furnished',
                impact: 'medium'
            });
        }

        return factors;
    }
}

module.exports = PricePredictionService;
