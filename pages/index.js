
// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import Head from "next/head";

// import { MdAccountCircle } from 'react-icons/md';
// import { useRouter } from 'next/router'; // For programmatic navigation

// export default function dashboard({ Logout, user }) {
//   const [dropdown, setDropdown] = useState(false);
//   const [notification, setNotification] = useState(false); // State to track the notification
//   const [firstName, setFirstName] = useState(null); // State to store the first name
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State to control mobile menu
//   const router = useRouter(); // Next.js router to navigate to /role

//   useEffect(() => {
//           if (!localStorage.getItem("token")) {
//             router.push("/login");
//           } else {
//             const userFromStorage = JSON.parse(localStorage.getItem('user'));
//               setFirstName(userFromStorage.fullName.split(" ")[0]);
          
//           }
//         }, []);

//   const toggleDropdown = () => setDropdown(prev => !prev);
//   const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

//   // Function to simulate storing an item in localStorage and triggering the notification
//   const handleReportClick = () => {
//     localStorage.removeItem("store"); // Remove notification from localStorage
//     setNotification(false); // Hide the notification dot
//   };

// return (
//     <>
//       <Head>
//         <title>Shakktii मुलाखत प्रशिक्षक</title>
//         <meta name="description" content="AI-Powered Interview Excellence" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <div
//         className="min-h-screen bg-fixed bg-cover bg-center flex flex-col items-center"
//         style={{ backgroundImage: "url('/bg.gif')" }}
//       >
//         {/* Modern Glassmorphism Navigation */}
//         <nav className="sticky top-4 z-50 flex justify-between items-center my-4 mx-4 py-3 px-8 backdrop-blur-xl bg-black/30 w-[95%] max-w-7xl rounded-2xl border border-white/10 shadow-2xl">
//           <div className="flex items-center gap-3 group cursor-pointer">
//             <div className="bg-white/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
//               <img src="/Logo.png" alt="लोगो चिन्ह" className="w-8 h-8 object-contain" />
//             </div>
//             <div className="text-white text-2xl font-black tracking-tight">
//               Shakkti<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">AI</span>
//             </div>
//           </div>
          
//           {/* Desktop Navigation */}
//           <ul className="hidden md:flex space-x-10 text-white/90 text-sm font-semibold uppercase tracking-wider items-center">
//             <li className="hover:text-pink-400 cursor-pointer transition-all duration-300 relative group">
//               होम
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
//             </li>
            
//             <Link href={'/progress'}>
//               <li className="hover:text-pink-400 cursor-pointer transition-all duration-300 relative group">
//                 प्रोग्रेस
//                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
//               </li>
//             </Link>
            
//             <Link href={'/oldreport'}>
//               <li className="relative hover:text-pink-400 cursor-pointer transition-all duration-300 group" onClick={handleReportClick}>
//                 अहवाल
//                 {notification && (
//                   <span className="absolute -top-1 -right-3 flex h-3 w-3">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//                   </span>
//                 )}
//                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
//               </li>
//             </Link>
//           </ul>
          
//           <div className="hidden md:flex items-center gap-6">
//             {user?.value ? (
//               <div className="relative">
//                 <button 
//                   className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all border border-white/10 shadow-inner" 
//                   onClick={toggleDropdown}
//                 >
//                   <MdAccountCircle className="text-2xl text-pink-400" />
//                   <span className="text-sm font-bold text-white">{firstName || 'Account'}</span>
//                 </button>
                
//                 {dropdown && (
//                   <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
//                     <ul className="p-2 space-y-1">
//                       <Link href={'/profile'}>
//                         <li className="flex items-center gap-3 p-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors cursor-pointer font-medium">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
//                           प्रोफाइल
//                         </li>
//                       </Link>
//                       <Link href={'/progress'}>
//                         <li className="flex items-center gap-3 p-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors cursor-pointer font-medium">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
//                           माझी प्रगती
//                         </li>
//                       </Link>
//                       <li onClick={Logout} className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer font-bold border-t border-gray-50 mt-1">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
//                         बाहेर पडा
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link href="/login">
//                 <button className="px-7 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg font-bold text-sm">
//                   लॉगिन
//                 </button>
//               </Link>
//             )}
//           </div>

