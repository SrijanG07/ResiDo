/**
 * Market Analytics Static Data
 * Realistic Indian Real Estate Market Data (2020-2025)
 * 100% Frontend - No Backend Required
 */

// ============================================
// CITY-WISE MARKET DATA
// ============================================
export const cityMarketData = [
  {
    city: "Bangalore",
    state: "Karnataka",
    tier: 1,
    avgPricePerSqFt: 8200,
    avgPricePerSqFtPrevYear: 7650,
    yoyGrowth: 7.2,
    demandIndex: 85,
    supplyIndex: 62,
    rentalYield: 3.4,
    transactionVolume: 45200,
    population: "13.1M",
    topLocalities: ["Whitefield", "Electronic City", "Koramangala", "HSR Layout", "Sarjapur Road"],
    propertyTypes: {
      apartment: { share: 72, avgPrice: 8500 },
      villa: { share: 15, avgPrice: 12500 },
      plot: { share: 13, avgPrice: 6200 }
    },
    priceTrend: [5800, 6200, 6800, 7200, 7650, 8200],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "A+",
    marketSentiment: "Bullish"
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
    tier: 1,
    avgPricePerSqFt: 18500,
    avgPricePerSqFtPrevYear: 17200,
    yoyGrowth: 7.6,
    demandIndex: 88,
    supplyIndex: 45,
    rentalYield: 2.8,
    transactionVolume: 62400,
    population: "21.0M",
    topLocalities: ["Bandra", "Worli", "Powai", "Thane", "Navi Mumbai"],
    propertyTypes: {
      apartment: { share: 85, avgPrice: 19500 },
      villa: { share: 8, avgPrice: 45000 },
      plot: { share: 7, avgPrice: 28000 }
    },
    priceTrend: [14200, 14800, 15600, 16400, 17200, 18500],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "A",
    marketSentiment: "Stable"
  },
  {
    city: "Delhi NCR",
    state: "Delhi",
    tier: 1,
    avgPricePerSqFt: 9800,
    avgPricePerSqFtPrevYear: 9100,
    yoyGrowth: 7.7,
    demandIndex: 82,
    supplyIndex: 68,
    rentalYield: 2.6,
    transactionVolume: 58600,
    population: "32.9M",
    topLocalities: ["Gurgaon", "Noida", "Greater Noida", "Dwarka", "Ghaziabad"],
    propertyTypes: {
      apartment: { share: 68, avgPrice: 10200 },
      villa: { share: 18, avgPrice: 18500 },
      plot: { share: 14, avgPrice: 7800 }
    },
    priceTrend: [7200, 7600, 8100, 8600, 9100, 9800],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "A",
    marketSentiment: "Bullish"
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    tier: 1,
    avgPricePerSqFt: 6800,
    avgPricePerSqFtPrevYear: 6100,
    yoyGrowth: 11.5,
    demandIndex: 90,
    supplyIndex: 58,
    rentalYield: 4.2,
    transactionVolume: 38200,
    population: "10.5M",
    topLocalities: ["Gachibowli", "HITEC City", "Kondapur", "Madhapur", "Jubilee Hills"],
    propertyTypes: {
      apartment: { share: 65, avgPrice: 7200 },
      villa: { share: 22, avgPrice: 11500 },
      plot: { share: 13, avgPrice: 5400 }
    },
    priceTrend: [4200, 4600, 5100, 5600, 6100, 6800],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "A+",
    marketSentiment: "Very Bullish"
  },
  {
    city: "Pune",
    state: "Maharashtra",
    tier: 1,
    avgPricePerSqFt: 7200,
    avgPricePerSqFtPrevYear: 6700,
    yoyGrowth: 7.5,
    demandIndex: 78,
    supplyIndex: 72,
    rentalYield: 3.8,
    transactionVolume: 32100,
    population: "7.4M",
    topLocalities: ["Hinjewadi", "Wakad", "Baner", "Kharadi", "Viman Nagar"],
    propertyTypes: {
      apartment: { share: 70, avgPrice: 7500 },
      villa: { share: 18, avgPrice: 12000 },
      plot: { share: 12, avgPrice: 5200 }
    },
    priceTrend: [5100, 5400, 5800, 6200, 6700, 7200],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "A",
    marketSentiment: "Bullish"
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    tier: 1,
    avgPricePerSqFt: 6500,
    avgPricePerSqFtPrevYear: 6100,
    yoyGrowth: 6.6,
    demandIndex: 72,
    supplyIndex: 68,
    rentalYield: 3.5,
    transactionVolume: 28400,
    population: "11.5M",
    topLocalities: ["OMR", "Velachery", "Anna Nagar", "Adyar", "Porur"],
    propertyTypes: {
      apartment: { share: 68, avgPrice: 6800 },
      villa: { share: 20, avgPrice: 10500 },
      plot: { share: 12, avgPrice: 4800 }
    },
    priceTrend: [4800, 5100, 5400, 5700, 6100, 6500],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "B+",
    marketSentiment: "Stable"
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    tier: 1,
    avgPricePerSqFt: 5200,
    avgPricePerSqFtPrevYear: 4900,
    yoyGrowth: 6.1,
    demandIndex: 65,
    supplyIndex: 72,
    rentalYield: 3.2,
    transactionVolume: 22800,
    population: "15.1M",
    topLocalities: ["Rajarhat", "Salt Lake", "EM Bypass", "Alipore", "New Town"],
    propertyTypes: {
      apartment: { share: 75, avgPrice: 5400 },
      villa: { share: 12, avgPrice: 9200 },
      plot: { share: 13, avgPrice: 3800 }
    },
    priceTrend: [3900, 4100, 4400, 4700, 4900, 5200],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "B",
    marketSentiment: "Stable"
  },
  {
    city: "Ahmedabad",
    state: "Gujarat",
    tier: 2,
    avgPricePerSqFt: 4800,
    avgPricePerSqFtPrevYear: 4400,
    yoyGrowth: 9.1,
    demandIndex: 76,
    supplyIndex: 70,
    rentalYield: 3.9,
    transactionVolume: 18600,
    population: "8.6M",
    topLocalities: ["SG Highway", "Prahlad Nagar", "Satellite", "Thaltej", "Bopal"],
    propertyTypes: {
      apartment: { share: 62, avgPrice: 5000 },
      villa: { share: 25, avgPrice: 8500 },
      plot: { share: 13, avgPrice: 3600 }
    },
    priceTrend: [3400, 3600, 3900, 4100, 4400, 4800],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "A-",
    marketSentiment: "Bullish"
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    tier: 2,
    avgPricePerSqFt: 4200,
    avgPricePerSqFtPrevYear: 3850,
    yoyGrowth: 9.1,
    demandIndex: 68,
    supplyIndex: 75,
    rentalYield: 3.6,
    transactionVolume: 12400,
    population: "4.1M",
    topLocalities: ["Vaishali Nagar", "Mansarovar", "Malviya Nagar", "C-Scheme", "Jagatpura"],
    propertyTypes: {
      apartment: { share: 55, avgPrice: 4400 },
      villa: { share: 30, avgPrice: 6800 },
      plot: { share: 15, avgPrice: 3200 }
    },
    priceTrend: [2900, 3100, 3400, 3600, 3850, 4200],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "B+",
    marketSentiment: "Bullish"
  },
  {
    city: "Lucknow",
    state: "Uttar Pradesh",
    tier: 2,
    avgPricePerSqFt: 3800,
    avgPricePerSqFtPrevYear: 3500,
    yoyGrowth: 8.6,
    demandIndex: 64,
    supplyIndex: 78,
    rentalYield: 3.4,
    transactionVolume: 9800,
    population: "3.7M",
    topLocalities: ["Gomti Nagar", "Hazratganj", "Indira Nagar", "Aliganj", "Vikas Nagar"],
    propertyTypes: {
      apartment: { share: 58, avgPrice: 3950 },
      villa: { share: 28, avgPrice: 5800 },
      plot: { share: 14, avgPrice: 2800 }
    },
    priceTrend: [2600, 2800, 3100, 3300, 3500, 3800],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "B",
    marketSentiment: "Stable"
  },
  {
    city: "Chandigarh",
    state: "Punjab/Haryana",
    tier: 2,
    avgPricePerSqFt: 7500,
    avgPricePerSqFtPrevYear: 7000,
    yoyGrowth: 7.1,
    demandIndex: 70,
    supplyIndex: 55,
    rentalYield: 2.9,
    transactionVolume: 8200,
    population: "1.2M",
    topLocalities: ["Sector 17", "Sector 35", "Mohali", "Zirakpur", "Panchkula"],
    propertyTypes: {
      apartment: { share: 52, avgPrice: 7800 },
      villa: { share: 35, avgPrice: 12000 },
      plot: { share: 13, avgPrice: 8500 }
    },
    priceTrend: [5800, 6100, 6400, 6700, 7000, 7500],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "B+",
    marketSentiment: "Stable"
  },
  {
    city: "Kochi",
    state: "Kerala",
    tier: 2,
    avgPricePerSqFt: 5800,
    avgPricePerSqFtPrevYear: 5400,
    yoyGrowth: 7.4,
    demandIndex: 66,
    supplyIndex: 60,
    rentalYield: 3.8,
    transactionVolume: 7600,
    population: "2.1M",
    topLocalities: ["Marine Drive", "Kakkanad", "Edappally", "Vytilla", "Palarivattom"],
    propertyTypes: {
      apartment: { share: 72, avgPrice: 6000 },
      villa: { share: 18, avgPrice: 9500 },
      plot: { share: 10, avgPrice: 4200 }
    },
    priceTrend: [4200, 4500, 4800, 5100, 5400, 5800],
    years: [2020, 2021, 2022, 2023, 2024, 2025],
    investmentRating: "B+",
    marketSentiment: "Stable"
  }
];

