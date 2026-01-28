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

// Property images
const exteriorImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=300&fit=crop&q=80'
];

const interiorImages = [
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&q=80'
];

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
        'Mumbai': 1.5, 'Delhi': 1.3, 'Bangalore': 1.2, 'Pune': 1.0,
        'Hyderabad': 0.9, 'Chennai': 0.9, 'Kolkata': 0.8,
        'Ahmedabad': 0.7, 'Jaipur': 0.6, 'Chandigarh': 0.8
    };

    let basePrice;

    if (listingType === 'rent') {
        // Rental prices (monthly)
        if (propertyType === 'pg' || propertyType === 'hostel' || propertyType === 'room') {
            basePrice = 5000 + (randomInt(0, 10) * 1000); // 5k-15k
        } else if (propertyType === 'villa') {
            basePrice = 50000 + (bedrooms * 15000);
        } else {
            basePrice = 10000 + (bedrooms * 8000);
        }
    } else {
        // Sale prices
        if (propertyType === 'villa') basePrice = 12000000;
        else if (propertyType === 'plot') basePrice = 5000000;
        else if (propertyType === 'commercial') basePrice = 15000000;
        else basePrice = 3000000 + ((bedrooms || 2) * 1500000);
    }

    return Math.floor(basePrice * cityMultiplier[city] * (0.8 + Math.random() * 0.4));
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
                email: `owner${i}@roomgi.com`,
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
                email: `buyer${i}@roomgi.com`,
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
                const listingType = isPGHostel ? 'rent' : (randomInt(1, 10) > 7 ? 'rent' : 'sale');

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
                    amenities: randomChoices(amenitiesList, randomInt(4, 8)),
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
