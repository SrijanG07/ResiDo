/**
 * Seed script for Property News
 * Run with: node seeds/seedNews.js
 */

const sequelize = require('../config/database');
const PropertyNews = require('../models/PropertyNews');

const NEWS_ARTICLES = [
    {
        title: 'Mumbai Property Prices Rise 12% in Q4 2025, Highest in 5 Years',
        description: 'The Mumbai real estate market has witnessed a remarkable 12% surge in property prices during Q4 2025, marking the highest quarterly growth in five years. Experts attribute this to strong demand in the premium segment and limited new supply in prime locations.',
        source_name: 'Livemint',
        source_url: 'https://www.livemint.com/industry/real-estate/mumbai-property-prices-rise-12-percent-q4-2025',
        image_url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800',
        published_at: new Date('2026-01-28'),
        category: 'Market Trends',
        city_mentions: ['Mumbai'],
        keywords: ['property prices', 'real estate', 'market trends']
    },
    {
        title: 'Bengaluru Emerges as Top Destination for Tech Employee Home Buying',
        description: 'With the tech sector boom continuing, Bengaluru has become the preferred destination for home purchases among IT professionals. Areas like Whitefield, Electronic City, and Sarjapur Road have seen 40% increase in residential inquiries.',
        source_name: 'Economic Times',
        source_url: 'https://economictimes.indiatimes.com/industry/services/property/-cstruction/bengaluru-tech-employee-home-buying',
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        published_at: new Date('2026-01-27'),
        category: 'Market Trends',
        city_mentions: ['Bangalore', 'Bengaluru'],
        keywords: ['home buying', 'real estate', 'property investment']
    },
    {
        title: 'Government Announces 2% Stamp Duty Reduction for First-Time Buyers',
        description: 'In a major relief for first-time home buyers, the Central Government has announced a 2% reduction in stamp duty charges. This move is expected to boost the affordable housing segment and increase property transactions by 25%.',
        source_name: 'Business Standard',
        source_url: 'https://www.business-standard.com/industry/real-estate/stamp-duty-reduction-first-time-buyers',
        image_url: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800',
        published_at: new Date('2026-01-26'),
        category: 'Legal & Tax Updates',
        city_mentions: [],
        keywords: ['stamp duty', 'home buying', 'property tax']
    },
    {
        title: 'Noida Metro Extension to Boost Property Prices Along Route',
        description: 'The newly approved Noida Metro extension connecting Greater Noida West to the existing network is expected to boost property prices by 15-20% in the corridor. Real estate developers have already started launching new projects.',
        source_name: 'Hindustan Times',
        source_url: 'https://www.hindustantimes.com/real-estate/noida-metro-extension-property-prices',
        image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
        published_at: new Date('2026-01-26'),
        category: 'Infrastructure & Development',
        city_mentions: ['Noida'],
        keywords: ['metro project', 'infrastructure development', 'property prices']
    },
    {
        title: 'Pune Real Estate Records 35% Jump in Luxury Home Sales',
        description: 'Pune has witnessed a 35% increase in luxury home sales (above ₹2 crore) in 2025. Areas like Koregaon Park, Kalyani Nagar, and Baner are leading this premium segment growth.',
        source_name: 'Financial Express',
        source_url: 'https://www.financialexpress.com/industry/real-estate/pune-luxury-home-sales-35-percent',
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        published_at: new Date('2026-01-25'),
        category: 'Market Trends',
        city_mentions: ['Pune'],
        keywords: ['property sale', 'real estate', 'housing demand']
    },
    {
        title: 'Home Loan Interest Rates Drop to 7.5%, Lowest Since 2020',
        description: 'Major banks have reduced home loan interest rates to 7.5%, the lowest since 2020. SBI, HDFC Bank, and ICICI Bank have all announced competitive rates to attract home buyers in the upcoming festive season.',
        source_name: 'Livemint',
        source_url: 'https://www.livemint.com/industry/real-estate/home-loan-interest-rates-drop-7-5-percent',
        image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        published_at: new Date('2026-01-25'),
        category: 'Home Investment Advice',
        city_mentions: [],
        keywords: ['home loan', 'mortgage', 'property investment']
    },
    {
        title: 'Delhi-NCR Rental Market Witnesses 18% Growth in IT Corridors',
        description: 'The rental market in Delhi-NCR IT corridors including Gurugram Cyber City and Noida Sector 62 has grown by 18% year-on-year. Remote work flexibility has not dampened demand as companies implement hybrid models.',
        source_name: 'Economic Times',
        source_url: 'https://economictimes.indiatimes.com/industry/services/property/-cstruction/delhi-ncr-rental-market-growth',
        image_url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',
        published_at: new Date('2026-01-24'),
        category: 'Rental Market',
        city_mentions: ['Delhi', 'Gurgaon', 'Gurugram', 'Noida'],
        keywords: ['rental market', 'rent', 'real estate']
    },
    {
        title: '5 Things First-Time Home Buyers Must Know in 2026',
        description: 'From understanding RERA registration to checking builder credentials, here are five essential things every first-time home buyer must know before making their purchase decision in 2026.',
        source_name: 'MagicBricks',
        source_url: 'https://www.magicbricks.com/blog/5-things-first-time-home-buyers-2026',
        image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        published_at: new Date('2026-01-24'),
        category: 'Buying & Selling Tips',
        city_mentions: [],
        keywords: ['home buying', 'buyer', 'tips']
    },
    {
        title: 'Hyderabad IT Hub Continues Property Price Surge, Up 22% YoY',
        description: 'Hyderabad real estate market, driven by IT hub expansion in Gachibowli and HITEC City, has witnessed a 22% year-on-year price appreciation. The city remains affordable compared to other metro cities.',
        source_name: '99acres',
        source_url: 'https://www.99acres.com/articles/hyderabad-it-hub-property-price-surge',
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        published_at: new Date('2026-01-23'),
        category: 'Market Trends',
        city_mentions: ['Hyderabad'],
        keywords: ['property prices', 'real estate', 'market trends']
    },
    {
        title: 'Chennai Real Estate: Peripheral Areas See 28% Rise in New Launches',
        description: 'Chennai peripheral areas including OMR, Porur, and Tambaram have seen a 28% increase in new project launches. Developers are focusing on affordable and mid-segment housing.',
        source_name: 'Business Standard',
        source_url: 'https://www.business-standard.com/industry/real-estate/chennai-peripheral-areas-new-launches',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        published_at: new Date('2026-01-23'),
        category: 'Market Trends',
        city_mentions: ['Chennai'],
        keywords: ['property developer', 'real estate', 'housing demand']
    },
    {
        title: 'RERA Authorities Crack Down on Delayed Projects Across India',
        description: 'Real Estate Regulatory Authorities across India have taken strict action against builders delaying project completion. Over 150 projects have been penalized in the last quarter.',
        source_name: 'Financial Express',
        source_url: 'https://www.financialexpress.com/industry/real-estate/rera-crackdown-delayed-projects',
        image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        published_at: new Date('2026-01-22'),
        category: 'Legal & Tax Updates',
        city_mentions: [],
        keywords: ['RERA', 'legal', 'property developer']
    },
    {
        title: 'NRI Investment in Indian Real Estate Hits Record $15 Billion',
        description: 'Non-Resident Indians invested a record $15 billion in Indian real estate in 2025. Mumbai, Bengaluru, and Dubai-connected Goa remain top choices for NRI investors.',
        source_name: 'Reuters',
        source_url: 'https://www.reuters.com/world/india/nri-investment-indian-real-estate-record',
        image_url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
        published_at: new Date('2026-01-22'),
        category: 'Home Investment Advice',
        city_mentions: ['Mumbai', 'Bangalore', 'Goa'],
        keywords: ['property investment', 'NRI', 'real estate']
    },
    {
        title: 'Ahmedabad Smart City Projects to Transform Real Estate Landscape',
        description: 'Ahmedabad Smart City initiatives including elevated corridors, integrated townships, and riverfront development are expected to significantly boost property values in the coming years.',
        source_name: 'Hindustan Times',
        source_url: 'https://www.hindustantimes.com/real-estate/ahmedabad-smart-city-real-estate',
        image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
        published_at: new Date('2026-01-21'),
        category: 'Infrastructure & Development',
        city_mentions: ['Ahmedabad'],
        keywords: ['smart city', 'infrastructure development', 'real estate']
    },
    {
        title: 'Co-Living Spaces See 45% Growth as Young Professionals Prefer Flexibility',
        description: 'Co-living spaces in major Indian cities have witnessed 45% growth in 2025. Young professionals prefer fully-furnished, flexible rental options over traditional long-term leases.',
        source_name: 'Economic Times',
        source_url: 'https://economictimes.indiatimes.com/industry/services/property/-cstruction/co-living-spaces-growth',
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        published_at: new Date('2026-01-21'),
        category: 'Rental Market',
        city_mentions: [],
        keywords: ['rental market', 'rent', 'tenant']
    },
    {
        title: 'Jaipur Emerges as Budget-Friendly Alternative to Delhi Real Estate',
        description: 'With property prices 60% lower than Delhi, Jaipur is attracting buyers looking for affordable options. The Pink City\'s connectivity via expressways and proposed metro adds to its appeal.',
        source_name: 'MagicBricks',
        source_url: 'https://www.magicbricks.com/blog/jaipur-budget-friendly-delhi-alternative',
        image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
        published_at: new Date('2026-01-20'),
        category: 'Buying & Selling Tips',
        city_mentions: ['Jaipur', 'Delhi'],
        keywords: ['home buying', 'property prices', 'real estate']
    },
    {
        title: 'Mumbai Coastal Road to Impact Prices in Worli, Bandra by 30%',
        description: 'The Mumbai Coastal Road, set to open in phases, is expected to boost property prices in Worli and Bandra by up to 30%. Reduced travel times are the key driver.',
        source_name: 'Livemint',
        source_url: 'https://www.livemint.com/industry/real-estate/mumbai-coastal-road-worli-bandra-prices',
        image_url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
        published_at: new Date('2026-01-20'),
        category: 'Infrastructure & Development',
        city_mentions: ['Mumbai'],
        keywords: ['infrastructure development', 'property prices', 'real estate']
    },
    {
        title: 'How to Negotiate the Best Deal When Buying Resale Property',
        description: 'Buying resale property? Here are expert tips on negotiation, property valuation, legal verification, and getting the best deal in the current market scenario.',
        source_name: '99acres',
        source_url: 'https://www.99acres.com/articles/negotiate-best-deal-resale-property',
        image_url: 'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=800',
        published_at: new Date('2026-01-19'),
        category: 'Buying & Selling Tips',
        city_mentions: [],
        keywords: ['buying', 'selling', 'tips', 'property sale']
    },
    {
        title: 'Kolkata Real Estate Sees Revival with IT Parks and Metro Expansion',
        description: 'Kolkata real estate market is witnessing revival driven by IT park developments in Rajarhat and New Town, coupled with East-West Metro expansion increasing connectivity.',
        source_name: 'Business Standard',
        source_url: 'https://www.business-standard.com/industry/real-estate/kolkata-real-estate-revival',
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        published_at: new Date('2026-01-19'),
        category: 'Market Trends',
        city_mentions: ['Kolkata'],
        keywords: ['real estate', 'metro project', 'market trends']
    },
    {
        title: 'Property Tax Hike in Karnataka: What Homeowners Need to Know',
        description: 'Karnataka government has proposed a 15% property tax hike for urban areas. Here is what homeowners in Bengaluru and other cities need to know about the new rates.',
        source_name: 'Financial Express',
        source_url: 'https://www.financialexpress.com/industry/real-estate/karnataka-property-tax-hike',
        image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        published_at: new Date('2026-01-18'),
        category: 'Legal & Tax Updates',
        city_mentions: ['Bangalore', 'Bengaluru'],
        keywords: ['property tax', 'tax', 'legal']
    },
    {
        title: 'Top 10 Localities for Property Investment in India 2026',
        description: 'From Whitefield in Bengaluru to Worli in Mumbai, here are the top 10 localities across India offering the best returns on property investment in 2026.',
        source_name: 'MagicBricks',
        source_url: 'https://www.magicbricks.com/blog/top-10-localities-property-investment-2026',
        image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        published_at: new Date('2026-01-18'),
        category: 'Home Investment Advice',
        city_mentions: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad'],
        keywords: ['property investment', 'ROI', 'real estate']
    }
];

async function seedNews() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();

        // Sync the model (create table if not exists)
        await PropertyNews.sync({ alter: true });

        console.log('📰 Seeding property news articles...');

        let added = 0;
        let skipped = 0;

        for (const article of NEWS_ARTICLES) {
            try {
                await PropertyNews.create(article);
                added++;
                console.log(`  ✅ Added: ${article.title.substring(0, 50)}...`);
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    skipped++;
                    console.log(`  ⏭️  Skipped (exists): ${article.title.substring(0, 40)}...`);
                } else {
                    throw error;
                }
            }
        }

        const total = await PropertyNews.count();
        console.log(`\n✅ Seeding complete!`);
        console.log(`   Added: ${added} | Skipped: ${skipped} | Total in DB: ${total}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedNews();
