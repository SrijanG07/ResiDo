const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
    // Connect to default postgres database
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: 'postgres' // Connect to default postgres database first
    });

    try {
        await client.connect();
        console.log('✅ Connected to PostgreSQL');

        // Check if database exists
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            ['ResiDo']
        );

        if (result.rows.length === 0) {
            // Database doesn't exist, create it
            await client.query('CREATE DATABASE ResiDo');
            console.log('✅ Database "ResiDo" created successfully!');
        } else {
            console.log('✅ Database "ResiDo" already exists');
        }

        await client.end();
        console.log('\n🎉 Ready to seed! Run: npm run seed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createDatabase();
