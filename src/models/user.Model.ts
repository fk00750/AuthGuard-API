import { model, Schema,SchemaOptions } from "mongoose";
import generatePassword from "../utils/generate.Secure.Password";

interface IUser {
  Id?: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please Provide Username"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please Provide Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
  },
  role: {
    type: String,
    default: "User",
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword: string = await generatePassword(
      this.id,
      this.password
    );
    this.password = hashedPassword;
  } catch (error) {
    next(error);
  }
});

const User = model("User", UserSchema);

export default User;
