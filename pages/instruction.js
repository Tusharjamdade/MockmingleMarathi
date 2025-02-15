// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';

// function Instruction() {
//     const router = useRouter();
//     const [isButtonEnabled, setIsButtonEnabled] = useState(false);

//     useEffect(() => {
//         // Function to check the API response status
//         const checkApiResponseStatus = () => {
//             const responseStatus = localStorage.getItem("apiResponseStatus");

//             if (responseStatus === "success") {
//                 setIsButtonEnabled(true); // Enable button if the response was successful
//             } else {
//                 setIsButtonEnabled(false); // Disable button if the response was not successful
//             }
//         };

//         // Check API status every 1 second
//         const intervalId = setInterval(checkApiResponseStatus, 1000);

//         // Cleanup interval on component unmount
//         return () => clearInterval(intervalId);
//     }, []); // Empty dependency array to run effect only once on mount

//     const handleButtonClick = () => {
//         // Remove apiResponseStatus from localStorage
//         localStorage.removeItem("apiResponseStatus");

//         router.push("/questionForm");   
//     };

//     return (
//         <>
            
//         <button onClick={() => router.back()} className="absolute font-bold text-4xl top-10 left-10 text-purple-400 hover:text-purple-300">
//           &laquo;
//         </button>
//         <div className="absolute top-10 right-10">
//           <div className="  rounded-full flex items-center justify-center">
//             <img src="/Logoo.png" alt="Logo" className="w-16 h-16" />
//           </div>
//         </div>
//            <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/BG.jpg')" }}>
    
//       <div className="relative w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg text-white">
//         {/* Back Button */}

//         {/* Logo */}

//         {/* Instructions Header */}
//         <div className="text-center text-lg font-bold bg-purple-600 rounded-md py-2">
//           INSTRUCTIONS FOR THE INTERVIEW
//         </div>

//         {/* Instructions List */}
//         <ul className="mt-4 space-y-2 text-sm">
//           <li>01. Research the company and job role.</li>
//           <li>02. Understand the job description properly.</li>
//           <li>03. Prepare answers for common interview questions.</li>
//           <li>04. Practice your introduction (Tell me about yourself).</li>
//           <li>05. Update your resume and Carry multiple copies.</li>
//           <li>06. Dress professionally and neatly.</li>
//           <li>07. Keep all necessary documents in a folder.</li>
//           <li>08. Learn about the company’s recent news and projects.</li>
//           <li>09. Be ready with questions to ask the interviewer.</li>
//           <li>10. Get proper sleep before the interview.</li>
//         </ul>

//         {/* Start Button */}
//         <div className="mt-6 text-center">
//           <button onClick={handleButtonClick} disabled={!isButtonEnabled} className={` ${isButtonEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'}  px-4 py-2 rounded-md text-white `}>
//             I am ready to begin
//           </button>
//         </div>
//       </div>
//     </div>
//         </>
//     );
// }

// export default Instruction;


// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';

// function Instruction() {
//     const router = useRouter();
//     const [isButtonEnabled, setIsButtonEnabled] = useState(false);

//     // Function to handle text-to-speech
//     const speak = (text) => {
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = 'en-US'; // Set language to English
//         window.speechSynthesis.speak(utterance);
//     };

//     useEffect(() => {
//         // Function to check the API response status
//         const checkApiResponseStatus = () => {
//             const responseStatus = localStorage.getItem("apiResponseStatus");

//             if (responseStatus === "success") {
//                 setIsButtonEnabled(true); // Enable button if the response was successful
//             } else {
//                 setIsButtonEnabled(false); // Disable button if the response was not successful
//             }
//         };

//         // Check API status every 1 second
//         const intervalId = setInterval(checkApiResponseStatus, 1000);

//         // Cleanup interval on component unmount
//         return () => clearInterval(intervalId);
//     }, []); // Empty dependency array to run effect only once on mount

//     useEffect(() => {
//         // Speak the instructions when the component is loaded
//         speak('Hi, I am Shakti, your interview trainer! Here are some essential tips to help you prepare for your upcoming interview.');
//     }, []); // Only run this once, when the component mounts

//     const handleButtonClick = () => {
//         // Remove apiResponseStatus from localStorage
//         localStorage.removeItem("apiResponseStatus");

//         router.push("/questionForm");   
//     };

