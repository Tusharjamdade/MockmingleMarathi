import mongoose from 'mongoose';

const JobRoleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        default: null, // This will hold the user's answer
      }
    }
  ],
});

export default mongoose.models.JobRole || mongoose.model('JobRole', JobRoleSchema);
