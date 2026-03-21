import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // validate fields
    if (!name || !username || !password) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    // check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password length should be at least 6",
      });
    }

    // convert username to lowercase
    const normalizedUsername = username.trim().toLowerCase();

    const newUser = await User.create({
      name,
      username: normalizedUsername,
      password,
    });

    return res.status(201).json({
      message: "User Created",
      data: { id: newUser._id },
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error: ${err.message}`,
    });
  }
};
