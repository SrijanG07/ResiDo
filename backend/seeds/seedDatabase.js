const { sequelize, User, Property, Image } = require('../models');

// Indian cities with localities and coordinates
const cities = [
    {
        name: 'Bangalore',
        state: 'Karnataka',
        lat: 12.9716,
        lng: 77.5946,
        localities: ['Koramangala', 'Whitefield', 'HSR Layout', 'Indiranagar', 'Jayanagar', 'Electronic City', 'Marathahalli', 'BTM Layout', 'Yelahanka', 'JP Nagar'],
        colleges: ['IIM Bangalore', 'Christ University', 'RV College', 'PES University']
    },
    {
        name: 'Delhi',
        state: 'Delhi',
        lat: 28.6139,
        lng: 77.2090,
        localities: ['Connaught Place', 'Dwarka', 'Rohini', 'Rajouri Garden', 'Saket', 'Nehru Place', 'Lajpat Nagar', 'Karol Bagh', 'Vasant Kunj', 'Mayur Vihar'],
        colleges: ['IIT Delhi', 'Delhi University', 'JNU', 'AIIMS Delhi']
    },
    {
        name: 'Mumbai',
        state: 'Maharashtra',
        lat: 19.0760,
        lng: 72.8777,
        localities: ['Andheri', 'Bandra', 'Powai', 'Thane', 'Malad', 'Borivali', 'Goregaon', 'Dadar', 'Lower Parel', 'Worli'],
        colleges: ['IIT Bombay', 'TISS Mumbai', 'NMIMS', 'St. Xaviers College']
    },
    {
        name: 'Pune',
        state: 'Maharashtra',
        lat: 18.5204,
        lng: 73.8567,
        localities: ['Hinjewadi', 'Kothrud', 'Viman Nagar', 'Wakad', 'Baner', 'Aundh', 'Kharadi', 'Magarpatta', 'Hadapsar', 'Pimple Saudagar'],
        colleges: ['COEP', 'Symbiosis', 'MIT Pune', 'Fergusson College']
    },
    {
        name: 'Hyderabad',
        state: 'Telangana',
        lat: 17.3850,
        lng: 78.4867,
        localities: ['Gachibowli', 'Jubilee Hills', 'HITEC City', 'Kondapur', 'Madhapur', 'Banjara Hills', 'Kukatpally', 'Miyapur', 'Secunderabad', 'LB Nagar'],
        colleges: ['IIIT Hyderabad', 'Osmania University', 'ISB Hyderabad']
    },
    {
        name: 'Chennai',
        state: 'Tamil Nadu',
        lat: 13.0827,
        lng: 80.2707,
        localities: ['Anna Nagar', 'T Nagar', 'OMR', 'Adyar', 'Velachery', 'Tambaram', 'Porur', 'Chromepet', 'Perungudi', 'Sholinganallur'],
        colleges: ['IIT Madras', 'Anna University', 'Loyola College', 'SRM University']
    },
    {
        name: 'Kolkata',
        state: 'West Bengal',
        lat: 22.5726,
        lng: 88.3639,
        localities: ['Salt Lake', 'New Town', 'Ballygunge', 'Park Street', 'Rajarhat', 'Howrah', 'Barasat', 'Dum Dum', 'Jadavpur', 'Garia'],
        colleges: ['IIM Calcutta', 'Jadavpur University', 'Presidency University']
    },
    {
        name: 'Ahmedabad',
        state: 'Gujarat',
        lat: 23.0225,
        lng: 72.5714,
        localities: ['Satellite', 'Vastrapur', 'Prahlad Nagar', 'Bodakdev', 'Navrangpura', 'SG Highway', 'Maninagar', 'Chandkheda', 'Gota', 'Thaltej'],
        colleges: ['IIM Ahmedabad', 'CEPT University', 'NID Ahmedabad']
    },
    {
        name: 'Jaipur',
        state: 'Rajasthan',
        lat: 26.9124,
        lng: 75.7873,
        localities: ['Malviya Nagar', 'Mansarovar', 'Vaishali Nagar', 'C-Scheme', 'Jagatpura', 'Raja Park', 'Sitapura', 'Tonk Road', 'Ajmer Road', 'Bani Park'],
        colleges: ['MNIT Jaipur', 'IIHMR', 'Manipal University Jaipur']
    },
    {
        name: 'Chandigarh',
        state: 'Chandigarh',
        lat: 30.7333,
        lng: 76.7794,
        localities: ['Sector 17', 'Sector 35', 'Sector 22', 'Sector 43', 'Sector 8', 'Sector 9', 'Sector 26', 'Sector 40', 'Sector 15', 'Sector 34'],
        colleges: ['Punjab University', 'PEC Chandigarh', 'PGIMER']
    }
];

