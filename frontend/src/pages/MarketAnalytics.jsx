/**
 * Market Analytics Dashboard
 * Comprehensive Real Estate Market Analytics - 100% Frontend
 * No backend dependencies
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  cityMarketData, 
  localityData, 
  propertyTypeAnalytics,
  investmentInsights,
  marketForecast,
  marketSummary,
  buyerPreferences,
  hotLocalities 
} from '../data/marketAnalyticsData';
import { 
  LineChart, 
  BarChart, 
  DonutChart, 
  GaugeChart 
} from '../components/analytics/AnalyticsCharts';
import {
  StatCard,
  CityCard,
  LocalityHotCard,
  InvestmentCard,
  PropertyTypeCard,
  ComparisonCard,
  SkeletonCard
} from '../components/analytics/AnalyticsCards';
import { 
  formatNumber, 
  getGrowthColor, 
  projectLinearTrend,
  calculateYoYGrowth 
} from '../utils/analyticsUtils';
import './MarketAnalytics.css';

const MarketAnalytics = ({ onNavigate }) => {
  // State Management
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [yearRange, setYearRange] = useState([2020, 2025]);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedCities, setComparedCities] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');

  // Simulate loading for realistic UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Memoized city data
  const currentCityData = useMemo(() => {
    return cityMarketData.find(city => city.city === selectedCity) || cityMarketData[0];
  }, [selectedCity]);

  // Memoized locality data for selected city
  const currentLocalityData = useMemo(() => {
    return localityData[selectedCity] || [];
  }, [selectedCity]);

  // Filter price trends by year range
  const filteredPriceTrend = useMemo(() => {
    if (!currentCityData) return [];
    const startIdx = currentCityData.years.indexOf(yearRange[0]);
    const endIdx = currentCityData.years.indexOf(yearRange[1]);
    return currentCityData.priceTrend.slice(startIdx, endIdx + 1);
  }, [currentCityData, yearRange]);

  // Comparison data
  const comparisonData = useMemo(() => {
    if (!compareMode || comparedCities.length === 0) return null;
    return cityMarketData.filter(city => comparedCities.includes(city.city));
  }, [compareMode, comparedCities]);

  // Handle city comparison toggle
  const toggleCityComparison = useCallback((cityName) => {
    setComparedCities(prev => {
      if (prev.includes(cityName)) {
        return prev.filter(c => c !== cityName);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), cityName];
      }
      return [...prev, cityName];
    });
  }, []);

  // Get forecast data
  const forecastData = useMemo(() => {
    const cityForecast = marketForecast.byCity[selectedCity];
    if (!cityForecast) return null;
    
    const historicalData = currentCityData?.priceTrend || [];
    const projections = projectLinearTrend(historicalData, 3);
    
    return {
      historical: historicalData,
      projected: [cityForecast.forecast2026, cityForecast.forecast2027, cityForecast.forecast2028],
      years: [...(currentCityData?.years || []), 2026, 2027, 2028]
    };
  }, [selectedCity, currentCityData]);

  // Navigation scroll handler
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="market-analytics">
        <div className="analytics-header">
          <div className="analytics-header__content">
            <h1 className="analytics-title">Market Analytics</h1>
            <p className="analytics-subtitle">Loading market data...</p>
          </div>
        </div>
        <div className="analytics-container">
          <div className="analytics-grid loading">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} type={i > 3 ? 'chart' : 'stat'} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="market-analytics">
      {/* Header */}
      <header className="analytics-header">
        <div className="analytics-header__content">
          <div className="header-left">
            <button className="back-button" onClick={() => onNavigate('home')}>
              ← Back
            </button>
            <div>
              <h1 className="analytics-title">
                Market Analytics
              </h1>
              <p className="analytics-subtitle">
                Real-time insights into India's real estate market
              </p>
            </div>
          </div>
          <div className="header-right">
            <span className="last-updated">
              Last updated: {marketSummary.lastUpdated}
            </span>
          </div>
        </div>
        
        {/* Navigation Pills */}
        <nav className="analytics-nav">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'cities', label: 'City Analysis' },
            { id: 'trends', label: 'Price Trends' },
            { id: 'comparison', label: 'Compare' },
            { id: 'investment', label: 'Investment' },
            { id: 'forecast', label: 'Forecast' }
          ].map(item => (
            <button 
              key={item.id}
              className={`nav-pill ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Disclaimer Banner */}
      <div className="disclaimer-banner">
        <span className="disclaimer-text">
          Data is indicative and for informational purposes only. Actual prices may vary.
        </span>
      </div>

      {/* Sticky Filter Panel */}
      <div className="filter-panel">
        <div className="filter-group">
          <label className="filter-label">City</label>
          <select 
            className="filter-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cityMarketData.map(city => (
              <option key={city.city} value={city.city}>{city.city}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Property Type</label>
          <select 
            className="filter-select"
            value={selectedPropertyType}
            onChange={(e) => setSelectedPropertyType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Year Range</label>
          <div className="year-range">
            <select 
              className="filter-select small"
              value={yearRange[0]}
              onChange={(e) => setYearRange([parseInt(e.target.value), yearRange[1]])}
            >
              {[2020, 2021, 2022, 2023, 2024].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <span className="range-separator">to</span>
            <select 
              className="filter-select small"
              value={yearRange[1]}
              onChange={(e) => setYearRange([yearRange[0], parseInt(e.target.value)])}
            >
              {[2021, 2022, 2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          className={`compare-toggle ${compareMode ? 'active' : ''}`}
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? '✓ Compare Mode' : 'Compare Cities'}
        </button>
      </div>

      <main className="analytics-container">
        {/* Section 1: Market Overview */}
        <section id="overview" className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">Market Overview</h2>
            <p className="section-description">
              Key metrics for India's real estate market
            </p>
          </div>
          
          <div className="overview-stats-grid">
            <StatCard 
              title="Total Market Size"
              value={marketSummary.totalMarketSize}
              subtitle="Indian Real Estate Market 2025"
              color="#1e3a5f"
            />
            <StatCard 
              title="Total Transactions"
              value={formatNumber(marketSummary.totalTransactions)}
              subtitle="Properties sold in 2025"
              trend="up"
              trendValue="+12.4%"
              color="#0f766e"
            />
            <StatCard 
              title="Avg. Price (National)"
              value={`₹${formatNumber(marketSummary.avgNationalPrice)}`}
              subtitle="Per sq.ft across major cities"
              trend="up"
              trendValue={`+${marketSummary.yoyNationalGrowth}%`}
              sparklineData={[5800, 6100, 6500, 6900, 7200]}
              color="#7c3aed"
            />
            <StatCard 
              title="Market Sentiment"
              value={marketSummary.marketTrend}
              subtitle={`Top performer: ${marketSummary.topGrowingCity}`}
              color="#10b981"
            />
          </div>

          {/* Buyer Preferences */}
          <div className="subsection">
            <h3 className="subsection-title">Buyer Preferences</h3>
            <div className="preferences-grid">
              <div className="preference-chart">
                <DonutChart 
                  data={buyerPreferences.propertySize.map(p => p.share)}
                  labels={buyerPreferences.propertySize.map(p => p.type)}
                  title="Property Size Preference"
                  size={180}
                  thickness={35}
                />
              </div>
              <div className="preference-chart">
                <DonutChart 
                  data={buyerPreferences.buyerType.map(p => p.share)}
                  labels={buyerPreferences.buyerType.map(p => p.type)}
                  title="Buyer Demographics"
                  size={180}
                  thickness={35}
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']}
                />
              </div>
              <div className="preference-chart budget-distribution">
                <h4 className="chart-title">Budget Distribution</h4>
                <div className="budget-bars">
                  {buyerPreferences.budgetSegments.map((segment, i) => (
                    <div key={segment.range} className="budget-bar-item">
                      <div className="budget-bar-header">
                        <span className="budget-range">{segment.range}</span>
                        <span className="budget-share">{segment.share}%</span>
                      </div>
                      <div className="budget-bar-track">
                        <div 
                          className="budget-bar-fill"
                          style={{ 
                            width: `${segment.share}%`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      </div>
                      <span className={`budget-trend ${segment.trend}`}>
                        {segment.trend === 'growing' ? '↑' : '→'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: City-Wise Analysis */}
        <section id="cities" className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">City-Wise Market Overview</h2>
            <p className="section-description">
              Compare real estate metrics across major Indian cities
            </p>
          </div>
          
          <div className="city-cards-grid">
            {cityMarketData.slice(0, 8).map(city => (
              <CityCard 
                key={city.city}
                city={city.city}
                state={city.state}
                avgPrice={city.avgPricePerSqFt}
                growth={city.yoyGrowth}
                demandIndex={city.demandIndex}
                supplyIndex={city.supplyIndex}
                rentalYield={city.rentalYield}
                rating={city.investmentRating}
                sentiment={city.marketSentiment}
                isSelected={selectedCity === city.city}
                onClick={() => setSelectedCity(city.city)}
              />
            ))}
          </div>

          {/* Selected City Details */}
          <div className="city-details-panel">
            <div className="city-details-header">
              <h3 className="city-details-title">
                {currentCityData.city} Market Details
              </h3>
              <span className="city-tier">Tier {currentCityData.tier} City</span>
            </div>
            
            <div className="city-details-grid">
              <div className="detail-item">
                <span className="detail-label">Population</span>
                <span className="detail-value">{currentCityData.population}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Transaction Volume</span>
                <span className="detail-value">{formatNumber(currentCityData.transactionVolume)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Top Localities</span>
                <div className="localities-tags">
                  {currentCityData.topLocalities.slice(0, 3).map(loc => (
                    <span key={loc} className="locality-tag">{loc}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Locality Heat Map */}
            <div className="localities-section">
              <h4 className="localities-title">Hot Localities in {currentCityData.city}</h4>
              <div className="localities-grid">
                {currentLocalityData.slice(0, 6).map(loc => (
                  <LocalityHotCard 
                    key={loc.locality}
                    locality={loc.locality}
                    city={currentCityData.city}
                    hotnessScore={Math.round((loc.demandIndex + (100 - loc.supplyIndex)) / 2)}
                    priceGrowth={calculateYoYGrowth(
                      loc.priceTrend[loc.priceTrend.length - 1],
                      loc.priceTrend[loc.priceTrend.length - 2]
                    )}
                    demand={loc.hotness}
                    avgPrice={loc.avgPricePerSqFt}
                    upcomingProjects={loc.upcomingProjects}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Price Trends */}
        <section id="trends" className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">Price Trends</h2>
            <p className="section-description">
              Historical price movements and growth analysis
            </p>
          </div>
          
          <div className="trends-grid">
            {/* Main Price Trend Chart */}
            <div className="trend-chart-card main-chart">
              <LineChart 
                data={currentCityData.priceTrend}
                labels={currentCityData.years}
                title={`${currentCityData.city} - Price per Sq.Ft Trend`}
                color="#c9a962"
                height={300}
              />
              <div className="chart-insights">
                <div className="insight">
                  <span className="insight-label">5-Year Growth</span>
                  <span className="insight-value" style={{ color: getGrowthColor(
                    calculateYoYGrowth(
                      currentCityData.priceTrend[currentCityData.priceTrend.length - 1],
                      currentCityData.priceTrend[0]
                    )
                  )}}>
                    +{calculateYoYGrowth(
                      currentCityData.priceTrend[currentCityData.priceTrend.length - 1],
                      currentCityData.priceTrend[0]
                    )}%
                  </span>
                </div>
                <div className="insight">
                  <span className="insight-label">Current Price</span>
                  <span className="insight-value">
                    ₹{formatNumber(currentCityData.avgPricePerSqFt)}/sq.ft
                  </span>
                </div>
                <div className="insight">
                  <span className="insight-label">YoY Change</span>
                  <span className="insight-value" style={{ color: getGrowthColor(currentCityData.yoyGrowth) }}>
                    +{currentCityData.yoyGrowth}%
                  </span>
                </div>
              </div>
            </div>

            {/* Property Type Trends */}
            <div className="trend-chart-card">
              <h4 className="chart-title">Price Trend by Property Type</h4>
              <div className="property-trends">
                {Object.entries(propertyTypeAnalytics).map(([key, type]) => (
                  <div key={key} className="property-trend-row">
                    <div className="property-trend-header">
                      <span className="property-name">{type.name}</span>
                      <span 
                        className="property-growth"
                        style={{ color: getGrowthColor(type.yoyGrowth) }}
                      >
                        +{type.yoyGrowth}%
                      </span>
                    </div>
                    <LineChart 
                      data={type.priceTrend}
                      labels={type.years}
                      color={key === 'apartment' ? '#c9a962' : key === 'villa' ? '#10b981' : '#3b82f6'}
                      height={100}
                      showGrid={false}
                      showDots={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Property Type Analytics */}
        <section id="property-types" className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">Property Type Analytics</h2>
            <p className="section-description">
              Market share and performance by property category
            </p>
          </div>
          
          <div className="property-types-grid">
            {Object.entries(propertyTypeAnalytics).map(([key, type]) => (
              <PropertyTypeCard 
                key={key}
                name={type.name}
                marketShare={type.marketShare}
                avgPrice={type.avgPricePerSqFt}
                growth={type.yoyGrowth}
                avgTicketSize={type.avgTicketSize}
                isSelected={selectedPropertyType === key}
                onClick={() => setSelectedPropertyType(key)}
              />
            ))}
          </div>

          {/* Buyer Demographics by Property Type */}
          {selectedPropertyType !== 'all' && (
            <div className="property-demographics">
              <h4 className="demographics-title">
                {propertyTypeAnalytics[selectedPropertyType].name} - Buyer Demographics
              </h4>
              <DonutChart 
                data={Object.values(propertyTypeAnalytics[selectedPropertyType].buyerDemographic)}
                labels={['First-time Buyers', 'Investors', 'Upgraders']}
                size={200}
                thickness={40}
              />
            </div>
          )}
        </section>

        {/* Section 5: Comparative Analytics */}
        <section id="comparison" className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">Comparative Analytics</h2>
            <p className="section-description">
              Compare up to 3 cities side by side
            </p>
          </div>

          {/* City Selection for Comparison */}
          <div className="comparison-selector">
            <p className="comparison-instruction">
              Select cities to compare (up to 3):
            </p>
            <div className="comparison-chips">
              {cityMarketData.map(city => (
                <button 
                  key={city.city}
                  className={`comparison-chip ${comparedCities.includes(city.city) ? 'selected' : ''}`}
                  onClick={() => toggleCityComparison(city.city)}
                >
                  {city.city}
                  {comparedCities.includes(city.city) && <span className="chip-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {comparedCities.length >= 2 && (
            <div className="comparison-charts">
              {/* Price Comparison Bar Chart */}
              <div className="comparison-chart-card">
                <BarChart 
                  data={comparedCities.map(city => 
                    cityMarketData.find(c => c.city === city)?.avgPricePerSqFt || 0
                  )}
                  labels={comparedCities}
                  title="Average Price per Sq.Ft"
                  height={250}
                />
              </div>

              {/* Growth Comparison */}
              <div className="comparison-chart-card">
                <BarChart 
                  data={comparedCities.map(city => 
                    cityMarketData.find(c => c.city === city)?.yoyGrowth || 0
                  )}
                  labels={comparedCities}
                  title="YoY Growth (%)"
                  height={250}
                  colors={['#10b981', '#3b82f6', '#f59e0b']}
                />
              </div>

              {/* Comparison Table */}
              <div className="comparison-table-card">
                <h4 className="table-title">Detailed Comparison</h4>
                <div className="comparison-table">
                  <div className="table-header">
                    <div className="table-cell header">Metric</div>
                    {comparedCities.map(city => (
                      <div key={city} className="table-cell header">{city}</div>
                    ))}
                  </div>
                  {[
                    { label: 'Avg Price/Sq.Ft', key: 'avgPricePerSqFt', prefix: '₹' },
                    { label: 'YoY Growth', key: 'yoyGrowth', suffix: '%' },
                    { label: 'Demand Index', key: 'demandIndex' },
                    { label: 'Supply Index', key: 'supplyIndex' },
                    { label: 'Rental Yield', key: 'rentalYield', suffix: '%' },
                    { label: 'Investment Rating', key: 'investmentRating' }
                  ].map(metric => (
                    <div key={metric.key} className="table-row">
                      <div className="table-cell label">{metric.label}</div>
                      {comparedCities.map(city => {
                        const cityData = cityMarketData.find(c => c.city === city);
                        const value = cityData?.[metric.key] || 'N/A';
                        return (
                          <div key={city} className="table-cell value">
                            {metric.prefix || ''}{typeof value === 'number' ? formatNumber(value) : value}{metric.suffix || ''}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {comparedCities.length < 2 && (
            <div className="comparison-empty">
              <p>Select at least 2 cities to start comparing</p>
            </div>
          )}
        </section>

        {/* Section 6: Investment Insights */}
        <section id="investment" className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">Rental & Investment Insights</h2>
            <p className="section-description">
              Best cities for investment based on rental yield and capital appreciation
            </p>
          </div>
          
          <div className="investment-grid">
            {investmentInsights.slice(0, 6).map(insight => (
              <InvestmentCard 
                key={insight.city}
                city={insight.city}
                rentalYield={insight.rentalYield}
                capitalAppreciation={insight.capitalAppreciation}
                investmentScore={insight.investmentScore}
                recommendation={insight.recommendation}
              />
            ))}
          </div>

          {/* Investment Comparison Charts */}
          <div className="investment-charts">
            <div className="investment-chart-card">
              <ComparisonCard 
                cities={investmentInsights.slice(0, 5).map(i => ({ name: i.city, value: i.rentalYield }))}
                metric="Top 5 Cities by Rental Yield"
                unit="%"
              />
            </div>
            <div className="investment-chart-card">
              <ComparisonCard 
                cities={investmentInsights
                  .sort((a, b) => b.capitalAppreciation - a.capitalAppreciation)
                  .slice(0, 5)
                  .map(i => ({ name: i.city, value: i.capitalAppreciation }))}
                metric="Top 5 Cities by Capital Appreciation"
                unit="%"
              />
            </div>
          </div>
        </section>

        {/* Section 7: Market Forecast */}
        <section id="forecast" className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">Market Forecast</h2>
            <p className="section-description">
              Projected price trends based on historical data analysis
            </p>
          </div>

          <div className="forecast-disclaimer">
            <span className="disclaimer-icon">!</span>
            <span>
              Forecasts are indicative projections based on historical trends. 
              Actual market performance may vary due to economic and policy factors.
            </span>
          </div>

          <div className="forecast-grid">
            {/* Main Forecast Chart */}
            <div className="forecast-chart-card main">
              <LineChart 
                data={[...currentCityData.priceTrend, 
                  marketForecast.byCity[selectedCity]?.forecast2026 || currentCityData.priceTrend.slice(-1)[0] * 1.08,
                  marketForecast.byCity[selectedCity]?.forecast2027 || currentCityData.priceTrend.slice(-1)[0] * 1.16
                ]}
                labels={[...currentCityData.years, 2026, 2027]}
                title={`${selectedCity} - Price Forecast (2026-2027)`}
                color="#c9a962"
                height={320}
                secondaryData={currentCityData.priceTrend}
                secondaryColor="#64748b"
                secondaryLabel="Historical"
              />
              <div className="forecast-legend">
                <div className="legend-item">
                  <span className="legend-line solid"></span>
                  <span>Historical + Projected</span>
                </div>
                <div className="legend-item forecast">
                  <span className="legend-dash"></span>
                  <span>Forecast Period</span>
                </div>
              </div>
            </div>

            {/* Scenario Analysis */}
            <div className="forecast-scenarios">
              <h4 className="scenarios-title">Growth Scenarios (National)</h4>
              <div className="scenarios-grid">
                {Object.entries(marketForecast.national.growthScenarios).map(([scenario, values]) => (
                  <div key={scenario} className={`scenario-card ${scenario}`}>
                    <h5 className="scenario-name">{scenario.charAt(0).toUpperCase() + scenario.slice(1)}</h5>
                    <div className="scenario-projections">
                      <div className="projection">
                        <span className="projection-year">2026</span>
                        <span className="projection-value">₹{formatNumber(values[2026])}</span>
                      </div>
                      <div className="projection">
                        <span className="projection-year">2027</span>
                        <span className="projection-value">₹{formatNumber(values[2027])}</span>
                      </div>
                      <div className="projection">
                        <span className="projection-year">2028</span>
                        <span className="projection-value">₹{formatNumber(values[2028])}</span>
                      </div>
                    </div>
                    <div className="scenario-growth">
                      <span>3-Year Growth: </span>
                      <span style={{ color: getGrowthColor(
                        ((values[2028] - marketForecast.national.currentAvgPrice) / marketForecast.national.currentAvgPrice) * 100
                      )}}>
                        +{(((values[2028] - marketForecast.national.currentAvgPrice) / marketForecast.national.currentAvgPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* City-wise Forecast Summary */}
          <div className="forecast-summary">
            <h4 className="summary-title">City-wise 2027 Forecast</h4>
            <div className="forecast-bars">
              {Object.entries(marketForecast.byCity).map(([city, forecast]) => {
                const currentPrice = cityMarketData.find(c => c.city === city)?.avgPricePerSqFt || 0;
                const growth = ((forecast.forecast2027 - currentPrice) / currentPrice * 100);
                return (
                  <div key={city} className="forecast-bar-item">
                    <div className="forecast-bar-header">
                      <span className="forecast-city">{city}</span>
                      <span className="forecast-values">
                        ₹{formatNumber(currentPrice)} → ₹{formatNumber(forecast.forecast2027)}
                        <span className="forecast-growth" style={{ color: getGrowthColor(growth) }}>
                          (+{growth.toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                    <div className="forecast-bar-visual">
                      <div className="bar-current" style={{ width: `${(currentPrice / 25000) * 100}%` }}></div>
                      <div 
                        className="bar-projected" 
                        style={{ 
                          width: `${((forecast.forecast2027 - currentPrice) / 25000) * 100}%`,
                          left: `${(currentPrice / 25000) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Hot Localities Section */}
        <section id="hot-localities" className="analytics-section">
          <div className="section-header">
            <h2 className="section-title">Top Performing Localities</h2>
            <p className="section-description">
              Top performing micro-markets with highest demand
            </p>
          </div>
          
          <div className="hot-localities-grid">
            {hotLocalities.map(loc => (
              <LocalityHotCard 
                key={`${loc.city}-${loc.locality}`}
                locality={loc.locality}
                city={loc.city}
                hotnessScore={loc.hotnessScore}
                priceGrowth={loc.priceGrowth}
                demand={loc.demand}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="analytics-footer">
        <div className="footer-content">
          <div className="footer-text">
            <h3>Ready to Invest?</h3>
            <p>Browse properties in your preferred location</p>
          </div>
          <button className="footer-cta" onClick={() => onNavigate('browse')}>
            Explore Properties →
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MarketAnalytics;
