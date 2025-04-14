const mongoose = require("mongoose");
const RecipeTemplate = mongoose.model("RecipeTemplate");

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { user, content } = req.body;

    if (!user || !content) {
      return res.status(400).json({ message: "User and content are required." });
    }

    const recipe = await RecipeTemplate.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    recipe.comments.push({ user, content });
    await recipe.save();

    res.status(201).json({ message: "Comment added successfully.", comments: recipe.comments });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment.", error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { recipeId, commentId } = req.params;

    const recipe = await RecipeTemplate.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    const commentIndex = recipe.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found." });
    }

    recipe.comments.splice(commentIndex, 1);
    await recipe.save();

    res.status(200).json({ message: "Comment deleted successfully.", comments: recipe.comments });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment.", error: error.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { recipeId, commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required." });
    }

    const recipe = await RecipeTemplate.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    const comment = recipe.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    comment.content = content;
    comment.updatedAt = Date.now();
    await recipe.save();

    res.status(200).json({ message: "Comment updated successfully.", comments: recipe.comments });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment.", error: error.message });
  }
};

// Show all comments
exports.showComments = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await RecipeTemplate.findById(recipeId).populate("comments.user", "name email");
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    res.status(200).json({ comments: recipe.comments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments.", error: error.message });
  }
};