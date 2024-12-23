// app/models/Data.js
import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  ACCOUNTTYPE: String,
  ADDRESS: String,
  BRANCH: String,
  DESIGNATION: String,
  DISTRICT: String,
  EMAIL: String,
  EMPID: String,
  GRADE: String,
  INSERTEDDATETIME: String,
  NAME: String,
  PASSWORD: String,
  PHONENO: String,
  PINCODE: String,
  REGION: String,
  REPORTINGID: String,
  STATE: String,
  STATUS: String,
  UMID: String,
  USERNAME: String,
  WORKLOCATION: String,
});

export default mongoose.models.UserData || mongoose.model("UserData", DataSchema);