//           <button className="md:hidden p-2 text-white z-20" onClick={toggleMobileMenu}>
//             {mobileMenuOpen ? <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
//           </button>

//           {mobileMenuOpen && (
//             <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex flex-col p-8 animate-in slide-in-from-right duration-300">
//               <button className="self-end p-2 text-white" onClick={toggleMobileMenu}>
//                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//               </button>
//               <ul className="flex flex-col gap-8 mt-12 text-center">
//                 <li className="text-3xl font-bold text-white" onClick={toggleMobileMenu}>होम</li>
//                 <Link href={'/progress'} onClick={toggleMobileMenu}><li className="text-3xl font-bold text-white">प्रोग्रेस <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full align-top">नवीन</span></li></Link>
//                 <Link href={'/oldreport'} onClick={() => { handleReportClick(); toggleMobileMenu(); }}><li className="text-3xl font-bold text-white">अहवाल</li></Link>
//                 {user?.value ? (
//                   <>
//                     <Link href={'/profile'} onClick={toggleMobileMenu}><li className="text-3xl font-bold text-white">प्रोफाइल</li></Link>
//                     <li className="text-3xl font-bold text-red-500" onClick={() => { Logout(); toggleMobileMenu(); }}>बाहेर पडा</li>
//                   </>
//                 ) : (
//                   <Link href="/login" onClick={toggleMobileMenu}><li className="bg-pink-500 text-white py-4 rounded-2xl text-2xl font-bold">लॉगिन</li></Link>
//                 )}
//               </ul>
//             </div>
//           )}
//         </nav>

//         {/* Hero Section */}
//         <div className="w-full max-w-7xl px-6 py-12 md:py-24 flex flex-col md:flex-row items-center gap-16">
//           <div className="flex-1 space-y-8 text-center md:text-left z-10">
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
//               <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
//               <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-pink-300">नवीन: प्रोग्रेस ट्रॅकिंग आणि विश्लेषण</span>
//             </div>
//             <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1]">
//               तुमच्या <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500">मुलाखत कौशल्यांवर</span> प्रभुत्व मिळवा
//             </h1>
//             <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl mx-auto md:mx-0">
//               आमच्या एआय मुलाखतकर्त्यासोबत सराव करा, त्वरित फीडबॅक मिळवा आणि सविस्तर विश्लेषणाच्या आधारे वेळोवेळी आपली प्रोग्रेस ट्रॅक करा.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
//               <Link href={'/role'}>
//                 <button className="group relative px-8 py-4 bg-pink-500 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 shadow-[0_20px_40px_rgba(244,63,94,0.3)]">
//                   <span className="relative z-10 flex items-center gap-2">सराव सुरू करा <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
//                 </button>
//               </Link>
//               <Link href={'/progress'}>
//                 <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2">प्रोग्रेस पहा</button>
//               </Link>
//               <Link href={'/practices'}>
//                 <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2">प्रॅक्टिस टेस्ट्स</button>
//               </Link>
//             </div>
//           </div>
//           <div className="flex-1 relative">
//             <div className="absolute -inset-4 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
//             <img src="/mock.png" alt="Hero" className="relative w-full max-w-2xl drop-shadow-2xl transform transition-transform duration-700 hover:rotate-1 hover:scale-[1.02]" />
//           </div>
//         </div>
//       </div>

//       <div className="w-full bg-white text-slate-900 py-32 px-6">
//         <div className="max-w-7xl mx-auto">
//           <header className="text-center mb-24 space-y-4">
//             <h2 className="text-4xl md:text-6xl font-black tracking-tight">
//               तुम्ही मुलाखतीसाठी तयार आहात का? <br/>
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Shakkti AI</span> सोबत चाचणी देऊन तपासा.
//             </h2>
//             <div className="h-1.5 w-24 bg-pink-500 mx-auto rounded-full"></div>
//           </header>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40">
//             <div className="group bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-2">
//               <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
//                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
//               </div>
//               <h3 className="text-2xl font-extrabold mb-4">तुमची मुलाखत प्रोग्रेस ट्रॅक करा</h3>
//               <p className="text-slate-600 leading-relaxed mb-8">आमच्या प्रोग्रेस ट्रॅकिंग सिस्टममुळे तुम्हाला वेळोवेळी तुमच्या कामगिरीतील सुधारणा पाहता येतात. विविध कौशल्यांतील कामगिरीचे सविस्तर विश्लेषण करा.</p>
//               <ul className="space-y-4 mb-8">
//                 {['कौशल्य विश्लेषण', 'परफॉर्मन्स कम्पेरिजन', 'ग्रोथ व्हिज्युअलायझेशन', 'मुलाखतींचा आढावा'].map((f, i) => (
//                   <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
//                     <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>{f}
//                   </li>
//                 ))}
//               </ul>
//               <Link href="/progress"><button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold transition-all hover:bg-blue-600">प्रोग्रेस पहा</button></Link>
//             </div>

