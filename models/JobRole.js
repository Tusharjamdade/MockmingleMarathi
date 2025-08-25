import mongoose from "mongoose";

const JobRoleSchema = new mongoose.Schema({
  // Use "role" everywhere (same as English & Marathi "standard")
  role: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true 
  },

  level: { 
    type: String, 
    default: "Beginner" // optional, default for Marathi site
  },

  // Optional board (Marathi site had this, English site may not)
  board: { 
    type: String, 
    default: "Not Specified" 
  },

  // Optional subject (Marathi site had this, English site may not)
  subject: { 
    type: String, 
    default: "General" 
  },

  questions: [
    {
      questionText: { type: String, required: true },
      answer: { type: String, default: null },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.models.JobRole || mongoose.model("JobRole", JobRoleSchema);
