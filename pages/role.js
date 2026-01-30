import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { getApiResponse } from './api/questionsFetchFormModel';
import { IoIosArrowBack, IoMdSchool, IoMdCreate } from "react-icons/io"; // Added icons for visuals
import { FaChalkboardTeacher, FaLayerGroup } from "react-icons/fa"; // Added icons for visuals
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function Role() {
  const router = useRouter();
  // const [jobRole, setJobRole] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [role, setRole] = useState("");
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState("");
  const [user, setUser] = useState(null);
  const [hasAvailableInterviews, setHasAvailableInterviews] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [board, setBoard] = useState("");

  // Declare boards array here (not inside JSX)
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
        setEmail(userFromStorage.email || '');  // Initialize email here directly

        // Check if user has available interviews from local storage initially
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

  // Function to check if user has available interviews
  const checkInterviewAvailability = async () => {
    setIsCheckingAvailability(true);
    try {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (!userFromStorage || !userFromStorage.email) {
        toast.error("वापरकर्ता माहिती सापडली नाही. कृपया पुन्हा लॉगिन करा.");
        setIsCheckingAvailability(false);
        return false;
      }

      // Try to get the latest stats from the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || ''}/api/getUserStats?email=${encodeURIComponent(userFromStorage.email)}`);

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.stats) {
          const completedInterviews = data.stats.no_of_interviews_completed || 0;
          const totalInterviews = data.stats.no_of_interviews || 1;

          // Update the user in localStorage with latest stats
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

      // Fallback to using the data from localStorage
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
    e.preventDefault();  // Prevent form from submitting normally
    localStorage.removeItem("apiResponseStatus");

    if (!subject.trim()) {
      toast.error("कृपया विषय टाका");
      return;
    }

    // Show loading indicator
    toast.loading("मुलाखतीसाठी तयार होत आहे...");

    // Always proceed with the interview without checking limits
    toast.success("मुलाखतीची तयारी सुरू करत आहे...");

    // Declare formattedQuestions here once
    let formattedQuestions = [];

    router.push("/instruction");

    // Replace this with a fetch request to your new API
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/questionsFetchFormModel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // jobRole,
          level,
          subject,
          role, board
        }),
      });

      // Check if the response is OK (status 200)
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.");
      }

      // Parse the response
      const responseData = await res.json();

      console.log('Fetched Questions:', responseData.questions);  // Debug: Log fetched questions

      let fetchedQuestions = responseData.questions;

      if (fetchedQuestions) {
        // Check if the fetchedQuestions is a string
        if (typeof fetchedQuestions === 'string') {
          console.log('Raw response:', fetchedQuestions);

          // Pattern specifically designed for the example format
          // Handle format like "**1. What is the difference between...**"
          const matches = [];


          const patterns = [
            // Bold Marathi numbered item: **१. काहीतरी मजकूर**
            {
              regex: /\*\*[०-९]+\.\s+([^*]+?)\*\*/gu,
              type: 'Bold with ** markers (Marathi)'
            },

            // Regular Marathi numbered list pattern at start of line
            {
              regex: /^\s*[०-९]+\.\s+([^\n]+)/gmu,
              type: 'Regular numbered list (Marathi)'
            },

            // Simple match for Marathi number followed by text
            {
              regex: /[०-९]+\.\s+([^\n(]+)/gu,
              type: 'Simple number followed by text (Marathi)'
            }
          ];


          // Try each pattern until we find matches
          // Convert to string once outside the loop
          const questionText = fetchedQuestions.toString();

          for (const pattern of patterns) {
            let match;
            pattern.regex.lastIndex = 0; // Reset regex for each use

            while ((match = pattern.regex.exec(questionText)) !== null) {
              if (match[1]) {
                const question = match[1].trim();
                matches.push(question);
                console.log(`Found ${pattern.type} question:`, question);
              }
            }

            // If we found any matches, stop trying patterns
            if (matches.length > 0) {
              console.log(`Found ${matches.length} questions using pattern: ${pattern.type}`);
              break;
            }
          }

          // Remove extra formatting from the questions
          const cleanedMatches = matches.map(q => {
            // Remove any remaining markdown or unnecessary characters
            return q.replace(/\*\*/g, '').trim();
          });

          const matchedQuestions = cleanedMatches.length > 0 ? cleanedMatches : null;
          console.log('Extracted questions:', cleanedMatches);

          // For debugging
          console.log('Total questions found:', cleanedMatches.length);

          console.log('Matched Questions:', matchedQuestions); // Debug: Log matched questions

          if (matchedQuestions) {
            // Start with the "Introduce yourself" question as the first element
            const firstName = user?.fullName?.split(' ')[0];
            formattedQuestions = [{
              questionText: `हॅलो ${firstName}, कृपया आपले स्वतःबद्दल थोडक्यात माहिती द्या, ज्यामध्ये आपली शैक्षणिक पात्रता आणि मागील कामाचा अनुभव समाविष्ट असावा."`,
              answer: null,
            }];

            // Add the fetched questions to the array
            const additionalQuestions = matchedQuestions.map(questionText => ({
              questionText: questionText.trim(),
              answer: null,
            }));

            // Prepend the fetched questions after the "Introduce yourself"
            formattedQuestions.push(...additionalQuestions);

            // Set the questions in the state with the "Introduce yourself" as the first question
            setQuestions(formattedQuestions);
          } else {
            console.error("मिळालेल्या डेटामध्ये वैध प्रश्न आढळले नाहीत");
          }
        } else {
          console.error('फेच केलेले प्रश्न अपेक्षित मजकूर स्वरूपात नाहीत:', fetchedQuestions);
        }
      } else {
        console.error("API मधून प्रश्न मिळाले नाहीत.");
      }

      console.log("Questions to be sent:", formattedQuestions);

      if (formattedQuestions && formattedQuestions.length > 0) {
        const data = { email, level, subject, role, board, questions: formattedQuestions };

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/jobRoleAndQuestionsSave`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error || "त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.");
          }

          const response = await res.json();
          // console.log(response.data._id); // Log the successful response

          // Store the response _id in localStorage
          if (response.data._id) {
            // Remove the existing items if they exist
            localStorage.removeItem("_id");
            localStorage.removeItem("_idForReport");

            // Add the new items
            localStorage.setItem("_id", response.data._id);
            localStorage.setItem("_idForReport", response.data._id);
          }

          // Store response status in localStorage to enable button on Instruction page
          localStorage.setItem("apiResponseStatus", "success");

        } catch (error) {
          console.error('Error:', error);
          // Store response failure status in localStorage
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

  // Helper for radio buttons
  const levels = [
    { id: "Beginner", label: "सुरुवातीचा स्तर", sub: "Beginner" },
    { id: "Intermediate", label: "मध्यम स्तर", sub: "Intermediate" },
    { id: "Advanced", label: "उच्च स्तर", sub: "Advanced" },
    { id: "Expert", label: "अनुभवी", sub: "Expert" },
  ];

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-cover bg-center overflow-hidden" 
         style={{ backgroundImage: "url('/bg.gif')" }}>
      
      {/* Dark overlay to improve text readability over the GIF */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* <Toaster position="top-center" toastOptions={{ duration: 3000 }} /> */}

      <Link href="/">
        <div className="absolute top-6 left-4 z-20 flex items-center gap-2 text-white hover:text-[#e600ff] transition-colors cursor-pointer group">
          <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-all backdrop-blur-sm">
             <IoIosArrowBack className="text-2xl" />
          </div>
          <span className="text-sm font-medium hidden sm:block">Back</span>
        </div>
      </Link>

      {/* No interviews available modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-red-500/50 p-8 rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto flex items-center justify-center mb-6 ring-1 ring-red-500/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white">कोणतीही मुलाखत उपलब्ध नाही</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">तुम्ही तुमच्या सर्व उपलब्ध मुलाखती वापरल्या आहेत. कृपया अधिक मुलाखतीसाठी प्रशासकाशी संपर्क साधा.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/profile">
                  <button className="w-full sm:w-auto bg-[#2a72ff] text-white px-6 py-3 rounded-xl hover:bg-[#1a5adb] transition-all duration-200 font-medium shadow-lg shadow-blue-500/20">
                    प्रोफाइल पाहा
                  </button>
                </Link>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full sm:w-auto bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
                >
                  बंद करा
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Container - Glassmorphism */}
      <div className="relative z-10 w-full max-w-lg p-6 sm:p-10 m-4">
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8">
          
          <div className="text-center mb-8">
            <img src="/logoo.png" alt="Shakti AI लोगो" className="w-24 mx-auto mb-4 drop-shadow-lg" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
               अभ्यास आणि मुलाखत
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Class Selection */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium ml-1 flex items-center gap-2">
                <IoMdSchool className="text-[#e600ff]" /> इयत्ता निवडा
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#e600ff] focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-800">-- इयत्ता निवडा --</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="text-gray-800">
                      इयत्ता {i + 1} वी
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  ▼
                </div>
              </div>
            </div>

            {/* Board Selection */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium ml-1 flex items-center gap-2">
                <FaChalkboardTeacher className="text-[#2a72ff]" /> बोर्ड निवडा
              </label>
              <div className="relative">
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#2a72ff] focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-800">-- बोर्ड निवडा --</option>
                  {boards.map(({ value, label }) => (
                    <option key={value} value={value} className="text-gray-800">
                      {label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  ▼
                </div>
              </div>
            </div>

            {/* English Redirect Button */}
            <Link href="/engrole" passHref>
              <button type="button" className="w-full group mt-2 relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-3 hover:border-blue-500/60 transition-all">
                <div className="flex justify-center items-center gap-2 text-blue-200 group-hover:text-white font-medium">
                  <span>For English Subject Click Here</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            </Link>

            {/* Subject Input */}
            <div className="space-y-2 pt-2">
              <label className="text-gray-300 text-sm font-medium ml-1 flex items-center gap-2">
                <IoMdCreate className="text-[#e600ff]" /> विषय
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3.5 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#e600ff] focus:border-transparent transition-all"
                placeholder="उदा. मराठी, गणित, विज्ञान..."
                required
              />
            </div>

            <input
              type="email"
              name="email"
              value={email}
              readOnly
              className="hidden"
            />

            {/* Level Selection */}
            <div className="pt-4">
              <label className="text-[#e600ff] text-lg font-semibold mb-4 block flex items-center gap-2">
                 <FaLayerGroup /> काठिन्य पातळी निवडा
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {levels.map((lvl) => (
                  <label 
                    key={lvl.id}
                    className={`
                      relative flex flex-col p-4 rounded-xl cursor-pointer border transition-all duration-200
                      ${level === lvl.id 
                        ? 'bg-[#e600ff]/20 border-[#e600ff] shadow-[0_0_15px_rgba(230,0,255,0.3)]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'}
                    `}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={lvl.id}
                      className="hidden"
                      checked={level === lvl.id}
                      onChange={() => setLevel(lvl.id)}
                    />
                    <span className={`font-semibold text-lg ${level === lvl.id ? 'text-white' : 'text-gray-300'}`}>
                      {lvl.label}
                    </span>
                    <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                      {lvl.sub}
                    </span>
                    
                    {level === lvl.id && (
                      <div className="absolute top-4 right-4 w-3 h-3 bg-[#e600ff] rounded-full shadow-[0_0_10px_#e600ff]"></div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full mt-6 bg-gradient-to-r from-[#2a72ff] to-[#1a5adb] hover:from-[#3b7dff] hover:to-[#2a6ae0] text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-3"
            >
              <span>पुढील</span>
              <div className="bg-white/20 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
            
          </form>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © Shakti AI | Education & Interview Prep
        </p>
      </div>
    </div>
  );
}