// Property images - LOCAL EXTERIOR IMAGES (High Quality)
const exteriorImages = [
    '/property-features/exteriors/alejandra-cifre-gonzalez-ylyn5r4vxcA-unsplash.jpg',
    '/property-features/exteriors/andre-francois-mckenzie-08uIUe2a9XY-unsplash.jpg',
    '/property-features/exteriors/aubrey-odom-ITzfgP77DTg-unsplash.jpg',
    '/property-features/exteriors/bailey-anselme-Bkp3gLygyeA-unsplash.jpg',
    '/property-features/exteriors/brian-babb-XbwHrt87mQ0-unsplash.jpg',
    '/property-features/exteriors/digital-marketing-agency-ntwrk-g39p1kDjvSY-unsplash.jpg',
    '/property-features/exteriors/dillon-kydd-3Ignkeds3w8-unsplash.jpg',
    '/property-features/exteriors/dillon-kydd-XGvwt544g8k-unsplash.jpg',
    '/property-features/exteriors/elijah-crouch-kcNB4_0HRLA-unsplash.jpg',
    '/property-features/exteriors/eric-ardito-Z2WiPyxywQ0-unsplash.jpg',
    '/property-features/exteriors/frames-for-your-heart-2d4lAQAlbDA-unsplash.jpg',
    '/property-features/exteriors/francesca-tosolini-XcVm8mn7NUM-unsplash.jpg',
    '/property-features/exteriors/john-fornander-Id7u0EkTjBE-unsplash.jpg',
    '/property-features/exteriors/john-fornander-tVzyDSV84w8-unsplash.jpg',
    '/property-features/exteriors/john-fornander-y3_AHHrxUBY-unsplash.jpg',
    '/property-features/exteriors/johnson-U6Q6zVDgmSs-unsplash.jpg',
    '/property-features/exteriors/madeleine-maguire-hAfW3tKJVv0-unsplash.jpg',
    '/property-features/exteriors/mark-grandcourt-QeC_YOzGGj0-unsplash.jpg',
    '/property-features/exteriors/modunite-ltd-hjWqyOMGvNY-unsplash.jpg',
    '/property-features/exteriors/parth-savani-pjVsIlrdiCo-unsplash.jpg',
    '/property-features/exteriors/pixasquare-4ojhpgKpS68-unsplash.jpg',
    '/property-features/exteriors/point3d-commercial-imaging-ltd-wC4QVZmAF58-unsplash.jpg',
    '/property-features/exteriors/webaliser-_TPTXZd9mOo-unsplash (1).jpg',
    '/property-features/exteriors/webaliser-_TPTXZd9mOo-unsplash (2).jpg',
    '/property-features/exteriors/willian-reis-E6jIae7z2fw-unsplash.jpg',
    '/property-features/exteriors/willian-reis-yQjXfakypZM-unsplash.jpg',
    '/property-features/exteriors/zac-gudakov-5QLCohwVndQ-unsplash.jpg',
    '/property-features/exteriors/zac-gudakov-w-W1Nznmw3w-unsplash.jpg',
    '/property-features/exteriors/zero-take-WvHrrR1C5Po-unsplash.jpg'
];

