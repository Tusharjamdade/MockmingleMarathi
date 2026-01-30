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

    // Password strength validation states
    const [passwordStrength, setPasswordStrength] = useState(0); // 0: none, 1: weak, 2: medium, 3: strong
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false
    });

    const validatePassword = (password) => {
        // Password validation criteria
        const validations = {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Update validation state
        setPasswordValidation(validations);

        // Calculate password strength
        const criteriaCount = Object.values(validations).filter(Boolean).length;
        if (password === '') {
            setPasswordStrength(0); // Empty
        } else if (criteriaCount <= 2) {
            setPasswordStrength(1); // Weak
        } else if (criteriaCount <= 4) {
            setPasswordStrength(2); // Medium
        } else {
            setPasswordStrength(3); // Strong
        }

        // Clear any previous password error if valid
        if (criteriaCount >= 3) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.password;
                return newErrors;
            });
        }

        return criteriaCount >= 3; // Password is valid if it meets at least 3 criteria
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);

        // If confirm password is filled, check match
        if (confirmPassword) {
            if (newPassword !== confirmPassword) {
                setPasswordError("Passwords do not match!");
            } else {
                setPasswordError("");
            }
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        // Check if passwords match
        if (value && password !== value) {
            setPasswordError("Passwords do not match!");
        } else {
            setPasswordError("");
        }
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

        // Password strength validation
        const isPasswordValid = validatePassword(password);
        if (!isPasswordValid) {
            setFormErrors(prev => ({
                ...prev,
                password: "Password doesn't meet the minimum security requirements"
            }));
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


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden">
                {/* Background Layer */}
                <div className="absolute inset-0 z-[-1]">
                    <img
                        src="/bg.gif"
                        alt="background"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-[#0f0c29]/70 backdrop-blur-[2px]"></div>
                </div>

                {/* Floating Logo */}
                <img
                    src="/Logoo.png"
                    alt="Shakti AI Logo"
                    className="absolute top-6 right-6 w-16 md:w-20 drop-shadow-lg transition-transform hover:scale-105"
                />

                {/* Main Card Container */}
                <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">

                    {/* Header Decorative Line */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

                    <div className="p-6 md:p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                                Create an <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Account!</span>
                            </h1>
                            <p className="text-gray-400 text-sm">Join us to start your journey.</p>
                        </div>

                        {generalError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">{generalError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Profile Upload - Spans Full Width */}
                            <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center mb-6">
                                <div className="relative group cursor-pointer">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-xl bg-black/20 relative">
                                        {profileImg ? (
                                            <img src={profileImg} alt="Profile Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">👤</div>
                                        )}
                                        {/* Overlay on Hover */}
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-white text-xs font-bold">Change</span>
                                        </div>
                                    </div>
                                    <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-pink-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </label>
                                </div>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    name="profileImg"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <div className="text-center mt-2">
                                    <p className="text-white font-medium text-sm">Profile Photo <span className="text-pink-500">*</span></p>
                                    <p className="text-gray-400 text-xs">Max size: 10MB</p>
                                </div>
                            </div>

                            {/* Standard Inputs */}
                            {[
                                { name: 'fullName', type: 'text', placeholder: 'Full Name', value: fullName },
                                { name: 'email', type: 'email', placeholder: 'Email Address', value: email },
                                { name: 'mobileNo', type: 'text', placeholder: 'Mobile Number', value: mobileNo },
                                { name: 'DOB', type: 'text', placeholder: 'Date of Birth (DD/MM/YYYY)', value: DOB },
                                { name: 'address', type: 'text', placeholder: 'Address', value: address },
                                { name: 'education', type: 'text', placeholder: 'Education', value: education },
                                { name: 'collageName', type: 'text', placeholder: 'College/Institute Name', value: collageName },
                            ].map((field, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <div className="relative group">
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={field.value}
                                            onChange={handleChange}
                                            placeholder=" "
                                            required
                                            className={`peer w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300 ${formErrors[field.name] ? 'border-red-500' : ''}`}
                                        />
                                        <label className="absolute left-4 top-[-10px] bg-[#2a2445] px-1 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-pink-400 peer-focus:bg-[#2a2445] rounded">
                                            {field.placeholder} <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    {formErrors[field.name] && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors[field.name]}</p>}
                                </div>
                            ))}

                            {/* Empty spacer div for layout balance on larger screens if needed, otherwise flows naturally */}
                            <div className="hidden md:block"></div>

                            {/* Password Field */}
                            <div className="flex flex-col">
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder=" "
                                        required
                                        className={`peer w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300 ${formErrors.password ? 'border-red-500' : ''}`}
                                    />
                                    <label className="absolute left-4 top-[-10px] bg-[#2a2445] px-1 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-pink-400 peer-focus:bg-[#2a2445] rounded">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <span
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition-colors text-lg"
                                        onClick={(e) => handlePasswordToggle(e, "password")}
                                    >
                                        👁️
                                    </span>
                                </div>
                                {formErrors.password && <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.password}</p>}

                                {/* Password Strength Visual */}
                                {password && (
                                    <div className="mt-2 p-3 bg-black/20 rounded-lg border border-white/5 transition-all duration-300 animate-fade-in">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-xs text-gray-400">Strength</span>
                                            <span className={`text-xs font-bold ${passwordStrength === 0 ? 'text-gray-500' :
                                                    passwordStrength === 1 ? 'text-red-400' :
                                                        passwordStrength === 2 ? 'text-yellow-400' : 'text-green-400'
                                                }`}>
                                                {passwordStrength === 0 ? 'Too Weak' : passwordStrength === 1 ? 'Weak' : passwordStrength === 2 ? 'Medium' : 'Strong'}
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden flex">
                                            <div className={`h-full transition-all duration-300 ${passwordStrength >= 1 ? 'w-1/3 bg-red-500' : 'w-0'
                                                }`}></div>
                                            <div className={`h-full transition-all duration-300 ${passwordStrength >= 2 ? 'w-1/3 bg-yellow-500' : 'w-0'
                                                }`}></div>
                                            <div className={`h-full transition-all duration-300 ${passwordStrength >= 3 ? 'w-1/3 bg-green-500' : 'w-0'
                                                }`}></div>
                                        </div>

                                        {/* Requirements List */}
                                        <ul className="grid grid-cols-2 gap-1 mt-2">
                                            {[
                                                { label: '8+ Chars', valid: passwordValidation.minLength },
                                                { label: 'Uppercase', valid: passwordValidation.hasUppercase },
                                                { label: 'Lowercase', valid: passwordValidation.hasLowercase },
                                                { label: 'Number', valid: passwordValidation.hasNumber },
                                                { label: 'Special Char', valid: passwordValidation.hasSpecial },
                                            ].map((req, i) => (
                                                <li key={i} className={`text-[10px] flex items-center gap-1 ${req.valid ? 'text-green-400' : 'text-gray-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${req.valid ? 'bg-green-400' : 'bg-gray-600'}`}></span>
                                                    {req.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="flex flex-col">
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        placeholder=" "
                                        required
                                        className={`peer w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-transparent focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300 ${passwordError ? 'border-red-500' : ''}`}
                                    />
                                    <label className="absolute left-4 top-[-10px] bg-[#2a2445] px-1 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-pink-400 peer-focus:bg-[#2a2445] rounded">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <span
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition-colors text-lg"
                                        onClick={(e) => handlePasswordToggle(e, "confirm-password")}
                                    >
                                        👁️
                                    </span>
                                </div>
                                {passwordError && <p className="text-red-400 text-xs mt-1 ml-1">{passwordError}</p>}
                            </div>

                            {/* Footer / Submit Section - Spans Full Width */}
                            <div className="col-span-1 md:col-span-2 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-gray-400 text-xs text-center md:text-left">
                                    Fields marked with <span className="text-red-500">*</span> are required.
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                                    <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                                        Already have an account? <span className="text-pink-400 font-semibold hover:underline">Login</span>
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 ${isSubmitting
                                                ? 'bg-gray-600 cursor-not-allowed opacity-70'
                                                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-pink-500/30'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Creating Account...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Sign Up</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