// ============================================
// LOCALITY-WISE DETAILED DATA
// ============================================
export const localityData = {
  "Bangalore": [
    { locality: "Whitefield", avgPricePerSqFt: 8800, priceTrend: [6200, 6800, 7400, 7900, 8400, 8800], demandIndex: 88, supplyIndex: 58, rentalYield: 3.6, hotness: "Hot", upcomingProjects: 42 },
    { locality: "Electronic City", avgPricePerSqFt: 5200, priceTrend: [3800, 4100, 4400, 4700, 5000, 5200], demandIndex: 75, supplyIndex: 72, rentalYield: 4.2, hotness: "Warm", upcomingProjects: 28 },
    { locality: "Koramangala", avgPricePerSqFt: 12500, priceTrend: [9200, 9800, 10500, 11200, 11800, 12500], demandIndex: 92, supplyIndex: 35, rentalYield: 3.2, hotness: "Very Hot", upcomingProjects: 15 },
    { locality: "HSR Layout", avgPricePerSqFt: 9800, priceTrend: [7000, 7500, 8100, 8700, 9200, 9800], demandIndex: 85, supplyIndex: 48, rentalYield: 3.5, hotness: "Hot", upcomingProjects: 22 },
    { locality: "Sarjapur Road", avgPricePerSqFt: 6800, priceTrend: [4800, 5200, 5600, 6100, 6500, 6800], demandIndex: 82, supplyIndex: 65, rentalYield: 3.9, hotness: "Hot", upcomingProjects: 56 },
    { locality: "Indiranagar", avgPricePerSqFt: 14200, priceTrend: [10500, 11200, 12000, 12800, 13500, 14200], demandIndex: 90, supplyIndex: 28, rentalYield: 2.8, hotness: "Very Hot", upcomingProjects: 8 },
    { locality: "Jayanagar", avgPricePerSqFt: 11800, priceTrend: [8800, 9400, 10000, 10700, 11200, 11800], demandIndex: 78, supplyIndex: 42, rentalYield: 2.6, hotness: "Warm", upcomingProjects: 12 },
    { locality: "Marathahalli", avgPricePerSqFt: 7200, priceTrend: [5200, 5600, 6000, 6500, 6900, 7200], demandIndex: 76, supplyIndex: 68, rentalYield: 4.1, hotness: "Warm", upcomingProjects: 35 }
  ],
  "Mumbai": [
    { locality: "Bandra", avgPricePerSqFt: 48000, priceTrend: [38000, 40000, 42500, 45000, 46500, 48000], demandIndex: 95, supplyIndex: 22, rentalYield: 2.2, hotness: "Very Hot", upcomingProjects: 12 },
    { locality: "Worli", avgPricePerSqFt: 52000, priceTrend: [42000, 44500, 47000, 49500, 51000, 52000], demandIndex: 88, supplyIndex: 18, rentalYield: 2.0, hotness: "Very Hot", upcomingProjects: 8 },
    { locality: "Powai", avgPricePerSqFt: 22000, priceTrend: [17000, 18200, 19500, 20800, 21400, 22000], demandIndex: 82, supplyIndex: 55, rentalYield: 3.0, hotness: "Hot", upcomingProjects: 25 },
    { locality: "Thane", avgPricePerSqFt: 12800, priceTrend: [9500, 10200, 11000, 11800, 12300, 12800], demandIndex: 78, supplyIndex: 72, rentalYield: 3.4, hotness: "Warm", upcomingProjects: 65 },
    { locality: "Navi Mumbai", avgPricePerSqFt: 9800, priceTrend: [7200, 7800, 8400, 9000, 9400, 9800], demandIndex: 80, supplyIndex: 68, rentalYield: 3.6, hotness: "Hot", upcomingProjects: 78 },
    { locality: "Andheri", avgPricePerSqFt: 24500, priceTrend: [19000, 20200, 21500, 22800, 23600, 24500], demandIndex: 85, supplyIndex: 48, rentalYield: 2.8, hotness: "Hot", upcomingProjects: 32 }
  ],
  "Hyderabad": [
    { locality: "Gachibowli", avgPricePerSqFt: 8500, priceTrend: [5200, 5800, 6500, 7200, 7800, 8500], demandIndex: 92, supplyIndex: 52, rentalYield: 4.5, hotness: "Very Hot", upcomingProjects: 68 },
    { locality: "HITEC City", avgPricePerSqFt: 9200, priceTrend: [5600, 6300, 7100, 7900, 8500, 9200], demandIndex: 94, supplyIndex: 48, rentalYield: 4.8, hotness: "Very Hot", upcomingProjects: 55 },
    { locality: "Kondapur", avgPricePerSqFt: 7200, priceTrend: [4500, 5000, 5600, 6200, 6700, 7200], demandIndex: 88, supplyIndex: 58, rentalYield: 4.2, hotness: "Hot", upcomingProjects: 48 },
    { locality: "Madhapur", avgPricePerSqFt: 8800, priceTrend: [5400, 6000, 6700, 7400, 8100, 8800], demandIndex: 90, supplyIndex: 45, rentalYield: 4.4, hotness: "Very Hot", upcomingProjects: 35 },
    { locality: "Jubilee Hills", avgPricePerSqFt: 15500, priceTrend: [11000, 11800, 12800, 13800, 14600, 15500], demandIndex: 82, supplyIndex: 32, rentalYield: 2.8, hotness: "Hot", upcomingProjects: 15 },
    { locality: "Banjara Hills", avgPricePerSqFt: 14200, priceTrend: [10200, 11000, 11900, 12800, 13500, 14200], demandIndex: 78, supplyIndex: 35, rentalYield: 2.6, hotness: "Warm", upcomingProjects: 12 }
  ],
  "Delhi NCR": [
    { locality: "Gurgaon", avgPricePerSqFt: 12500, priceTrend: [9200, 9800, 10500, 11200, 11800, 12500], demandIndex: 86, supplyIndex: 62, rentalYield: 2.8, hotness: "Hot", upcomingProjects: 85 },
    { locality: "Noida", avgPricePerSqFt: 7800, priceTrend: [5800, 6200, 6700, 7200, 7500, 7800], demandIndex: 78, supplyIndex: 75, rentalYield: 3.2, hotness: "Warm", upcomingProjects: 92 },
    { locality: "Greater Noida", avgPricePerSqFt: 4800, priceTrend: [3400, 3700, 4000, 4300, 4500, 4800], demandIndex: 72, supplyIndex: 82, rentalYield: 3.5, hotness: "Warm", upcomingProjects: 68 },
    { locality: "Dwarka", avgPricePerSqFt: 11200, priceTrend: [8500, 9000, 9600, 10200, 10700, 11200], demandIndex: 75, supplyIndex: 55, rentalYield: 2.4, hotness: "Stable", upcomingProjects: 25 },
    { locality: "Ghaziabad", avgPricePerSqFt: 4200, priceTrend: [3000, 3200, 3500, 3800, 4000, 4200], demandIndex: 70, supplyIndex: 78, rentalYield: 3.8, hotness: "Warm", upcomingProjects: 55 }
  ],
  "Pune": [
    { locality: "Hinjewadi", avgPricePerSqFt: 7500, priceTrend: [5200, 5600, 6100, 6600, 7000, 7500], demandIndex: 88, supplyIndex: 65, rentalYield: 4.2, hotness: "Hot", upcomingProjects: 72 },
    { locality: "Wakad", avgPricePerSqFt: 7800, priceTrend: [5500, 5900, 6400, 6900, 7400, 7800], demandIndex: 85, supplyIndex: 62, rentalYield: 4.0, hotness: "Hot", upcomingProjects: 58 },
    { locality: "Baner", avgPricePerSqFt: 9200, priceTrend: [6500, 7000, 7600, 8200, 8700, 9200], demandIndex: 82, supplyIndex: 52, rentalYield: 3.6, hotness: "Hot", upcomingProjects: 42 },
    { locality: "Kharadi", avgPricePerSqFt: 8500, priceTrend: [6000, 6500, 7000, 7600, 8100, 8500], demandIndex: 86, supplyIndex: 58, rentalYield: 4.1, hotness: "Hot", upcomingProjects: 55 },
    { locality: "Viman Nagar", avgPricePerSqFt: 9800, priceTrend: [7200, 7700, 8200, 8800, 9300, 9800], demandIndex: 78, supplyIndex: 45, rentalYield: 3.4, hotness: "Warm", upcomingProjects: 28 }
  ],
  "Chennai": [
    { locality: "OMR", avgPricePerSqFt: 6200, priceTrend: [4500, 4800, 5200, 5600, 5900, 6200], demandIndex: 82, supplyIndex: 68, rentalYield: 3.8, hotness: "Hot", upcomingProjects: 65 },
    { locality: "Velachery", avgPricePerSqFt: 7500, priceTrend: [5600, 6000, 6400, 6900, 7200, 7500], demandIndex: 76, supplyIndex: 58, rentalYield: 3.4, hotness: "Warm", upcomingProjects: 32 },
    { locality: "Anna Nagar", avgPricePerSqFt: 11500, priceTrend: [8800, 9300, 9900, 10500, 11000, 11500], demandIndex: 72, supplyIndex: 42, rentalYield: 2.6, hotness: "Stable", upcomingProjects: 18 },
    { locality: "Adyar", avgPricePerSqFt: 13200, priceTrend: [10200, 10800, 11500, 12200, 12700, 13200], demandIndex: 68, supplyIndex: 35, rentalYield: 2.4, hotness: "Stable", upcomingProjects: 12 },
    { locality: "Porur", avgPricePerSqFt: 5800, priceTrend: [4200, 4500, 4900, 5300, 5600, 5800], demandIndex: 78, supplyIndex: 72, rentalYield: 4.0, hotness: "Warm", upcomingProjects: 45 }
  ]
};