const interiorImages = [
    '/property-features/Living_Room_Images/clay-banks-KjkZqlBayFc-unsplash.jpg',
    '/property-features/Living_Room_Images/kam-idris-_HqHX3LBN18-unsplash.jpg',
    '/property-features/Living_Room_Images/lotus-design-n-print-qIffpsNK90I-unsplash.jpg',
    '/property-features/Living_Room_Images/pipcke-g_5UyVBIX_k-unsplash.jpg',
    '/property-features/Living_Room_Images/pipcke-SZ-DsEZxzlg-unsplash.jpg',
    '/property-features/bedrooms/chastity-cortijo-R-w5Q-4Mqm0-unsplash.jpg',
    '/property-features/bedrooms/francesca-tosolini-hCU4fimRW-c-unsplash.jpg',
    '/property-features/Kitchens/aaron-huber-G7sE2S4Lab4-unsplash.jpg',
    '/property-features/Kitchens/jason-briscoe-GliaHAJ3_5A-unsplash.jpg',
    '/property-features/Bathroom_Images/chastity-cortijo-6TY_WrJTwSI-unsplash.jpg'
];

// ===== PROPERTY FEATURE IMAGES WITH DESCRIPTIONS =====
const featureData = {
    bedroom: {
        images: [
            '/property-features/bedrooms/chastity-cortijo-R-w5Q-4Mqm0-unsplash.jpg',
            '/property-features/bedrooms/francesca-tosolini-hCU4fimRW-c-unsplash.jpg',
            '/property-features/bedrooms/istockphoto-2218698302-1024x1024.jpg',
            '/property-features/bedrooms/kenny-eliason-iAftdIcgpFc-unsplash.jpg',
            '/property-features/bedrooms/lotus-design-n-print-EoTUCbv9Jrs-unsplash.jpg',
            '/property-features/bedrooms/mark-champs-Id2IIl1jOB0-unsplash.jpg',
            '/property-features/bedrooms/minh-pham-7pCFUybP_P8-unsplash.jpg',
            '/property-features/bedrooms/sonnie-hiles-DhFHtkECn7Q-unsplash.jpg',
            '/property-features/bedrooms/spacejoy-nEtpvJjnPVo-unsplash.jpg'
        ],
        descriptions: [
            'Luxurious master bedroom with elegant interiors, plush bedding, and serene ambiance for restful nights',
            'Spacious bedroom featuring modern design, natural lighting, and premium finishes throughout',
            'Elegant bedroom suite with designer furnishings, ambient lighting, and sophisticated décor',
            'Cozy yet expansive bedroom with warm tones, comfortable layouts, and stunning views',
            'Premium bedroom with walk-in closet space, contemporary styling, and peaceful atmosphere',
            'Beautifully crafted bedroom offering comfort, style, and a perfect retreat after long days',
            'Tastefully designed bedroom with high ceilings, quality materials, and luxurious touches',
            'Inviting bedroom sanctuary with soft textures, calming colors, and impeccable design'
        ]
    },
    livingRoom: {
        images: [
            '/property-features/Living_Room_Images/clay-banks-KjkZqlBayFc-unsplash.jpg',
            '/property-features/Living_Room_Images/kam-idris-_HqHX3LBN18-unsplash.jpg',
            '/property-features/Living_Room_Images/lotus-design-n-print-qIffpsNK90I-unsplash.jpg',
            '/property-features/Living_Room_Images/pipcke-g_5UyVBIX_k-unsplash.jpg',
            '/property-features/Living_Room_Images/pipcke-SZ-DsEZxzlg-unsplash.jpg',
            '/property-features/Living_Room_Images/prydumano-design-vIbxvHj9m9g-unsplash.jpg',
            '/property-features/Living_Room_Images/spacejoy-c0JoR_-2x3E-unsplash.jpg',
            '/property-features/Living_Room_Images/spacejoy-Kh4tedFdHz4-unsplash.jpg'
        ],
        descriptions: [
            'Grand living room with floor-to-ceiling windows, designer furniture, and breathtaking city views',
            'Sophisticated living space featuring premium finishes, elegant lighting, and comfortable seating',
            'Open-concept living area with modern aesthetics, natural light flooding in, and stylish décor',
            'Expansive living room perfect for entertaining, with luxurious furnishings and warm ambiance',
            'Contemporary living space showcasing minimalist design, quality craftsmanship, and comfort',
            'Elegant living room with statement pieces, cozy textures, and a welcoming atmosphere',
            'Beautifully appointed living area featuring smart home integration and premium materials',
            'Stunning living room with architectural details, curated artwork, and refined elegance'
        ]
    },
    kitchen: {
        images: [
            '/property-features/Kitchens/3d-rendering-white-minimal-kitchen-with-wood-decoration.jpg',
            '/property-features/Kitchens/aaron-huber-G7sE2S4Lab4-unsplash.jpg',
            '/property-features/Kitchens/cat-han-VgyN_CWXQVM-unsplash.jpg',
            '/property-features/Kitchens/jason-briscoe-GliaHAJ3_5A-unsplash.jpg',
            '/property-features/Kitchens/minimalist-kitchen-interior-design.jpg',
            '/property-features/Kitchens/modern-kitchen-design-interior.jpg',
            '/property-features/Kitchens/roam-in-color-z3QZ6gjGRt4-unsplash.jpg',
            '/property-features/Kitchens/sven-brandsma-3hEGHI4b4gg-unsplash.jpg'
        ],
        descriptions: [
            'State-of-the-art modular kitchen with premium appliances, granite countertops, and ample storage',
            'Chef-inspired kitchen featuring Italian marble, high-end fixtures, and smart storage solutions',
            'Modern open kitchen with sleek cabinetry, built-in appliances, and elegant breakfast counter',
            'Luxurious kitchen space with designer fittings, soft-close drawers, and ambient lighting',
            'Fully equipped gourmet kitchen with island counter, premium finishes, and efficient layout',
            'Contemporary kitchen featuring quartz surfaces, modern appliances, and sophisticated design',
            'Elegant cooking space with wooden accents, stainless steel appliances, and thoughtful design',
            'Spacious kitchen with panoramic views, top-tier amenities, and beautiful aesthetics'
        ]
    },
    bathroom: {
        images: [
            '/property-features/Bathroom_Images/99-films-48mTwDzizqE-unsplash.jpg',
            '/property-features/Bathroom_Images/backbone-L4iRkKL5dng-unsplash.jpg',
            '/property-features/Bathroom_Images/carlos-masias-yg8zkwBS30Q-unsplash.jpg',
            '/property-features/Bathroom_Images/chastity-cortijo-6TY_WrJTwSI-unsplash.jpg',
            '/property-features/Bathroom_Images/chastity-cortijo-FJLoqqIsSHc-unsplash.jpg',
            '/property-features/Bathroom_Images/curology-ycEKahEaO5U-unsplash.jpg',
            '/property-features/Bathroom_Images/lotus-design-n-print-g51F6-WYzyU-unsplash.jpg',
            '/property-features/Bathroom_Images/raquel-navalon-alvarez-TWj0qbJn4zI-unsplash.jpg',
            '/property-features/Bathroom_Images/serjan-midili-mLx6oMw32PI-unsplash.jpg'
        ],
        descriptions: [
            'Spa-like bathroom with rain shower, premium fixtures, and luxurious marble finishes',
            'Elegant en-suite bathroom featuring designer vanity, mood lighting, and premium tiles',
            'Modern bathroom with walk-in shower, high-end fittings, and sophisticated design',
            'Luxurious bathroom retreat with soaking tub, heated floors, and exquisite finishes',
            'Contemporary bathroom with frameless glass shower, floating vanity, and ambient lighting',
            'Beautifully designed bathroom with natural stone, chrome fixtures, and spa amenities',
            'Premium bathroom featuring dual sinks, large mirrors, and designer accessories',
            'Serene bathroom space with calming aesthetics, quality materials, and ample storage'
        ]
    },
    swimmingPool: {
        images: [
            '/property-features/swimming_pool/alex-muzenhardt-qcI-nT48bfQ-unsplash.jpg',
            '/property-features/swimming_pool/daniel-hobiera-uE7vZHFqQNE-unsplash.jpg',
            '/property-features/swimming_pool/sijmen-van-hooff-EFL8KR12X2o-unsplash.jpg',
            '/property-features/swimming_pool/stephanie-klepacki-cIZ9OuNAcUk-unsplash.jpg',
            '/property-features/swimming_pool/stephanie-klepacki-Oj-J1hUnBVU-unsplash.jpg',
            '/property-features/swimming_pool/toa-heftiba-m_gTxMH0n-4-unsplash.jpg'
        ],
        descriptions: [
            'Stunning infinity pool with panoramic views, sun loungers, and tropical landscaping',
            'Resort-style swimming pool with temperature control, poolside cabanas, and ambient lighting',
            'Crystal-clear pool surrounded by lush gardens, perfect for relaxation and entertainment',
            'Olympic-sized pool with dedicated lap lanes, jacuzzi, and premium poolside amenities',
            'Elegant rooftop pool offering breathtaking city views and exclusive poolside service',
            'Family-friendly pool area with separate kids section, water features, and safety measures'
        ]
    },
    gym: {
        images: [
            '/property-features/gym/andrew-kayani-4G08MoVJlig-unsplash.jpg',
            '/property-features/gym/aparna-johri-tBcAuzYNn0Y-unsplash.jpg',
            '/property-features/gym/brett-jordan-U2q73PfHFpM-unsplash.jpg',
            '/property-features/gym/brian-wangenheim-175WMFRMoOA-unsplash.jpg',
            '/property-features/gym/jelmer-assink-gzeTjGu3b_k-unsplash.jpg',
            '/property-features/gym/mohamed-fareed-rbSNsoXk-3A-unsplash.jpg',
            '/property-features/gym/point3d-commercial-imaging-ltd-10_Bx7IJqGc-unsplash.jpg',
            '/property-features/gym/point3d-commercial-imaging-ltd-FnMU3Hl1dMQ-unsplash.jpg'
        ],
        descriptions: [
            'Fully-equipped fitness center with cardio machines, free weights, and personal training area',
            'State-of-the-art gymnasium featuring latest equipment, yoga studio, and recovery zone',
            'Premium fitness facility with dedicated strength training area and professional trainers',
            'Modern gym with panoramic windows, top-tier equipment, and motivating atmosphere',
            'Comprehensive workout space including CrossFit zone, spinning area, and stretching studio',
            'World-class fitness center with smart equipment, air conditioning, and 24/7 access',
            'Luxury gym featuring Technogym equipment, personal lockers, and steam room access',
            'Well-designed fitness area with cardio theater, weight room, and group exercise space'
        ]
    },
    garden: {
        images: [
            '/property-features/Gardens/adriana-carles-rSrpSgocsm0-unsplash.jpg',
            '/property-features/Gardens/markus-spiske-bk11wZwb9F4-unsplash.jpg',
            '/property-features/Gardens/mitchell-luo-zFArD_PF_p4-unsplash.jpg',
            '/property-features/Gardens/sonnie-hiles-iANAdaNu7mg-unsplash.jpg',
            '/property-features/Gardens/tile-merchant-ireland-lCmZqcHM-OY-unsplash.jpg',
            '/property-features/Gardens/tile-merchant-ireland-pn4OhyUAVnI-unsplash.jpg',
            '/property-features/Gardens/tile-merchant-ireland-ujfcn8vQpUY-unsplash.jpg',
            '/property-features/Gardens/zane-lee-RRhmemtmBS4-unsplash.jpg'
        ],
        descriptions: [
            'Beautifully landscaped garden with manicured lawns, flowering plants, and serene water features',
            'Private garden oasis featuring mature trees, decorative shrubs, and peaceful sitting areas',
            'Lush green garden space with walking paths, ornamental plants, and outdoor lighting',
            'Elegant terrace garden with potted plants, cozy seating, and stunning sunset views',
            'Sprawling garden area with seasonal flowers, herb section, and children\'s play zone',
            'Zen-inspired garden featuring bamboo, stone pathways, and tranquil meditation spots',
            'Rooftop garden with vertical planters, comfortable loungers, and barbecue area',
            'Verdant garden retreat with fruit trees, vegetable patches, and charming pergola'
        ]
    }
};

