/**
 * Simple Line Chart Component
 * Pure CSS/SVG based - No external chart library needed
 */
import React, { useMemo, useState } from 'react';
import './AnalyticsCharts.css';

export const LineChart = ({ 
  data, 
  labels, 
  title,
  color = '#c9a962',
  secondaryData,
  secondaryColor = '#3b82f6',
  secondaryLabel,
  height = 250,
  showGrid = true,
  showDots = true,
  animated = true
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data, ...(secondaryData || [])) * 1.1;
    const minValue = Math.min(...data, ...(secondaryData || [])) * 0.9;
    const range = maxValue - minValue;
    
    const width = 100;
    const chartHeight = height - 60;
    
    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * width,
      y: chartHeight - ((value - minValue) / range) * chartHeight,
      value,
      label: labels?.[index] || index
    }));
    
    const secondaryPoints = secondaryData?.map((value, index) => ({
      x: (index / (secondaryData.length - 1)) * width,
      y: chartHeight - ((value - minValue) / range) * chartHeight,
      value,
      label: labels?.[index] || index
    }));
    
    const pathD = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');
    
    const secondaryPathD = secondaryPoints?.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');
    
    // Area path for gradient fill
    const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
    
    return { 
      points, 
      secondaryPoints,
      pathD, 
      secondaryPathD,
      areaD, 
      maxValue, 
      minValue, 
      chartHeight 
    };
  }, [data, secondaryData, labels, height]);

  if (!chartData) {
    return <div className="chart-empty">No data available</div>;
  }

  return (
    <div className="line-chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      <div className="chart-wrapper" style={{ height }}>
        <svg 
          viewBox={`-5 -10 110 ${chartData.chartHeight + 30}`} 
          className={`line-chart-svg ${animated ? 'animated' : ''}`}
          preserveAspectRatio="none"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id={`gradient-${title?.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          
          {/* Grid Lines */}
          {showGrid && (
            <g className="chart-grid">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line 
                  key={i}
                  x1="0" 
                  y1={chartData.chartHeight * ratio} 
                  x2="100" 
                  y2={chartData.chartHeight * ratio}
                  className="grid-line"
                />
              ))}
            </g>
          )}
          
          {/* Area Fill */}
          <path 
            d={chartData.areaD} 
            fill={`url(#gradient-${title?.replace(/\s/g, '')})`}
            className="chart-area"
          />
          
          {/* Secondary Line (if provided) */}
          {chartData.secondaryPathD && (
            <path 
              d={chartData.secondaryPathD} 
              fill="none" 
              stroke={secondaryColor}
              strokeWidth="2"
              className="chart-line secondary"
              strokeDasharray="4,2"
            />
          )}
          
          {/* Main Line */}
          <path 
            d={chartData.pathD} 
            fill="none" 
            stroke={color}
            strokeWidth="2.5"
            className="chart-line"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data Points */}
          {showDots && chartData.points.map((point, i) => (
            <g key={i} className="data-point-group">
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === i ? 6 : 4}
                fill={color}
                className="data-point"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {hoveredPoint === i && (
                <g className="tooltip-group">
                  <rect 
                    x={point.x - 25} 
                    y={point.y - 30} 
                    width="50" 
                    height="20" 
                    rx="4"
                    fill="rgba(0,0,0,0.8)"
                  />
                  <text 
                    x={point.x} 
                    y={point.y - 16} 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="8"
                    fontWeight="600"
                  >
                    ₹{point.value.toLocaleString()}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
        
        {/* X-Axis Labels */}
        <div className="chart-x-labels">
          {labels?.map((label, i) => (
            <span key={i} className="x-label">{label}</span>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      {secondaryLabel && (
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: color }}></span>
            <span>Primary</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: secondaryColor }}></span>
            <span>{secondaryLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Bar Chart Component
 */
export const BarChart = ({ 
  data, 
  labels, 
  title,
  colors,
  horizontal = false,
  height = 250,
  showValues = true
}) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  
  const defaultColors = ['#c9a962', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const barColors = colors || defaultColors;
  
  const maxValue = Math.max(...data) * 1.1;
  
  if (horizontal) {
    return (
      <div className="bar-chart-container horizontal">
        {title && <h4 className="chart-title">{title}</h4>}
        <div className="horizontal-bars" style={{ minHeight: height }}>
          {data.map((value, i) => (
            <div 
              key={i} 
              className="horizontal-bar-row"
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <span className="bar-label">{labels?.[i] || `Item ${i + 1}`}</span>
              <div className="bar-track">
                <div 
                  className={`bar-fill ${hoveredBar === i ? 'hovered' : ''}`}
                  style={{ 
                    width: `${(value / maxValue) * 100}%`,
                    background: barColors[i % barColors.length]
                  }}
                >
                  {showValues && <span className="bar-value">₹{value.toLocaleString()}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bar-chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      <div className="chart-wrapper vertical-bars" style={{ height }}>
        <div className="bars-container">
          {data.map((value, i) => (
            <div 
              key={i} 
              className="bar-column"
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="bar-wrapper">
                <div 
                  className={`bar ${hoveredBar === i ? 'hovered' : ''}`}
                  style={{ 
                    height: `${(value / maxValue) * 100}%`,
                    background: barColors[i % barColors.length]
                  }}
                >
                  {showValues && hoveredBar === i && (
                    <span className="bar-tooltip">₹{value.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <span className="bar-x-label">{labels?.[i] || ''}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Donut Chart Component
 */
export const DonutChart = ({ 
  data, 
  labels, 
  title,
  colors,
  size = 200,
  thickness = 40,
  showLegend = true
}) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  
  const defaultColors = ['#c9a962', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const segmentColors = colors || defaultColors;
  
  const total = data.reduce((sum, val) => sum + val, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercent = 0;
  
  const segments = data.map((value, i) => {
    const percent = (value / total) * 100;
    const offset = circumference * (1 - cumulativePercent / 100);
    const length = (percent / 100) * circumference;
    cumulativePercent += percent;
    
    return {
      value,
      percent: percent.toFixed(1),
      offset,
      length,
      color: segmentColors[i % segmentColors.length],
      label: labels?.[i] || `Segment ${i + 1}`
    };
  });
  
  return (
    <div className="donut-chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      <div className="donut-chart-wrapper">
        <svg width={size} height={size} className="donut-chart-svg">
          {segments.map((segment, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={hoveredSegment === i ? thickness + 8 : thickness}
              strokeDasharray={`${segment.length} ${circumference - segment.length}`}
              strokeDashoffset={segment.offset}
              className={`donut-segment ${hoveredSegment === i ? 'hovered' : ''}`}
              style={{ 
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-width 0.2s ease'
              }}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          ))}
          {/* Center text */}
          <text 
            x={size / 2} 
            y={size / 2 - 8} 
            textAnchor="middle" 
            className="donut-center-value"
            fill="var(--color-text-primary)"
            fontSize="24"
            fontWeight="700"
          >
            {hoveredSegment !== null ? `${segments[hoveredSegment].percent}%` : total.toLocaleString()}
          </text>
          <text 
            x={size / 2} 
            y={size / 2 + 14} 
            textAnchor="middle" 
            className="donut-center-label"
            fill="var(--color-text-muted)"
            fontSize="11"
          >
            {hoveredSegment !== null ? segments[hoveredSegment].label : 'Total'}
          </text>
        </svg>
      </div>
      
      {showLegend && (
        <div className="donut-legend">
          {segments.map((segment, i) => (
            <div 
              key={i} 
              className={`legend-item ${hoveredSegment === i ? 'active' : ''}`}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <span className="legend-dot" style={{ background: segment.color }}></span>
              <span className="legend-label">{segment.label}</span>
              <span className="legend-value">{segment.percent}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Gauge/Meter Chart
 */
export const GaugeChart = ({ value, max = 100, label, color, size = 150 }) => {
  const percent = Math.min((value / max) * 100, 100);
  const rotation = (percent / 100) * 180;
  
  const getColor = () => {
    if (color) return color;
    if (percent >= 75) return '#10b981';
    if (percent >= 50) return '#eab308';
    if (percent >= 25) return '#f59e0b';
    return '#ef4444';
  };
  
  return (
    <div className="gauge-chart-container" style={{ width: size }}>
      <div className="gauge-wrapper">
        <div className="gauge-background"></div>
        <div 
          className="gauge-fill"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            borderColor: getColor()
          }}
        ></div>
        <div className="gauge-cover"></div>
        <div className="gauge-center">
          <span className="gauge-value" style={{ color: getColor() }}>{value}</span>
          <span className="gauge-label">{label || 'Score'}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Mini Sparkline Chart
 */
export const SparklineChart = ({ data, color = '#c9a962', width = 100, height = 30 }) => {
  if (!data || data.length < 2) return null;
  
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  
  const isUp = data[data.length - 1] > data[0];
  const lineColor = color === 'auto' ? (isUp ? '#10b981' : '#ef4444') : color;
  
  return (
    <svg width={width} height={height} className="sparkline-chart">
      <polyline
        fill="none"
        stroke={lineColor}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="3"
        fill={lineColor}
      />
    </svg>
  );
};

export default { LineChart, BarChart, DonutChart, GaugeChart, SparklineChart };
