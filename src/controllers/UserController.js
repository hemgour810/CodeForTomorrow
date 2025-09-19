const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 4);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.json({ message: "User successfully registered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found. Please try again" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "user not found" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  user.resetToken = token;
  user.resetTokenExpiry = Date.now();
  await user.save();
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (
      !user ||
      user.resetToken !== token ||
      user.resetTokenExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 4);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status({ message: "password reset successfuly" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