// ============================================
// PROPERTY TYPE ANALYTICS
// ============================================
export const propertyTypeAnalytics = {
  apartment: {
    name: "Apartment",
    marketShare: 68,
    avgTicketSize: "₹85L",
    avgPricePerSqFt: 7800,
    yoyGrowth: 7.8,
    buyerDemographic: { firstTimeBuyers: 45, investors: 35, upgraders: 20 },
    popularConfigs: ["2 BHK", "3 BHK"],
    priceTrend: [5800, 6200, 6700, 7200, 7500, 7800],
    years: [2020, 2021, 2022, 2023, 2024, 2025]
  },
  villa: {
    name: "Villa",
    marketShare: 18,
    avgTicketSize: "₹2.5Cr",
    avgPricePerSqFt: 12500,
    yoyGrowth: 9.2,
    buyerDemographic: { firstTimeBuyers: 15, investors: 25, upgraders: 60 },
    popularConfigs: ["4 BHK", "5 BHK"],
    priceTrend: [9200, 9800, 10500, 11200, 11800, 12500],
    years: [2020, 2021, 2022, 2023, 2024, 2025]
  },
  plot: {
    name: "Plot",
    marketShare: 14,
    avgTicketSize: "₹45L",
    avgPricePerSqFt: 5200,
    yoyGrowth: 12.5,
    buyerDemographic: { firstTimeBuyers: 20, investors: 55, upgraders: 25 },
    popularConfigs: ["30x40", "40x60"],
    priceTrend: [3400, 3700, 4100, 4500, 4800, 5200],
    years: [2020, 2021, 2022, 2023, 2024, 2025]
  }
};

