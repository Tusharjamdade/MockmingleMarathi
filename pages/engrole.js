// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useState } from "react";
// import { getApiResponse } from './api/questionsFetchFormModel';
// import { IoIosArrowBack } from "react-icons/io";
// import Link from "next/link";
// import { toast, Toaster } from "react-hot-toast";

// export default function Role() {
//   const router = useRouter();
//   // const [jobRole, setJobRole] = useState("");
//   const [level, setLevel] = useState("Beginner");
//   const [standard, setStandard] = useState("");
//   const [subject, setSubject] = useState("English");
//   const [email, setEmail] = useState("");
//   const [questions, setQuestions] = useState("");
//   const [user, setUser] = useState(null);
//   const [hasAvailableInterviews, setHasAvailableInterviews] = useState(true);
//   const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [board, setBoard] = useState("");

//   // Declare boards array here (not inside JSX)
//   const boards = [
//      { label: "Maharashtra State Board", value: "maharashtra" },
//   { label: "CBSE (Central Board of Secondary Education)", value: "cbse" },
//   { label: "ICSE (Indian Certificate of Secondary Education)", value: "icse" },
//   { label: "Other State Board", value: "stateboard" },
//   { label: "NIOS (National Institute of Open Schooling)", value: "nios" },
//   { label: "IB (International Baccalaureate)", value: "ib" },
//   { label: "Cambridge International (CIE)", value: "cie" },
//   { label: "Karnataka State Board", value: "karnataka" },
//   { label: "Tamil Nadu State Board", value: "tamilnadu" },
//   { label: "Andhra Pradesh State Board", value: "andhrapradesh" },
//   { label: "Telangana State Board", value: "telangana" },
//   { label: "Uttar Pradesh State Board", value: "uttarpradesh" },
//   { label: "West Bengal State Board", value: "westbengal" },
//   { label: "Gujarat State Board", value: "gujarat" },
//   { label: "Rajasthan State Board", value: "rajasthan" },
//   { label: "Punjab State Board", value: "punjab" },
//   { label: "Haryana State Board", value: "haryana" },
//   { label: "Madhya Pradesh State Board", value: "madhyapradesh" },
//   { label: "Bihar State Board", value: "bihar" },
//   { label: "Odisha State Board", value: "odisha" },
//   { label: "Chhattisgarh State Board", value: "chhattisgarh" }
//   ];
//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       router.push("/login");
//     } else {
//       const userFromStorage = JSON.parse(localStorage.getItem('user'));
//       if (userFromStorage) {
//         setUser(userFromStorage);
//         setEmail(userFromStorage.email || '');  // Initialize email here directly

//         // Check if user has available interviews from local storage initially
//         const completedInterviews = userFromStorage.no_of_interviews_completed || 0;
//         const totalInterviews = userFromStorage.no_of_interviews || 1;

//         if (completedInterviews >= totalInterviews) {
//           setHasAvailableInterviews(false);
//         } else {
//           setHasAvailableInterviews(true);
//         }
//       }
//     }
//   }, [router]);

//   // Function to check if user has available interviews
//   const checkInterviewAvailability = async () => {
//     setIsCheckingAvailability(true);
//     try {
//       const userFromStorage = JSON.parse(localStorage.getItem('user'));
//       if (!userFromStorage || !userFromStorage.email) {
//         toast.error("वापरकर्ता माहिती सापडली नाही. कृपया पुन्हा लॉगिन करा.");
//         setIsCheckingAvailability(false);
//         return false;
//       }

//       // Try to get the latest stats from the API
//       const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || ''}/api/getUserStats?email=${encodeURIComponent(userFromStorage.email)}`);

//       if (response.ok) {
//         const data = await response.json();

//         if (data.success && data.stats) {
//           const completedInterviews = data.stats.no_of_interviews_completed || 0;
//           const totalInterviews = data.stats.no_of_interviews || 1;

