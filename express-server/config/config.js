const env = process.env.NODE_ENV || 'development';
const config = require(`./env/${env}.config`);
module.exports = config;