// ============================================
// RENTAL & INVESTMENT INSIGHTS
// ============================================
export const investmentInsights = [
  { city: "Hyderabad", rentalYield: 4.2, capitalAppreciation: 11.5, investmentScore: 95, recommendation: "Best for Long-term Investment" },
  { city: "Bangalore", rentalYield: 3.4, capitalAppreciation: 7.2, investmentScore: 88, recommendation: "Stable Growth Market" },
  { city: "Pune", rentalYield: 3.8, capitalAppreciation: 7.5, investmentScore: 85, recommendation: "IT Hub Growth Corridor" },
  { city: "Ahmedabad", rentalYield: 3.9, capitalAppreciation: 9.1, investmentScore: 82, recommendation: "Emerging Investment Hub" },
  { city: "Mumbai", rentalYield: 2.8, capitalAppreciation: 7.6, investmentScore: 78, recommendation: "Premium Market - High Entry Cost" },
  { city: "Delhi NCR", rentalYield: 2.6, capitalAppreciation: 7.7, investmentScore: 76, recommendation: "Diversified Market Options" },
  { city: "Chennai", rentalYield: 3.5, capitalAppreciation: 6.6, investmentScore: 72, recommendation: "Steady Returns Market" },
  { city: "Jaipur", rentalYield: 3.6, capitalAppreciation: 9.1, investmentScore: 70, recommendation: "Tier-2 Growth Potential" },
  { city: "Kochi", rentalYield: 3.8, capitalAppreciation: 7.4, investmentScore: 68, recommendation: "NRI Investment Favorite" },
  { city: "Kolkata", rentalYield: 3.2, capitalAppreciation: 6.1, investmentScore: 62, recommendation: "Affordable Entry Market" }
];

