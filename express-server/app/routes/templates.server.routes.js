var templates = require("../controllers/templates.server.controller");
var express = require("express");
var router = express.Router();

module.exports = function (app) {
  app.get(
    "/templates",
    templates.requiresLogin,
    templates.requiresAdmin,
    templates.list
  );

  app.post("/template", templates.requiresLogin, templates.create);

  app
    .route("/templates/:templateId")
    .get(templates.read)
    .put(templates.requiresLogin, templates.update)
    .delete(templates.requiresLogin, templates.delete);

  app.param("templateId", templates.templateByID);
};
