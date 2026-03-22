import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

// Automatically delete any document once its expiresAt time is reached.
refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "ttl_expiry_index" },
);

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