//             <div className="group bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-2">
//               <div className="w-14 h-14 bg-pink-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-pink-200">
//                 <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
//               </div>
//               <h3 className="text-2xl font-extrabold mb-4">प्रॅक्टिस टेस्ट्स आणि असेसमेंट्स</h3>
//               <p className="text-slate-600 leading-relaxed mb-8">आमच्या विशेष अभ्यास चाचण्यांसह तुमची भाषा आणि मुलाखत कौशल्ये सुधारा. तुमच्या क्षमता सुधारण्यासाठी वैयक्तिक AI फीडबॅक मिळवा.</p>
//               <ul className="space-y-4 mb-8">
//                 {['पर्सनालिटी असेसमेंट', 'बोलण्याचा सराव', 'ऐकण्याची समज', 'वाचन आणि लेखन चाचण्या'].map((f, i) => (
//                   <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
//                     <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs">✓</div>{f}
//                   </li>
//                 ))}
//               </ul>
//               <Link href="/practices"><button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold transition-all hover:bg-pink-600">प्रॅक्टिस टेस्ट्स सुरू करा</button></Link>
//             </div>
//           </div>

//           <div className="space-y-40">
//             {[
//               { id: 1, title: "प्रॅक्टिस करा", desc: "तुमच्या मुलाखतीच्या कौशल्यांचा अभ्यास करा, सुधारणा आवश्यक असलेले भाग ओळखा आणि उत्तरे अधिक प्रभावी बनवा. वास्तविक मुलाखतीपूर्वी आत्मविश्वास वाढवा आणि तणाव कमी करा, जेणेकरून तुम्ही यशस्वी होऊ शकता.", img: "/p1.jpeg", align: "left" },
//               { id: 2, title: "AI आधारित थेट मुलाखत सराव सत्र", desc: "AI-सह थेट मॉक इंटरव्ह्यूचा अनुभव घ्या – जिथे तुमच्या बोलण्याची शैली, आत्मविश्वास आणि अचूकतेवर त्वरित प्रतिक्रिया मिळते. डेटा-आधारित विश्लेषणामुळे वेळ वाचतो आणि सुधारण्याच्या दिशा स्पष्ट होतात.", img: "/p2.jpeg", align: "right" },
//               { id: 3, title: "तुमच्या सोयीनुसार मुलाखतीचे वेळापत्रक", desc: "कधीही आणि कुठेही सराव करा – निश्चित वेळापत्रकाची गरज नाही. विद्यार्थ्यांना आणि व्यावसायिकांना तत्काळ प्रवेश मिळावा यासाठी फ्लेक्सिबल आणि स्ट्रेस-फ्री तयारीची सुविधा.", img: "/p3.jpg", align: "left" },
//               { id: 4, title: "शिक्षणात गेमसारखा अनुभव", desc: "MockMingle मध्ये स्कोर्स, बॅजेस आणि लीडरबोर्ड्ससह गैमीकरण वापरून शिकणे मजेदार, प्रेरणादायक आणि फलदायी बनवले आहे, तसेच तुमच्या प्रगतीवर लक्ष ठेवले जाते.", img: "/p4.png", align: "right" },
//               { id: 5, title: "तज्ज्ञांकडून फीडबॅक मिळवा", desc: "AI आणि इंडस्ट्री तज्ज्ञांकडून संवाद, तांत्रिक कौशल्ये आणि कामगिरी यावर सखोल फीडबॅक मिळवा, तसेच तुमच्या मुलाखतीतील यशासाठी वैयक्तिक सुधारणा सूचना प्राप्त करा.", img: "/p5.png", align: "left" },
//               { id: 6, title: "व्हिडिओ स्वरूपात मार्गदर्शन मिळवा", desc: "AI आणि तज्ज्ञांच्या मदतीने तुम्हाला व्हिडिओ स्वरूपात मार्गदर्शन मिळेल, ज्यात उत्तर देण्याच्या पद्धती, शारीरिक भाषा आणि आवाजावर सखोल सूचना दिल्या जातील. यामुळे तुम्हाला सुधारणा सहज आणि आकर्षकपणे करता येईल.", img: "/p6.jpg", align: "right" }
//             ].map((step) => (
//               <div key={step.id} className={`flex flex-col lg:flex-row items-center gap-16 ${step.align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
//                 <div className="flex-1 relative group" style={{ perspective: "1000px" }}>
//                   <div className="transform transition-all duration-700 group-hover:rotate-y-12" style={{ transformStyle: "preserve-3d", transform: step.align === 'left' ? 'rotateY(20deg)' : 'rotateY(-20deg)' }}>
//                     <img src={step.img} alt={step.title} className="rounded-[2rem] shadow-2xl w-full h-[350px] object-cover border-8 border-white" />
//                   </div>
//                   <div className={`absolute -top-10 ${step.align === 'left' ? '-left-10' : '-right-10'} w-24 h-24 bg-white shadow-2xl rounded-3xl flex items-center justify-center text-4xl font-black text-pink-600 z-20 border-4 border-slate-50`}>{step.id}</div>
//                 </div>
//                 <div className="flex-1 space-y-6">
//                   <h3 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">{step.title}</h3>
//                   <p className="text-xl text-slate-600 leading-relaxed font-medium">{step.desc}</p>
//                   <div className="h-1.5 w-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <footer className="relative bg-slate-950 text-white py-24 px-6 overflow-hidden">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full"></div>
//         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
//           <div className="flex justify-center lg:justify-start">
//             <img src="/footermock.png" alt="Footer" className="w-full max-w-md object-contain drop-shadow-2xl" />
//           </div>
//           <div className="text-center lg:text-left space-y-8">
//             <div className="space-y-2">
//               <h2 className="text-pink-500 font-black uppercase tracking-widest text-sm">संपर्क करा</h2>
//               <p className="text-4xl md:text-6xl font-black leading-tight">तुमच्या यशासाठी आम्ही सोबत आहोत.</p>
//             </div>
//             <div className="space-y-4">
//               <a href="mailto:info@shakktii.in" className="inline-block text-2xl md:text-5xl font-black hover:text-pink-400 transition-colors border-b-4 border-pink-500 pb-2 break-all">info@shakktii.in</a>
//               <p className="text-gray-400 text-lg max-w-md mx-auto lg:mx-0">कोणत्याही प्रश्नांसाठी किंवा सहकार्याकरिता आम्हाला ईमेल करा.</p>
//             </div>
//             <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 font-bold tracking-tight">
//               <p>© 2026 Shakkti AI. All Rights Reserved.</p>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// }


