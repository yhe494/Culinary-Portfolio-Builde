var users = require('../controllers/users.server.controller');
var express = require('express');
var router = express.Router();

module.exports = function (app) {
    // Handle a get request made to /users path and list users
    app.get('/users', users.requiresLogin, users.requiresAdmin, users.list);

    // Handle a post request to create a new user
    app.post('/users', users.create);

    // Set up the 'users' parameterized routes
    app.route('/users/:userId')
        .get(users.read)
        .put(users.requiresLogin, users.update)
        .delete(users.requiresLogin, users.delete);

    // Authentication routes
    app.post('/signin', users.authenticate); // Changed from /login to /signin
    app.post('/logout', users.signout);
    app.get('/check-auth', users.isSignedIn);

    // Set up route parameter middleware
    app.param('userId', users.userByID);
};