module.exports = function (app) {
    const { searchPosts } = require("../controllers/search.server.controller");
  
    app.get("/search", searchPosts);
  };
  