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

//   </div>



//  <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/BG.jpg')" }}>


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



// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';

// function Instruction() {
//     const router = useRouter();
//     const [isButtonEnabled, setIsButtonEnabled] = useState(false);
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const slides = [
//         {
//             id: 1,
//             content: "Inspired by Shree Narendra Modi, Puushkar an ISB Alum became the Founding Member of Citizens for Accountable Governance, the official team of Shree Narendra Modi’s Prime Ministerial campaign",
//         },
//         {
//             id: 2,
//             content: "Ideated and executed multiple projects like the collection of iron from 6lac villages, Chai pe Charcha, Modi in 3D, NaMo for India, Onground research, and campaign. Ideated the NaMo App with providing consultancy",
//         },
//         {
//             id: 3,
//             content: "Chief consultant to the CM War Room and ideated and provided blue print for a unique first time ground influencer outreach project, Mukhyamantri Mitra",
//         },
//         {
//             id: 4,
//             content: "Consulting to various national and international government bodies, political leaders and tech platforms for ground outreach",
//         },
//         {
//             id: 5,
//             content: "Founded a tech platform for assistive governance and outreach to citizens.Like Gramya, SHAKKTII, Grath. Worked with Chattisgarh, Madhya Padresh The principal coordinator for P20. With the use of AI and Gramya conducted 1000 roundatbles at Gram Panchayat",
//         },
//     ];

//     const handleNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     };

//     const handlePrev = () => {
//         setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
//     };

//     const goToSlide = (index) => {
//         setCurrentIndex(index);
//     };

//     useEffect(() => {
//         const interval = setInterval(() => {
//             handleNext();
//         }, 10000);

//         return () => clearInterval(interval);
//     }, []);
//     // Function to handle text-to-speech
//     const speak = (text) => {
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = 'en-US'; // Set language to English
//         window.speechSynthesis.speak(utterance);
//     };

//     useEffect(() => {
//         // Speak the instructions when the component is loaded
//         speak('Hi, I am Shakti, your interview trainer! Here are some essential tips to help you prepare for your upcoming interview.');

//         // No need to return anything here, just ensuring speak is called once 
//     }, []); // Empty dependency array to run effect only once on mount

//     useEffect(() => {
//         // Function to check the API response status
//         const checkApiResponseStatus = () => {
//             const responseStatus = localStorage.getItem("apiResponseStatus"); // Check if apiResponseStatus exists in localStorage

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
//             <button onClick={() => router.back()} className="absolute font-bold h-20 w-20 text-4xl top-10 left-10 text-purple-400 hover:text-purple-300">
//                 <img src="/2.svg" className=' top-10 left-10 ' alt="Back" />
//             </button>
//             <div className="absolute top-10 right-10">
//                 <div className="rounded-full flex items-center justify-center">
//                     <img src="/logoo.png" alt="Logo" className="w-16 h-16" />
//                 </div>
//             </div>
//             <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/BG.jpg')" }}>
//                 <div className="relative w-full mt-10 max-w-md p-6  rounded-xl shadow-lg text-white">
//                     {/* <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4"> */}
//                     {/* <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4"> */}
//                     <div class="m-10 rounded-lg text-sm text-center bg-gradient-to-r from-pink-800 to-purple-900 p-2">INSTRUCTIONS FOR THE INTERVIEW</div>
//                     <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
//                         {/* Header Badge */}
//                         <div className="absolute -top-5 right-20 flex items-center">
//                             {/* Circular Icon */}
//                             <div className="w-12 h-12 z-10 bg-white rounded-full flex items-center justify-center border-4 border-pink-800">
//                                 <img src="/1.svg" alt="icon" className='h-56 w-56' />
//                             </div>
//                             {/* Title Background */}
//                             <div className="bg-gradient-to-r from-pink-800 to-purple-900 text-white rounded-r-full px-4 py-1 -ml-2">
//                                 <span className="text-sm font-semibold">Understand the job role</span>
//                             </div>
//                         </div>

//                         {/* Card Content */} {slides.map((slide, index) => (
//                             <div
//                                 key={slide.id}
//                                 className={`ab inset-0 transition-opacity duration-700 ease-in-out ${currentIndex === index ? 'opacity-100' : 'opacity-0'}`}
//                             >
//                                 <p className="text-gray-700 text-center mt-8 p-0 text-sm">
//                                     {slide.content}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>

//                 </div>
//                 {/* </div> */}
//             </div>

//             <div className="mt-6 text-center ">
//                 <button onClick={handleButtonClick} disabled={!isButtonEnabled} className={`${isButtonEnabled ? 'bg-gradient-to-r from-pink-800 to-purple-900' : 'bg-gradient-to-r from-pink-200 to-purple-300 cursor-not-allowed'} px-4 py-2 rounded-md text-white`}>
//                     I am ready to begin
//                 </button>
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

    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Understand the job role",
            img: '/Shawn.png',
            content: " Understanding the job role means researching its key responsibilities, required skills, and expectations. This helps you tailor your resume, answer interview questions confidently, and demonstrate how your abilities align with the position.",
        },
        {
            id: 2,
            img: '/Job_Discrioption.png',
            title: "Understand the Job Description",
            content: "Carefully read and analyze the job description to grasp the key qualifications, duties, and expectations. Prepare examples of how your skills and experiences match the job requirements",
        },
        {
            id: 3,
            img: '/companys_background..png',
            title: "Understand the company's background",
            content: "Understanding the company's background means learning about its history, mission, values, products, services, and industry position. This helps you align your answers in interviews and show genuine interest in the organization",
        },
        {
            id: 4,
            img: '/Self_Introduction.png',
            title: "Practice Your Self Introduction",
            content: " Introduce yourself briefly, highlight key skills, experience, and achievements, and connect them to the job role",
        },
        {
            id: 5,
            img: '/Resume.png',
            title: "Update Your Resume and Carry 1/2 copies",
            content: "Ensure your resume and other application materials are updated, tailored to the job, and neatly organized. Bring multiple copies of your resume and any other requested documents",
        },
        {
            id: 6,
            img: '/Yourself_Professionally.png',
            title: "Present Yourself Professionally",
            content: "Dress appropriately for the industry and company culture. Pay attention to grooming and personal hygiene to make a positive impression",
        },
        {
            id: 7,
            img: '/Essential_Documents.png',
            title: "Gather and Organize Essential Documents",
            content: "Collect and neatly organize all necessary documents, such as certificates, references, and identification. Use a folder or portfolio to keep everything tidy and easily accessible",
        },
        {
            id: 8,
            img: '/Company_News.png',
            title: "Stay Up-to-Date on Company News",
            content: "Research the company's recent news, achievements, and initiatives. This demonstrates your interest in the company and can provide valuable conversation topics",
        },
        {
            id: 9,
            img: '/Thoughtful_Questions.png',
            title: " Prepare Thoughtful Questions",
            content: 'Develop a list of insightful questions to ask the interviewer, such as "What are the biggest challenges facing the team?" or "Can you tell me more about the company culture?',
        },
        {
            id: 10,
            img: '/Rest_Preparation.png',
            title: " Get Adequate Rest and Preparation",
            content: 'Ensure you get sufficient sleep and time to prepare before the interview. This will help you feel confident, focused, and ready to make a positive impression',
        },
    ];

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 10000);

        return () => clearInterval(interval);
    }, []);


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

                <button onClick={() => router.back()} className="absolute font-bold h-20 w-20 text-4xl top-10 left-10 text-purple-400 hover:text-purple-300">
                    <img src="/2.svg" className=' top-10 left-10 ' alt="Back" />

                </button>
                <div className="absolute top-10 right-10">
                    <div className="rounded-full flex items-center justify-center">
                        <img src="/logoo.png" alt="Logo" className="w-16 h-16" />
                    </div>
                </div>
                <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/BG.jpg')" }}>

                    <div className="relative w-full mt-10 max-w-md p-6  rounded-xl shadow-lg text-white">
                        <div className="m-10 mb-20 rounded-lg text-sm text-center bg-gradient-to-r from-pink-800 to-purple-900 p-2">INSTRUCTIONS FOR THE INTERVIEW</div>
                        <div className="bg-white h-44 rounded-xl shadow-lg p-6 w-96 relative">
                            {/* Header Badge */}{slides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={`transition-opacity duration-800 ease-in-out ${currentIndex === index ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                                >
                                    <div className="absolute -top-5  flex  items-center">
                                        <div className="w-12 h-12 z-10 bg-white rounded-full flex items-center justify-center border-4 border-pink-800">
                                            <img src={slide.img} alt="icon" className=' rounded-full' />
                                        </div>

                                        <div className="bg-gradient-to-r from-pink-800 to-purple-900 text-white rounded-r-full px-4 py-1 -ml-2">
                                            <span className="text-sm font-semibold">{slide.title}</span>
                                        </div>
                                    </div>

                                    {/* Slider */}
                                    <div className="relative">

                                        <p className="text-gray-700 text-center mt-8 p-0 text-sm">{slide.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-32 text-center ">
                            <button onClick={handleButtonClick} disabled={!isButtonEnabled} className={`${isButtonEnabled ? 'bg-gradient-to-r from-pink-800 to-purple-900' : 'bg-gradient-to-r from-pink-200 to-purple-300 cursor-not-allowed'} px-4 py-2  rounded-md text-white`}>
                                I am ready to begin
                            </button>
                        </div>
                    </div>
                </div>

            </>
        );
    };

    export default Instruction;
