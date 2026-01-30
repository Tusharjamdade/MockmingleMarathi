// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Head from 'next/head';

// function Practices() {
//   const router = useRouter();
//   const [userName, setUserName] = useState('');

//   useEffect(() => {
//     // Check if user is authenticated
//     if (!localStorage.getItem("token")) {
//       router.push("/login");
//     } else {
//       // Get user info from localStorage
//       const userFromStorage = JSON.parse(localStorage.getItem('user'));
//       if (userFromStorage) {
//         setUserName(userFromStorage.fullName || '');
//       }
//     }
//   }, []);

//   const practiceCards = [
//     {
//       id: 1,
//       title: "पर्सनॅलिटी टेस्ट",
//       description: "तुमचे पर्सनॅलिटी ट्रेट्स जाणून घ्या आणि स्ट्रेंथ्स व इम्प्रूव्हमेंट एरियाज ओळखा.",
//       image: "/personality.png",
//       bgColor: "from-purple-600 to-indigo-800",
//       link: "/personalityTest"
//     },
//     {
//       id: 2,
//       title: "बोलण्याचा सराव",
//       description: "वेगवेगळ्या डिफिकल्टी लेव्हल्सवर इंटरॲक्टिव्ह सरावाने तुमची बोलण्याची कौशल्ये सुधारवा.",
//       image: "/speaking.png",
//       bgColor: "from-pink-600 to-rose-800",
//       link: "/speakingPractice"
//     },
//     {
//       id: 3,
//       title: "ऐकण्याचा सराव",
//       description: "मार्गदर्शित ऑडिओ सराव आणि प्रत्यक्ष आयुष्यातील परिस्थितींच्या आधारे तुमची ऐकण्याची समज सुधारवा.",
//       image: "/listening.png",
//       bgColor: "from-blue-600 to-cyan-800",
//       link: "/listeningPractice"
//     },
//     {
//       id: 4,
//       title: "वाचन आणि लेखन",
//       description: "संघटित उपक्रमांद्वारे तुमची वाचन समज आणि लेखन कौशल्ये विकसित करा.",
//       image: "/reading.png",
//       bgColor: "from-emerald-600 to-teal-800",
//       link: "/readingWritingPractice"
//     }
//   ];

//   return (
//     <>
//       <Head>
//         <title>SHAKKTII AI - सराव परीक्षा</title>
//       </Head>
//       <div className="min-h-screen bg-gray-100" style={{ backgroundImage: "url('/BG.jpg')", backgroundSize: 'cover' }}>
//         <div className="container mx-auto px-4 py-16">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-12">
//             <div>
//               <button 
//                 onClick={() => router.push('/dashboard')} 
//                 className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
//               >
//                 <img src="/2.svg" alt="Back" className="w-8 h-8 mr-2" />
//                 <span className="text-lg font-medium">मागे जा</span>
//               </button>
//             </div>
//             <div className="flex items-center">
//               <div className="mr-4 text-right">
//                 <p className="text-sm text-gray-600">आपले स्वागत आहे,</p>
//                 <p className="font-semibold text-lg text-purple-900">{userName}</p>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
//                 <img src="/logoo.png" alt="Logo" className="w-10 h-10" />
//               </div>
//             </div>
//           </div>

//           {/* Title */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold text-purple-900">प्रॅक्टिस अ‍ॅसेसमेंट्स</h1>
//             <p className="text-lg text-gray-700 mt-2">
//               आमच्या विशेष सराव सत्रांद्वारे तुमची कौशल्ये वाढवा.
//             </p>
//             <button
//               onClick={() => router.push('/practiceProgress')}
//               className="mt-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-2 px-6 rounded-full text-md font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//               </svg>
//               तुमची प्रोग्रेस पाहा
//             </button>
//           </div>

