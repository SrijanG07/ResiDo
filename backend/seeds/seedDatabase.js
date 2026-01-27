const { sequelize, User, Property, Image } = require('../models');

// Indian cities with localities
const cities = [
    {
        name: 'Bangalore',
        state: 'Karnataka',
        localities: ['Koramangala', 'Whitefield', 'HSR Layout', 'Indiranagar', 'Jayanagar', 'Electronic City', 'Marathahalli', 'BTM Layout', 'Yelahanka', 'JP Nagar']
    },
    {
        name: 'Delhi',
        state: 'Delhi',
        localities: ['Connaught Place', 'Dwarka', 'Rohini', 'Rajouri Garden', 'Saket', 'Nehru Place', 'Lajpat Nagar', 'Karol Bagh', 'Vasant Kunj', 'Mayur Vihar']
    },
    {
        name: 'Mumbai',
        state: 'Maharashtra',
        localities: ['Andheri', 'Bandra', 'Powai', 'Thane', 'Malad', 'Borivali', 'Goregaon', 'Dadar', 'Lower Parel', 'Worli']
    },
    {
        name: 'Pune',
        state: 'Maharashtra',
        localities: ['Hinjewadi', 'Kothrud', 'Viman Nagar', 'Wakad', 'Baner', 'Aundh', 'Kharadi', 'Magarpatta', 'Hadapsar', 'Pimple Saudagar']
    },
    {
        name: 'Hyderabad',
        state: 'Telangana',
        localities: ['Gachibowli', 'Jubilee Hills', 'HITEC City', 'Kondapur', 'Madhapur', 'Banjara Hills', 'Kukatpally', 'Miyapur', 'Secunderabad', 'LB Nagar']
    },
    {
        name: 'Chennai',
        state: 'Tamil Nadu',
        localities: ['Anna Nagar', 'T Nagar', 'OMR', 'Adyar', 'Velachery', 'Tambaram', 'Porur', 'Chromepet', 'Perungudi', 'Sholinganallur']
    },
    {
        name: 'Kolkata',
        state: 'West Bengal',
        localities: ['Salt Lake', 'New Town', 'Ballygunge', 'Park Street', 'Rajarhat', 'Howrah', 'Barasat', 'Dum Dum', 'Jadavpur', 'Garia']
    },
    {
        name: 'Ahmedabad',
        state: 'Gujarat',
        localities: ['Satellite', 'Vastrapur', 'Prahlad Nagar', 'Bodakdev', 'Navrangpura', 'SG Highway', 'Maninagar', 'Chandkheda', 'Gota', 'Thaltej']
    },
    {
        name: 'Jaipur',
        state: 'Rajasthan',
        localities: ['Malviya Nagar', 'Mansarovar', 'Vaishali Nagar', 'C-Scheme', 'Jagatpura', 'Raja Park', 'Sitapura', 'Tonk Road', 'Ajmer Road', 'Bani Park']
    },
    {
        name: 'Chandigarh',
        state: 'Chandigarh',
        localities: ['Sector 17', 'Sector 35', 'Sector 22', 'Sector 43', 'Sector 8', 'Sector 9', 'Sector 26', 'Sector 40', 'Sector 15', 'Sector 34']
    }
];

// Property images from Unsplash
const propertyImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop'
];

const propertyTypes = ['flat', 'home', 'villa', 'plot', 'commercial'];
const furnishedStatus = ['unfurnished', 'semi-furnished', 'fully-furnished'];
const amenitiesList = ['Parking', 'WiFi', 'Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Lift', 'Club House', 'Garden', 'Play Area'];

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

function generatePrice(bedrooms, city, propertyType) {
    let basePrice;
    const cityMultiplier = {
        'Mumbai': 1.5,
        'Delhi': 1.3,
        'Bangalore': 1.2,
        'Pune': 1.0,
        'Hyderabad': 0.9,
        'Chennai': 0.9,
        'Kolkata': 0.8,
        'Ahmedabad': 0.7,
        'Jaipur': 0.6,
        'Chandigarh': 0.8
    };

    if (propertyType === 'villa') basePrice = 12000000;
    else if (propertyType === 'plot') basePrice = 5000000;
    else if (propertyType === 'commercial') basePrice = 15000000;
    else basePrice = 3000000 + (bedrooms * 1500000);

    return Math.floor(basePrice * cityMultiplier[city] * (0.8 + Math.random() * 0.4));
}

async function seedDatabase() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();

        console.log('🔄 Syncing database...');
        await sequelize.sync({ force: true }); // WARNING: This drops all tables

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

        // Create some buyers
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

        console.log('🔄 Creating 200+ properties across Indian cities...');
        let propertyCount = 0;

        for (const cityData of cities) {
            const propertiesPerCity = 20 + randomInt(0, 10);

            for (let i = 0; i < propertiesPerCity; i++) {
                const locality = randomChoice(cityData.localities);
                const propertyType = randomChoice(propertyTypes);
                const bedrooms = propertyType === 'plot' ? null : randomInt(1, 4);
                const bathrooms = bedrooms ? randomInt(1, bedrooms) : null;
                const size = propertyType === 'plot' ? randomInt(1000, 5000) : randomInt(600, 3000);
                const price = generatePrice(bedrooms || 2, cityData.name, propertyType);
                const owner = randomChoice(users);

                const property = await Property.create({
                    owner_id: owner.id,
                    title: `${bedrooms ? bedrooms + ' BHK' : ''} ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} in ${locality}`,
                    description: `Beautiful ${propertyType} located in prime location of ${locality}, ${cityData.name}. ${bedrooms ? 'Spacious ' + bedrooms + ' bedroom' : 'Prime location'} with modern amenities.`,
                    property_type: propertyType,
                    listing_type: randomInt(1, 10) > 7 ? 'rent' : 'sale',
                    address: `${randomInt(1, 500)} ${locality} Road`,
                    city: cityData.name,
                    locality: locality,
                    state: cityData.state,
                    postal_code: `${randomInt(100, 999)}${randomInt(100, 999)}`,
                    latitude: 12.9716 + (Math.random() * 0.5 - 0.25),
                    longitude: 77.5946 + (Math.random() * 0.5 - 0.25),
                    price: price,
                    size: size,
                    bedrooms: bedrooms,
                    bathrooms: bathrooms,
                    furnished: propertyType !== 'plot' ? randomChoice(furnishedStatus) : null,
                    amenities: randomChoices(amenitiesList, randomInt(3, 7)),
                    available_from: new Date(),
                    status: randomInt(1, 100) > 10 ? 'available' : randomChoice(['sold', 'under_negotiation'])
                });

                // Add 3-5 images per property
                const imageCount = randomInt(3, 5);
                const imageUrls = randomChoices(propertyImages, imageCount);

                for (let j = 0; j < imageUrls.length; j++) {
                    await Image.create({
                        property_id: property.id,
                        image_url: imageUrls[j],
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
        console.log(`\n🎉 Ready to use!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
