var users = require("../controllers/users.server.controller");
// var portfolio = require('../controllers/portfolio.server.controller.js'); // Import the portfolio controller
var express = require("express");
var router = express.Router();

module.exports = function (app) {
  // Handle a get request made to /users path and list users
  app.get("/users", users.requiresLogin, users.requiresAdmin, users.list);

  // Handle a post request to create a new user
  app.post("/users", users.create);

  // Set up the 'users' parameterized routes
  app
    .route("/users/:userId")
    .get(users.read)
    .put(users.requiresLogin, users.update)
    .delete(users.requiresLogin, users.delete);

  // Authentication routes
  app.post("/signin", users.authenticate);
  app.post("/signout", users.signout);
  app.get("/read_cookie", users.isSignedIn);


  // Portfolio route
  // app.post('/portfolio', users.requiresLogin, portfolio.updatePortfolio); // Add the portfolio update route

  // Set up route parameter middleware
  app.param("userId", users.userByID);
};
