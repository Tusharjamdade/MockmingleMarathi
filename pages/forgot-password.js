// import { useState } from "react";

// const ForgotPasswordPage = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await fetch("/api/forgot-password", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ email })
//     });

//     const data = await res.json();

//     if (data.success) {
//       setMessage("Password reset email sent!");
//     } else {
//       setMessage(`Error: ${data.error}`);
//     }
//   };

//   return (
//     <div>
//       <h1>Forgot Password</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           placeholder="Enter your email"
//         />
//         <button type="submit">Send Reset Link</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ForgotPasswordPage;


import { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    
    if (data.success) {
      setMessage("पासवर्ड रीसेटसाठी ईमेल तुमच्या नोंदणीकृत ईमेलवर पाठवण्यात आला आहे.");
    } else {
      setMessage(`त्रुटी: ${data.error}`);
    }
  };
return (
    <div className="min-h-screen w-full bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#1a1638] to-[#24243e] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="p-8 sm:p-10">
          
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>

          {/* Title & Description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">पासवर्ड विसरलात?</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              काळजी करू नका! तुमचा नोंदणीकृत ईमेल खाली प्रविष्ट करा आणि आम्ही तुम्हाला पासवर्ड रीसेट लिंक पाठवू.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-400">
                ईमेल पत्ता
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1638] focus:ring-purple-500"
            >
              रीसेट लिंक पाठवा
            </button>
          </form>

          {/* Feedback Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl border backdrop-blur-sm flex items-start gap-3 animate-fade-in-up ${
              message.toLowerCase().includes("error") || message.includes("त्रुटी") 
                ? 'bg-red-500/10 border-red-500/20 text-red-200' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
            }`}>
              <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                message.toLowerCase().includes("error") || message.includes("त्रुटी") ? 'bg-red-400' : 'bg-emerald-400'
              }`}></div>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <button 
              onClick={() => window.history.back()} 
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>लॉगिन वर परत जा</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;