// Function to generate random features for a property
function generatePropertyFeatures(propertyType, bedrooms, amenities) {
    const features = [];
    
    // Always add bedroom feature if property has bedrooms
    if (bedrooms && bedrooms > 0 && propertyType !== 'plot') {
        features.push({
            type: 'bedroom',
            title: `${bedrooms} Elegant Bedroom${bedrooms > 1 ? 's' : ''}`,
            image: randomChoice(featureData.bedroom.images),
            description: randomChoice(featureData.bedroom.descriptions)
        });
    }
    
    // Always add living room for residential properties
    if (!['plot', 'pg', 'hostel', 'room', 'commercial'].includes(propertyType)) {
        features.push({
            type: 'livingRoom',
            title: 'Spacious Living Room',
            image: randomChoice(featureData.livingRoom.images),
            description: randomChoice(featureData.livingRoom.descriptions)
        });
    }
    
    // Always add kitchen for residential properties
    if (!['plot', 'pg', 'hostel', 'room', 'commercial'].includes(propertyType)) {
        features.push({
            type: 'kitchen',
            title: 'Modern Kitchen',
            image: randomChoice(featureData.kitchen.images),
            description: randomChoice(featureData.kitchen.descriptions)
        });
    }
    
    // Add bathroom feature
    if (propertyType !== 'plot') {
        features.push({
            type: 'bathroom',
            title: 'Premium Bathroom',
            image: randomChoice(featureData.bathroom.images),
            description: randomChoice(featureData.bathroom.descriptions)
        });
    }
    
    // Add swimming pool if in amenities
    if (amenities && amenities.includes('Swimming Pool')) {
        features.push({
            type: 'swimmingPool',
            title: 'Lavish Swimming Pool',
            image: randomChoice(featureData.swimmingPool.images),
            description: randomChoice(featureData.swimmingPool.descriptions)
        });
    }
    
    // Add gym if in amenities
    if (amenities && amenities.includes('Gym')) {
        features.push({
            type: 'gym',
            title: 'State-of-the-Art Gym',
            image: randomChoice(featureData.gym.images),
            description: randomChoice(featureData.gym.descriptions)
        });
    }
    
    // Add garden if in amenities
    if (amenities && amenities.includes('Garden')) {
        features.push({
            type: 'garden',
            title: 'Beautiful Garden',
            image: randomChoice(featureData.garden.images),
            description: randomChoice(featureData.garden.descriptions)
        });
    }
    
    // Ensure we have at least 4-5 features by adding more if needed
    const additionalFeatures = ['swimmingPool', 'gym', 'garden'];
    while (features.length < 4 && propertyType !== 'plot') {
        const featureType = randomChoice(additionalFeatures);
        if (!features.find(f => f.type === featureType)) {
            const data = featureData[featureType];
            const titles = {
                swimmingPool: 'Lavish Swimming Pool',
                gym: 'State-of-the-Art Gym',
                garden: 'Beautiful Garden'
            };
            features.push({
                type: featureType,
                title: titles[featureType],
                image: randomChoice(data.images),
                description: randomChoice(data.descriptions)
            });
        }
    }
    
    return features.slice(0, 5); // Return max 5 features
}

