const User = require('mongoose').model('User'); // Assuming you're using Mongoose for database operations

// Controller to handle portfolio updates
exports.updatePortfolio = async (req, res) => {
  const { firstName, lastName, bio, website } = req.body;
  const userId = req.user.id; // Assuming user ID is available in the request (e.g., via authentication middleware)

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        "profile.firstName": firstName,
        "profile.lastName": lastName,
        "profile.bio": bio,
        "profile.website": website,
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Portfolio updated successfully", user });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({ message: "Failed to update portfolio" });
  }
};