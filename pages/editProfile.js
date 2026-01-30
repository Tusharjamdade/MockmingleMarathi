// import React, { useState,useEffect } from "react";

// function EditProfile() {
//   const [user, setUser] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [DOB, setDOB] = useState('');
//   const [mobileNo, setMobileNo] = useState('');
//   const [education, setEducation] = useState('');
//   const [profilePic, setProfilePic] = useState('');  // Declare the profilePic state

 

//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       router.push("/login");
//     } 
//   }, []);

//   useEffect(() => {
//     // Fetch user data from localStorage
//     const user = JSON.parse(localStorage.getItem('user'));

//     if (user) {
//       setUser(user);
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if(name =='fullName'){
//         setFullName(e.target.value)
//     }
//   };

//   const handleImageChange = (e) => {
//     setProfilePic(URL.createObjectURL(e.target.files[0]));  // Update profilePic state
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Profile updated!");
//   };

//   return (
//     <div className="relative  min-h-screen ">
//             <img
//                 src="/bg.gif"
//                 alt="background"
//                 className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
//             />
//     <div className="max-w-md mx-auto    p-6 rounded-lg shadow-lg">
        
//       <h2 className="text-2xl font-semibold text-orange-500 text-center mb-6">Edit Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="flex flex-col">
//           <label htmlFor="username" className="text-sm font-medium text-white mb-1">
//             fullName 
//           </label>
//           <input
//             type="text"
//             id="fullName"
//             name="fullName"
//             value={user?.fullName}
//             onChange={handleInputChange}
//             placeholder="Edit your fullName"
//             required
//             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
//           />
//         </div>

//         <div className="flex flex-col">
//           <label htmlFor="email" className="text-sm font-medium text-white mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={user?.email}
//             onChange={handleInputChange}
//             placeholder="Edit your email"
//             required
//             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label htmlFor="DOB" className="text-sm font-medium text-white mb-1">
//             Date Of Birth
//           </label>
//           <input
//             type="text"
//             id="DOB"
//             name="DOB"
//             value={user?.DOB}
//             onChange={handleInputChange}
//             placeholder="Edit your DOB"
//             required
//             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label htmlFor="address" className="text-sm font-medium text-white mb-1">
//             Address
//           </label>
//           <input
//             type="text"
//             id="address"
//             name="address"
//             value={user?.address}
//             onChange={handleInputChange}
//             placeholder="Edit your address"
//             required
//             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label htmlFor="mobileNo" className="text-sm font-medium text-white mb-1">
//             Mobile Number
//           </label>
//           <input
//             type="text"
//             id="mobileNo"
//             name="mobileNo"
//             value={user?.mobileNo}
//             onChange={handleInputChange}
//             placeholder="Edit your mobileNo"
//             required
//             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label htmlFor="education" className="text-sm font-medium text-white mb-1">
//           Education
//           </label>
//           <input
//             type="text"
//             id="education"
//             name="education"
//             value={user?.education}
//             onChange={handleInputChange}
//             placeholder="Edit your education"
//             required
//             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
//           />
//         </div>


//         <div className="flex flex-col">
//           <label htmlFor="profilePic" className="text-sm font-medium text-white mb-1">
//             Profile Picture
//           </label>
//           <input
//             type="file"
//             id="profilePic"
//             name="profilePic"
//             onChange={handleImageChange}
//             accept="image/*"
//             className="mb-3"
//           />
//           {profilePic && (
//             <img
//               src={profilePic}
//               alt="Profile Preview"
//               className="w-24 h-24 rounded-full object-cover mx-auto"
//             />
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           Save Changes
//         </button>
//       </form>
//     </div>
//     </div>
//   );
// }

// export default EditProfile;


import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";  // Assuming you're using Next.js, since you're calling router.push
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

function EditProfile() {
  const [user, setUser] = useState({});
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [DOB, setDOB] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [education, setEducation] = useState('');
  const [profileImg, setProfileImg] = useState('');
  
  const router = useRouter();  // For navigating the user to login page if not authenticated

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");  // Redirect to login if no token
    }
  }, [router]);

  useEffect(() => {
    // Fetch user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setFullName(userData.fullName || '');
      setEmail(userData.email || '');
      setAddress(userData.address || '');
      setDOB(userData.DOB || '');
      setMobileNo(userData.mobileNo || '');
      setEducation(userData.education || '');
      setProfileImg(userData.profileImg || '');  // Set profile pic if exists
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'DOB':
        setDOB(value);
        break;
      case 'mobileNo':
        setMobileNo(value);
        break;
      case 'education':
        setEducation(value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    if (e.target.name == "profileImg") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImg(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } // Update profilePic state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const updatedUser = {
        fullName,
        email,
        address,
        DOB,
        mobileNo,
        education,
        profileImg
      };
  
      // Make the API request
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Something went wrong. Please try again.");
    }
    
    const response = await res.json();
    if (response.success) {
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Save updated user
        toast.success('Profile updated successfully!');
        router.push("/profile");
      }
  
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };
  const goBack = () => {
    router.back(); // This will take the user to the previous page
  };

  // return (
  //   <div className="relative min-h-screen">
  //       <div className='absolute top-5 left-3 text-4xl text-white' onClick={goBack} ><IoIosArrowBack /></div>
  //       <ToastContainer
  //               position="top-left"
  //               autoClose={3000}
  //               hideProgressBar={false}
  //               newestOnTop={false}
  //               closeOnClick
  //               rtl={false}
  //               pauseOnFocusLoss
  //               draggable
  //               pauseOnHover
  //               theme="light"
  //           />
  //     <img
  //       src="/bg.gif"
  //       alt="background"
  //       className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
  //     />
  //     <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg">
  //       <h2 className="text-2xl font-semibold text-orange-500 text-center mb-6">प्रोफाईल अपडेट करा</h2>
  //       <form onSubmit={handleSubmit}  className="space-y-4">

  //       <div className="flex flex-col">
           
  //          {profileImg && (
  //             <img
  //               src={profileImg}
  //               alt="प्रोफाईल पूर्वदृश्य"
  //               className="w-24 h-24 rounded-full object-cover mx-auto"
  //             />
  //          )}
  //            <label htmlFor="profileImg" className="text-sm font-medium text-white mb-1">
  //             प्रोफाईल पिक्चर
  //           </label>
  //           <input
  //             type="file"
  //             id="profileImg"
  //             name="profileImg"
  //             onChange={handleImageChange}
  //             accept="image/*"
  //             className="mb-3"
  //           />
  //         </div>
  //         <div className="flex flex-col">
  //           <label htmlFor="fullName" className="text-sm font-medium text-white mb-1">
  //             पूर्ण नाव
  //           </label>
  //           <input
  //             type="text"
  //             id="fullName"
  //             name="fullName"
  //              value={fullName}
  //             onChange={handleInputChange}
  //             placeholder="पूर्ण नाव अपडेट करा"
  //             required
  //             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
  //           />
  //         </div>

  //         <div className="flex flex-col">
  //           <label htmlFor="email" className="text-sm font-medium text-white mb-1">
  //             ई-मेल
  //           </label>
  //           <input
  //             type="email"
  //             id="email"
  //             name="email"
  //             value={email}
  //             onChange={handleInputChange}
  //             placeholder="ईमेल अपडेट करा"
  //             required
  //             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
  //           />
  //         </div>

  //         <div className="flex flex-col">
  //           <label htmlFor="DOB" className="text-sm font-medium text-white mb-1">
  //             जन्मतारीख
  //           </label>
  //           <input
  //             type="text"
  //             id="DOB"
  //             name="DOB"
  //             value={DOB}
  //             onChange={handleInputChange}
  //             placeholder="जन्मतारीख अपडेट करा"
  //             required
  //             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
  //           />
  //         </div>

  //         <div className="flex flex-col">
  //           <label htmlFor="address" className="text-sm font-medium text-white mb-1">
  //             पत्ता
  //           </label>
  //           <input
  //             type="text"
  //             id="address"
  //             name="address"
  //            value={address}
  //             onChange={handleInputChange}
  //             placeholder="पत्ता अपडेट करा"
  //             required
  //             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
  //           />
  //         </div>

  //         <div className="flex flex-col">
  //           <label htmlFor="mobileNo" className="text-sm font-medium text-white mb-1">
  //             मोबाईल नंबर
  //           </label>
  //           <input
  //             type="text"
  //             id="mobileNo"
  //             name="mobileNo"
  //             value={mobileNo}
  //             onChange={handleInputChange}
  //             placeholder="मोबाईल क्रमांक अपडेट करा"
  //             required
  //             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
  //           />
  //         </div>

  //         <div className="flex flex-col">
  //           <label htmlFor="education" className="text-sm font-medium text-white mb-1">
  //             शिक्षण
  //           </label>
  //           <input
  //             type="text"
  //             id="education"
  //             name="education"
  //              value={education}
  //             onChange={handleInputChange}
  //             placeholder="शिक्षण अपडेट करा"
  //             required
  //             className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
  //           />
  //         </div>

          

  //         <button
  //           type="submit"
  //           className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  //         >
  //           जतन करा
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );
return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-10 px-4 sm:px-6 font-sans overflow-hidden">
      
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg.gif"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0f0c29]/80 backdrop-blur-[3px]"></div>
      </div>

      {/* Back Button */}
      <div 
        className="absolute top-6 left-6 z-20 cursor-pointer group" 
        onClick={goBack}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:bg-white/20 group-hover:-translate-x-1">
          <IoIosArrowBack className="text-2xl text-white" />
        </div>
      </div>

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

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600"></div>

        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-300 mb-8 tracking-wide">
            प्रोफाईल अपडेट करा
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Profile Image Upload Section */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative group w-32 h-32 mb-4">
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-orange-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="प्रोफाईल पूर्वदृश्य"
                    className="relative w-full h-full rounded-full object-cover border-4 border-[#1a103c] shadow-xl"
                  />
                ) : (
                  <div className="relative w-full h-full rounded-full bg-white/10 border-4 border-[#1a103c] flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-[#1a103c]"></div>
              </div>

              <div className="w-full text-center">
                <label htmlFor="profileImg" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  प्रोफाईल पिक्चर
                </label>
                <input
                  type="file"
                  id="profileImg"
                  name="profileImg"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-xs file:font-semibold
                    file:bg-orange-500/20 file:text-orange-300
                    hover:file:bg-orange-500/30
                    cursor-pointer focus:outline-none"
                />
              </div>
            </div>

            {/* Input Fields Grid */}
            <div className="space-y-5">
              {[
                { id: 'fullName', label: 'पूर्ण नाव', type: 'text', value: fullName, placeholder: 'तुमचे पूर्ण नाव' },
                { id: 'email', label: 'ई-मेल', type: 'email', value: email, placeholder: 'name@example.com' },
                { id: 'DOB', label: 'जन्मतारीख', type: 'text', value: DOB, placeholder: 'DD/MM/YYYY' }, // Consider type='date' for better UX, but kept 'text' as per original
                { id: 'address', label: 'पत्ता', type: 'text', value: address, placeholder: 'तुमचा पत्ता' },
                { id: 'mobileNo', label: 'मोबाईल नंबर', type: 'text', value: mobileNo, placeholder: '10 अंकी मोबाईल क्रमांक' },
                { id: 'education', label: 'शिक्षण', type: 'text', value: education, placeholder: 'तुमचे शिक्षण (उदा. B.E, B.Sc)' },
              ].map((field) => (
                <div key={field.id} className="group">
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-1.5 ml-1 transition-colors group-focus-within:text-orange-400">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={field.value}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 
                             focus:outline-none focus:bg-black/40 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 
                             transition-all duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-lg shadow-lg 
                         transform transition-all duration-200 hover:scale-[1.02] hover:shadow-orange-500/30 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                बदल जतन करा (Save Changes)
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
