const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('my_project_db', 'my_user', 'dharmik', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});
module.exports = sequelize;