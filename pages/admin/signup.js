// pages/signup.js

import React, { useState ,useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

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
    const [passwordError, setPasswordError] = useState("");
    const [DOB, setDOB] = useState("");
    const [profileImg, setProfileImg] = useState("");

const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/admin/login");
    } else {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage) {
        setUser(userFromStorage);
        
      }
    }
  }, []);


    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // const handlePasswordToggle = (e, fieldId) => {
    //     const field = document.getElementById(fieldId);
    //     const type = field.type === "password" ? "text" : "password";
    //     field.type = type;
    //     e.target.textContent = type === "password" ? "👁️" : "🙈";
    // };

    
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
        }else if (e.target.name == 'DOB') {
            setDOB(e.target.value)
        }else if (e.target.name == "profileImg") {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setProfileImg(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }
    }

const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setPasswordError("Passwords do not match!");
        return;
    } else {
        setPasswordError("");
    }

    const data = { profileImg, fullName, email, DOB, password, mobileNo, address, education,collageName };

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Check if response is not OK
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error || "Something went wrong. Please try again.");
        }

        const response = await res.json();
        if (response.success) {
            setProfileImg('');
            setMobileNo('');
            setConfirmPassword('');
            setAddress('');
            setEducation('');
            setCollageName('');
            setDOB('');
            setEmail('');
            setFullName('');
            setPassword('');

            toast.success('Your account has been created!', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

    } catch (error) {
        toast.error(`Error: ${error.message}`, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
};
// Add these state variables
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// Add this toggle function
const handlePasswordToggle = (e, field) => {
    e.preventDefault(); 
    if (field === "password") {
        setShowPassword(!showPassword);
    } else if (field === "confirm-password") {
        setShowConfirmPassword(!showConfirmPassword);
    }
};

//     return (<> 
//     <ToastContainer
//         position="top-left"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//     />
//        <div className="relative grid grid-cols-1 place-items-center w-full min-h-screen">
//     <img
//         src="/bg.gif"
//         alt="background"
//         className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
//     />
//     <img
//         src="/Logoo.png"
//         alt="Shakti AI Logo"
//         className="absolute top-4 right-8 w-20 mb-5"
//     />

//     <div className="container ml-2 mr-2 w-full max-w-5xl p-4 rounded-lg bg-white bg-opacity-30">
//         <h1 className="text-2xl text-white mb-4">
//             Create an <span className="text-pink-400">Account!</span>
//         </h1>

//         <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
//             <input
//                 type="file"
//                 name="profileImg"
//                 accept="image/*"
//                 onChange={handleChange}
//                 placeholder="fullName"
//                 className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//             />
//             <input
//                 type="text"
//                 name="fullName"
//                 value={fullName}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 required
//                 className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//             />
//             <input
//                 type="email"
//                 name="email"
//                 value={email}
//                 onChange={handleChange}
//                 placeholder="Email Address"
//                 required
//                 className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//             />
//             <input
//                 type="text"
//                 name="mobileNo"
//                 value={mobileNo}
//                 onChange={handleChange}
//                 placeholder="Mobile Number"
//                 required
//                 className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//             />
//             <input
//                 type="text"
//                 name="address"
//                 value={address}
//                 onChange={handleChange}
//                 placeholder="Address"
//                 required
//                 className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//             />
//             <input
//                 type="text"
//                 name="DOB"
//                 value={DOB}
//                 onChange={handleChange}
//                 placeholder="DOB"
//                 required
//                 className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//             />
//             <input
//                 type="text"
//                 name="education"
//                 value={education}
//                 onChange={handleChange}
//                 placeholder="Education"
//                 required
//                 className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//             />
//             <input
//                 type="text"
//                 name="collageName"
//                 value={collageName}
//                 onChange={handleChange}
//                 placeholder="College Name"
//                 required
//                 className="p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//             />

//             <div className="relative">
//                 <input
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={password}
//                     onChange={handlePasswordChange}
//                     placeholder="🔒 Password"
//                     required
//                     className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//                 />
//                 <span
//                     className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white"
//                     onClick={(e) => handlePasswordToggle(e, "password")}
//                 >
//                     👁️
//                 </span>
//             </div>

//             <div className="relative">
//                 <input
//                     type="password"
//                     id="confirm-password"
//                     value={confirmPassword}
//                     onChange={handleConfirmPasswordChange}
//                     placeholder="🔒 Confirm Password"
//                     required
//                     className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400"
//                 />
//                 <span
//                     className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white"
//                     onClick={(e) => handlePasswordToggle(e, "confirm-password")}
//                 >
//                     👁️
//                 </span>
//             </div>

//             {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}

//             <button
//                 type="submit"
//                 className="p-3 text-white bg-pink-400 rounded-md hover:bg-pink-500 transition duration-300"
//             >
//                 Sign Up
//             </button>
//         </form>
//     </div>
// </div>

//         </>
//     );
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
        theme="light"
      />

      {/* Main Container */}
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
        
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <img
            src="/bg.gif"
            alt="background"
            className="w-full h-full object-cover"
          />
          {/* Overlay to ensure text readability regardless of the GIF brightness */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        {/* Logo (Top Right Absolute) */}
        <img
          src="/Logoo.png"
          alt="Shakti AI Logo"
          className="absolute top-6 right-6 w-16 md:w-24 z-10 drop-shadow-lg"
        />

        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-4xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl backdrop-blur-md p-6 md:p-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Create an <span className="text-pink-400">Account</span>
            </h1>
            <p className="text-gray-300 mt-2 text-sm md:text-base">
              Join us today and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            
            {/* Profile Image - Spans full width on mobile, integrates nicely */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Profile Picture</label>
              <input
                type="file"
                name="profileImg"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-3 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-500 file:text-white
                  file:hover:bg-pink-600
                  cursor-pointer bg-black/20 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
              />
            </div>

            {/* Full Name */}
            <div className="group">
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full p-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-black/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div className="group">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full p-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-black/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
              />
            </div>

            {/* Mobile Number */}
            <div className="group">
              <input
                type="text"
                name="mobileNo"
                value={mobileNo}
                onChange={handleChange}
                placeholder="Mobile Number"
                required
                className="w-full p-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-black/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
              />
            </div>

            {/* DOB */}
            <div className="group">
              <input
                type="text"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                name="DOB"
                value={DOB}
                onChange={handleChange}
                placeholder="Date of Birth"
                required
                className="w-full p-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-black/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
              />
            </div>

            {/* Address */}
            <div className="col-span-1 md:col-span-2 group">
              <input
                type="text"
                name="address"
                value={address}
                onChange={handleChange}
                placeholder="Address"
                required
                className="w-full p-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-black/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
              />
            </div>

            {/* Education */}
            <div className="group">
              <input
                type="text"
                name="education"
                value={education}
                onChange={handleChange}
                placeholder="Education"
                required
                className="w-full p-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-black/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
              />
            </div>

            {/* College Name */}
            <div className="group">
              <input
                type="text"
                name="collageName"
                value={collageName}
                onChange={handleChange}
                placeholder="College Name"
                required
                className="w-full p-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-black/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                required
                className="w-full p-3.5 pr-12 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-black/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                onClick={(e) => handlePasswordToggle(e, "password")}
              >
                {/* SVG Icon for Eye/EyeOff */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
                required
                className="w-full p-3.5 pr-12 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-black/30 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all duration-200"
              />
               <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                onClick={(e) => handlePasswordToggle(e, "confirm-password")}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {passwordError && (
              <div className="col-span-1 md:col-span-2 text-red-300 text-sm text-center bg-red-900/20 p-2 rounded-lg border border-red-500/20">
                {passwordError}
              </div>
            )}

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 text-white font-semibold text-lg bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out"
              >
                Sign Up
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
