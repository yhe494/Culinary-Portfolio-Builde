var students = require('../controllers/students.server.controller');
var express = require('express');
var router = express.Router();
var passport = require('passport');

module.exports = function(app){
    // Handle a get request made to /students path and list students when /students is visited
    app.get('/students', students.list); // Go to http://localhost:3000/students to see the list of students
    // Handle a post request made to root path
    app.post('/students', students.create);
    // Set up the 'students' parameterized routes
    app.route('/students/:studentId')
        .get(students.read)
        .put(students.update)
        .delete(students.delete);
    app.route('/api/student/courses')
        .get(passport.authenticate('jwt', { session: false }), students.getStudentCourses)
        .post(passport.authenticate('jwt', { session: false }), students.addStudentToCourse)
        .put(passport.authenticate('jwt', { session: false }), students.updateStudentCourse)
        .delete(passport.authenticate('jwt', { session: false }), students.removeStudentFromCourse);
    // Add a new route to search for a student by student number
    app.get('/students/search/:studentNumber', students.studentByNumber);

    app.param('studentId', students.studentByID);
    app.post('/signin', students.authenticate);
    app.post('/signout', students.signout);
    app.get('/read_cookie', students.isSignedIn);

    app.get('/welcome', students.welcome);
}