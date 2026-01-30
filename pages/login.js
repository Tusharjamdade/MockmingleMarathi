
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
     const [loading, setLoading] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    
    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss(); // Dismiss any previous toasts
        setLoading(true);
        const data = { email, password };

        try {
              

            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const response = await res.json();

            // Check if the response is a 401 error (Unauthorized)
            if (res.status === 401) {
                // Show the error from the response in a toast
                toast.error(response.error || 'अवैध क्रेडेन्शियल्स. कृपया तुमचा ईमेल आणि पासवर्ड तपासा.', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setLoading(false);
                return; // Stop further execution
            }

            // Reset the form fields if login is successful
            setEmail('');
            setPassword('');

            if (response.success) {
                // Store token and user data in localStorage
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                toast.success('तुम्ही यशस्वीरित्या लॉगिन झाला आहात!', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                setTimeout(() => {
                    router.push({
                        pathname: '/', 
                        query: { user: response.user },
                    });
                }, 1000);
            } else {
                // Show general error in toast if not a 401 but some other error
                toast.error(response.error || 'An unexpected error occurred. Please try again.', {
                    position: "top-left",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred, please try again.', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false);
        }
    };

    // return (
    //     <div className="flex justify-center items-center min-h-screen  relative overflow-hidden">
    //         <img src="/bg.gif" className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" alt="background" />
    //         <img src="/Logoo.png" className="absolute top-4 right-8 w-20 mb-4" alt="Logo" />
            
    //         <div className="bg-transparent text-center p-6 w-full max-w-xs rounded-lg">
    //             <h1 className="text-2xl text-white mb-6">स्वागत आहे <span className="text-pink-400">मागे जा!</span></h1>
                
    //             <form onSubmit={handleSubmit}>
    //                 <input 
    //                     type="email" 
    //                     id="email"
    //                     name="email"
    //                     value={email}
    //                     onChange={handleChange}
    //                     placeholder="आपला ईमेल प्रविष्ट करा" 
    //                     className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
    //                 />
                    
    //                 <div className="relative mb-4">
    //                     <input
    //                         type={showPassword ? 'text' : 'password'}
    //                         id="password" 
    //                         name="password"
    //                         value={password}
    //                         onChange={handleChange}
    //                         placeholder="आपला पासवर्ड प्रविष्ट करा"
    //                         className="w-full p-3 rounded-md bg-white bg-opacity-20 text-white text-base focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
    //                     />
    //                     <span 
    //                         className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer text-white text-xl"
    //                         onClick={togglePasswordVisibility}
    //                     >
    //                         {showPassword ? '🙈' : '👁️'}
    //                     </span>
    //                 </div>
                    
    //                 <div className="flex items-center text-white text-sm mb-4">
    //                     <input type="checkbox" id="remember" className="mr-2" />
    //                     <label htmlFor="remember">३० दिवसांसाठी आपली माहिती लक्षात ठेवा.</label>
    //                 </div>
    //                  <button
    //                     type="submit"
    //                     disabled={loading}
    //                     className="w-full py-3 rounded-md bg-pink-400 text-white text-base transition-all hover:bg-pink-600"
    //                 >
    //                     {loading ? (
    //                         <>
    //                             <div className="flex justify-center items-center h-4">
    //                                 <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
    //                             </div>
    //                              लॉग इन...
    //                         </>
    //                     ) : " लॉग इन"}
    //                 </button>
                   
    //             </form>
                
    //             <a href="/forgot-password" className="text-pink-400 text-sm mt-4 block">पासवर्ड विसरलात?</a>
                
    //             <div className="text-white text-sm mt-4">
    //                 नोंदणी नसल्यास, कृपया नवीन खाते तयार करा 
    //                 <a href="/signup" className="font-bold text-pink-400"> साइन अप</a>
    //             </div>
    //         </div>

    //         <ToastContainer />
    //     </div>
    // );
return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#0f0c29] font-sans">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/bg.gif" 
          className="w-full h-full object-cover opacity-90" 
          alt="background" 
        />
        {/* Dark overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Floating Logo */}
      <div className="absolute top-6 right-6 z-20 transition-transform duration-300 hover:scale-110">
        <img 
          src="/Logoo.png" 
          className="w-16 md:w-20 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
          alt="Logo" 
        />
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-pink-500/10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              स्वागत आहे <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                मागे जा!
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-2">तुमच्या खात्यात प्रवेश करण्यासाठी खालील माहिती भरा.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div className="group">
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-pink-400 transition-colors">
                ईमेल
              </label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="आपला ईमेल प्रविष्ट करा" 
                className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent focus:bg-black/40 transition-all duration-300"
              />
            </div>
            
            {/* Password Input */}
            <div className="group">
              <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-pink-400 transition-colors">
                पासवर्ड
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password" 
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="आपला पासवर्ड प्रविष्ट करा"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent focus:bg-black/40 transition-all duration-300"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <label className="flex items-center text-gray-300 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" id="remember" className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-gray-500 rounded bg-transparent peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-all"></div>
                  <svg className="absolute w-3 h-3 text-white hidden peer-checked:block top-1 left-1 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="ml-2 group-hover:text-white transition-colors">लक्षात ठेवा (30 Days)</span>
              </label>
              
              <a href="/forgot-password" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
                पासवर्ड विसरलात?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed opacity-70' 
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-pink-500/40 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>लॉग इन...</span>
                </div>
              ) : "लॉग इन करा"}
            </button>
          </form>
          
          {/* Divider */}
          <div className="my-8 flex items-center justify-center space-x-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-gray-500 text-sm">नवीन आहात?</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          
          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              नोंदणी नसल्यास, कृपया नवीन खाते तयार करा <br/>
              <a href="/signup" className="inline-block mt-2 font-bold text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full border border-white/10 transition-all duration-300 hover:scale-105">
                साइन अप (Sign Up) &rarr;
              </a>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
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
    </div>
  );
}
