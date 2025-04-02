module.exports = function (app) {
    const { searchPosts } = require("../controllers/search.server.controller");
  
    app.get("/search", searchPosts);
  };
<<<<<<< HEAD
  
=======
>>>>>>> 8b9d4896c3a892e9d084a71e4676746148e08321
  