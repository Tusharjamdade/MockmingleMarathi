//  {/* <div className="flex justify-between items-center p-3 bg-[#29064b] rounded-lg cursor-pointer">
//               <span className="text-sm">⚙️ Mode (Dark & Light)</span>
//               <label className="relative inline-block w-10 h-6">
//                 <input type="checkbox" className="opacity-0 w-0 h-0" />
//                 <span className="absolute inset-0 bg-gray-400 rounded-full transition-all"></span>
//                 <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform transform"></span>
//               </label>
//             </div> */}
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { FaUserEdit, FaLock, FaShare, FaInfoCircle, FaClipboardList } from "react-icons/fa";
// import { IoIosArrowBack, IoMdSettings } from "react-icons/io";
// import { BsBarChartFill, BsFileEarmarkText } from "react-icons/bs";
// import { MdOutlineVerified } from "react-icons/md";
// import { useRouter } from "next/router";
// import InterviewProgress from "../components/InterviewProgress";

// export default function Profile() {
//   const router = useRouter()
//   const [user, setUser] = useState('')
//   const [email, setEmail] = useState('')
//   const [userData, setUserData] = useState({
//     fullName: '',
//     email: '',
//     profileImg: '',
//     interviews_completed: 0,
//   });
//   const [isLoading, setIsLoading] = useState(true);
//       useEffect(() => {
//         if (!localStorage.getItem("token")) {
//           router.push("/login");
//         } else {
//           const userFromStorage = JSON.parse(localStorage.getItem('user'));
//           if (userFromStorage) {
//             setUser(userFromStorage);
//             setEmail(userFromStorage.email || '');  // Initialize email here directly
//           }
//         }
//       }, []);
//   useEffect(() => {
//     setIsLoading(true);
//     // Fetch user data from localStorage first
//     const user = JSON.parse(localStorage.getItem('user'));
    
//     if (user) {
//       setUserData({
//         fullName: user.fullName,
//         email: user.email,
//         profileImg: user.profileImg || '/default-avatar.png',
//         interviews_completed: user.no_of_interviews_completed || 0, // Keep tracking completed interviews
//       });
      
//       // Also fetch latest user data from the server to get up-to-date interview stats
//       const fetchUserData = async () => {
//         try {
//           // First try to get the user stats specifically
//           const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST || ''}/api/getUserStats?email=${encodeURIComponent(user.email)}`);
          
//           if (statsResponse.ok) {
//             const statsData = await statsResponse.json();
//             if (statsData.success && statsData.stats) {
//               // Update interview stats in local state
//               setUserData(prevData => ({
//                 ...prevData,
//                 interviews_completed: statsData.stats.no_of_interviews_completed || 0,
//               }));
              
//               // Also update user in local storage with these stats
//               const updatedUser = {
//                 ...user,
//                 no_of_interviews_completed: statsData.stats.no_of_interviews_completed || 0,
//               };
//               localStorage.setItem('user', JSON.stringify(updatedUser));
//             }
//           } else {
//             // Fallback to the editStudentProfile API
//             const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || ''}/api/editStudentProfile`, {
//               method: 'PUT',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 email: user.email,
//                 updatedData: {}
//               }),
//             });
            
//             if (response.ok) {
//               const data = await response.json();
//               if (data.user) {
//                 // Update local storage with latest user data
//                 localStorage.setItem('user', JSON.stringify(data.user));
                
//                 // Update state
//                 setUserData(prevData => ({
//                   ...prevData,
//                   interviews_completed: data.user.no_of_interviews_completed || 0,
//                 }));
//               }
//             }
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       };
      
//       fetchUserData();
//     }
//   }, []);
//       const goBack = () => {
//         router.push('/'); // This will take the user to the previous page
//       };
//     return (
//   <div className="relative min-h-screen bg-gradient-to-b from-[#14001f] via-[#1c0032] to-black overflow-hidden">
//     {/* Animated background */}
//     <img
//       src="/bg.gif"
//       alt="background"
//       className="absolute inset-0 w-full h-full object-cover opacity-30 -z-10"
//     />

