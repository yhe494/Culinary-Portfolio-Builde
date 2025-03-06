const courses = require('../controllers/courses.server.controller');
const passport = require('passport');

module.exports = function(app) {
    app.route('/api/courses')
        .get(courses.list)
        .post(courses.create);

    app.route('/api/courses/:courseId')
        .get(courses.read)
        .put(courses.update)
        .delete(courses.delete);

    app.route('/api/courses/:courseCode/students')
        .get(courses.getStudentsByCourseCode);

    app.param('courseId', courses.courseByID);
};