import { Schema, model } from "mongoose";

interface IOTP {
  userId: string;
  OTP: String;
  expiresIn: Date;
}

const OTPSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    OTP: {
      type: String,
      unique: true,
    },
    expiresIn: {
      type: Date,
    },
  },
  { timestamps: true }
);

OTPSchema.pre("save", async function (next) {
  try {
    const existingOTP = await OTP.findOne({ userId: this.userId });

    if (existingOTP) {
      // Delete the existing OTP if found
      await OTP.findOneAndDelete({ OTP: existingOTP.OTP });
    }
  } catch (error) {
    next(error);
  }
});

const OTP = model("OTPs", OTPSchema);

export default OTP;
