import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      message: "Fetched users",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server Error: ${err.message}`,
    });
  }
};
