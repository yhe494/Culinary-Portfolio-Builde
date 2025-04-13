require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    db: process.env.DB,
    sessionSecret: process.env.SESSION_SECRET,
    secretKey: process.env.SECRET_KEY
}; 