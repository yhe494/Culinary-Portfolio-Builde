//const Template = require("../models/template.server.model"); // Import Mongoose Model

const mongoose = require("mongoose");
require("../models/template.server.model");
const Template = mongoose.model("RecipeTemplate");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const jwtExpirySeconds = 14400; // 4 hours
const jwtKey = config.secretKey;

// Function to handle errors
const getErrorMessage = (err) => {
  let message = "";
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = "Template already exists";
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (const errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

// Create a new template
exports.create = async (req, res, next) => {
  const templateData = {
    ...req.body,
    createdBy: req.user.id, //log-in ID
  };

  console.log("Creating template with data: ", templateData);

  try {
    const template = new Template(templateData);
    await template.save();
    console.log("Template created successfully: ", template);
    res.status(201).json(template);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error("Template creation error:", message);
    res.status(500).json({ message });
  }
};

// Return all templates sorted by date created
exports.list = async (req, res, next) => {
  try {
    const templates = await Template.find({}).sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    return next(err);
  }
};

// Display a single template
exports.read = (req, res) => {
  res.json(req.template);
};

// Find a template by ID
exports.templateByID = async (req, res, next, id) => {
  try {
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).send({ message: "Template not found" });
    }
    req.template = template;
    next();
  } catch (err) {
    return next(err);
  }
};

// Update a template by ID
exports.update = async (req, res, next) => {
  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      req.template._id,
      req.body,
      { new: true }
    );
    if (!updatedTemplate) {
      return res.status(404).send({ message: "Template not found" });
    }
    res.json(updatedTemplate);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

// Delete a template by ID
exports.delete = async (req, res, next) => {
  try {
    const deletedTemplate = await Template.findByIdAndDelete(req.template._id);
    if (!deletedTemplate) {
      return res.status(404).send({ message: "Template not found" });
    }
    res.json({ message: "Template deleted successfully" });
  } catch (err) {
    console.error("Error deleting template:", err);
    return next(err);
  }
};

//Get templates by userID and sort by date created
exports.getTemplatesByUserID = async (req, res, next) => {
  try {
    // Convert string ID to MongoDB ObjectId
    console.log("User ID:", req.params.userId);
    const userId = mongoose.Types.ObjectId.createFromHexString(req.params.userId);
    const templates = await Template.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    // Handle invalid ObjectId format error specifically
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    return next(err);
  }
};


// Middleware to check if the user is logged in
exports.requiresLogin = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ screen: "auth" });
  }

  try {
    const payload = jwt.verify(token, jwtKey);
    console.log("In requiresLogin - payload:", payload);
    req.id = payload.id;
    req.user = payload;
    next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ screen: "auth" });
    }
    return res.status(400).end();
  }
};


exports.rateRecipe = async (req, res) => {
  const userId = req.id; 
  const { score } = req.body;
  const templateId = req.params.templateId;

  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ message: "Score must be between 1 and 5" });
  }

  try {
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const alreadyRated = template.ratings.some(
      (r) => r.user.toString() === userId
    );

    if (alreadyRated) {
      return res.status(400).json({ message: "You already rated this recipe" });
    }

    template.ratings.push({
      user: userId,
      score: score,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const totalScore = template.ratings.reduce((sum, r) => sum + r.score, 0);
    template.averageRating = Number((totalScore / template.ratings.length).toFixed(1));
    template.ratingCount = template.ratings.length;

    await template.save();

    res.status(200).json(template);
  } catch (err) {
    console.error("Rating failed:", err);
    res.status(500).json({ message: "Failed to rate the recipe" });
  }
};

exports.listWithAuthor = async (req, res, next) => {
  try {
    const templates = await Template.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy", "firstName lastName");

    res.json(templates);
  } catch (err) {
    return next(err);
  }
};


// Middleware to check if the user is an admin
exports.requiresAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({ message: "User is not authorized" });
  }
};