// ============================================
// MARKET FORECAST (SIMULATED)
// ============================================
export const marketForecast = {
  national: {
    currentAvgPrice: 7200,
    forecast2026: 7850,
    forecast2027: 8520,
    forecast2028: 9180,
    growthScenarios: {
      optimistic: { 2026: 8100, 2027: 8900, 2028: 9800 },
      baseline: { 2026: 7850, 2027: 8520, 2028: 9180 },
      conservative: { 2026: 7500, 2027: 7950, 2028: 8400 }
    }
  },
  byCity: {
    "Bangalore": { forecast2026: 8900, forecast2027: 9650, forecast2028: 10400 },
    "Mumbai": { forecast2026: 20100, forecast2027: 21800, forecast2028: 23600 },
    "Hyderabad": { forecast2026: 7600, forecast2027: 8500, forecast2028: 9500 },
    "Pune": { forecast2026: 7800, forecast2027: 8450, forecast2028: 9150 },
    "Delhi NCR": { forecast2026: 10600, forecast2027: 11500, forecast2028: 12400 },
    "Chennai": { forecast2026: 7000, forecast2027: 7550, forecast2028: 8150 }
  }
};

// ============================================
// MARKET SUMMARY STATS
// ============================================
export const marketSummary = {
  totalMarketSize: "₹12.5 Lakh Cr",
  totalTransactions: 324000,
  avgNationalPrice: 7200,
  yoyNationalGrowth: 7.8,
  topGrowingCity: "Hyderabad",
  topDemandCity: "Bangalore",
  hottestSegment: "Affordable Housing (₹40L-80L)",
  marketTrend: "Bullish",
  lastUpdated: "January 2025"
};