//           // Update the user in localStorage with latest stats
//           const updatedUser = {
//             ...userFromStorage,
//             no_of_interviews: totalInterviews,
//             no_of_interviews_completed: completedInterviews
//           };
//           localStorage.setItem('user', JSON.stringify(updatedUser));

//           setHasAvailableInterviews(completedInterviews < totalInterviews);
//           return completedInterviews < totalInterviews;
//         }
//       }

//       // Fallback to using the data from localStorage
//       const completedInterviews = userFromStorage.no_of_interviews_completed || 0;
//       const totalInterviews = userFromStorage.no_of_interviews || 1;
//       setHasAvailableInterviews(completedInterviews < totalInterviews);
//       return completedInterviews < totalInterviews;

//     } catch (error) {
//       console.error('Error checking interview availability:', error);
//       toast.error("मुलाखतीची उपलब्धता तपासताना त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.");
//       return false;
//     } finally {
//       setIsCheckingAvailability(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();  // Prevent form from submitting normally
//     localStorage.removeItem("apiResponseStatus");

//     // 
//     if (!subject.trim()) {
//       toast.error("कृपया विषय टाका");
//       return;
//     }

//     // Show loading indicator
//     toast.loading("मुलाखतीसाठी वेळ पाहत आहे...");

//     // Check if user has available interviews
//     const userHasAvailableInterviews = await checkInterviewAvailability();
//     toast.dismiss(); // Dismiss loading toast

//     if (!userHasAvailableInterviews) {
//       setShowErrorModal(true);
//       return;
//     }

//     // If we get here, proceed with the interview
//     toast.success("मुलाखतीची तयारी सुरू करत आहे...");

//     // Declare formattedQuestions here once
//     let formattedQuestions = [];

//     router.push("/instruction");

//     // Replace this with a fetch request to your new API
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/engQuestionsFetchFormModel`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           // jobRole,
//           level,
//           subject,
//           standard,board
//         }),
//       });

//       // Check if the response is OK (status 200)
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData?.error || "त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.");
//       }

//       // Parse the response
//       const responseData = await res.json();

//       console.log('Fetched Questions:', responseData.questions);  // Debug: Log fetched questions

//       let fetchedQuestions = responseData.questions;

//       if (fetchedQuestions) {
//         // Check if the fetchedQuestions is a string
//         if (typeof fetchedQuestions === 'string') {
//           console.log('Raw response:', fetchedQuestions);

//           // Pattern specifically designed for the example format
//           // Handle format like "**1. What is the difference between...**"
//           const matches = [];


//           const patterns = [
//   // Bold Marathi numbered item: **१. काहीतरी मजकूर**
//   {
//     regex: /\*\*[०-९]+\.\s+([^*]+?)\*\*/gu,
//     type: 'Bold with ** markers (Marathi)'
//   },

//   // Regular Marathi numbered list pattern at start of line
//   {
//     regex: /^\s*[०-९]+\.\s+([^\n]+)/gmu,
//     type: 'Regular numbered list (Marathi)'
//   },

//   // Simple match for Marathi number followed by text
//   {
//     regex: /[०-९]+\.\s+([^\n(]+)/gu,
//     type: 'Simple number followed by text (Marathi)'
//   },

//   // NEW: Bold English numbered item: **1. Some text**
//   {
//     regex: /\*\*[0-9]+\.\s+([^*]+?)\*\*/gu,
//     type: 'Bold with ** markers (English)'
//   },

//   // NEW: Regular English numbered list at start of line
//   {
//     regex: /^\s*[0-9]+\.\s+([^\n]+)/gmu,
//     type: 'Regular numbered list (English)'
//   },

//   // NEW: Simple match for English number followed by text
//   {
//     regex: /[0-9]+\.\s+([^\n(]+)/gu,
//     type: 'Simple number followed by text (English)'
//   }
// ];



//           // Try each pattern until we find matches
//           // Convert to string once outside the loop
//           const questionText = fetchedQuestions.toString();

//           for (const pattern of patterns) {
//             let match;
//             pattern.regex.lastIndex = 0; // Reset regex for each use

//             while ((match = pattern.regex.exec(questionText)) !== null) {
//               if (match[1]) {
//                 const question = match[1].trim();
//                 matches.push(question);
//                 console.log(`Found ${pattern.type} question:`, question);
//               }
//             }

//             // If we found any matches, stop trying patterns
//             if (matches.length > 0) {
//               console.log(`Found ${matches.length} questions using pattern: ${pattern.type}`);
//               break;
//             }
//           }

//           // Remove extra formatting from the questions
//           const cleanedMatches = matches.map(q => {
//             // Remove any remaining markdown or unnecessary characters
//             return q.replace(/\*\*/g, '').trim();
//           });

//           const matchedQuestions = cleanedMatches.length > 0 ? cleanedMatches : null;
//           console.log('Extracted questions:', cleanedMatches);

//           // For debugging
//           console.log('Total questions found:', cleanedMatches.length);

//           console.log('Matched Questions:', matchedQuestions); // Debug: Log matched questions

//           if (matchedQuestions) {
//             // Start with the "Introduce yourself" question as the first element
//             const firstName = user?.fullName?.split(' ')[0];
//             formattedQuestions = [{
//               questionText: `हॅलो ${firstName}, कृपया आपले स्वतःबद्दल थोडक्यात माहिती द्या, ज्यामध्ये आपली शैक्षणिक पात्रता आणि मागील कामाचा अनुभव समाविष्ट असावा."`,
//               answer: null,
//             }];

