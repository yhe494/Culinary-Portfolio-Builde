const User = require("mongoose").model("User");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const jwtExpirySeconds = 14400; // 4 hours
const jwtKey = config.secretKey;

const getErrorMessage = function (err) {
  var message = "";
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = "User already exists";
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

// Create a new user
exports.create = async function (req, res, next) {
  var user = new User(req.body);
  console.log("Creating user with data: ", req.body);

  try {
    await user.save();
    console.log("User created successfully: ", user);
    res.json(user);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error(message);
    res.status(500).json({ message }); 
  }
  
};

// Return all users
exports.list = async function (req, res, next) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    return next(err);
  }
};

// Only used when author info is needed

// Display a user
exports.read = function (req, res) {
  res.json(req.user);
};

// Find a user by ID
exports.userByID = async function (req, res, next, id) {
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};

// Update a user by ID
exports.update = async function (req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

// Delete a user by ID
exports.delete = async function (req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (err) {
    console.error("Error deleting user:", err);
    return next(err);
  }
};

// Authenticate a user
exports.authenticate = async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    console.log("Attempting authentication for user:", email);

    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).send({
        message: "Authentication failed. User not found.",
      });
    }

    console.log("Found user:", user.email);

    const isMatch = await user.authenticate(password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).send({
        message: "Authentication failed. Wrong password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        email: user.email,
      },
      jwtKey,
      {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      }
    );

    res.cookie("token", token, {
      maxAge: jwtExpirySeconds * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error("Authentication error:", err);
    return next(err);
  }
};

// Sign out function in the controller
exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.status("200").json({ message: "signed out" });
};

// Check if the user is signed in
exports.isSignedIn = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ screen: "auth" });
  }
  try {
    const payload = jwt.verify(token, jwtKey);
    // Fetch complete user information from database
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Send complete user information
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profile: user.profile,
      },
    });
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ screen: "auth" });
    }
    return res.status(400).end();
  }
};

// Middleware to check if the user is signed in
exports.requiresLogin = function (req, res, next) {
  // Check for token in cookies or Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ screen: "auth" });
  }

  try {
    const payload = jwt.verify(token, jwtKey);
    console.log("in requiresLogin - payload:", payload);
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
exports.requiresAdmin = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      message: "User is not authorized",
    });
  }
};
