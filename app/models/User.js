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
    type: String,
    required: true,
    default: false,
  },
});

export const User = mongoose.models?.User ?? mongoose.model("User", UserSchema);