//             // Add the fetched questions to the array
//             const additionalQuestions = matchedQuestions.map(questionText => ({
//               questionText: questionText.trim(),
//               answer: null,
//             }));

//             // Prepend the fetched questions after the "Introduce yourself"
//             formattedQuestions.push(...additionalQuestions);

//             // Set the questions in the state with the "Introduce yourself" as the first question
//             setQuestions(formattedQuestions);
//           } else {
//             console.error("मिळालेल्या डेटामध्ये वैध प्रश्न आढळले नाहीत");
//           }
//         } else {
//           console.error('फेच केलेले प्रश्न अपेक्षित मजकूर स्वरूपात नाहीत:', fetchedQuestions);
//         }
//       } else {
//         console.error("API मधून प्रश्न मिळाले नाहीत.");
//       }

//       console.log("Questions to be sent:", formattedQuestions);

//       if (formattedQuestions && formattedQuestions.length > 0) {
//         const data = { email, level, subject, standard,board, questions: formattedQuestions };

//         try {
//           const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/jobRoleAndQuestionsSave`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//           });

//           if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData?.error || "त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.");
//           }

//           const response = await res.json();
//           // console.log(response.data._id); // Log the successful response

//           // Store the response _id in localStorage
//           if (response.data._id) {
//             // Remove the existing items if they exist
//             localStorage.removeItem("_id");
//             localStorage.removeItem("_idForReport");

//             // Add the new items
//             localStorage.setItem("_id", response.data._id);
//             localStorage.setItem("_idForReport", response.data._id);
//           }

//           // Store response status in localStorage to enable button on Instruction page
//           localStorage.setItem("apiResponseStatus", "success");

//         } catch (error) {
//           console.error('Error:', error);
//           // Store response failure status in localStorage
//           localStorage.setItem("apiResponseStatus", "error");
//         }
//       } else {
//         console.error("कोणतेही प्रश्न मिळाले नाहीत. कृपया पुन्हा प्रयत्न करा.");
//       }
//     } catch (error) {
//       console.error('प्रश्न लोड करताना त्रुटी:', error);
//       localStorage.setItem("apiResponseStatus", "error");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg.gif')" }}>
//       {/* <Toaster position="top-center" toastOptions={{ duration: 3000 }} /> */}

