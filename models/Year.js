// app/models/Data.js
import mongoose from "mongoose";
const YearSchema = new mongoose.Schema({
  year: String,
  selectYears: [String],
});

export default mongoose.models.Year || mongoose.model("Year", YearSchema);
