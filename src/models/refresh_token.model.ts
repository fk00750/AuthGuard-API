import { Schema, model } from "mongoose";

interface IRefresh {
  refreshToken: string;
  expiresAt: Number;
  status: "valid" | "invalid";
  userId: string;
}

const RefreshSchema = new Schema<IRefresh>(
  {
    refreshToken: {
      type: String,
      unique: true,
    },
    expiresAt: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "invalid",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RefreshToken = model("RefreshTokens", RefreshSchema);

export default RefreshToken;