//     {/* Header */}
//     <div className="sticky top-0 z-20 flex justify-between items-center px-5 py-4 bg-[#1a013a]/80 backdrop-blur-md border-b border-white/10">
//       <div
//         onClick={goBack}
//         className="text-white text-2xl cursor-pointer hover:text-[#e600ff] transition"
//       >
//         <IoIosArrowBack />
//       </div>

//       <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
//         प्रोफाइल
//       </h1>

//       <div className="w-6" />
//     </div>

//     {isLoading ? (
//       <div className="flex justify-center items-center h-[60vh]">
//         <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-[#e600ff]" />
//       </div>
//     ) : (
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

//         {/* Profile Card */}
//         <div className="bg-[#29064b]/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 mb-8">
//           <div className="p-6 sm:p-8">
//             <div className="flex flex-col md:flex-row items-center gap-6">

//               {/* Avatar */}
//               <div className="relative">
//                 <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#e600ff] shadow-lg shadow-purple-500/30">
//                   <img
//                     src={userData.profileImg || "/default-avatar.png"}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "/default-avatar.png";
//                     }}
//                   />
//                 </div>

//                 <div className="absolute bottom-1 right-1 bg-[#e600ff] rounded-full p-1.5 shadow-md">
//                   <MdOutlineVerified className="text-white text-lg" />
//                 </div>
//               </div>

//               {/* User Info */}
//               <div className="flex-1 text-center md:text-left">
//                 <h2 className="text-2xl font-bold text-white mb-1">
//                   {userData.fullName || "User"}
//                 </h2>

//                 <p className="text-gray-300 text-sm flex items-center justify-center md:justify-start gap-2 mb-4">
//                   <span className="h-2 w-2 rounded-full bg-[#e600ff]" />
//                   {userData.email}
//                 </p>

//                 {/* Stats */}
//                 <div className="bg-[#1a0035] rounded-xl p-4 border border-white/10">
//                   <h3 className="text-[#e600ff] text-sm font-semibold mb-3 flex items-center gap-2">
//                     <BsBarChartFill />
//                     मुलाखत स्टॅटिस्टिक्स
//                   </h3>

//                   <div className="bg-[#3a0a5c] rounded-lg p-4 text-center">
//                     <p className="text-xs text-gray-300 mb-1">
//                       एकूण पूर्ण केलेल्या मुलाखती
//                     </p>
//                     <p className="text-3xl font-bold text-white">
//                       {userData.interviews_completed}
//                     </p>
//                   </div>

//                   <div className="mt-4">
//                     <InterviewProgress userData={userData} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//           <Link href="/oldreport">
//             <div className="group bg-[#29064b]/80 backdrop-blur-md p-5 rounded-xl flex items-center gap-4 border border-white/10 hover:bg-[#3a0a5c] transition">
//               <div className="bg-[#e600ff] p-3 rounded-full group-hover:scale-110 transition">
//                 <BsFileEarmarkText className="text-white text-xl" />
//               </div>
//               <div>
//                 <h3 className="text-white font-semibold">माझे अहवाल</h3>
//                 <p className="text-gray-300 text-xs">
//                   तुमचे मुलाखत अहवाल पाहा
//                 </p>
//               </div>
//             </div>
//           </Link>

//           <Link href="/editProfile">
//             <div className="group bg-[#29064b]/80 backdrop-blur-md p-5 rounded-xl flex items-center gap-4 border border-white/10 hover:bg-[#3a0a5c] transition">
//               <div className="bg-[#e600ff] p-3 rounded-full group-hover:scale-110 transition">
//                 <FaUserEdit className="text-white text-xl" />
//               </div>
//               <div>
//                 <h3 className="text-white font-semibold">अपडेट प्रोफाइल</h3>
//                 <p className="text-gray-300 text-xs">
//                   तुमची वैयक्तिक माहिती अपडेट करा
//                 </p>
//               </div>
//             </div>
//           </Link>
//         </div>

//         {/* Settings */}
//         <div className="bg-[#29064b]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden mb-10">
//           <div className="p-4 bg-[#3a0a5c]/80 font-semibold text-white flex items-center gap-2">
//             <IoMdSettings />
//             सेटिंग्ज आणि माहिती
//           </div>