// ============================================
// BUYER PREFERENCES DATA
// ============================================
export const buyerPreferences = {
  budgetSegments: [
    { range: "Below ₹40L", share: 18, trend: "growing" },
    { range: "₹40L - ₹80L", share: 38, trend: "growing" },
    { range: "₹80L - ₹1.5Cr", share: 28, trend: "stable" },
    { range: "₹1.5Cr - ₹3Cr", share: 12, trend: "stable" },
    { range: "Above ₹3Cr", share: 4, trend: "growing" }
  ],
  propertySize: [
    { type: "1 BHK", share: 12 },
    { type: "2 BHK", share: 42 },
    { type: "3 BHK", share: 35 },
    { type: "4+ BHK", share: 11 }
  ],
  buyerType: [
    { type: "First-time Buyers", share: 42 },
    { type: "Investors", share: 28 },
    { type: "Upgraders", share: 22 },
    { type: "NRIs", share: 8 }
  ]
};

// ============================================
// HOT LOCALITIES DATA
// ============================================
export const hotLocalities = [
  { locality: "Gachibowli", city: "Hyderabad", hotnessScore: 95, priceGrowth: 15.2, demand: "Very High" },
  { locality: "HITEC City", city: "Hyderabad", hotnessScore: 94, priceGrowth: 14.8, demand: "Very High" },
  { locality: "Koramangala", city: "Bangalore", hotnessScore: 92, priceGrowth: 8.5, demand: "Very High" },
  { locality: "Whitefield", city: "Bangalore", hotnessScore: 88, priceGrowth: 9.2, demand: "High" },
  { locality: "Bandra", city: "Mumbai", hotnessScore: 95, priceGrowth: 6.5, demand: "Very High" },
  { locality: "Hinjewadi", city: "Pune", hotnessScore: 88, priceGrowth: 10.5, demand: "High" },
  { locality: "Gurgaon", city: "Delhi NCR", hotnessScore: 86, priceGrowth: 8.8, demand: "High" },
  { locality: "Madhapur", city: "Hyderabad", hotnessScore: 90, priceGrowth: 13.2, demand: "Very High" }
];

export default {
  cityMarketData,
  localityData,
  propertyTypeAnalytics,
  investmentInsights,
  marketForecast,
  marketSummary,
  buyerPreferences,
  hotLocalities
};
