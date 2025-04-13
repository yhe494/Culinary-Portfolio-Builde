const mongoose = require('mongoose');
const RecipeTemplate = mongoose.model('RecipeTemplate');

// Controller function to search posts by keyword
exports.searchPosts = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const posts = await RecipeTemplate.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        // Ingredients is a mixed type field in your schema, so we need a different approach
        // This assumes ingredients contain text that can be searched
        { "ingredients": { $regex: q, $options: "i" } }
      ]
    });

    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).send("Server error");
  }
};
