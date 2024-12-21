// app/models/Data.js
import mongoose from "mongoose";
const DataSchema = new mongoose.Schema({
  blank: String,
  callNo: String,
  faultReport: String,
  callDate: String,
  callStartEndDate: String,
  engineerName: String,
  serialNo: String,
  unitStatus: String,
  customerName: String,
  phoneEmail: String,
  contactPerson: String,
  regionBranch: String,
  cityState: String,
  servicePersonRemarks: String,
});

export const Data = mongoose.models.Data || mongoose.model("Data", DataSchema);
