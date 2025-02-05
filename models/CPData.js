import mongoose from "mongoose";

const CpSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  custId: { type: String },
  prodId: { type: String },
  serialNo: { type: String },
  pincode: { type: String },
  customerName: { type: String },
  customerAddress: { type: String },
  state: { type: String },
  city: { type: String },
  region: { type: String },
  branch: { type: String },
  prodDescription: { type: String },
  batMake: { type: String },
  batType: { type: String },
  batteryCode: { type: String },
  batteryCapacity: { type: String },
  batteryQty: { type: String },
  category: { type: String },
  name: { type: String },
  series: { type: String },
  model: { type: String },
  modelCode: { type: String },
  capacity: { type: String },
  capacityUnit: { type: String },
  callIds: [
    {
      callNo: { type: String },
      natureOfComplaint: { type: String },
    },
  ],
});

export default mongoose.models.CPData || mongoose.model("CPData", CpSchema);
