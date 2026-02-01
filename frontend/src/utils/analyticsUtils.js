/**
 * Analytics Utility Functions
 * Pure frontend data manipulation and calculations
 */

/**
 * Calculate Year-over-Year growth percentage
 */
export const calculateYoYGrowth = (currentValue, previousValue) => {
  if (!previousValue) return 0;
  return (((currentValue - previousValue) / previousValue) * 100).toFixed(1);
};

/**
 * Format price in Indian currency format
 */
export const formatPrice = (price) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakh`;
  } else {
    return `₹${price.toLocaleString('en-IN')}`;
  }
};

/**
 * Format large numbers with Indian notation
 */
export const formatNumber = (num) => {
  return num.toLocaleString('en-IN');
};

/**
 * Calculate simple moving average for forecast
 */
export const calculateMovingAverage = (data, periods = 3) => {
  if (data.length < periods) return data[data.length - 1];
  const slice = data.slice(-periods);
  return slice.reduce((a, b) => a + b, 0) / periods;
};

/**
 * Generate linear trend projection
 */
export const projectLinearTrend = (historicalData, yearsToProject = 3) => {
  const n = historicalData.length;
  if (n < 2) return [];

  // Calculate linear regression
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += historicalData[i];
    sumXY += i * historicalData[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const projections = [];
  for (let i = 1; i <= yearsToProject; i++) {
    const projectedValue = Math.round(slope * (n + i - 1) + intercept);
    projections.push(projectedValue);
  }

  return projections;
};

/**
 * Calculate demand-supply ratio
 */
export const calculateDemandSupplyRatio = (demand, supply) => {
  if (!supply) return 0;
  return (demand / supply).toFixed(2);
};

/**
 * Get trend direction based on data
 */
export const getTrendDirection = (data) => {
  if (data.length < 2) return 'stable';
  const recent = data[data.length - 1];
  const previous = data[data.length - 2];
  const change = ((recent - previous) / previous) * 100;
  
  if (change > 3) return 'up';
  if (change < -3) return 'down';
  return 'stable';
};

/**
 * Filter data by city
 */
export const filterByCity = (data, city) => {
  if (!city || city === 'all') return data;
  return data.filter(item => item.city === city);
};

/**
 * Filter data by property type
 */
export const filterByPropertyType = (data, propertyType) => {
  if (!propertyType || propertyType === 'all') return data;
  return data.filter(item => item.propertyType === propertyType);
};

/**
 * Sort data by specified field
 */
export const sortData = (data, field, order = 'desc') => {
  return [...data].sort((a, b) => {
    if (order === 'asc') return a[field] - b[field];
    return b[field] - a[field];
  });
};

/**
 * Get color based on growth rate
 */
export const getGrowthColor = (growth) => {
  if (growth >= 10) return '#10b981'; // Strong green
  if (growth >= 7) return '#22c55e';  // Green
  if (growth >= 5) return '#84cc16';  // Light green
  if (growth >= 0) return '#eab308';  // Yellow
  return '#ef4444'; // Red
};

/**
 * Get investment rating color
 */
export const getRatingColor = (rating) => {
  const colors = {
    'A+': '#10b981',
    'A': '#22c55e',
    'A-': '#84cc16',
    'B+': '#eab308',
    'B': '#f59e0b',
    'B-': '#f97316',
    'C+': '#ef4444',
    'C': '#dc2626'
  };
  return colors[rating] || '#64748b';
};

/**
 * Get hotness badge color
 */
export const getHotnessColor = (hotness) => {
  const colors = {
    'Very Hot': '#ef4444',
    'Hot': '#f97316',
    'Warm': '#eab308',
    'Stable': '#3b82f6',
    'Cold': '#64748b'
  };
  return colors[hotness] || '#64748b';
};

/**
 * Calculate percentile rank
 */
export const calculatePercentile = (value, dataArray) => {
  const sorted = [...dataArray].sort((a, b) => a - b);
  const index = sorted.findIndex(v => v >= value);
  return Math.round((index / sorted.length) * 100);
};

/**
 * Aggregate data by category
 */
export const aggregateByCategory = (data, categoryField, valueField) => {
  const aggregated = {};
  data.forEach(item => {
    const category = item[categoryField];
    if (!aggregated[category]) {
      aggregated[category] = { sum: 0, count: 0 };
    }
    aggregated[category].sum += item[valueField];
    aggregated[category].count += 1;
  });

  return Object.entries(aggregated).map(([category, values]) => ({
    category,
    average: Math.round(values.sum / values.count),
    count: values.count
  }));
};

/**
 * Debounce function for filter updates
 */
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Memoization helper
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export default {
  calculateYoYGrowth,
  formatPrice,
  formatNumber,
  calculateMovingAverage,
  projectLinearTrend,
  calculateDemandSupplyRatio,
  getTrendDirection,
  filterByCity,
  filterByPropertyType,
  sortData,
  getGrowthColor,
  getRatingColor,
  getHotnessColor,
  calculatePercentile,
  aggregateByCategory,
  debounce,
  memoize
};
