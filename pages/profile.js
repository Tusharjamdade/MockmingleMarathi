 {/* <div className="flex justify-between items-center p-3 bg-[#29064b] rounded-lg cursor-pointer">
              <span className="text-sm">⚙️ Mode (Dark & Light)</span>
              <label className="relative inline-block w-10 h-6">
                <input type="checkbox" className="opacity-0 w-0 h-0" />
                <span className="absolute inset-0 bg-gray-400 rounded-full transition-all"></span>
                <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform transform"></span>
              </label>
            </div> */}
import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { FaUserEdit } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter()
const[user,setUser]=useState('')
const[email,setEmail]=useState('')
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        profileImg: '',
      });
      useEffect(() => {
        if (!localStorage.getItem("token")) {
          router.push("/login");
        } else {
          const userFromStorage = JSON.parse(localStorage.getItem('user'));
          if (userFromStorage) {
            setUser(userFromStorage);
            setEmail(userFromStorage.email || '');  // Initialize email here directly
          }
        }
      }, []);
      useEffect(() => {
        // Fetch user data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
    
        if (user) {
          setUserData({
            fullName: user.fullName,
            email: user.email,
            profileImg: user.profileImg,
          });
        }
      }, []);
      const goBack = () => {
        router.push('/'); // This will take the user to the previous page
      };
    return (
<>
        <div className="relative  min-h-screen ">
            <img
                src="/bg.gif"
                alt="background"
                className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
            />
                 
        <div className="mx-auto  rounded-lg p-5">
          {/* Profile Section */}
          <div className="text-center sm:text-left pb-5 border-b border-[#3b185f] sm:flex sm:items-center sm:space-x-8">
            <div className="relative w-32 h-32 mx-auto sm:mx-0">
              <img
                src={userData.profileImg}
                alt="Profile"
                className="w-full h-full rounded-full border-3 border-[#6a0dad]"
              />
              
            </div>
            <div className="mt-4 sm:mt-0 sm:text-left">
              <h2 className="text-2xl text-white">{userData.fullName}</h2>
              <p className="text-gray-400 text-sm">{userData.email}</p>
            </div>
          </div>
  
          {/* General Settings Section */}
          <h3 className="bg-fuchsia-700 text-[#d4a8ff] text-sm py-4 px-4 -mx-4">General Settings</h3>
          <div className="space-y-2">
            <Link href={'/oldreport'}><div className="flex justify-between items-center p-3 mt-3 bg-[#29064b] rounded-lg cursor-pointer">
              <span className="text-sm">📊 Reports</span>
              <span className="text-sm">›</span>
            </div></Link>
            <Link href={'/editProfile'}><div className="flex justify-between  items-center p-3 mt-3 bg-[#29064b] rounded-lg cursor-pointer">
            
              <span className="text-sm  flex gap-1"><FaUserEdit className="text-xl"/> Edit Personal Info</span>
              <span className="text-sm">›</span>
            </div></Link>
           
            <div className="flex justify-between items-center p-3 bg-[#29064b] rounded-lg cursor-pointer">
              <span className="text-sm">🔑 Change Password</span>
              <span className="text-sm">›</span>
            </div>
          </div>
  
          {/* Information Section */}
          <h3 className="bg-fuchsia-700 text-[#d4a8ff] text-sm py-4 px-4 -mx-4 mt-4">Information</h3>
          <div className="space-y-2 mt-3">
            <div className="flex justify-between items-center p-3 bg-[#29064b] rounded-lg cursor-pointer">
              <span className="text-sm">📱 About App</span>
              <span className="text-sm">›</span>
            </div>
            {/* <div className="flex justify-between items-center p-3 bg-[#29064b] rounded-lg cursor-pointer">
              <span className="text-sm">🌐 Language</span>
              <span className="text-sm">›</span>
            </div> */}
            <div className="flex justify-between items-center p-3 bg-[#29064b] rounded-lg cursor-pointer">
              <span className="text-sm">🔒 Privacy Policy</span>
              <span className="text-sm">›</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#29064b] rounded-lg cursor-pointer">
              <span className="text-sm">📤 Share This App</span>
              <span className="text-sm">›</span>
            </div>
          </div>
      <div className='flex justify-center text-center text-4xl mt-6 text-white'  ><div className="border-2 rounded-full" onClick={goBack}><IoIosArrowBack /></div></div>
        </div>
      </div>
      </>
    );
  }
  