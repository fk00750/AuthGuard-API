import { Schema, model } from "mongoose";

interface IResetKey {
  userId: string;
  resetkey: string;
  verified: Boolean;
  expiresAt: Date;
}

const ResetKeySchema = new Schema<IResetKey>({
  userId: {
    type: String,
    unique: true,
  },
  resetkey: {
    type: String,
    unique: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  expiresAt: { type: Date, default: Date.now() + 5 * 60 * 1000 },
});

// Date.now() + 5 * 60 * 1000 is a timestamp that represents the current time plus 5 minutes (5 minutes * 60 seconds/minute * 1000 milliseconds/second) in the future

const Resetkey = model("resetkeys", ResetKeySchema);

export default Resetkey;