//           <div className="divide-y divide-white/10">
//             {[
//               { icon: <FaLock />, label: "पासवर्ड बदला" },
//               { icon: <FaInfoCircle />, label: "ॲप बद्दल माहिती" },
//               { icon: <FaLock />, label: "गोपनीयता धोरण" },
//               { icon: <FaShare />, label: "अ‍ॅप शेअर करा" },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between items-center px-5 py-4 hover:bg-[#3a0a5c] transition cursor-pointer"
//               >
//                 <div className="flex items-center gap-3 text-white">
//                   <span className="text-[#e600ff]">{item.icon}</span>
//                   {item.label}
//                 </div>
//                 <span className="text-gray-400 text-lg">›</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* CTA Buttons */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4 pb-10">
//           <Link href="/role">
//             <button className="bg-gradient-to-r from-[#e600ff] to-[#8000ff] text-white font-bold py-3 px-10 rounded-full shadow-lg hover:scale-105 transition">
//               नवीन मुलाखत सुरू करा
//             </button>
//           </Link>

//           <Link href="">
//             <button className="bg-[#3a0a5c] text-white font-bold py-3 px-10 rounded-full hover:bg-[#500d80] transition flex items-center justify-center gap-2 hover:scale-105">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                 />
//               </svg>
//               अधिक मुलाखती खरेदी करा
//             </button>
//           </Link>
//         </div>
//       </div>
//     )}
//   </div>
// );

