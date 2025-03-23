const templates = require("../controllers/templates.server.controller");
const express = require("express");
const router = express.Router();

module.exports = function (app) {
  // 🔓 GET: All logged-in users can fetch templates (creators + admins)
  app.get(
    "/templates",
    templates.requiresLogin,
    //templates.requresAdmin //-has to be uncomment when working on templates (Admin side)
    templates.list
  );

  // ✅ POST: Any logged-in user can create a template (temporary use for creators)
  app.post(
    "/template",
    templates.requiresLogin,
    templates.create
  );

  // 🔐 Individual template operations: protected for editing/deleting
  app
    .route("/templates/:templateId")
    .get(templates.read) // anyone can read
    .put(templates.requiresLogin, templates.update) // only logged in can edit
    .delete(templates.requiresLogin, templates.delete); // only logged in can delete

  // Template ID parameter preloading
  app.param("templateId", templates.templateByID);
};
