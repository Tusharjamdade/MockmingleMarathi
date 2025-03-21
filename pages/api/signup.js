// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User"
import connectDb from "@/middleware/dbConnect"
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
    if (req.method == 'POST') {
        const {profileImg,fullName,email,mobileNo,address,DOB,education,collageName} = req.body
        let u = new User({profileImg,fullName, email,mobileNo,address,DOB,education,collageName, password: CryptoJS.AES.encrypt(req.body.password,'secret123').toString()})
        await u.save()
            
        res.status(200).json({ success: "success" })
        }
    
    else {
        res.status(400).json({ error: "this method is not allowed" })
    }


}

export default connectDb(handler)

// import User from "@/models/User"
// import connectDb from "@/middleware/dbConnect"
// var CryptoJS = require("crypto-js");

// const handler = async (req, res) => {
//     if (req.method === 'POST') {
//         try {
//             const { profileImg, fullName, email, mobileNo, address, DOB, education, password } = req.body;

//             // Validate required fields
//             if (!email || !password || !fullName) {
//                 return res.status(400).json({ error: "Please provide all required fields." });
//             }

//             // Check if email already exists
//             const existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res.status(400).json({ error: "This email is already in use. Please choose a different one." });
//             }

//             // Encrypt the password before saving
//             const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret123').toString();

//             // Create new user
//             let newUser = new User({ profileImg, fullName, email, mobileNo, address, DOB, education, password: encryptedPassword });
//             await newUser.save();

//             // Respond with success
//             return res.status(200).json({ success: "User created successfully." });

//         } catch (error) {
//             // Catch duplicate key error (email already exists)
//             if (error.code === 11000) {
//                 return res.status(400).json({ error: "This email is already in use. Please choose a different one." });
//             }

//             // Log the error for debugging
//             console.error(error);

//             // Handle general server error
//             return res.status(500).json({ error: "An error occurred while creating the user. Please try again later." });
//         }
//     } else {
//         res.status(400).json({ error: "This method is not allowed." });
//     }
// };

// export default connectDb(handler);










// import User from "@/models/User";
// import connectDb from "@/middleware/dbConnect";
// import mongoose from "mongoose";
// var CryptoJS = require("crypto-js");

// const handler = async (req, res) => {
//     if (mongoose.connections[0].readyState) return;
//           await mongoose.connect(process.env.MONGODB_URI);
//     if (req.method === 'POST') {
        
        
        
//         try {
//             const { profileImg, fullName, email, mobileNo, address, DOB, education, password } = req.body;

//             // Validate required fields
//             if (!email || !password || !fullName) {
//                 return res.status(400).json({ error: "Please provide all required fields." });
//             }

//             // Check if email already exists
//             const existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res.status(400).json({ error: "This email is already in use. Please choose a different one." });
//             }

//             // Encrypt the password before saving
//             const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret123').toString();

//             // Create new user
//             let newUser = new User({ profileImg, fullName, email, mobileNo, address, DOB, education, password: encryptedPassword });
//             await newUser.save();

//             // Respond with success
//             return res.status(200).json({ success: "User created successfully." });

//         } catch (error) {
//             // Catch duplicate key error (email already exists)
//             if (error.code === 11000) {
//                 return res.status(400).json({ error: "This email is already in use. Please choose a different one." });
//             }

//             // Log the error for debugging
//             console.error(error);

//             // Handle general server error
//             return res.status(500).json({ error: "An error occurred while creating the user. Please try again later." });
//         }
//     } else if (req.method === 'PUT') {
//         if (mongoose.connections[0].readyState) return;
//           await mongoose.connect(process.env.MONGODB_URI);
//         try {
//             const { email, profileImg, fullName, mobileNo, address, DOB, education, password } = req.body;

//             // Validate email
//             if (!email) {
//                 return res.status(400).json({ error: "Please provide the email of the user to update." });
//             }

//             // Find the user by email
//             const user = await User.findOne({ email });
//             if (!user) {
//                 return res.status(404).json({ error: "User not found." });
//             }

//             // Update the user fields if provided
//             if (profileImg) user.profileImg = profileImg;
//             if (fullName) user.fullName = fullName;
//             if (mobileNo) user.mobileNo = mobileNo;
//             if (address) user.address = address;
//             if (DOB) user.DOB = DOB;
//             if (education) user.education = education;

//             // Encrypt the password if it's provided
//             if (password) {
//                 const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret123').toString();
//                 user.password = encryptedPassword;
//             }

//             // Save the updated user
//             await user.save();

//             // Respond with success
//             return res.status(200).json({ success: "User updated successfully." });

//         } catch (error) {
//             // Log the error for debugging
//             console.error(error);

//             // Handle general server error
//             return res.status(500).json({ error: "An error occurred while updating the user. Please try again later." });
//         }
//     } else if (req.method === 'GET') {
//         try {
//             const { email } = req.query;  // Getting email from query params

//             // Validate that email is provided
//             if (!email) {
//                 return res.status(400).json({ error: "Please provide the email of the user." });
//             }

//             // Find the user by email
//             const user = await User.findOne({ email });
//             if (!user) {
//                 return res.status(404).json({ error: "User not found." });
//             }

//             // Exclude sensitive fields (password)
//             const { password, ...userData } = user.toObject();

//             // Return the user's data (excluding password)
//             return res.status(200).json(userData);

//         } catch (error) {
//             // Log the error for debugging
//             console.error(error);

//             // Handle general server error
//             return res.status(500).json({ error: "An error occurred while fetching the user. Please try again later." });
//         }
//     } else {
//         res.status(400).json({ error: "This method is not allowed." });
//     }
// };

// export default connectDb(handler);


// // import bcrypt from 'bcryptjs';

// // // Encrypt the password using bcrypt
// // const salt = await bcrypt.genSalt(10);
// // const hashedPassword = await bcrypt.hash(password, salt);

// // // Create new user
// // let newUser = new User({
// //   profileImg,
// //   fullName,
// //   email,
// //   mobileNo,
// //   address,
// //   DOB,
// //   education,
// //   password: hashedPassword,
// // });
// // await newUser.save();

// // // Check if email already exists before proceeding with PUT method
// // if (req.method === 'PUT') {
// //   const { email, profileImg, fullName, mobileNo, address, DOB, education, password } = req.body;
// //   const user = await User.findOne({ email });

// //   if (!user) {
// //     return res.status(404).json({ error: "User not found." });
// //   }

// //   // Handle password encryption conditionally
// //   if (password) {
// //     const salt = await bcrypt.genSalt(10);
// //     user.password = await bcrypt.hash(password, salt);
// //   }

// //   // Update fields
// //   user.profileImg = profileImg || user.profileImg;
// //   user.fullName = fullName || user.fullName;
// //   user.mobileNo = mobileNo || user.mobileNo;
// //   user.address = address || user.address;
// //   user.DOB = DOB || user.DOB;
// //   user.education = education || user.education;

// //   await user.save();
// //   return res.status(200).json({ success: "User updated successfully." });
// // }
