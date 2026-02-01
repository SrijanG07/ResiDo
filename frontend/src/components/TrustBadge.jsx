import React, { useState, useEffect } from 'react';
import './TrustBadge.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function TrustBadge({ propertyId, size = 'normal' }) {
    const [trustData, setTrustData] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrustScore();
    }, [propertyId]);

    const fetchTrustScore = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/fraud/property/${propertyId}/trust-score`);
            if (response.ok) {
                const data = await response.json();
                setTrustData(data);
            }
        } catch (error) {
            console.error('Failed to fetch trust score:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !trustData) {
        return null;
    }

    const { trustScore, trustLevel, riskFactors, recommendation } = trustData;

    const getColorClass = () => {
        if (trustScore >= 80) return 'high';
        if (trustScore >= 60) return 'medium';
        if (trustScore >= 40) return 'low';
        return 'very-low';
    };

    const getIcon = () => {
        if (trustScore >= 80) return '✓';
        if (trustScore >= 60) return '!';
        if (trustScore >= 40) return '⚠';
        return '✕';
    };

    const getLabel = () => {
        if (trustScore >= 80) return 'Verified';
        if (trustScore >= 60) return 'Trusted';
        if (trustScore >= 40) return 'Caution';
        return 'Risk';
    };

    return (
        <div className={`trust-badge ${getColorClass()} ${size}`}>
            <div 
                className="badge-main" 
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
            >
                <span className="badge-icon">{getIcon()}</span>
                <span className="badge-score">{trustScore}</span>
                <span className="badge-label">{getLabel()}</span>
            </div>

            {showDetails && (
                <div className="trust-tooltip">
                    <div className="tooltip-header">
                        <span className="tooltip-title">Trust Analysis</span>
                        <div className={`score-circle ${getColorClass()}`}>
                            {trustScore}
                        </div>
                    </div>

                    {riskFactors && riskFactors.length > 0 && (
                        <div className="risk-factors">
                            <span className="factors-title">Risk Factors:</span>
                            <ul>
                                {riskFactors.map((factor, idx) => (
                                    <li key={idx}>
                                        <span className="factor-type">
                                            {factor.type.replace(/_/g, ' ')}
                                        </span>
                                        <span className="factor-msg">{factor.message}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="recommendation">
                        {recommendation}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TrustBadge;
