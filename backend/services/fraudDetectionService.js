/**
 * Fraud Detection Service
 * Analyzes property listings for potential fraud indicators
 */

const { Property } = require('../models');
const { Op } = require('sequelize');

// Price thresholds by city (per sq.ft)
const CITY_PRICE_RANGES = {
    'Mumbai': { min: 10000, max: 80000 },
    'Delhi': { min: 8000, max: 50000 },
    'Bangalore': { min: 5000, max: 30000 },
    'Hyderabad': { min: 3000, max: 20000 },
    'Chennai': { min: 4000, max: 25000 },
    'Pune': { min: 4000, max: 25000 },
    'Kolkata': { min: 3000, max: 18000 },
    'default': { min: 2000, max: 20000 }
};

class FraudDetectionService {
    /**
     * Analyze a property for fraud indicators
     * @param {Object} property - Property data
     * @returns {Object} Trust analysis result
     */
    static async analyze(property) {
        try {
            const riskFactors = [];
            let trustScore = 100; // Start with perfect score

            // 1. Price Anomaly Check
            const priceCheck = this.checkPriceAnomaly(property);
            if (priceCheck.isAnomalous) {
                riskFactors.push(priceCheck);
                trustScore -= priceCheck.severity;
            }

            // 2. Description Quality Check
            const descCheck = this.checkDescriptionQuality(property);
            if (descCheck.isRisky) {
                riskFactors.push(descCheck);
                trustScore -= descCheck.severity;
            }

            // 3. Image Analysis (placeholder - would need ML in production)
            const imageCheck = this.checkImages(property);
            if (imageCheck.isRisky) {
                riskFactors.push(imageCheck);
                trustScore -= imageCheck.severity;
            }

            // 4. Owner Verification Status
            const ownerCheck = await this.checkOwnerVerification(property);
            if (!ownerCheck.isVerified) {
                riskFactors.push(ownerCheck);
                trustScore -= ownerCheck.severity;
            }

            // 5. Market Comparison
            const marketCheck = await this.compareToMarket(property);
            if (marketCheck.isOutlier) {
                riskFactors.push(marketCheck);
                trustScore -= marketCheck.severity;
            }

            // Ensure score is within bounds
            trustScore = Math.max(0, Math.min(100, trustScore));

            return {
                success: true,
                trustScore,
                trustLevel: this.getTrustLevel(trustScore),
                riskFactors,
                recommendation: this.getRecommendation(trustScore, riskFactors)
            };
        } catch (error) {
            console.error('Fraud detection error:', error);
            return {
                success: false,
                trustScore: 50,
                trustLevel: 'unknown',
                riskFactors: [],
                error: 'Unable to complete fraud analysis'
            };
        }
    }

    /**
     * Check for price anomalies
     */
    static checkPriceAnomaly(property) {
        const { price, size, city } = property;
        const pricePerSqFt = price / (size || 1);
        const cityRange = CITY_PRICE_RANGES[city] || CITY_PRICE_RANGES['default'];

        if (pricePerSqFt < cityRange.min * 0.5) {
            return {
                type: 'price_too_low',
                message: 'Price is suspiciously low for this area',
                isAnomalous: true,
                severity: 25
            };
        }

        if (pricePerSqFt > cityRange.max * 1.5) {
            return {
                type: 'price_too_high',
                message: 'Price is unusually high for this area',
                isAnomalous: true,
                severity: 15
            };
        }

        return { isAnomalous: false };
    }

    /**
     * Check description quality for spam/fraud indicators
     */
    static checkDescriptionQuality(property) {
        const { description, title } = property;
        const spamKeywords = ['urgent', 'limited time', 'act now', 'guaranteed', 'too good'];
        const text = `${title} ${description}`.toLowerCase();

        const hasSpamKeywords = spamKeywords.some(keyword => text.includes(keyword));
        const isTooShort = (description || '').length < 30;
        const hasContactInfo = /\b\d{10}\b/.test(text) || /@/.test(text);

        if (hasSpamKeywords) {
            return {
                type: 'spam_content',
                message: 'Description contains marketing spam language',
                isRisky: true,
                severity: 10
            };
        }

        if (isTooShort) {
            return {
                type: 'insufficient_description',
                message: 'Property description is too short',
                isRisky: true,
                severity: 5
            };
        }

        if (hasContactInfo) {
            return {
                type: 'contact_in_description',
                message: 'Contains personal contact info in description',
                isRisky: true,
                severity: 10
            };
        }

        return { isRisky: false };
    }

    /**
     * Analyze images (placeholder for ML-based detection)
     */
    static checkImages(property) {
        const images = property.images || [];
        
        if (images.length === 0) {
            return {
                type: 'no_images',
                message: 'No property images provided',
                isRisky: true,
                severity: 15
            };
        }

        if (images.length === 1) {
            return {
                type: 'few_images',
                message: 'Only one image provided',
                isRisky: true,
                severity: 5
            };
        }

        // In production, would use image analysis APIs to detect:
        // - Stock photos
        // - Duplicate images across listings
        // - Image manipulation/editing
        // - Watermarks from other sites

        return { isRisky: false };
    }

    /**
     * Check owner verification status
     */
    static async checkOwnerVerification(property) {
        // Assuming owner info comes with property or needs to be fetched
        const isVerified = property.owner?.is_verified || false;

        if (!isVerified) {
            return {
                type: 'unverified_owner',
                message: 'Property owner is not verified',
                isVerified: false,
                severity: 10
            };
        }

        return { isVerified: true };
    }

    /**
     * Compare to similar properties in the market
     */
    static async compareToMarket(property) {
        try {
            // Find similar properties
            const similarProperties = await Property.findAll({
                where: {
                    city: property.city,
                    property_type: property.property_type,
                    id: { [Op.ne]: property.id || 0 }
                },
                limit: 10
            });

            if (similarProperties.length < 3) {
                return { isOutlier: false };
            }

            // Calculate average price per sq.ft
            const avgPricePerSqFt = similarProperties.reduce((sum, p) => {
                return sum + (p.price / (p.size || 1));
            }, 0) / similarProperties.length;

            const propertyPricePerSqFt = property.price / (property.size || 1);
            const deviation = ((propertyPricePerSqFt - avgPricePerSqFt) / avgPricePerSqFt) * 100;

            if (Math.abs(deviation) > 50) {
                return {
                    type: 'market_outlier',
                    message: `Price differs ${Math.round(Math.abs(deviation))}% from similar properties`,
                    isOutlier: true,
                    severity: 15,
                    deviation: Math.round(deviation)
                };
            }

            return { isOutlier: false };
        } catch (error) {
            console.error('Market comparison error:', error);
            return { isOutlier: false };
        }
    }

    /**
     * Get trust level from score
     */
    static getTrustLevel(score) {
        if (score >= 80) return 'high';
        if (score >= 60) return 'medium';
        if (score >= 40) return 'low';
        return 'very_low';
    }

    /**
     * Get recommendation based on analysis
     */
    static getRecommendation(score, riskFactors) {
        if (score >= 80) {
            return 'This property appears trustworthy. Standard precautions recommended.';
        }
        if (score >= 60) {
            return 'Some minor concerns detected. Verify details before proceeding.';
        }
        if (score >= 40) {
            return 'Multiple risk factors detected. Exercise caution and verify thoroughly.';
        }
        return 'High risk property. We recommend additional verification before contacting.';
    }
}

module.exports = FraudDetectionService;
