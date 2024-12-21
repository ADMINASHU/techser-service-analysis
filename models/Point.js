import mongoose from 'mongoose';

const PointSchema = new mongoose.Schema({
  category: { type: String, required: true },
  data: {
    eng: { 
      new: { type: Number, required: true },
      pending: { type: Number, required: true },
      closed: { type: [Number], required: true }
    },
    branch: { 
      new: { type: Number, required: true },
      pending: { type: Number, required: true },
      closed: { type: Number, required: true }
    },
    region: { 
      new: { type: Number, required: true },
      pending: { type: Number, required: true },
      closed: { type: Number, required: true }
    }
  }
});

export default mongoose.models.Point || mongoose.model('Point', PointSchema);