//       <Link href="/">
//         <div className="absolute top-10 left-3 text-4xl text-white cursor-pointer">
//           <IoIosArrowBack />
//         </div>
//       </Link>

//       {/* No interviews available modal */}
//       {showErrorModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
//           <div className="bg-gray-800 p-6 rounded-xl max-w-md border border-red-500 shadow-2xl">
//             <div className="text-center mb-4">
//               <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               </div>
//               <h2 className="text-2xl font-bold mb-2 text-white">कोणतीही मुलाखत उपलब्ध नाही</h2>
//               <p className="text-gray-300 mb-4">तुम्ही तुमच्या सर्व उपलब्ध मुलाखती वापरल्या आहेत. कृपया अधिक मुलाखतीसाठी प्रशासकाशी संपर्क साधा.</p>
//               <div className="flex justify-center space-x-4">
//                 <Link href="/profile">
//                   <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200">
//                     प्रोफाइल पाहा
//                   </button>
//                 </Link>
//                 <button
//                   onClick={() => setShowErrorModal(false)}
//                   className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
//                 >
//                   बंद करा
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

      

//       <div className="bg-transparent w-11/12 max-w-md p-8 text-center">
//         <img src="/logoo.png" alt="Shakti AI लोगो" className="w-20 mx-auto mb-4" />

//         <h3 className="text-2xl text-[#e600ff] mb-4">इयत्ता निवडा</h3>
//         <form onSubmit={handleSubmit}>



//           <div className="pl-15 mb-6">
//             <select
//               value={standard}
//               onChange={(e) => setStandard(e.target.value)}
//               className="text-black bg-white text-lg p-2 rounded w-64"
//             >
//               <option value="">-- इयत्ता निवडा --</option>
//               {Array.from({ length: 12 }, (_, i) => (
//                 <option key={i + 1} value={i + 1}>
//                   {i + 1}
//                 </option>
//               ))}
//             </select>
//           </div>
        

//           <div className="pl-15 mb-6">
//             <select
//               value={board}
//               onChange={(e) => setBoard(e.target.value)}
//               className="text-black bg-white text-lg p-2 rounded w-64"
//             >
//               <option value="">-- बोर्ड निवडा --</option>
//               {boards.map(({ value, label }) => (
//                 <option key={value} value={value}>
//                   {label}
//                 </option>
//               ))}
//             </select>
//           </div>

          

//           <input
//             type="text"
//             name="subject"
//             id="subject"
//             value={subject}
//             readOnly
//             className="w-1/2 p-2 mb-4 rounded-lg text-xl border border-transparent bg-gray-500 focus:border-purple-500 focus:outline-none"
//             placeholder="विषय निवडा. (e.g. Marathi, Maths)"
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             value={email}
//             readOnly
//             className="hidden w-full p-3 mb-5 bg-opacity-20 bg-white text-white border-none rounded-md text-lg text-center"
//           />

