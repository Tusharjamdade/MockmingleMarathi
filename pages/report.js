

// import React, { useState, useEffect } from 'react'; 

// import { IoIosArrowBack } from "react-icons/io";
// import { useRouter } from 'next/router';

// function Report() { 
//   const router = useRouter(); 

//   const [reportData, setReportData] = useState(null); 
//   const [user, setUser] = useState('');
//   const [email, setEmail] = useState(''); 
//   const [jobRole, setJobRole] = useState(''); 
//   const [loading, setLoading] = useState(true); 
//   const [error, setError] = useState(null); 
//   const [jobRoleId, setJobRoleId] = useState(null); 
//   const [isEmailFetched, setIsEmailFetched] = useState(false);  


//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
//     } else {
//       const userFromStorage = JSON.parse(localStorage.getItem('user'));
//       if (userFromStorage) {
//         setUser(userFromStorage);
//         setEmail(userFromStorage.email || '');  // Initialize email here directly
//       }
//     }
//   }, []);


//   const extractScoreAndFeedback = (report, category) => {

//     if (!report || !report.reportData) {
//       return { score: 0, feedback: 'No data available.' };
//     }

//     const scoreoverallRegex = new RegExp(`${category}:\\s*(\\d+\\/50)`, 'i');
//     const regexWithoverallParentheses = new RegExp(`${category}:\\s*\\((\\d+\\/50)\\)`, 'i');
//     const scoreStarOverallRegex = new RegExp(`${category}:\\*\\*\\s*(\\d+/50)`, 'i');


//     const scoreMatch =  report.reportData.match(scoreoverallRegex) || report.reportData.match(regexWithoverallParentheses)||report.reportData.match(scoreStarOverallRegex)

//     const overallScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

//     return {overallScore};
//   };  




//   // Fetch job role data if jobRoleId exists
//   useEffect(() => {
//     localStorage.removeItem('_id');
//     const idFromLocalStorage = localStorage.getItem('_idForReport');

//     const emailFromLocalStorage = localStorage.getItem('user'); // Retrieve user data from localStorage

//     if (emailFromLocalStorage) {
//       const parsedUser = JSON.parse(emailFromLocalStorage); // Parse the stringified user object
//       const email = parsedUser.email; // Access the email field from the parsed object
//       console.log(email); // Output the email

//       if (idFromLocalStorage) {
//         // If jobRoleId is available, set the jobRoleId
//         setJobRoleId(idFromLocalStorage);
//       } else {
//         // If jobRoleId is missing, set the email and show previous reports
//         setEmail(email);
//         setIsEmailFetched(true);
//       }
//     } else {
//       // If neither jobRoleId nor email is available, show an error
//       setError('Missing job role ID and email');
//       setLoading(false);
//     }
//   }, []);

//   // Fetch job role data if jobRoleId exists
//   useEffect(() => {
//     if (!jobRoleId) return;

//     const fetchJobRole = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getReadyQuestionsAndAnswers?jobRoleId=${jobRoleId}`);
//         localStorage.setItem('status', "processing");
//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }
//         const data = await response.json();
//         setReportData(data.data);
//         localStorage.removeItem('status');
//         localStorage.setItem('status', "model processing");


//         // const analysisData = await getApiResponseReport(data.data);
//         const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/reportFromModel`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             data:data.data,
//           }),
//         });

//         // Check if the response is OK (status 200)
//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData?.error || "Something went wrong. Please try again.");
//         }

//         // Parse the response
//         const analysisData = await res.json();
// console.log("model return this report ",analysisData);

//         // setReportAnalysis(analysisData);
//         localStorage.removeItem('status');
//         localStorage.setItem('status', "model 5 min");

//         setEmail(data.data.email);  
//         setJobRole(data.data.role);

//         await storeReport(data.data.role, data.data.email, analysisData);

//         // localStorage.removeItem('_idForReport')
//         localStorage.removeItem('status');
//         localStorage.setItem('store',"success");
//         setIsEmailFetched(true);  
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);  
//       }
//     };

//     fetchJobRole();
//   }, [jobRoleId]);

//   const storeScore = async (jobRole, email, overallScore) => {

//       const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/saveAndGetReport`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           role: jobRole,
//           email,
//           collageName: user.collageName,
//           overallScore,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to store report');
//       }

//       const result = await response.json();

//     }

//   const storeReport = async (jobRole, email, reportAnalysis) => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/saveAndGetReport`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           role: jobRole,
//           email,
//           collageName: user.collageName,
//           reportAnalysis,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to store report');
//       }

//       const result = await response.json();

//       localStorage.removeItem('_idForReport');

//       console.log('Report stored successfully:', result);

//     } catch (err) {
//       console.error('Error storing report:', err);
//     }
//   };