// Enhanced property types including PG/Hostel
const propertyTypes = ['flat', 'home', 'villa', 'plot', 'commercial', 'pg', 'hostel', 'room'];
const furnishedStatus = ['unfurnished', 'semi-furnished', 'fully-furnished'];
const amenitiesList = ['Parking', 'WiFi', 'Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Lift', 'Club House', 'Garden', 'Play Area', 'AC', 'Laundry', 'CCTV', 'Intercom'];
const genderPreferences = ['any', 'male', 'female'];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomChoices(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function randomBool(probability = 0.5) {
    return Math.random() < probability;
}

function generatePrice(bedrooms, city, propertyType, listingType) {
    const cityMultiplier = {
        'Mumbai': 2.0, 'Delhi': 1.8, 'Bangalore': 1.6, 'Pune': 1.2,
        'Hyderabad': 1.1, 'Chennai': 1.1, 'Kolkata': 0.9,
        'Ahmedabad': 0.8, 'Jaipur': 0.7, 'Chandigarh': 1.0
    };

    let basePrice;

    // All properties are now for sale only - no rentals
    if (propertyType === 'villa') basePrice = 25000000; // 2.5 crores
    else if (propertyType === 'plot') basePrice = 8000000; // 80 lakhs
    else if (propertyType === 'commercial') basePrice = 35000000; // 3.5 crores
    else if (propertyType === 'pg' || propertyType === 'hostel') basePrice = 5000000; // 50 lakhs
    else if (propertyType === 'room') basePrice = 3000000; // 30 lakhs
    else {
        // Regular apartments/flats/homes
        const bedroomMultiplier = {
            1: 4000000,  // 40 lakhs
            2: 6500000,  // 65 lakhs
            3: 9500000,  // 95 lakhs
            4: 14000000  // 1.4 crores
        };
        basePrice = bedroomMultiplier[bedrooms || 2] || 6500000;
    }

    return Math.floor(basePrice * cityMultiplier[city] * (0.85 + Math.random() * 0.3));
}

async function seedDatabase() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();

        console.log('🔄 Syncing database (dropping old tables)...');
        await sequelize.sync({ force: true });

        console.log('🔄 Creating sample users...');
        const users = [];

        // Create owners and brokers
        for (let i = 1; i <= 30; i++) {
            const user = await User.create({
                name: `Owner ${i}`,
                email: `owner${i}@ResiDo.com`,
                password_hash: 'password123',
                phone: `98765432${String(i).padStart(2, '0')}`,
                user_type: i % 5 === 0 ? 'broker' : 'owner',
                is_verified: true
            });
            users.push(user);
        }

        // Create buyers
        for (let i = 1; i <= 10; i++) {
            await User.create({
                name: `Buyer ${i}`,
                email: `buyer${i}@ResiDo.com`,
                password_hash: 'password123',
                phone: `97654321${String(i).padStart(2, '0')}`,
                user_type: 'buyer'
            });
        }

        console.log(`✅ Created ${users.length} owners/brokers and 10 buyers`);

        console.log('🔄 Creating 120 properties with lifestyle attributes...');
        let propertyCount = 0;

        for (const cityData of cities) {
            const propertiesPerCity = 12; // 12 properties per city = 120 total

            for (let i = 0; i < propertiesPerCity; i++) {
                const locality = randomChoice(cityData.localities);
                const propertyType = randomChoice(propertyTypes);
                const isPGHostel = ['pg', 'hostel', 'room'].includes(propertyType);
                const listingType = 'sale'; // All properties are now for sale only

                const bedrooms = propertyType === 'plot' ? null : (isPGHostel ? 1 : randomInt(1, 4));
                const bathrooms = bedrooms ? (isPGHostel ? 1 : randomInt(1, bedrooms)) : null;
                const size = propertyType === 'plot' ? randomInt(1000, 5000) : (isPGHostel ? randomInt(100, 300) : randomInt(600, 3000));
                const price = generatePrice(bedrooms || 2, cityData.name, propertyType, listingType);
                const owner = randomChoice(users);

                // Generate lifestyle attributes based on property type
                let genderPref = 'any';
                let bachelorFriendly = true;
                let vegetarianOnly = false;
                let petFriendly = false;
                let minLease = 11;
                let depositMonths = 2;

                if (isPGHostel) {
                    // PG/Hostel specific attributes
                    genderPref = randomChoice(genderPreferences);
                    bachelorFriendly = true;
                    vegetarianOnly = randomBool(0.4); // 40% chance
                    petFriendly = false; // PGs usually don't allow pets
                    minLease = randomChoice([1, 3, 6, 11]);
                    depositMonths = randomChoice([1, 2]);
                } else {
                    // Flats/Homes
                    genderPref = 'any';
                    bachelorFriendly = randomBool(0.7); // 70% allow bachelors
                    vegetarianOnly = randomBool(0.25); // 25% vegetarian only
                    petFriendly = randomBool(0.3); // 30% pet friendly
                    minLease = randomChoice([6, 11, 12, 24]);
                    depositMonths = randomChoice([1, 2, 3, 6]);
                }

                // Location attributes
                const nearMetro = randomBool(0.35); // 35% near metro
                const nearCollege = randomBool(0.25) ? randomChoice(cityData.colleges) : null;

                // Generate coordinates near city center
                const lat = cityData.lat + (Math.random() * 0.1 - 0.05);
                const lng = cityData.lng + (Math.random() * 0.1 - 0.05);

                // Generate amenities first (needed for features)
                const propertyAmenities = randomChoices(amenitiesList, randomInt(4, 8));
                
                // Generate property features with images and descriptions
                const propertyFeatures = generatePropertyFeatures(propertyType, bedrooms, propertyAmenities);

                const property = await Property.create({
                    owner_id: owner.id,
                    title: `${bedrooms ? bedrooms + ' BHK' : ''} ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} in ${locality}`.trim(),
                    description: `${isPGHostel ? 'Comfortable' : 'Beautiful'} ${propertyType} in ${locality}, ${cityData.name}. ${nearMetro ? 'Walking distance from metro station. ' : ''}${nearCollege ? `Near ${nearCollege}. ` : ''}${vegetarianOnly ? 'Vegetarian families only. ' : ''}${!bachelorFriendly ? 'Families preferred. ' : ''}`,
                    property_type: propertyType,
                    listing_type: listingType,
                    address: `${randomInt(1, 500)} ${locality} Road`,
                    city: cityData.name,
                    locality: locality,
                    state: cityData.state,
                    postal_code: `${randomInt(100, 999)}${randomInt(100, 999)}`,
                    latitude: lat,
                    longitude: lng,
                    price: price,
                    size: size,
                    bedrooms: bedrooms,
                    bathrooms: bathrooms,
                    furnished: propertyType !== 'plot' ? randomChoice(furnishedStatus) : null,
                    amenities: propertyAmenities,
                    features: propertyFeatures,
                    available_from: new Date(Date.now() + randomInt(0, 30) * 24 * 60 * 60 * 1000),
                    status: randomInt(1, 100) > 10 ? 'available' : randomChoice(['sold', 'under_negotiation']),
                    // Lifestyle attributes
                    pet_friendly: petFriendly,
                    vegetarian_only: vegetarianOnly,
                    gender_preference: genderPref,
                    bachelor_friendly: bachelorFriendly,
                    min_lease_months: minLease,
                    deposit_months: depositMonths,
                    maintenance_included: randomBool(0.3),
                    near_metro: nearMetro,
                    near_college: nearCollege
                });

                // Add images
                const exteriorCount = randomInt(1, 2);
                const interiorCount = randomInt(3, 4);
                const selectedExteriors = randomChoices(exteriorImages, exteriorCount);
                const selectedInteriors = randomChoices(interiorImages, interiorCount);
                const allImages = [...selectedExteriors, ...selectedInteriors];

                for (let j = 0; j < allImages.length; j++) {
                    await Image.create({
                        property_id: property.id,
                        image_url: allImages[j],
                        display_order: j
                    });
                }

                propertyCount++;
            }

            console.log(`✅ Added ${propertiesPerCity} properties for ${cityData.name}`);
        }

        console.log(`\n✅ Database seeded successfully!`);
        console.log(`📊 Total properties created: ${propertyCount}`);
        console.log(`👥 Total users created: ${users.length + 10}`);
        console.log(`\n🎉 Ready with lifestyle filters!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
