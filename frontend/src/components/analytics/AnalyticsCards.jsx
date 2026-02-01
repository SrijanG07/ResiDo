/**
 * Analytics Card Components
 * Reusable card UI elements for the dashboard
 */
import React from 'react';
import { SparklineChart } from './AnalyticsCharts';
import { getGrowthColor, getRatingColor, getHotnessColor } from '../../utils/analyticsUtils';
import './AnalyticsCards.css';

/**
 * Stat Card - Shows a key metric with trend
 */
export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon,
  sparklineData,
  color,
  size = 'normal'
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getTrendClass = () => {
    if (trend === 'up') return 'trend-up';
    if (trend === 'down') return 'trend-down';
    return 'trend-stable';
  };

  return (
    <div className={`stat-card ${size}`}>
      <div className="stat-card__header">
        {icon && <span className="stat-card__icon">{icon}</span>}
        <span className="stat-card__title">{title}</span>
      </div>
      <div className="stat-card__body">
        <div className="stat-card__value-section">
          <span className="stat-card__value" style={{ color }}>{value}</span>
          {trendValue && (
            <span className={`stat-card__trend ${getTrendClass()}`}>
              {getTrendIcon()} {trendValue}
            </span>
          )}
        </div>
        {sparklineData && (
          <div className="stat-card__sparkline">
            <SparklineChart data={sparklineData} color="auto" width={80} height={30} />
          </div>
        )}
      </div>
      {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
    </div>
  );
};

/**
 * City Card - Shows city overview with key metrics
 */
