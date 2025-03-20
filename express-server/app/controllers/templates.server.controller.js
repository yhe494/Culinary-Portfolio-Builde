const Template = require("../models/template.model"); // Import Mongoose Model
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
  const template = new Template(req.body);
  console.log("Creating template with data: ", req.body);

  try {
    await template.save();
    console.log("Template created successfully: ", template);
    res.json(template);
  } catch (err) {
    console.error(getErrorMessage(err));
    return next(err);
  }
};

// Return all templates
exports.list = async (req, res, next) => {
  try {
    const templates = await Template.find({});
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

// Middleware to check if the user is an admin
exports.requiresAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({ message: "User is not authorized" });
  }
};