//     return (
//         <>
//             <button onClick={() => router.back()} className="absolute font-bold text-4xl top-10 left-10 text-purple-400 hover:text-purple-300">
//                 &laquo;
//             </button>
//             <div className="absolute top-10 right-10">
//                 <div className="rounded-full flex items-center justify-center">
//                     <img src="/Logoo.png" alt="Logo" className="w-16 h-16" />
//                 </div>
//             </div>
//             <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/BG.jpg')" }}>
//                 <div className="relative w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-lg text-white">
//                     <div className="text-center text-lg font-bold bg-purple-600 rounded-md py-2">
//                         TIPS FOR THE INTERVIEW
//                     </div>

//                     <ul className="mt-4 space-y-2 text-sm">
//                         <li>01. Research the company and job role.</li>
//                         <li>02. Understand the job description properly.</li>
//                         <li>03. Prepare answers for common interview questions.</li>
//                         <li>04. Practice your introduction (Tell me about yourself).</li>
//                         <li>05. Update your resume and Carry multiple copies.</li>
//                         <li>06. Dress professionally and neatly.</li>
//                         <li>07. Keep all necessary documents in a folder.</li>
//                         <li>08. Learn about the company’s recent news and projects.</li>
//                         <li>09. Be ready with questions to ask the interviewer.</li>
//                         <li>10. Get proper sleep before the interview.</li>
//                     </ul>

//                     <div className="mt-6 text-center">
//                         <button onClick={handleButtonClick} disabled={!isButtonEnabled} className={`${isButtonEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'} px-4 py-2 rounded-md text-white`}>
//                             I am ready to begin
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Instruction;


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Instruction() {
    const router = useRouter();
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    // Function to handle text-to-speech
    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Set language to English
        window.speechSynthesis.speak(utterance);
    };
    
    useEffect(() => {
        // Speak the instructions when the component is loaded
        speak('Hi, I am Shakti, your interview trainer! Here are some essential tips to help you prepare for your upcoming interview.');
        
        // No need to return anything here, just ensuring speak is called once 
        }, []); // Empty dependency array to run effect only once on mount
        
        useEffect(() => {
        // Function to check the API response status
        const checkApiResponseStatus = () => {
            const responseStatus = localStorage.getItem("apiResponseStatus"); // Check if apiResponseStatus exists in localStorage

            if (responseStatus === "success") {
                setIsButtonEnabled(true); // Enable button if the response was successful
            } else {
                setIsButtonEnabled(false); // Disable button if the response was not successful
            }
        };

        // Check API status every 1 second
        const intervalId = setInterval(checkApiResponseStatus, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run effect only once on mount

    const handleButtonClick = () => {
        // Remove apiResponseStatus from localStorage
        localStorage.removeItem("apiResponseStatus");

        router.push("/questionForm");   
    };

    return (
        <>
            <button onClick={() => router.back()} className="absolute font-bold text-4xl top-10 left-10 text-purple-400 hover:text-purple-300">
                &laquo;
            </button>
            <div className="absolute top-10 right-10">
                <div className="rounded-full flex items-center justify-center">
                    <img src="/logoo.png" alt="Logo" className="w-16 h-16" />
                </div>
            </div>
            <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/BG.jpg')" }}>
                <div className="relative w-full mt-10 max-w-md p-6 bg-gray-800 rounded-xl shadow-lg text-white">
                    <div className="text-center text-lg font-bold bg-purple-600 rounded-md py-2">
                        TIPS FOR THE INTERVIEW
                    </div>

                    <ul className="mt-4 space-y-2 text-sm">
                        <li>01. Research the company and job role.</li>
                        <li>02. Understand the job description properly.</li>
                        <li>03. Prepare answers for common interview questions.</li>
                        <li>04. Practice your introduction (Tell me about yourself).</li>
                        <li>05. Update your resume and Carry multiple copies.</li>
                        <li>06. Dress professionally and neatly.</li>
                        <li>07. Keep all necessary documents in a folder.</li>
                        <li>08. Learn about the company’s recent news and projects.</li>
                        <li>09. Be ready with questions to ask the interviewer.</li>
                        <li>10. Get proper sleep before the interview.</li>
                    </ul>

                    <div className="mt-6 text-center">
                        <button onClick={handleButtonClick} disabled={!isButtonEnabled} className={`${isButtonEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'} px-4 py-2 rounded-md text-white`}>
                            I am ready to begin
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Instruction;
