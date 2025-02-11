import User from "@/models/User";
import connectDb from "@/middleware/dbConnect";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

// const handler = async (req, res) => {
//     if (req.method === "POST") {
//         try {
//             let user = await User.findOne({ email: req.body.email });

//             if (!user) {
//                 return res.status(401).json({ success: false, error: "No user found" });
//             }

//             // Decrypt stored password
//             const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET || "secret123");
//             const decryptedPass = bytes.toString(CryptoJS.enc.Utf8);

//             // Validate password
//             if (req.body.password !== decryptedPass) {
//                 return res.status(401).json({ success: false, error: "Invalid Credentials" });
//             }

//             // Generate JWT token with user data
//             const token = jwt.sign(
//                 {
//                     id: user._id,
//                     email: user.email,
//                     fullName: user.fullName,
//                     mobileNo: user.mobileNo, // Include role in the token
//                    profileImg:user.profileImg,
//                    address:user.address,
//                    DOB:user.DOB,
//                    education:user.education,

//                 },
//                 process.env.JWT_SECRET || "jwtsecret",
//                 { expiresIn: "1h" }
//             );

//             // Send user data and token in response
//             return res.status(200).json({
//                 success: true,
//                 token,
//                 user: {
//                     id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     mobileNo: user.mobileNo,
//                     profileImg:user.profileImg,
//                    address:user.address,
//                    DOB:user.DOB,
//                    education:user.education,
//                 },
//             });
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({ success: false, error: "An error occurred" });
//         }
//     } else {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }
// };

// export default connectDb(handler);


// const handler = async (req, res) => {
//     if (req.method === "POST") {
//         try {
//             let user = await User.findOne({ email: req.body.email });

//             if (!user) {
//                 return res.status(401).json({
//                     success: false,
//                     error: "No user found with this email. Please check your credentials."
//                 });
//             }

//             // Decrypt stored password
//             const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET || "secret123");
//             const decryptedPass = bytes.toString(CryptoJS.enc.Utf8);

//             // Validate password
//             if (req.body.password !== decryptedPass) {
//                 return res.status(401).json({
//                     success: false,
//                     error: "Invalid Credentials. Please check your password."
//                 });
//             }

//             // Generate JWT token with user data
//             const token = jwt.sign(
//                 {
//                     id: user._id,

//                     email: user.email,
//                     fullName: user.fullName,
//                     mobileNo: user.mobileNo,
//                     profileImg: user.profileImg,
//                     address: user.address,
//                     DOB: user.DOB,
//                     education: user.education,
//                 },
//                 process.env.JWT_SECRET || "jwtsecret",
//                 { expiresIn: "1h" }
//             );

//             // Send user data and token in response
//             return res.status(200).json({
//                 success: true,
//                 token,
//                 user: {
//                     id: user._id,
//                     fullName: user.fullName,
//                     email: user.email,
//                     mobileNo: user.mobileNo,
//                     profileImg: user.profileImg,
//                     address: user.address,
//                     DOB: user.DOB,
//                     education: user.education,
//                 },
//             });
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({
//                 success: false,
//                 error: "An error occurred on the server. Please try again later."
//             });
//         }
//     } else {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }
// };

// export default connectDb(handler);


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
    if (req.method === "POST") {
        try {
            // Find the user by email
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: "No user found with this email. Please check your credentials."
                });
            }

            // Compare password using bcrypt
            const isMatch = await bcrypt.compare(req.body.password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid Credentials. Please check your password."
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET || "jwtsecret",
                { expiresIn: "1h" }
            );

            // Send response with user data and token
            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    mobileNo: user.mobileNo,
                    profileImg: user.profileImg,
                    address: user.address,
                    DOB: user.DOB,
                    education: user.education,
                },
            });
        } catch (error) {
            console.error("Login error:", error.message);
            return res.status(500).json({
                success: false,
                error: "An error occurred on the server. Please try again later."
            });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
};

export default connectDb(handler);
