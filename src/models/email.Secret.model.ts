import { Schema, model } from "mongoose";

const emailVerificationSecret = new Schema({
  userId: String,
  secret: String,
});

const emailVerificationSecretModel = model(
  "emailSecret",
  emailVerificationSecret
);

export default emailVerificationSecretModel;
