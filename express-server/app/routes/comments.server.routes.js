const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments.server.controller");


module.exports = function (app) {
  // Routes for comments
  app.post("/:recipeId/comments", commentsController.addComment);
  app.delete("/:recipeId/comments/:commentId", commentsController.deleteComment);
  app.put("/:recipeId/comments/:commentId", commentsController.updateComment);
  app.get("/:recipeId/comments", commentsController.showComments);
};
