

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
import { FaYoutube } from 'react-icons/fa';
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
    const [youtubeVideos, setYoutubeVideos] = useState([]);
   const [loadingVideos, setLoadingVideos] = useState(false);


  // Function to render YouTube recommendations
 
  const renderYoutubeRecommendations = () => {
 
    if (loadingVideos) {
 
      return (
 
        <div className="text-center py-8">
 
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
 
          <p className="mt-2 text-gray-300">Finding helpful video recommendations...</p>
 
        </div>
 
      );
 
    }
 
  
 
     if (!youtubeVideos || youtubeVideos.length === 0) {
 
       return (
 
    //     <div className="text-center py-8">
 
    //       <p className="text-gray-400">No video recommendations available at the moment.</p>
 
    //     </div>
 
    <div className="flex justify-center items-center h-40">
 
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
 
            </div>
 
       );
 
     }
 
  
 
    // Function to extract video ID from a YouTube URL
 
    const extractVideoId = (url) => {
 
      try {
 
        const parsedUrl = new URL(url);
 
        return parsedUrl.searchParams.get("v") || parsedUrl.pathname.split("/").pop();
 
      } catch (err) {
 
        return null;
 
      }
 
    };
 
  
 
    return (
 
      <div className="mt-8 p-6 bg-gray-800 rounded-lg">
 
        <h2 className="flex items-center text-2xl font-bold mb-6 text-red-500">
 
          <FaYoutube className="mr-2" /> Recommended Videos by Skill
 
        </h2>
 
  
 
        {youtubeVideos.map((group, groupIndex) => (
 
          <div key={groupIndex} className="mb-10">
 
            <h3 className="text-xl text-white font-semibold mb-4">{group.skill}</h3>
 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 
              {group.videos.map((video, videoIndex) => {
 
                const videoId = extractVideoId(video.url);
 
                return (
 
                  <div
 
                    key={videoIndex}
 
                    className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transition-shadow duration-300"
 
                  >
 
                    <div className="aspect-w-16 aspect-h-9">
 
                      <iframe
 
                        className="w-full h-full"
 
                        src={`https://www.youtube.com/embed/${videoId}`}
 
                        title={video.title}
 
                        frameBorder="0"
 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 
                        allowFullScreen
 
                      ></iframe>
 
                    </div>
 
                    <div className="p-4">
 
                      <h4 className="font-semibold text-white line-clamp-2 mb-1">{video.title}</h4>
 
                      <p className="text-gray-400 text-sm">{group.skill} Video</p>
 
                    </div>
 
                  </div>
 
                );
 
              })}
 
            </div>
 
          </div>
 
        ))}
 
      </div>
 
    );
 
  };




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
  // Fetch YouTube recommendations based on report text
  const fetchYoutubeRecommendations = async (reportText) => {
    console.log("Fetching YouTube recommendations for report text:", reportText);
    try {
      setLoadingVideos(true);
      const response = await fetch('https://youtube-recommender-x79p.onrender.com/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report: reportText,
          max_videos: 7
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube recommendations');
      }
      
      const data = await response.json();
      console.log("Fetched responseData:", data);
      console.log("Fetched responseData:", data.recommendations);
      // Save to our database
      if (data && data.recommendations && data.recommendations.length > 0) {
        const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/youtube`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?._id,
            userEmail: email,
            recommendations: data.recommendations // ✅ updated key
          }),
        });
      
        if (saveResponse.ok) {
          setYoutubeVideos(data.recommendations);
        }
      }
      
      return data.videos || [];
      
    } catch (error) {
      console.error('Error fetching YouTube recommendations:', error);
      return [];
    } finally {
      setLoadingVideos(false);
    }
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


        // Fetch YouTube recommendations after report is generated
 
        try {
 
          await fetchYoutubeRecommendations(reportText);
 
        } catch (err) {
 
          console.error('Error fetching YouTube recommendations:', err);
 
          // Don't block the UI if YouTube recommendations fail
 
        }



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
     <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900">
      {/* Header */}
      
      
      {/* YouTube Recommendations Section */}
      {renderYoutubeRecommendations()}
    </div>
  );
}

export default Report;