export const CityCard = ({ 
  city, 
  state,
  avgPrice, 
  growth, 
  demandIndex,
  supplyIndex,
  rentalYield,
  rating,
  sentiment,
  onClick,
  isSelected
}) => {
  return (
    <div 
      className={`city-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="city-card__header">
        <div>
          <h3 className="city-card__name">{city}</h3>
          <span className="city-card__state">{state}</span>
        </div>
        <span 
          className="city-card__rating"
          style={{ background: getRatingColor(rating) }}
        >
          {rating}
        </span>
      </div>
      
      <div className="city-card__price">
        <span className="price-value">₹{avgPrice.toLocaleString()}</span>
        <span className="price-unit">/sq.ft</span>
        <span 
          className="price-growth"
          style={{ color: getGrowthColor(growth) }}
        >
          {growth > 0 ? '+' : ''}{growth}%
        </span>
      </div>
      
      <div className="city-card__metrics">
        <div className="metric">
          <span className="metric-label">Demand</span>
          <div className="metric-bar">
            <div 
              className="metric-fill demand"
              style={{ width: `${demandIndex}%` }}
            ></div>
          </div>
          <span className="metric-value">{demandIndex}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Supply</span>
          <div className="metric-bar">
            <div 
              className="metric-fill supply"
              style={{ width: `${supplyIndex}%` }}
            ></div>
          </div>
          <span className="metric-value">{supplyIndex}</span>
        </div>
      </div>
      
      <div className="city-card__footer">
        <div className="footer-item">
          <span className="footer-label">Rental Yield</span>
          <span className="footer-value">{rentalYield}%</span>
        </div>
        <div className="footer-item">
          <span className="footer-label">Sentiment</span>
          <span className={`footer-sentiment ${sentiment.toLowerCase().replace(' ', '-')}`}>
            {sentiment}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Locality Hot Card - Shows hot locality with score
 */
export const LocalityHotCard = ({ 
  locality, 
  city, 
  hotnessScore, 
  priceGrowth, 
  demand,
  avgPrice,
  upcomingProjects
}) => {
  return (
    <div className="locality-hot-card">
      <div className="locality-hot-card__header">
        <div className="hotness-indicator" style={{ background: getHotnessColor(demand) }}>
          <span className="hotness-score">{hotnessScore}</span>
        </div>
        <div className="locality-info">
          <h4 className="locality-name">{locality}</h4>
          <span className="locality-city">{city}</span>
        </div>
        <span className={`demand-badge ${demand.toLowerCase().replace(' ', '-')}`}>
          {demand}
        </span>
      </div>
      
      <div className="locality-hot-card__stats">
        <div className="hot-stat">
          <span className="hot-stat-value">₹{avgPrice?.toLocaleString()}</span>
          <span className="hot-stat-label">per sq.ft</span>
        </div>
        <div className="hot-stat">
          <span className="hot-stat-value" style={{ color: getGrowthColor(priceGrowth) }}>
            +{priceGrowth}%
          </span>
          <span className="hot-stat-label">YoY Growth</span>
        </div>
        <div className="hot-stat">
          <span className="hot-stat-value">{upcomingProjects}</span>
          <span className="hot-stat-label">New Projects</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Investment Card - Shows investment recommendation
 */
export const InvestmentCard = ({ 
  city, 
  rentalYield, 
  capitalAppreciation, 
  investmentScore, 
  recommendation 
}) => {
  const getScoreGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: '#10b981' };
    if (score >= 80) return { grade: 'A', color: '#22c55e' };
    if (score >= 70) return { grade: 'B+', color: '#84cc16' };
    if (score >= 60) return { grade: 'B', color: '#eab308' };
    return { grade: 'C', color: '#f59e0b' };
  };

  const scoreInfo = getScoreGrade(investmentScore);

  return (
    <div className="investment-card">
      <div className="investment-card__header">
        <h4 className="investment-city">{city}</h4>
        <div className="investment-score" style={{ borderColor: scoreInfo.color }}>
          <span className="score-grade" style={{ color: scoreInfo.color }}>
            {scoreInfo.grade}
          </span>
          <span className="score-value">{investmentScore}</span>
        </div>
      </div>
      
      <div className="investment-card__metrics">
        <div className="inv-metric">
          <div className="inv-metric-header">
            <span className="inv-metric-icon">💰</span>
            <span className="inv-metric-label">Rental Yield</span>
          </div>
          <span className="inv-metric-value">{rentalYield}%</span>
        </div>
        <div className="inv-metric">
          <div className="inv-metric-header">
            <span className="inv-metric-icon">📈</span>
            <span className="inv-metric-label">Capital Appreciation</span>
          </div>
          <span className="inv-metric-value" style={{ color: getGrowthColor(capitalAppreciation) }}>
            {capitalAppreciation}%
          </span>
        </div>
      </div>
      
      <div className="investment-card__recommendation">
        <span className="recommendation-icon">💡</span>
        <span className="recommendation-text">{recommendation}</span>
      </div>
    </div>
  );
};

/**
 * Property Type Card
 */
export const PropertyTypeCard = ({ 
  name, 
  icon, 
  marketShare, 
  avgPrice, 
  growth,
  avgTicketSize,
  isSelected,
  onClick
}) => {
  return (
    <div 
      className={`property-type-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="property-type-card__icon">{icon}</div>
      <h4 className="property-type-card__name">{name}</h4>
      <div className="property-type-card__share">
        <div className="share-bar">
          <div 
            className="share-fill" 
            style={{ width: `${marketShare}%` }}
          ></div>
        </div>
        <span className="share-value">{marketShare}% Market Share</span>
      </div>
      <div className="property-type-card__stats">
        <div className="type-stat">
          <span className="type-stat-value">₹{avgPrice.toLocaleString()}</span>
          <span className="type-stat-label">/sq.ft avg</span>
        </div>
        <div className="type-stat">
          <span className="type-stat-value" style={{ color: getGrowthColor(growth) }}>
            +{growth}%
          </span>
          <span className="type-stat-label">YoY</span>
        </div>
      </div>
      {avgTicketSize && (
        <div className="property-type-card__ticket">
          Avg. Ticket: {avgTicketSize}
        </div>
      )}
    </div>
  );
};

/**
 * Comparison Card
 */
export const ComparisonCard = ({ cities, metric, unit }) => {
  const maxValue = Math.max(...cities.map(c => c.value));
  
  return (
    <div className="comparison-card">
      <h4 className="comparison-card__title">{metric}</h4>
      <div className="comparison-card__items">
        {cities.map((city, index) => (
          <div key={city.name} className="comparison-item">
            <div className="comparison-item__header">
              <span className="comparison-rank">#{index + 1}</span>
              <span className="comparison-name">{city.name}</span>
              <span className="comparison-value">
                {unit === '₹' ? `₹${city.value.toLocaleString()}` : `${city.value}${unit}`}
              </span>
            </div>
            <div className="comparison-bar">
              <div 
                className="comparison-fill"
                style={{ 
                  width: `${(city.value / maxValue) * 100}%`,
                  background: index === 0 ? '#c9a962' : index === 1 ? '#3b82f6' : '#64748b'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Info Tooltip
 */
export const InfoTooltip = ({ text }) => {
  return (
    <span className="info-tooltip">
      <span className="info-icon">ℹ️</span>
      <span className="info-text">{text}</span>
    </span>
  );
};

/**
 * Skeleton Loader for cards
 */
export const SkeletonCard = ({ type = 'stat' }) => {
  if (type === 'chart') {
    return (
      <div className="skeleton-card skeleton-chart">
        <div className="skeleton-title"></div>
        <div className="skeleton-chart-area"></div>
      </div>
    );
  }
  
  return (
    <div className="skeleton-card">
      <div className="skeleton-title"></div>
      <div className="skeleton-value"></div>
      <div className="skeleton-subtitle"></div>
    </div>
  );
};

export default {
  StatCard,
  CityCard,
  LocalityHotCard,
  InvestmentCard,
  PropertyTypeCard,
  ComparisonCard,
  InfoTooltip,
  SkeletonCard
};
