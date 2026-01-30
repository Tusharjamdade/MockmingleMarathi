

import React, { useState, useEffect } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/router';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { jsPDF } from "jspdf";

function ReportDetailPopup({ user, isOpen, setIsOpen }) {
  if (!isOpen ) return null;
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [isEmailFetched, setIsEmailFetched] = useState(false);
  const [visibility, setVisibility] = useState({
    report: false,
    previousReports: false,
  });
  const [reportVisibility, setReportVisibility] = useState([]);

  const handleClosee = (e) => {
    e.stopPropagation();  // Prevent the click event from propagating to the parent
    setIsOpen(false); // Close the modal
  };

  const extractScore = (report, scoreType) => {
    // console.log("Extracting score from:", report);s

    if (!report || !report.reportAnalysis) {
      return 0; // Return 0 if no report or reportAnalysis field is available
    }



    // const match = report.reportAnalysis.match(scoreRegex);
    const regexNoParentheses = new RegExp(`${scoreType}:\\s*(\\d+\\/10)`, 'i');

    // Regex to match '(2/10)' with parentheses
    const regexWithParentheses = new RegExp(`${scoreType}:\\s*\\((\\d+\\/10)\\)`, 'i');


    const match = report.reportAnalysis.match(regexNoParentheses) || report.reportAnalysis.match(regexWithParentheses);


    if (match) {
      return parseInt(match[1], 10); // Return the numeric value found
    }

    return 0; // Return 0 if no score is found
  };
  
  const extractScoreAndFeedback = (report, category) => {
    // console.log(report);

    if (!report || !report.reportAnalysis) {
      return { score: 0, feedback: 'No data available.' };
    }

    // Regex to extract score (format: "Technical Proficiency: 2/10")
    const scoreRegex = new RegExp(`${category}:\\s*(\\d+\\/10)`, 'i');//**Technical Proficiency: 0/10**
    const regexWithParentheses = new RegExp(`${category}:\\s*\\((\\d+\\/10)\\)`, 'i');//**Technical Proficiency: (0/10)**
    const scoreStarRegex = new RegExp(`${category}:\\*\\*\\s*(\\d+/10)`, 'i');  //**Technical Proficiency:** 0/10

    const scoreoverallRegex = new RegExp(`${category}:\\s*(\\d+\\/50)`, 'i');
    const regexWithoverallParentheses = new RegExp(`${category}:\\s*\\((\\d+\\/50)\\)`, 'i');
    const scoreStarOverallRegex = new RegExp(`${category}:\\*\\*\\s*(\\d+/50)`, 'i');

    const feedbackRegex = new RegExp(`${category}:\\s*(\\d+/10)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall|$)`, 'i');
    const feedbackRegexParentheses = new RegExp(`${category}:\\s*\\((\\d+/10)\\)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall Report|$)`, 'i');
    const feedbackRegexStarParentheses = new RegExp(`${category}:\\*\\*\\s*(\\d+/10)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall Report|$)`, 'i');
    
    const feedbackOverallRegex = new RegExp(`${category}:\\s*(\\d+/50)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall|$)`, 'i');
    const feedbackRegexOverallParentheses = new RegExp(`${category}:\\s*\\((\\d+/50)\\)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall Report|$)`, 'i');
    const feedbackRegexStarOverallParentheses = new RegExp(`${category}:\\*\\*\\s*(\\d+/50)\\s*([^]*?)(?=\n[A-Z][a-zA-Z ]+:|Overall Report|$)`, 'i');



    const scoreMatch = report.reportAnalysis.match(scoreRegex) || report.reportAnalysis.match(regexWithParentheses) || report.reportAnalysis.match(scoreoverallRegex) || report.reportAnalysis.match(regexWithoverallParentheses)||report.reportAnalysis.match(scoreStarRegex)||report.reportAnalysis.match(scoreStarOverallRegex)
    const feedbackMatch = report.reportAnalysis.match(feedbackRegex) || report.reportAnalysis.match(feedbackRegexParentheses) ||report.reportAnalysis.match(feedbackOverallRegex) || report.reportAnalysis.match(feedbackRegexOverallParentheses)||report.reportAnalysis.match(feedbackRegexStarParentheses)||report.reportAnalysis.match(feedbackRegexStarOverallParentheses)
    // console.log(feedbackMatch);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
    const feedback = feedbackMatch ? feedbackMatch[0] : 'No feedback available.';

    return { score, feedback };
  };

  // Extract Overall Score

  // Extract Recommendations
  const extractRecommendations = (report) => {
    const regex = /Recommendation:([\s\S]*?)(?=(\n|$))/i;
    const match = report.reportAnalysis.match(regex);
    return match ? match[1].trim() : 'No recommendations available.';
  };

  // Fetch email from localStorage
  useEffect(() => {
    const userFromStorage = user
    if (userFromStorage) {
      // const parsedUser = JSON.parse(userFromStorage);
      const email = userFromStorage.email;

      if (email) {
        setEmail(email);
        setIsEmailFetched(true);
        setVisibility((prevVisibility) => ({
          ...prevVisibility,
          previousReports: true,
        }));
      } else {
        setError("Email is missing in localStorage");
      }
    } else {
      setError("No user data found in localStorage");
    }
  }, []);

  // Fetch reports when email is set
  useEffect(() => {
    if (email && isEmailFetched) {
      const fetchReportsByEmail = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/saveAndGetReport?email=${email}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch reports, status: ${response.status}`);
          }
          const data = await response.json();
          if (data.reports && data.reports.length > 0) {
            const sortedReports = data.reports.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
              const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
              return dateB - dateA;
            });
            setReports(sortedReports);
            setReportVisibility(new Array(sortedReports.length).fill(false));
          } else {
            setReports([]);
          }
        } catch (err) {
          setError(`Error fetching reports: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchReportsByEmail();
    }
  }, [email, isEmailFetched]);

  // Handle Go Back Logic
  const goBack = () => {
    if (document.referrer.includes('/report')) {
      router.push('/');
    } else {
      router.back('/');
    }
  };

  // Handle toggle visibility of report sections
  const toggleVisibility = (section) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [section]: !prevVisibility[section],
    }));
  };

  // Toggle visibility for individual reports
  const toggleIndividualReportVisibility = (index) => {
    setReportVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  // Generate PDF Report
  const downloadReport = (reportContent, report) => {
    const doc = new jsPDF();
    const reportDate = report.createdAt ? new Date(report.createdAt).toLocaleString() : "Unknown Date";
    let marginX = 20;
    let marginY = 20;
    let pageHeight = doc.internal.pageSize.height;

    // Title
    doc.setFontSize(20);
    doc.text("Interview Report", doc.internal.pageSize.width / 2, marginY, { align: "center" });

    // Report Role and Date
    marginY += 15;
    doc.setFontSize(14);
    doc.text(`Role: ${report.role}`, marginX, marginY);
    marginY += 10;
    doc.text(`Date: ${reportDate}`, marginX, marginY);

    // Analysis Header
    marginY += 15;
    doc.setFontSize(14);
    doc.text("Analysis:", marginX, marginY);

    // Wrap long content
    doc.setFontSize(12);
    marginY += 10;
    let wrappedText = doc.splitTextToSize(reportContent.replace(/<[^>]*>/g, ' '), 170);
    wrappedText.forEach(line => {
      if (marginY + 10 > pageHeight - 20) {
        doc.addPage();
        marginY = 20;
      }
      doc.text(line, marginX, marginY);
      marginY += 7;
    });

    // Scores Section
    marginY += 10;
    const scores = [
      { label: 'Technical Proficiency', score: extractScore(report, 'Technical Proficiency') },
      { label: 'Communication', score: extractScore(report, 'Communication') },
      { label: 'Decision-Making', score: extractScore(report, 'Decision-Making') },
      { label: 'Confidence', score: extractScore(report, 'Confidence') },
      { label: 'Language Fluency', score: extractScore(report, 'Language Fluency') },
      { label: 'Overall Score', score: extractScore(report, 'Overall Score') },
    ];

    scores.forEach((score) => {
      if (marginY + 15 > pageHeight - 20) {
        doc.addPage();
        marginY = 20;
      }
      doc.setFontSize(12);
      doc.text(`${score.label}:`, marginX, marginY);

      // Progress Bar (Replaces Circle)
      let progressWidth = (score.score / 10) * 50;
      doc.setFillColor(50, 150, 250); // Blue color
      doc.rect(marginX + 80, marginY - 5, progressWidth, 5, "F"); // Progress bar
      doc.text(`${score.score}/10`, marginX + 140, marginY);

      marginY += 15;
    });

    // Separator Line
    if (marginY + 10 > pageHeight - 20) {
      doc.addPage();
      marginY = 20;
    }
    doc.setLineWidth(0.5);
    doc.line(marginX, marginY, 190, marginY);
    marginY += 10;

    // Recommendations Section
    if (marginY + 10 > pageHeight - 20) {
      doc.addPage();
      marginY = 20;
    }
    doc.setFontSize(12);
    doc.text("Recommendations:", marginX, marginY);
    marginY += 10;
    doc.setFontSize(12);
    doc.text(extractRecommendations(report), marginX, marginY);

    // Save the PDF
    doc.save(`report_${report.role}_${reportDate.replace(/[:/,]/g, '-')}.pdf`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }




//   const ScoreCard = ({ label, score, feedback }) => {
//     const isOverallScore = label === 'Overall Score';
//     const maxScore = isOverallScore ? 50 : 10;  // Set max score to 50 for Overall Score, else 10
//     const scoreText = isOverallScore ? `${score}/50` : `${score}/10`; // Display score accordingly
    
//     return (
//       <div className="card-container text-black">
//         <div className="card relative w-full h-full">
//           {/* Front Side */}
//           <div className="front flex justify-center items-center p-4 bg-[#b393f8] rounded-lg">
//             <div>
//               <h5 className="text-xl font-semibold">{label}</h5>
//               <div className="mt-4">
//                 <CircularProgressbar
//                   value={score}
//                   maxValue={maxScore} // Dynamically set maxValue
//                   text={scoreText}  // Dynamically set text
//                   strokeWidth={12}
//                   styles={{
//                     path: { stroke: '#0700e7' },
//                     trail: { stroke: '#e0e0e0' },
//                     text: { fill: '#000000', fontSize: '18px', fontWeight: 'bold' },
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
  
//           {/* Back Side */}
//           <div className="back flex flex-col justify-center items-center p-4 bg-[#b393f8] rounded-lg overflow-y-auto">
//             <h5 className="text-xl font-semibold">{label} - तपशील</h5>
//             <p className="mt-4 text-sm">
//               {feedback.split(" ").slice(0, 32).join(" ")}...
//             </p>
  
//             <p className="mt-4 text-sm">अधिक जाणून घ्या</p>
//           </div>
//         </div>
//       </div>
//     );
//   };
  

// return (
//     <div
//       className="modal-background text-white"
//       onClick={handleClosee} // Close modal if clicked outside
//     >
//       <div
//         className="modal-container"
//         onClick={(e) => e.stopPropagation()} // Prevent closing if clicked inside modal
//       >
//         <div className="modal-header">
//           <div className="back-button" onClick={handleClosee}>
//             <IoIosArrowBack />
//           </div>
//           <h1 className="text-center">मुलाखत अहवाल</h1>
//         </div>
        
//         <div className="mx-auto mt-5">
//           {visibility.previousReports && (
//             <div className="mx-auto">
//               {reports && reports.length > 0 ? (
//                 reports.map((report, index) => (
//                   <div
//                     key={index}
//                     className="bg-transparent shadow-lg rounded-lg p-2 max-w-2xl mx-auto"
//                   >
//                     <div
//                       className="bg-purple-500 text-white p-4 rounded-t-lg cursor-pointer flex justify-between items-center"
//                       onClick={() => toggleIndividualReportVisibility(index)}
//                     >
//                       {/* Hide the toggle text if the report is visible */}
//                       <span>{reportVisibility[index] ? 'Hide Report' : 'Show Report'} ▼</span>
//                       <span className="text-sm">{new Date(report.createdAt).toLocaleString()}</span>
//                     </div>

//                     {reportVisibility[index] && (
//                       <div className="p-4">
//                         <h2 className="text-lg font-semibold">
//                           <strong>पद:</strong> {report.role}
//                         </h2>
//                         <div className="report-analysis mt-4">
//                           <h4 className="text-xl font-semibold mb-2">
//                             <strong>परीक्षण</strong>
//                           </h4>

//                           <div className="score-cards-container">
//                             {['Technical Proficiency', 'Communication', 'Decision-Making', 'Confidence', 'Language Fluency', 'Overall Score'].map((category) => {
//                               const { score, feedback } = extractScoreAndFeedback(report, category);
//                               return <ScoreCard key={category} label={category} score={score} feedback={feedback} />;
//                             })}
//                           </div>

//                           <button
//                             className="button mt-4"
//                             onClick={() => downloadReport(report.reportAnalysis, report)}
//                           >
//                             रिपोर्ट डाउनलोड करा
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center mt-5 text-gray-600">अहवाल पाहण्यासाठी कृपया ५ मिनिटांनंतर पुन्हा भेट द्या</div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//   );

// 1. Modernized ScoreCard Component
  const ScoreCard = ({ label, score, feedback }) => {
    const isOverallScore = label === 'Overall Score';
    const maxScore = isOverallScore ? 50 : 10;
    const scoreText = `${score}/${maxScore}`;
    const percentage = (score / maxScore) * 100;
    
    // Color logic based on score percentage
    const getColor = (p) => {
      if (p >= 80) return '#10b981'; // Emerald 500
      if (p >= 50) return '#f59e0b'; // Amber 500
      return '#ef4444'; // Red 500
    };

    const strokeColor = getColor(percentage);

    return (
      <div className="group relative w-full h-64 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Front Side */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300 group-hover:opacity-10 opacity-100">
          <h5 className="text-slate-600 font-semibold text-sm uppercase tracking-wider mb-4 text-center h-10 flex items-center">{label}</h5>
          <div className="w-28 h-28">
            <CircularProgressbar
              value={score}
              maxValue={maxScore}
              text={scoreText}
              strokeWidth={10}
              styles={{
                path: { stroke: strokeColor, transition: 'stroke-dashoffset 0.5s ease 0s' },
                trail: { stroke: '#f1f5f9' },
                text: { fill: '#1e293b', fontSize: '20px', fontWeight: 'bold' },
              }}
            />
          </div>
        </div>

        {/* Back Side (Reveal on Hover) */}
        <div className="absolute inset-0 bg-slate-50 p-6 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
          <h5 className="text-slate-800 font-bold mb-2 text-sm">{label}</h5>
          <p className="text-slate-600 text-sm text-center leading-relaxed line-clamp-4 mb-3">
             {feedback ? feedback : "No specific feedback available for this section."}
          </p>
          <span className="text-indigo-600 text-xs font-semibold cursor-pointer hover:underline mt-auto">
            View Details &rarr;
          </span>
        </div>
      </div>
    );
  };

  // 2. Main Return Block
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleClosee}
    >
      <div
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleClosee}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <IoIosArrowBack size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">मुलाखत अहवाल</h1>
              <p className="text-xs text-slate-500">Interview Performance Analysis</p>
            </div>
          </div>
          <button 
            onClick={handleClosee}
            className="hidden sm:block text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Close
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-8 custom-scrollbar">
          {visibility.previousReports && (
            <div className="space-y-6">
              {reports && reports.length > 0 ? (
                reports.map((report, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                      reportVisibility[index] ? 'shadow-lg border-indigo-100 ring-1 ring-indigo-50' : 'shadow-sm border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    {/* Report Accordion Header */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors gap-4"
                      onClick={() => toggleIndividualReportVisibility(index)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reportVisibility[index] ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                           <span className="font-bold text-lg">{index + 1}</span>
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-800">{report.role || "General Interview"}</h2>
                          <p className="text-sm text-slate-500">
                            {new Date(report.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            <span className="mx-2">•</span>
                            {new Date(report.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${reportVisibility[index] ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                           {reportVisibility[index] ? 'Viewing' : 'View Report'}
                        </span>
                        <IoIosArrowBack className={`transform transition-transform duration-300 text-slate-400 ${reportVisibility[index] ? '-rotate-90' : '-rotate-180'}`} />
                      </div>
                    </div>

                    {/* Report Content (Collapsible) */}
                    <div 
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        reportVisibility[index] ? 'max-h-[2000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-6 sm:p-8 bg-slate-50/30">
                        
                        <div className="flex items-center justify-between mb-6">
                           <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                             <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                             Performance Metrics
                           </h4>
                           <button
                              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadReport(report.reportAnalysis, report);
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              Download PDF
                            </button>
                        </div>

                        {/* Grid for Score Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {['Technical Proficiency', 'Communication', 'Decision-Making', 'Confidence', 'Language Fluency', 'Overall Score'].map((category) => {
                            const { score, feedback } = extractScoreAndFeedback(report, category);
                            return <ScoreCard key={category} label={category} score={score} feedback={feedback} />;
                          })}
                        </div>

                        {/* Mobile Download Button */}
                        <button
                          className="w-full sm:hidden flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-lg active:scale-95 transition-transform"
                          onClick={() => downloadReport(report.reportAnalysis, report)}
                        >
                          रिपोर्ट डाउनलोड करा
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">No Reports Available Yet</h3>
                  <p className="text-slate-500 max-w-xs mt-2">
                    अहवाल तयार होत आहेत. कृपया ५ मिनिटांनंतर पुन्हा तपासा.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportDetailPopup;