//   if (error) {
//     return console.log(error);

//   }

//   // Render "No job role data found" only if there's no job role data fetched and jobRoleId exists
//   if (!reportData && jobRoleId) {
//     return console.log('No job role data found');

//   }

//   const goBack = () => {
//     router.push('/'); // This will take the user to the previous page
//   };

//   return (
//     <div 
//     className="min-h-screen bg-cover bg-center relative" 
//     style={{ backgroundImage: "url('/BG.jpg')" }}
//   >
//     {/* Back Button */}
//     <div className="absolute top-5 left-3 text-4xl text-white cursor-pointer" onClick={goBack}>
//       <IoIosArrowBack />
//     </div>

//     {/* Main Content */}
//     <div className="text-white p-6 md:p-12">
//       <h1 className="text-center text-4xl md:text-5xl font-bold mb-4">
//         Interview Report
//       </h1>

//       <h2 className="text-center text-2xl md:text-3xl font-semibold mb-6">
//         Report update after 5 min
//       </h2>

//       {/* YouTube iframes */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
//         <div className="flex justify-center">
//           <iframe
//             src="https://www.youtube.com/embed/SEO9YPzSH-0"
//             frameBorder="0"
//             allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="w-full max-w-[560px] h-[315px] rounded-lg shadow-lg"
//           />
//         </div>
//         <div className="flex justify-center">
//           <iframe
//             src="https://www.youtube.com/embed/AH7k3P6W7V8"
//             frameBorder="0"
//             allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="w-full max-w-[560px] h-[315px] rounded-lg shadow-lg"
//           />
//         </div>
//       </div>

//       {/* Book Creator iframe */}
//       <div className="flex justify-center">
//         <iframe
//           src="https://read.bookcreator.com/aWAhdfUWXPQR1UPW7fJOHnfObsb2/_or2hLPmR3WlS34sPH_WKQ"
//           height="550"
//           className="w-full max-w-4xl rounded-lg shadow-lg"
//           allow="clipboard-write self https://read.bookcreator.com"
//         ></iframe>
//       </div>
//     </div>
//   </div>
//   );
// }

// export default Report;




import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/router';

