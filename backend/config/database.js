const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'ResiDo',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    }
);

module.exports = sequelize;