import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";

import { MdAccountCircle } from 'react-icons/md';
import { useRouter } from 'next/router';

export default function dashboard({ Logout, user }) {
  const [dropdown, setDropdown] = useState(false);
  const [notification, setNotification] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      setFirstName(userFromStorage.fullName.split(" ")[0]);
    }
  }, []);

  const toggleDropdown = () => setDropdown(prev => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const handleReportClick = () => {
    localStorage.removeItem("store");
    setNotification(false);
  };

  return (
    <>
      <Head>
        <title>Shakktii मुलाखत प्रशिक्षक</title>
        <meta name="description" content="AI-Powered Interview Excellence" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="min-h-screen bg-fixed bg-cover bg-center flex flex-col items-center"
        style={{ backgroundImage: "url('/bg.gif')" }}
      >
        {/* Modern Glassmorphism Navigation */}
        <nav className="sticky top-4 z-50 flex justify-between items-center my-4 mx-4 py-3 px-8 backdrop-blur-xl bg-black/30 w-[95%] max-w-7xl rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-white/10 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <img src="/Logo.png" alt="लोगो चिन्ह" className="w-8 h-8 object-contain" />
            </div>
            <div className="text-white text-2xl font-black tracking-tight">
              Shakkti<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">AI</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-10 text-white/90 text-sm font-semibold uppercase tracking-wider items-center">
            <li className="hover:text-pink-400 cursor-pointer transition-all duration-300 relative group">
              होम
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
            </li>
            
            <Link href={'/progress'}>
              <li className="hover:text-pink-400 cursor-pointer transition-all duration-300 relative group">
                प्रोग्रेस
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </li>
            </Link>

            {/* --- Added Assessment Report Link --- */}
            <Link href={'/assessmentReport'}>
              <li className="hover:text-pink-400 cursor-pointer transition-all duration-300 relative group">
                असेसमेंट रिपोर्ट
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </li>
            </Link>
            {/* ------------------------------------ */}
            
            <Link href={'/oldreport'}>
              <li className="relative hover:text-pink-400 cursor-pointer transition-all duration-300 group" onClick={handleReportClick}>
                अहवाल
                {notification && (
                  <span className="absolute -top-1 -right-3 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </li>
            </Link>
          </ul>
          
          <div className="hidden md:flex items-center gap-6">
            {user?.value ? (
              <div className="relative">
                <button 
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all border border-white/10 shadow-inner" 
                  onClick={toggleDropdown}
                >
                  <MdAccountCircle className="text-2xl text-pink-400" />
                  <span className="text-sm font-bold text-white">{firstName || 'Account'}</span>
                </button>
                
                {dropdown && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                    <ul className="p-2 space-y-1">
                      <Link href={'/profile'}>
                        <li className="flex items-center gap-3 p-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors cursor-pointer font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          प्रोफाइल
                        </li>
                      </Link>
                      <Link href={'/progress'}>
                        <li className="flex items-center gap-3 p-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors cursor-pointer font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                          माझी प्रगती
                        </li>
                      </Link>
                      <li onClick={Logout} className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer font-bold border-t border-gray-50 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        बाहेर पडा
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="px-7 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg font-bold text-sm">
                  लॉगिन
                </button>
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 text-white z-20" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>}
          </button>

          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex flex-col p-8 animate-in slide-in-from-right duration-300">
              <button className="self-end p-2 text-white" onClick={toggleMobileMenu}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <ul className="flex flex-col gap-8 mt-12 text-center">
                <li className="text-3xl font-bold text-white" onClick={toggleMobileMenu}>होम</li>
                <Link href={'/progress'} onClick={toggleMobileMenu}><li className="text-3xl font-bold text-white">प्रोग्रेस <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full align-top">नवीन</span></li></Link>
                
                {/* --- Added Assessment Report Mobile Link --- */}
                <Link href={'/assessmentReport'} onClick={toggleMobileMenu}>
                    <li className="text-3xl font-bold text-white">असेसमेंट रिपोर्ट</li>
                </Link>
                {/* ------------------------------------------- */}

                <Link href={'/oldreport'} onClick={() => { handleReportClick(); toggleMobileMenu(); }}><li className="text-3xl font-bold text-white">अहवाल</li></Link>
                {user?.value ? (
                  <>
                    <Link href={'/profile'} onClick={toggleMobileMenu}><li className="text-3xl font-bold text-white">प्रोफाइल</li></Link>
                    <li className="text-3xl font-bold text-red-500" onClick={() => { Logout(); toggleMobileMenu(); }}>बाहेर पडा</li>
                  </>
                ) : (
                  <Link href="/login" onClick={toggleMobileMenu}><li className="bg-pink-500 text-white py-4 rounded-2xl text-2xl font-bold">लॉगिन</li></Link>
                )}
              </ul>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <div className="w-full max-w-7xl px-6 py-12 md:py-24 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-pink-300">नवीन: प्रोग्रेस ट्रॅकिंग आणि विश्लेषण</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1]">
              तुमच्या <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500">मुलाखत कौशल्यांवर</span> प्रभुत्व मिळवा
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-xl mx-auto md:mx-0">
              आमच्या एआय मुलाखतकर्त्यासोबत सराव करा, त्वरित फीडबॅक मिळवा आणि सविस्तर विश्लेषणाच्या आधारे वेळोवेळी आपली प्रोग्रेस ट्रॅक करा.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start flex-wrap">
              <Link href={'/role'}>
                <button className="group relative px-8 py-4 bg-pink-500 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 shadow-[0_20px_40px_rgba(244,63,94,0.3)]">
                  <span className="relative z-10 flex items-center gap-2">सराव सुरू करा <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
                </button>
              </Link>
              
              <Link href={'/assessment'}>
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-[0_20px_40px_rgba(124,58,237,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 border border-purple-400/30">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   असेसमेंट द्या
                </button>
              </Link>

              <Link href={'/progress'}>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-lg backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2">प्रोग्रेस पहा</button>
              </Link>
              <Link href={'/practices'}>
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2">प्रॅक्टिस टेस्ट्स</button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
            <img src="/mock.png" alt="Hero" className="relative w-full max-w-2xl drop-shadow-2xl transform transition-transform duration-700 hover:rotate-1 hover:scale-[1.02]" />
          </div>
        </div>
      </div>

      <div className="w-full bg-white text-slate-900 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              तुम्ही मुलाखतीसाठी तयार आहात का? <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Shakkti AI</span> सोबत चाचणी देऊन तपासा.
            </h2>
            <div className="h-1.5 w-24 bg-pink-500 mx-auto rounded-full"></div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40">
            <div className="group bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-2xl font-extrabold mb-4">तुमची मुलाखत प्रोग्रेस ट्रॅक करा</h3>
              <p className="text-slate-600 leading-relaxed mb-8">आमच्या प्रोग्रेस ट्रॅकिंग सिस्टममुळे तुम्हाला वेळोवेळी तुमच्या कामगिरीतील सुधारणा पाहता येतात. विविध कौशल्यांतील कामगिरीचे सविस्तर विश्लेषण करा.</p>
              <ul className="space-y-4 mb-8">
                {['कौशल्य विश्लेषण', 'परफॉर्मन्स कम्पेरिजन', 'ग्रोथ व्हिज्युअलायझेशन', 'मुलाखतींचा आढावा'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>{f}
                  </li>
                ))}
              </ul>
              <Link href="/progress"><button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold transition-all hover:bg-blue-600">प्रोग्रेस पहा</button></Link>
            </div>

            <div className="group bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 bg-pink-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-pink-200">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h3 className="text-2xl font-extrabold mb-4">प्रॅक्टिस टेस्ट्स आणि असेसमेंट्स</h3>
              <p className="text-slate-600 leading-relaxed mb-8">आमच्या विशेष अभ्यास चाचण्यांसह तुमची भाषा आणि मुलाखत कौशल्ये सुधारा. तुमच्या क्षमता सुधारण्यासाठी वैयक्तिक AI फीडबॅक मिळवा.</p>
              <ul className="space-y-4 mb-8">
                {['पर्सनालिटी असेसमेंट', 'बोलण्याचा सराव', 'ऐकण्याची समज', 'वाचन आणि लेखन चाचण्या'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs">✓</div>{f}
                  </li>
                ))}
              </ul>
              <Link href="/practices"><button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold transition-all hover:bg-pink-600">प्रॅक्टिस टेस्ट्स सुरू करा</button></Link>
            </div>
          </div>

          <div className="space-y-40">
            {[
              { id: 1, title: "प्रॅक्टिस करा", desc: "तुमच्या मुलाखतीच्या कौशल्यांचा अभ्यास करा, सुधारणा आवश्यक असलेले भाग ओळखा आणि उत्तरे अधिक प्रभावी बनवा. वास्तविक मुलाखतीपूर्वी आत्मविश्वास वाढवा आणि तणाव कमी करा, जेणेकरून तुम्ही यशस्वी होऊ शकता.", img: "/p1.jpeg", align: "left" },
              { id: 2, title: "AI आधारित थेट मुलाखत सराव सत्र", desc: "AI-सह थेट मॉक इंटरव्ह्यूचा अनुभव घ्या – जिथे तुमच्या बोलण्याची शैली, आत्मविश्वास आणि अचूकतेवर त्वरित प्रतिक्रिया मिळते. डेटा-आधारित विश्लेषणामुळे वेळ वाचतो आणि सुधारण्याच्या दिशा स्पष्ट होतात.", img: "/p2.jpeg", align: "right" },
              { id: 3, title: "तुमच्या सोयीनुसार मुलाखतीचे वेळापत्रक", desc: "कधीही आणि कुठेही सराव करा – निश्चित वेळापत्रकाची गरज नाही. विद्यार्थ्यांना आणि व्यावसायिकांना तत्काळ प्रवेश मिळावा यासाठी फ्लेक्सिबल आणि स्ट्रेस-फ्री तयारीची सुविधा.", img: "/p3.jpg", align: "left" },
              { id: 4, title: "शिक्षणात गेमसारखा अनुभव", desc: "MockMingle मध्ये स्कोर्स, बॅजेस आणि लीडरबोर्ड्ससह गैमीकरण वापरून शिकणे मजेदार, प्रेरणादायक आणि फलदायी बनवले आहे, तसेच तुमच्या प्रगतीवर लक्ष ठेवले जाते.", img: "/p4.png", align: "right" },
              { id: 5, title: "तज्ज्ञांकडून फीडबॅक मिळवा", desc: "AI आणि इंडस्ट्री तज्ज्ञांकडून संवाद, तांत्रिक कौशल्ये आणि कामगिरी यावर सखोल फीडबॅक मिळवा, तसेच तुमच्या मुलाखतीतील यशासाठी वैयक्तिक सुधारणा सूचना प्राप्त करा.", img: "/p5.png", align: "left" },
              { id: 6, title: "व्हिडिओ स्वरूपात मार्गदर्शन मिळवा", desc: "AI आणि तज्ज्ञांच्या मदतीने तुम्हाला व्हिडिओ स्वरूपात मार्गदर्शन मिळेल, ज्यात उत्तर देण्याच्या पद्धती, शारीरिक भाषा आणि आवाजावर सखोल सूचना दिल्या जातील. यामुळे तुम्हाला सुधारणा सहज आणि आकर्षकपणे करता येईल.", img: "/p6.jpg", align: "right" }
            ].map((step) => (
              <div key={step.id} className={`flex flex-col lg:flex-row items-center gap-16 ${step.align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1 relative group" style={{ perspective: "1000px" }}>
                  <div className="transform transition-all duration-700 group-hover:rotate-y-12" style={{ transformStyle: "preserve-3d", transform: step.align === 'left' ? 'rotateY(20deg)' : 'rotateY(-20deg)' }}>
                    <img src={step.img} alt={step.title} className="rounded-[2rem] shadow-2xl w-full h-[350px] object-cover border-8 border-white" />
                  </div>
                  <div className={`absolute -top-10 ${step.align === 'left' ? '-left-10' : '-right-10'} w-24 h-24 bg-white shadow-2xl rounded-3xl flex items-center justify-center text-4xl font-black text-pink-600 z-20 border-4 border-slate-50`}>{step.id}</div>
                </div>
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">{step.title}</h3>
                  <p className="text-xl text-slate-600 leading-relaxed font-medium">{step.desc}</p>
                  <div className="h-1.5 w-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative bg-slate-950 text-white py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="flex justify-center lg:justify-start">
            <img src="/footermock.png" alt="Footer" className="w-full max-w-md object-contain drop-shadow-2xl" />
          </div>
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-2">
              <h2 className="text-pink-500 font-black uppercase tracking-widest text-sm">संपर्क करा</h2>
              <p className="text-4xl md:text-6xl font-black leading-tight">तुमच्या यशासाठी आम्ही सोबत आहोत.</p>
            </div>
            <div className="space-y-4">
              <a href="mailto:info@shakktii.in" className="inline-block text-2xl md:text-5xl font-black hover:text-pink-400 transition-colors border-b-4 border-pink-500 pb-2 break-all">info@shakktii.in</a>
              <p className="text-gray-400 text-lg max-w-md mx-auto lg:mx-0">कोणत्याही प्रश्नांसाठी किंवा सहकार्याकरिता आम्हाला ईमेल करा.</p>
            </div>
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 font-bold tracking-tight">
              <p>© 2026 Shakkti AI. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}