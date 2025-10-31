import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  authority: { type: String, enum: ["FM", "HQM"], required: true },
  location: { type: String },
  fleet: { type: String },
});

export default models.User || mongoose.model("User", UserSchema);


