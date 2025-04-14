require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5001,
    db: process.env.db || 'mongodb://localhost/studentsandcourses-db',
    sessionSecret: process.env.SESSION_SECRET || 'developmentSessionSecret',
    secretKey: process.env.SECRET_KEY || 'real_secret'
}; 