const Post = require("../models/template.server.model");

// Controller function to search posts by keyword
exports.searchPosts = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { ingredients: { $regex: q, $options: "i" } }
      ]
    });

    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).send("Server error");
  }
};