function Report() {
  const router = useRouter();

  const [reportData, setReportData] = useState(null);
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [roleId, setRoleId] = useState(null);
  const [isEmailFetched, setIsEmailFetched] = useState(false);
   const [recordId, setRecordId] = useState(null);
   const [role, setRole] = useState('');       // optional (English)
   const [subject, setSubject] = useState('');   // optional (Marathi)

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push(`${process.env.NEXT_PUBLIC_HOST}/login`);
    } else {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage) {
        setUser(userFromStorage);
        setEmail(userFromStorage.email || '');  // Initialize email here directly
      }
    }
  }, []);

  const extractScoreAndFeedback = (reportAnalysis, category) => {
    if (!reportAnalysis) {
      console.log("reportAnalysis is null");
      
    }

    // Match scores like "Category: 25/50" or "Category: (25/50)"
    const scoreoverallRegex = new RegExp(`${category}:\\s*(\\d+\\/50)`, 'i');
    const regexWithoverallParentheses = new RegExp(`${category}:\\s*\\((\\d+\\/50)\\)`, 'i');
    const scoreStarOverallRegex = new RegExp(`${category}:\\*\\*\\s*(\\d+/50)`, 'i');
    const scoreStarOverallwithoutRegex = new RegExp(`^(\\d+)\\/50$`, 'i');

    

    const scoreMatch = reportAnalysis.match(scoreoverallRegex)
      || reportAnalysis.match(regexWithoverallParentheses)
      || reportAnalysis.match(scoreStarOverallRegex)
      || reportAnalysis.match(scoreStarOverallwithoutRegex);
console.log("match Score",scoreMatch);

    // If a match is found, extract the score
    const overallScore = scoreMatch ? parseInt(scoreMatch[1].split('/')[0], 10) : 0; // Extract the number before /50

    // const overallScore = scoreMatch && scoreMatch[1] ? parseInt(scoreMatch[1], 10) : 0;
    return { overallScore }; 
  };

  // Store the score function - Make sure this is declared before it's called
  const storeScore = async (role,subject, email, overallScore) => {
    try {
      const collageName = user?.collageName || "Unknown Collage";
  
      // Log the data before sending it
      const requestData = {
        role,
        subject,
        email,
        collageName,
         overallScore,
      };
      console.log('Sending request data:', requestData);  // This will help debug
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/overallScore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to store report');
      }
  
      const result = await response.json();
      console.log('Score stored successfully:', result);
    } catch (error) {
      console.error('Error storing score:', error.message);
    }
  };
  

  // Fetch job role data if jobRoleId exists
  useEffect(() => {
    localStorage.removeItem('_id');
    const idFromLocalStorage = localStorage.getItem('_idForReport');

    const emailFromLocalStorage = localStorage.getItem('user'); // Retrieve user data from localStorage

    if (emailFromLocalStorage) {
      const parsedUser = JSON.parse(emailFromLocalStorage); // Parse the stringified user object
      const email = parsedUser.email; // Access the email field from the parsed object
      console.log(email); // Output the email

      if (idFromLocalStorage) {
        // If jobRoleId is available, set the jobRoleId
        // setJobRoleId(idFromLocalStorage);
        //setStandardId(idFromLocalStorage);
        setRecordId(idFromLocalStorage);
      } else {
        // If jobRoleId is missing, set the email and show previous reports
        setEmail(email);
        setIsEmailFetched(true);
      }
    } else {
      // If neither jobRoleId nor email is available, show an error
      setError('Missing job role ID and email');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // if (!jobRoleId) return;
    if (!recordId) return;

    const fetchJobRole = async () => {
      try {
   
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getReadyQuestionsAndAnswers?roleId=${recordId}`);
        localStorage.setItem('status', "processing");
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setReportData(data.data);
        localStorage.removeItem('status');
        localStorage.setItem('status', "model processing");

        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/reportFromModel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: data.data,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData?.error || "Something went wrong. Please try again.");
        }

        const analysisData = await res.json();
        console.log("Model returned this report", analysisData);

        // Extract overallScore from report data using the extractScoreAndFeedback function
        const { overallScore } = extractScoreAndFeedback(analysisData, "Overall Score"||"Overall");

        console.log("Extracted overall score:", overallScore);
        // Store the extracted overall score
        await storeScore(data.data.role || null,data.data.subject || null, data.data.email, overallScore);
        // Store the report analysis
        await storeReport(data.data.role || null,data.data.subject || null, data.data.email, analysisData);

        setEmail(data.data.email);
        setRole(data.data.role ||"");

        localStorage.removeItem('status');
        localStorage.setItem('status', "model 5 min");
        setIsEmailFetched(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobRole();
  }, [recordId]);

  const storeReport = async (role,subject, email, reportAnalysis) => {
    // Ensure collageName has a default value if it's undefined
    const collageName = user?.collageName || 'Unknown College';
    
    console.log("Storing report for:", { role,subject,email, reportAnalysis});
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/saveAndGetReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        role,
        subject,
          email,
          collageName,
          reportAnalysis,
        }),
      });
       
      if (!response.ok) {
        throw new Error('Failed to store report');
      }

      const result = await response.json();
      console.log('Report stored successfully:', result);

    } catch (err) {
      console.error('Error storing report:', err);
    }
  };

  if (error) {
    return console.log("other error",error);
  }
  const goBack = () => {
        router.push('/'); // This will take the user to the previous page
      };
    
return (
    <div className="relative min-h-screen w-full bg-[#1a103c] overflow-x-hidden font-sans">
      
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/BG.jpg')" }}
      >
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Navigation Bar */}
      <div className="relative z-20 w-full px-4 py-6 md:px-8 flex items-center">
        <button 
          onClick={goBack} 
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <IoIosArrowBack className="text-xl group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium text-sm tracking-wide">मागे जा</span>
        </button>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-10 space-y-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-200 drop-shadow-sm">
            मुलाखतीचा अहवाल
          </h1>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-blue-100 text-sm font-medium tracking-wide">
              अहवाल ५ मिनिटांनी अपडेट होईल
            </span>
          </div>
        </div>

        {/* Video Grid Section - Fully Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* YouTube 1 */}
          <div className="w-full bg-white/5 p-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src="https://www.youtube.com/embed/SEO9YPzSH-0"
                title="Interview Tip 1"
                className="absolute inset-0 w-full h-full object-cover"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* YouTube 2 */}
          <div className="w-full bg-white/5 p-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src="https://www.youtube.com/embed/AH7k3P6W7V8"
                title="Interview Tip 2"
                className="absolute inset-0 w-full h-full object-cover"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Book Creator Section */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 px-2">
            <div className="h-8 w-1 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">मार्गदर्शक पुस्तिका</h2>
          </div>

          <div className="w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            {/* The wrapper ensures height on mobile but max height on desktop */}
            <div className="relative w-full h-[60vh] md:h-[700px]">
              <iframe
                src="https://read.bookcreator.com/aWAhdfUWXPQR1UPW7fJOHnfObsb2/_or2hLPmR3WlS34sPH_WKQ"
                title="Interview Guide Book"
                className="absolute inset-0 w-full h-full"
                allow="clipboard-write self https://read.bookcreator.com"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Report;
