import React from "react";
import "../../styles/luxury-theme.css";
import "./AnalyticsOverview.css";

function AnalyticsOverview() {
  // Mock data - will be replaced with real API data
  const metrics = [
    {
      label: "Total Views",
      value: "12,847",
      change: "+24%",
      positive: true,
      icon: "◎",
    },
    {
      label: "Unique Visitors",
      value: "4,392",
      change: "+18%",
      positive: true,
      icon: "⚇",
    },
    {
      label: "Inquiries",
      value: "156",
      change: "+32%",
      positive: true,
      icon: "✉",
    },
    {
      label: "Conversion Rate",
      value: "3.6%",
      change: "+0.5%",
      positive: true,
      icon: "↑",
    },
  ];

  const properties = [
    {
      title: "3 BHK Apartment, Koramangala",
      views: 2340,
      inquiries: 28,
      status: "Below Market",
      statusColor: "green",
    },
    {
      title: "2 BHK Flat, Indiranagar",
      views: 1850,
      inquiries: 15,
      status: "At Market",
      statusColor: "yellow",
    },
    {
      title: "4 BHK Villa, Whitefield",
      views: 890,
      inquiries: 8,
      status: "Above Market",
      statusColor: "red",
    },
  ];

  return (
    <div className="analytics-overview">
      {/* Metrics Cards */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <span className="metric-label">{metric.label}</span>
              <span className="metric-value">{metric.value}</span>
              <span
                className={`metric-change ${metric.positive ? "positive" : "negative"}`}
              >
                {metric.change} vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Market Pulse Section */}
      <div className="analytics-row">
        <div className="card market-pulse">
          <h3>Local Market Pulse</h3>
          <div className="market-indicator">
            <div className="market-temp seller">
              <span className="temp-label">Market Type</span>
              <span className="temp-value">Seller's Market</span>
              <span className="temp-desc">High demand, low inventory</span>
            </div>
            <div className="market-stats">
              <div className="stat">
                <span className="stat-label">Avg. Price/sqft</span>
                <span className="stat-value">₹8,450</span>
                <span className="stat-change positive">↑ 12%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Days on Market</span>
                <span className="stat-value">23</span>
                <span className="stat-change positive">↓ 8 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Context Card */}
        <div className="card price-context">
          <h3>Listing Price Context</h3>
          <div className="price-list">
            {properties.map((prop, index) => (
              <div key={index} className="price-item">
                <div className="price-info">
                  <span className="price-title">{prop.title}</span>
                  <span className="price-stats">
                    {prop.views} views • {prop.inquiries} inquiries
                  </span>
                </div>
                <span className={`price-status ${prop.statusColor}`}>
                  {prop.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="card performance-chart">
        <h3>Views Over Time</h3>
        <div className="chart-placeholder">
          <div className="chart-bars">
            {[65, 80, 55, 90, 75, 85, 95, 70, 88, 92, 78, 100].map(
              (height, i) => (
                <div
                  key={i}
                  className="chart-bar"
                  style={{ height: `${height}%` }}
                ></div>
              ),
            )}
          </div>
          <div className="chart-labels">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsOverview;
