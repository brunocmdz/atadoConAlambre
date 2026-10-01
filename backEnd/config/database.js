const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'dbAtadoConAlambre', //nombre db
    'postgres', //usuario
    '1234', // contraseña
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

module.exports = sequelize;