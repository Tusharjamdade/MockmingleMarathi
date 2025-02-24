import mongoose from 'mongoose';

const ReportsSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  reportAnalysis: {
    type: String,
    required: true,
  },
},{timestamps:true});



export default mongoose.models.Reports || mongoose.model('Reports', ReportsSchema);
