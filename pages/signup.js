// pages/signup.js

import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

const SignUp = () => {
    const router = useRouter()
 
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [address, setAddress] = useState("");
    const [collageName, setCollageName] = useState("SPPU");
    const [education, setEducation] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [DOB, setDOB] = useState("");
    const [profileImg, setProfileImg] = useState("");
    
    // Form validation states
    const [passwordError, setPasswordError] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handlePasswordToggle = (e, fieldId) => {
        const field = document.getElementById(fieldId);
        const type = field.type === "password" ? "text" : "password";
        field.type = type;
        e.target.textContent = type === "password" ? "👁️" : "🙈";
    };

    
    // Compress image before uploading
    const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    // Create a canvas and get its context
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions while maintaining aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    // Set canvas dimensions and draw the image
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 format
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
                };
                img.onerror = error => {
                    reject(error);
                };
            };
            reader.onerror = error => reject(error);
        });
    };
    
    const handleChange = (e) => {
        if (e.target.name == 'fullName') {
            setFullName(e.target.value)
        }
        else if (e.target.name == 'email') {
            setEmail(e.target.value)
        }
        else if (e.target.name == 'collageName') {
            setCollageName(e.target.value)
        }
        else if (e.target.name == 'password') {
            setPassword(e.target.value)
        }
        else if (e.target.name == 'mobileNo') {
            setMobileNo(e.target.value)
        }
        else if (e.target.name == 'address') {
            setAddress(e.target.value)
        }
        else if (e.target.name == 'education') {
            setEducation(e.target.value)
        } else if (e.target.name == 'DOB') {
            setDOB(e.target.value)
        } else if (e.target.name == "profileImg") {
            const file = e.target.files[0];
            if (file) {
                // Check file size and type before compressing
                if (file.size > 10 * 1024 * 1024) { // Greater than 10MB
                    toast.error("Image too large. Please select an image smaller than 10MB", {
                        position: "top-center"
                    });
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    toast.error("Please select a valid image file", {
                        position: "top-center"
                    });
                    return;
                }
                
                // Compress the image
                compressImage(file)
                    .then(compressedImageData => {
                        setProfileImg(compressedImageData);
                    })
                    .catch(error => {
                        console.error("Error compressing image:", error);
                        toast.error("Error processing image. Please try another image.", {
                            position: "top-center"
                        });
                    });
            }
        }
    }

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setFormErrors({});
    setGeneralError("");
    setPasswordError("");
    
    // Password match validation
    if (password !== confirmPassword) {
        setPasswordError("Passwords do not match!");
        return;
    }

    // Set submitting state to true to show loading/disable the button
    setIsSubmitting(true);

    const data = { profileImg, fullName, email, DOB, password, mobileNo, address, education, collageName };

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await res.json();

        // Handle successful response
        if (res.ok && responseData.success) {
            // Clear all form fields
            setProfileImg('');
            setMobileNo('');
            setConfirmPassword('');
            setAddress('');
            setEducation('');
            setCollageName('SPPU');
            setDOB('');
            setEmail('');
            setFullName('');
            setPassword('');

            toast.success('Your account has been created! Redirecting to login...', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                router.push('/login');
            }, 3000);
            
            return;
        }

        // Handle validation errors and other API errors
        if (responseData.error === "Required fields missing" && responseData.missingFields) {
            // Create field-specific error messages
            const errors = {};
            responseData.missingFields.forEach(field => {
                const fieldKey = field === "Full Name" ? "fullName" :
                                field === "Email Address" ? "email" :
                                field === "Mobile Number" ? "mobileNo" :
                                field === "College Name" ? "collageName" :
                                field.toLowerCase().replace(/ /g, '');
                errors[fieldKey] = `${field} is required`;
            });
            setFormErrors(errors);
            
            toast.error(responseData.message || "Please fill in all required fields", {
                position: "top-center",
            });
        } 
        else if (responseData.error === "Invalid email format") {
            setFormErrors({ email: responseData.message || "Please enter a valid email address" });
            toast.error(responseData.message, { position: "top-center" });
        }
        else if (responseData.error === "Email already registered") {
            setFormErrors({ email: responseData.message || "This email is already registered" });
            toast.error(responseData.message, { position: "top-center" });
        }
        else if (responseData.error === "Validation failed" && responseData.validationErrors) {
            setFormErrors(responseData.validationErrors);
            toast.error(responseData.message || "Please fix the validation errors", { position: "top-center" });
        }
        else {
            // Handle general error
            setGeneralError(responseData.message || "An unexpected error occurred");
            toast.error(responseData.message || "Something went wrong. Please try again.", { position: "top-center" });
        }

    } catch (error) {
        console.error("Signup error:", error);
        setGeneralError("Network or server error. Please try again later.");
        toast.error("Connection error. Please check your internet and try again.", {
            position: "top-center",
            autoClose: 5000,
        });
    } finally {
        setIsSubmitting(false);
    }
};


    return (<> 
    <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
    />
       <div className="relative grid grid-cols-1 place-items-center w-full min-h-screen">
    <img
        src="/bg.gif"
        alt="background"
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
    />
    <img
        src="/Logoo.png"
        alt="Shakti AI Logo"
        className="absolute top-4 right-8 w-20 mb-5"
    />

    <div className="container ml-2 mr-2 w-full max-w-5xl p-4 rounded-lg bg-white bg-opacity-30">
        <h1 className="text-2xl text-white mb-4">
            Create an <span className="text-pink-400">Account!</span>
        </h1>

        {generalError && (
            <div className="col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">{generalError}</span>
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input
                type="file"
                name="profileImg"
                accept="image/*"
                onChange={handleChange}
                placeholder="fullName"
                className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
            />
            <div className="flex flex-col">
                <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className={`p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 ${formErrors.fullName ? 'border-2 border-red-500' : ''}`}
                />
                {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
            </div>
            <div className="flex flex-col">
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className={`p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 ${formErrors.email ? 'border-2 border-red-500' : ''}`}
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
            <div className="flex flex-col">
                <input
                    type="text"
                    name="mobileNo"
                    value={mobileNo}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    required
                    className={`p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 ${formErrors.mobileNo ? 'border-2 border-red-500' : ''}`}
                />
                {formErrors.mobileNo && <p className="text-red-500 text-sm mt-1">{formErrors.mobileNo}</p>}
            </div>
            <input
                type="text"
                name="address"
                value={address}
                onChange={handleChange}
                placeholder="Address"
                required
                className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
            />
            <input
                type="text"
                name="DOB"
                value={DOB}
                onChange={handleChange}
                placeholder="DOB"
                required
                className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
            />
            <div className="flex flex-col">
                <input
                    type="text"
                    name="education"
                    value={education}
                    onChange={handleChange}
                    placeholder="Education"
                    required
                    className={`p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 ${formErrors.education ? 'border-2 border-red-500' : ''}`}
                />
                {formErrors.education && <p className="text-red-500 text-sm mt-1">{formErrors.education}</p>}
            </div>
            <div className="flex flex-col">
                <input
                    type="text"
                    name="collageName"
                    value={collageName}
                    onChange={handleChange}
                    placeholder="College Name"
                    required
                    className={`p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 ${formErrors.collageName ? 'border-2 border-red-500' : ''}`}
                />
                {formErrors.collageName && <p className="text-red-500 text-sm mt-1">{formErrors.collageName}</p>}
            </div>

            <div className="flex flex-col relative">
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="🔒 Password"
                    required
                    className={`w-full p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 ${formErrors.password ? 'border-2 border-red-500' : ''}`}
                />
                <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white"
                    onClick={(e) => handlePasswordToggle(e, "password")}
                >
                    👁️
                </span>
                {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
            </div>

            <div className="flex flex-col relative">
                <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="🔒 Confirm Password"
                    required
                    className={`w-full p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 ${passwordError ? 'border-2 border-red-500' : ''}`}
                />
                <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white"
                    onClick={(e) => handlePasswordToggle(e, "confirm-password")}
                >
                    👁️
                </span>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            <div className="col-span-3 flex items-center justify-between mt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 text-white ${isSubmitting ? 'bg-gray-400' : 'bg-pink-400 hover:bg-pink-500'} rounded-md transition duration-300 flex items-center`}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : 'Sign Up'}
                </button>
                <div className="text-white">
                    Already have an account? <Link href="/login" className="text-pink-400 hover:underline">Login</Link>
                </div>
            </div>
        </form>
    </div>
</div>

        </>
    );
};

export default SignUp;
