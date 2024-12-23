import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  level: { type: Number, required: true, default: 4 },
  verified: { type: Boolean, required: true, default: false },
  fName: { type: String, required: true, default: "User" },
  eName: { type: String },
  image: { type: String, required: true, default: "user.png" },
  designation: { type: String },
  region: { type: String },
  branch: { type: String },
  mobileNo: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

// Prevents redefining the model during hot reloading
export default mongoose.models?.User || mongoose.model("User", UserSchema);