//           <h2 className=" text-3xl font-light mt-8"></h2>
//           <h3 className=" text-2xl text-[#e600ff] mb-4"> लेव्हल निवडा</h3>
//           <div className=" flex flex-col text-white text-left pl-16 text-lg mb-6" >
//             <label>
//               <input
//                 type="radio"
//                 name="level"
//                 value="Beginner"
//                 className="mr-2"
//                 checked={level === "Beginner"}
//                 onChange={() => setLevel("Beginner")}
//               /> सुरुवातीचा स्तर
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="level"
//                 value="Intermediate"
//                 className="mr-2"
//                 checked={level === "Intermediate"}
//                 onChange={() => setLevel("Intermediate")}
//               /> मध्यम स्तर
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="level"
//                 value="Advanced"
//                 className="mr-2"
//                 checked={level === "Advanced"}
//                 onChange={() => setLevel("Advanced")}
//               /> उच्च स्तर
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="level"
//                 value="Expert"
//                 className="mr-2"
//                 checked={level === "Expert"}
//                 onChange={() => setLevel("Expert")}
//               /> अनुभवी
//             </label>
//           </div>
//           <button type="submit" className="bg-[#2a72ff] text-white py-2 px-8 font-semibold rounded-full w-full mt-4 hover:bg-[#1a5adb] flex justify-center items-center">
//             पुढील <span className="ml-4 text-2xl">»</span>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IoIosArrowBack, IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function Role() {
  const router = useRouter();
  const [level, setLevel] = useState("Beginner");
  const [standard, setStandard] = useState("");
  const [subject, setSubject] = useState("English");
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState("");
  const [user, setUser] = useState(null);
  const [hasAvailableInterviews, setHasAvailableInterviews] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [board, setBoard] = useState("");

  const boards = [
    { label: "Maharashtra State Board", value: "maharashtra" },
    { label: "CBSE (Central Board of Secondary Education)", value: "cbse" },
    { label: "ICSE (Indian Certificate of Secondary Education)", value: "icse" },
    { label: "Other State Board", value: "stateboard" },
    { label: "NIOS (National Institute of Open Schooling)", value: "nios" },
    { label: "IB (International Baccalaureate)", value: "ib" },
    { label: "Cambridge International (CIE)", value: "cie" },
    { label: "Karnataka State Board", value: "karnataka" },
    { label: "Tamil Nadu State Board", value: "tamilnadu" },
    { label: "Andhra Pradesh State Board", value: "andhrapradesh" },
    { label: "Telangana State Board", value: "telangana" },
    { label: "Uttar Pradesh State Board", value: "uttarpradesh" },
    { label: "West Bengal State Board", value: "westbengal" },
    { label: "Gujarat State Board", value: "gujarat" },
    { label: "Rajasthan State Board", value: "rajasthan" },
    { label: "Punjab State Board", value: "punjab" },
    { label: "Haryana State Board", value: "haryana" },
    { label: "Madhya Pradesh State Board", value: "madhyapradesh" },
    { label: "Bihar State Board", value: "bihar" },
    { label: "Odisha State Board", value: "odisha" },
    { label: "Chhattisgarh State Board", value: "chhattisgarh" }
  ];

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage) {
        setUser(userFromStorage);
        setEmail(userFromStorage.email || '');

        const completedInterviews = userFromStorage.no_of_interviews_completed || 0;
        const totalInterviews = userFromStorage.no_of_interviews || 1;

        if (completedInterviews >= totalInterviews) {
          setHasAvailableInterviews(false);
        } else {
          setHasAvailableInterviews(true);
        }
      }
    }
  }, [router]);

  const checkInterviewAvailability = async () => {
    setIsCheckingAvailability(true);
    try {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (!userFromStorage || !userFromStorage.email) {
        toast.error("वापरकर्ता माहिती सापडली नाही. कृपया पुन्हा लॉगिन करा.");
        setIsCheckingAvailability(false);
        return false;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || ''}/api/getUserStats?email=${encodeURIComponent(userFromStorage.email)}`);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          const completedInterviews = data.stats.no_of_interviews_completed || 0;
          const totalInterviews = data.stats.no_of_interviews || 1;

          const updatedUser = {
            ...userFromStorage,
            no_of_interviews: totalInterviews,
            no_of_interviews_completed: completedInterviews
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          setHasAvailableInterviews(completedInterviews < totalInterviews);
          return completedInterviews < totalInterviews;
        }
      }

      const completedInterviews = userFromStorage.no_of_interviews_completed || 0;
      const totalInterviews = userFromStorage.no_of_interviews || 1;
      setHasAvailableInterviews(completedInterviews < totalInterviews);
      return completedInterviews < totalInterviews;

    } catch (error) {
      console.error('Error checking interview availability:', error);
      toast.error("मुलाखतीची उपलब्धता तपासताना त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.");
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("apiResponseStatus");

    if (!subject.trim()) {
      toast.error("कृपया विषय टाका");
      return;
    }

    toast.loading("मुलाखतीसाठी वेळ पाहत आहे...");
    const userHasAvailableInterviews = await checkInterviewAvailability();
    toast.dismiss();

    if (!userHasAvailableInterviews) {
      setShowErrorModal(true);
      return;
    }

    toast.success("मुलाखतीची तयारी सुरू करत आहे...");
    let formattedQuestions = [];
    router.push("/instruction");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/engQuestionsFetchFormModel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, subject, standard, board }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.");
      }

      const responseData = await res.json();
      let fetchedQuestions = responseData.questions;

      if (fetchedQuestions) {
        if (typeof fetchedQuestions === 'string') {
          const matches = [];
          const patterns = [
            { regex: /\*\*[०-९]+\.\s+([^*]+?)\*\*/gu, type: 'Bold with ** markers (Marathi)' },
            { regex: /^\s*[०-९]+\.\s+([^\n]+)/gmu, type: 'Regular numbered list (Marathi)' },
            { regex: /[०-९]+\.\s+([^\n(]+)/gu, type: 'Simple number followed by text (Marathi)' },
            { regex: /\*\*[0-9]+\.\s+([^*]+?)\*\*/gu, type: 'Bold with ** markers (English)' },
            { regex: /^\s*[0-9]+\.\s+([^\n]+)/gmu, type: 'Regular numbered list (English)' },
            { regex: /[0-9]+\.\s+([^\n(]+)/gu, type: 'Simple number followed by text (English)' }
          ];

          const questionText = fetchedQuestions.toString();
          for (const pattern of patterns) {
            let match;
            pattern.regex.lastIndex = 0;
            while ((match = pattern.regex.exec(questionText)) !== null) {
              if (match[1]) {
                matches.push(match[1].trim());
              }
            }
            if (matches.length > 0) break;
          }

          const cleanedMatches = matches.map(q => q.replace(/\*\*/g, '').trim());
          const matchedQuestions = cleanedMatches.length > 0 ? cleanedMatches : null;

          if (matchedQuestions) {
            const firstName = user?.fullName?.split(' ')[0];
            formattedQuestions = [{
              questionText: `हॅलो ${firstName}, कृपया आपले स्वतःबद्दल थोडक्यात माहिती द्या, ज्यामध्ये आपली शैक्षणिक पात्रता आणि मागील कामाचा अनुभव समाविष्ट असावा."`,
              answer: null,
            }];
            const additionalQuestions = matchedQuestions.map(questionText => ({
              questionText: questionText.trim(),
              answer: null,
            }));
            formattedQuestions.push(...additionalQuestions);
            setQuestions(formattedQuestions);
          } else {
            console.error("मिळालेल्या डेटामध्ये वैध प्रश्न आढळले नाहीत");
          }
        }
      }

      if (formattedQuestions && formattedQuestions.length > 0) {
        const data = { email, level, subject, standard, board, questions: formattedQuestions };
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/jobRoleAndQuestionsSave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error || "त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.");
          }

          const response = await res.json();
          if (response.data._id) {
            localStorage.removeItem("_id");
            localStorage.removeItem("_idForReport");
            localStorage.setItem("_id", response.data._id);
            localStorage.setItem("_idForReport", response.data._id);
          }
          localStorage.setItem("apiResponseStatus", "success");
        } catch (error) {
          console.error('Error:', error);
          localStorage.setItem("apiResponseStatus", "error");
        }
      } else {
        console.error("कोणतेही प्रश्न मिळाले नाहीत. कृपया पुन्हा प्रयत्न करा.");
      }
    } catch (error) {
      console.error('प्रश्न लोड करताना त्रुटी:', error);
      localStorage.setItem("apiResponseStatus", "error");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen font-sans">
      {/* Background with overlay for better text contrast */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('/bg.gif')" }}
      ></div>
      <div className="fixed inset-0 z-0 bg-neutral-900/60 backdrop-blur-sm"></div>

      <Link href="/">
        <div className="absolute top-6 left-6 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 text-white cursor-pointer border border-white/10">
          <IoIosArrowBack size={24} />
        </div>
      </Link>

      {/* No interviews available modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-neutral-800 p-8 rounded-2xl max-w-sm w-full border border-red-500/50 shadow-2xl transform scale-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto flex items-center justify-center mb-6 ring-1 ring-red-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-3 text-white">मुलाखत उपलब्ध नाही</h2>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                तुम्ही तुमच्या सर्व उपलब्ध मुलाखती वापरल्या आहेत. कृपया अधिक मुलाखतीसाठी प्रशासकाशी संपर्क साधा.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/profile">
                  <button className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm">
                    प्रोफाइल पाहा
                  </button>
                </Link>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full bg-neutral-700 text-neutral-200 py-2.5 rounded-lg hover:bg-neutral-600 transition-all duration-200 font-medium text-sm"
                >
                  बंद करा
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg p-6 md:p-10 mx-4">
        <div className="absolute inset-0 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"></div>
        
        <div className="relative z-20 text-center">
          <img src="/logoo.png" alt="Shakti AI" className="w-16 h-auto mx-auto mb-6 drop-shadow-lg" />
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
            तपशील निवडा
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            
            {/* Standard Select */}
            <div className="relative group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">इयत्ता</label>
              <div className="relative">
                <select
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  className="w-full appearance-none bg-black/20 text-white text-base p-4 pr-10 rounded-xl border border-white/10 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer hover:bg-black/30"
                >
                  <option value="" className="bg-neutral-800 text-gray-400">-- निवडा --</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-neutral-800 text-white">
                      इयत्ता {i + 1}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                  <IoMdArrowDropdown size={20} />
                </div>
              </div>
            </div>

            {/* Board Select */}
            <div className="relative group">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">बोर्ड</label>
              <div className="relative">
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full appearance-none bg-black/20 text-white text-base p-4 pr-10 rounded-xl border border-white/10 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer hover:bg-black/30"
                >
                  <option value="" className="bg-neutral-800 text-gray-400">-- निवडा --</option>
                  {boards.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-neutral-800 text-white">
                      {label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                  <IoMdArrowDropdown size={20} />
                </div>
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">विषय</label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={subject}
                readOnly
                className="w-full bg-white/5 border border-white/10 text-gray-300 rounded-xl p-4 outline-none cursor-not-allowed"
                placeholder="विषय निवडा"
              />
            </div>

            {/* Hidden Email Input */}
            <input type="hidden" name="email" value={email} />

            {/* Level Selection */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 ml-1">काठिण्य पातळी (Level)</h3>
              <div className="grid grid-cols-1 gap-2">
                {["Beginner", "Intermediate", "Advanced", "Expert"].map((lvl) => (
                  <label 
                    key={lvl}
                    className={`relative flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      level === lvl 
                        ? "bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                        : "bg-black/20 border-white/5 hover:bg-black/40 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={lvl}
                      checked={level === lvl}
                      onChange={() => setLevel(lvl)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${
                      level === lvl ? "border-purple-400" : "border-gray-500"
                    }`}>
                      {level === lvl && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                    </div>
                    <span className={`text-sm ${level === lvl ? "text-white font-medium" : "text-gray-300"}`}>
                      {lvl === "Beginner" && "सुरुवातीचा स्तर (Beginner)"}
                      {lvl === "Intermediate" && "मध्यम स्तर (Intermediate)"}
                      {lvl === "Advanced" && "उच्च स्तर (Advanced)"}
                      {lvl === "Expert" && "अनुभवी (Expert)"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg font-bold py-4 rounded-2xl shadow-lg shadow-purple-900/20 transform transition-all duration-200 active:scale-[0.98] flex justify-center items-center gap-2 group"
            >
              <span>पुढील</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">»</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}