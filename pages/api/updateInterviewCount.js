import mongoose from 'mongoose';
import User from '@/models/User';

export default async function handler(req, res) {
  // Ensure the connection to MongoDB is active
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, action } = req.body;

  // Validate required fields
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize completed interviews count if not set
    if (user.no_of_interviews_completed === undefined) {
      user.no_of_interviews_completed = 0;
    }
    
    // Set no_of_interviews to a high number to simulate unlimited
    user.no_of_interviews = 999999;
    
    // Always increment completed interviews for 'complete' action
    if (action === 'complete') {
      user.no_of_interviews_completed = user.no_of_interviews_completed + 1;
    }
    
    // Save the updated user
    await user.save();
    
    return res.status(200).json({ 
      success: true,
      message: action === 'complete' 
        ? 'Interview completion recorded successfully' 
        : 'Interview count updated',
      no_of_interviews: user.no_of_interviews,
      no_of_interviews_completed: user.no_of_interviews_completed
    });
  } catch (error) {
    console.error('Error updating interview count:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
