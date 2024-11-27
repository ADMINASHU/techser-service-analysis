// app/models/User.js
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
  verified: { type: Boolean,required: true, default: false },
  fName: { type: String },
  eName: { type: String },
  image: { type: String },
  designation: { type: String },
  region: { type: String },
  branch: { type: String },
  mobileNo: { type: String },
});

export const User = mongoose.models?.User ?? mongoose.model("User", UserSchema);
