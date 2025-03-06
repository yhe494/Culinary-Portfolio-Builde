var config = require('./config'),
    mongoose = require('mongoose');
//Define the Mongoose configuration method
module.exports = function(){
    //Use Mongoose to connect to MongoDB
    const db = mongoose.connect(config.db, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(() => console.log('Connected to MongoDB...'))
    .catch(err => {console.error('Could not connect to MongoDB...', err);});

    //Load the 'Student' model
    require('../app/models/student.server.model');
    //Load the 'Course' model
    require('../app/models/course.server.model');

    return db;
}