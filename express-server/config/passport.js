const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Student = mongoose.model('Student');
const config = require('./config'); 

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey 
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const student = await Student.findById(jwt_payload.id);
    if (student) {
      return done(null, student);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;