//           {/* Practice Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {practiceCards.map((card) => (
//               <div
//                 key={card.id}
//                 className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 cursor-pointer"
//                 onClick={() => router.push(card.link)}
//               >
//                 <div className={`h-32 bg-gradient-to-r ${card.bgColor} flex items-center justify-center p-6`}>
//                   <img 
//                     src={card.image || "/default-card.png"} 
//                     alt={card.title} 
//                     className="w-24 h-24 object-contain" 
//                     onError={(e) => {
//                       e.target.src = "/default-card.png";
//                     }}
//                   />
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
//                   <p className="text-gray-600 text-sm mb-4">{card.description}</p>
//                   <button 
//                     className="w-full bg-gradient-to-r from-pink-800 to-purple-900 text-white py-2 rounded-md hover:opacity-90 transition-opacity"
//                   >
//                     सराव सुरू करा
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Practices;


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function Practices() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      // Get user info from localStorage
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage) {
        setUserName(userFromStorage.fullName || 'User');
      }
      setLoading(false);
    }
  }, [router]);

  const practiceCards = [
    {
      id: 1,
      title: "पर्सनॅलिटी टेस्ट",
      description: "तुमचे पर्सनॅलिटी ट्रेट्स जाणून घ्या आणि स्ट्रेंथ्स व इम्प्रूव्हमेंट एरियाज ओळखा.",
      image: "/personality.png", // Ensure this exists in /public
      bgColor: "from-purple-600 to-indigo-800",
      link: "/personalityTest"
    },
    {
      id: 2,
      title: "बोलण्याचा सराव",
      description: "वेगवेगळ्या डिफिकल्टी लेव्हल्सवर इंटरॲक्टिव्ह सरावाने तुमची बोलण्याची कौशल्ये सुधारवा.",
      image: "/speaking.png", // Ensure this exists in /public
      bgColor: "from-pink-600 to-rose-800",
      link: "/speakingPractice"
    },
    {
      id: 3,
      title: "ऐकण्याचा सराव",
      description: "मार्गदर्शित ऑडिओ सराव आणि प्रत्यक्ष आयुष्यातील परिस्थितींच्या आधारे तुमची ऐकण्याची समज सुधारवा.",
      image: "/listening.png", // Ensure this exists in /public
      bgColor: "from-blue-600 to-cyan-800",
      link: "/listeningPractice"
    },
    {
      id: 4,
      title: "वाचन आणि लेखन",
      description: "संघटित उपक्रमांद्वारे तुमची वाचन समज आणि लेखन कौशल्ये विकसित करा.",
      image: "/reading.png", // Ensure this exists in /public
      bgColor: "from-emerald-600 to-teal-800",
      link: "/readingWritingPractice"
    }
  ];

  // Prevent hydration mismatch or flash of content
  if (loading) return null;

  return (
    <>
      <Head>
        <title>SHAKKTII AI - सराव परीक्षा</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen relative bg-[#0f0c29] font-sans text-white overflow-x-hidden">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/BG.jpg')" }}
          ></div>
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/95 via-[#1a1638]/90 to-[#2e1065]/80 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          
          {/* Header Navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 backdrop-blur-md"
            >
              <div className="p-1.5 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                <img src="/2.svg" alt="Back" className="w-5 h-5 invert" />
              </div>
              <span className="text-sm font-medium tracking-wide text-gray-200 group-hover:text-white">डॅशबोर्डकडे परत जा</span>
            </button>

            <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-purple-300 font-bold uppercase tracking-wider">Welcome back,</p>
                <p className="font-bold text-lg text-white leading-none">{userName}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <div className="w-full h-full rounded-full bg-[#1a103c] flex items-center justify-center overflow-hidden">
                   <img src="/logoo.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-down">
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-pink-200 mb-6 drop-shadow-sm tracking-tight">
              प्रॅक्टिस अ‍ॅसेसमेंट्स
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              आमच्या विशेष AI-आधारित सराव सत्रांद्वारे तुमची कौशल्ये वाढवा आणि मुलाखतीसाठी तयार व्हा.
            </p>
            
            <button
              onClick={() => router.push('/practiceProgress')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-1 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              तुमची प्रोग्रेस पाहा (View Progress)
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 animate-fade-in-up">
            {practiceCards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => router.push(card.link)}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 cursor-pointer flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Area */}
                <div className={`h-40 relative overflow-hidden bg-gradient-to-br ${card.bgColor} flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-700`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-28 h-28 object-contain drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { 
                      e.target.onerror = null; // Stops the infinite loop
                      e.target.src = "/logoo.png"; // Fallback to logo if image missing
                    }}
                  />
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-1 relative">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {card.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5">
                    <button className="w-full py-3 rounded-xl font-bold text-sm bg-white/5 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 text-white border border-white/5 group-hover:border-transparent transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group-hover:shadow-purple-500/25">
                      <span>सराव सुरू करा</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Practices;