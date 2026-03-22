import { User } from "../models/user.model.js";
import { APIError } from "../utils/APIError.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      throw new APIError("Unauthorized", 401);
    }

    return res.status(200).json({
      message: `Fetched user data`,
      data: { name: user.name, username: user.username },
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

// aayiye bahaar ko hum baant le