//   }
  
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserEdit, FaLock, FaShare, FaInfoCircle, FaChevronRight } from "react-icons/fa";
import { IoIosArrowBack, IoMdSettings, IoMdStats } from "react-icons/io";
import { BsFileEarmarkText, BsGraphUp } from "react-icons/bs";
import { MdOutlineVerified, MdEmail } from "react-icons/md";
import { useRouter } from "next/router";
import InterviewProgress from "../components/InterviewProgress";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    profileImg: '',
    interviews_completed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage) {
        setUser(userFromStorage);
        setEmail(userFromStorage.email || '');
      }
    }
  }, [router]);

  useEffect(() => {
    setIsLoading(true);
    // Fetch user data from localStorage first
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      setUserData({
        fullName: user.fullName,
        email: user.email,
        profileImg: user.profileImg || '/default-avatar.png',
        interviews_completed: user.no_of_interviews_completed || 0,
      });

      // Also fetch latest user data from the server to get up-to-date interview stats
      const fetchUserData = async () => {
        try {
          // First try to get the user stats specifically
          const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST || ''}/api/getUserStats?email=${encodeURIComponent(user.email)}`);

          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData.success && statsData.stats) {
              // Update interview stats in local state
              setUserData(prevData => ({
                ...prevData,
                interviews_completed: statsData.stats.no_of_interviews_completed || 0,
              }));

              // Also update user in local storage with these stats
              const updatedUser = {
                ...user,
                no_of_interviews_completed: statsData.stats.no_of_interviews_completed || 0,
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          } else {
            // Fallback to the editStudentProfile API
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || ''}/api/editStudentProfile`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                updatedData: {}
              }),
            });

            if (response.ok) {
              const data = await response.json();
              if (data.user) {
                // Update local storage with latest user data
                localStorage.setItem('user', JSON.stringify(data.user));

                // Update state
                setUserData(prevData => ({
                  ...prevData,
                  interviews_completed: data.user.no_of_interviews_completed || 0,
                }));
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, []);

  const goBack = () => {
    router.push('/'); 
  };

  const settingsItems = [
    { icon: <FaLock />, label: "पासवर्ड बदला", link: "/change-password" }, // Added explicit links or placeholders
    { icon: <FaInfoCircle />, label: "ॲप बद्दल माहिती", link: "/about" },
    { icon: <FaLock />, label: "गोपनीयता धोरण", link: "/privacy" },
    { icon: <FaShare />, label: "अ‍ॅप शेअर करा", link: "#share" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center overflow-x-hidden font-sans"
         style={{ backgroundImage: "url('/bg.gif')" }}>
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/70 z-0 fixed"></div>

      {/* Navigation Header */}
      <div className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/20 border-b border-white/5">
        <div 
          onClick={goBack}
          className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer transition-all group"
        >
          <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10">
             <IoIosArrowBack className="text-xl" />
          </div>
          <span className="hidden sm:block text-sm font-medium">Back</span>
        </div>
        <h1 className="text-white text-lg font-semibold tracking-wide flex items-center gap-2">
          <FaUserEdit className="text-[#e600ff]" /> प्रोफाइल
        </h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-24">
        
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-[#e600ff] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm animate-pulse">प्रोफाइल लोड होत आहे...</p>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            
            {/* User Info Card */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl mb-6 relative overflow-hidden">
               {/* Background Accent */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#e600ff]/10 blur-[80px] rounded-full pointer-events-none"></div>

               <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative z-10">
                  {/* Avatar Section */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#e600ff] to-[#2a72ff]">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#1a1a1a] bg-gray-800">
                        <img
                          src={userData.profileImg || "/default-avatar.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#e600ff] text-white p-1.5 rounded-full shadow-lg border-2 border-[#1a1a1a]">
                       <MdOutlineVerified className="text-sm" />
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                      {userData.fullName || "विद्यार्थी"}
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-300 bg-white/5 w-fit mx-auto sm:mx-0 px-3 py-1.5 rounded-lg mb-4">
                      <MdEmail className="text-[#2a72ff]" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    
                    {/* Mini Stats Row */}
                    <div className="flex justify-center sm:justify-start gap-6 border-t border-white/10 pt-4 mt-4">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">मुलाखती</p>
                        <p className="text-2xl font-bold text-white">{userData.interviews_completed}</p>
                      </div>
                      {/* <div className="w-px bg-white/10 h-10"></div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">दर्जा</p>
                        <p className="text-2xl font-bold text-[#e600ff]">Active</p>
                      </div> */}
                    </div>
                  </div>
               </div>
            </div>

            {/* Performance Card */}
            <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#e600ff]/20 rounded-lg text-[#e600ff]">
                  <BsGraphUp className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white">प्रगती अहवाल</h3>
              </div>
              
              <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                <InterviewProgress userData={userData} />
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Link href="/oldreport" passHref>
                <div className="group cursor-pointer bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl hover:border-[#e600ff]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,0,255,0.15)] flex items-center gap-4">
                   <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <BsFileEarmarkText className="text-white text-xl" />
                   </div>
                   <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">माझे अहवाल</h4>
                      <p className="text-gray-400 text-xs">मागील सर्व मुलाखती पाहा</p>
                   </div>
                   <div className="ml-auto text-white/20 group-hover:text-white/60">
                      <FaChevronRight />
                   </div>
                </div>
              </Link>

              <Link href="/editProfile" passHref>
                <div className="group cursor-pointer bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl hover:border-[#e600ff]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,0,255,0.15)] flex items-center gap-4">
                   <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaUserEdit className="text-white text-xl" />
                   </div>
                   <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">प्रोफाइल अपडेट</h4>
                      <p className="text-gray-400 text-xs">माहिती बदलण्यासाठी</p>
                   </div>
                   <div className="ml-auto text-white/20 group-hover:text-white/60">
                      <FaChevronRight />
                   </div>
                </div>
              </Link>
            </div>

            {/* Settings Menu */}
            <div className="bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden mb-10">
              <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center gap-2">
                <IoMdSettings className="text-gray-400" />
                <span className="text-gray-300 font-medium text-sm uppercase tracking-wider">सेटिंग्ज</span>
              </div>
              
              <div className="divide-y divide-white/5">
                {settingsItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 group-hover:text-[#e600ff] transition-colors text-lg">{item.icon}</span>
                      <span className="text-gray-200 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <FaChevronRight className="text-xs text-gray-600 group-hover:text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pb-4">
              <Link href="/role" passHref>
                <button className="flex-1 bg-gradient-to-r from-[#e600ff] to-[#be29ec] hover:from-[#d100e6] hover:to-[#a620ce] text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-purple-600/20 transform hover:-translate-y-1 transition-all duration-200 flex justify-center items-center gap-2">
                   <IoMdStats className="text-xl" /> नवीन मुलाखत सुरू करा
                </button>
              </Link>

              <button className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 px-6 rounded-2xl font-semibold backdrop-blur-md transform hover:-translate-y-1 transition-all duration-200 flex justify-center items-center gap-2">
                 <span className="text-yellow-400 text-xl">★</span> अधिक मुलाखती खरेदी करा
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}