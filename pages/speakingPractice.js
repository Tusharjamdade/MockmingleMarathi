import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function SpeakingPractice() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);
  const [token, setToken] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [showLevelSelection, setShowLevelSelection] = useState(false);
  const [levelProgress, setLevelProgress] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [responses, setResponses] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Check if user is authenticated
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }

    // Check if speech recognition is supported
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setSpeechSupported(false);
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
    }

    return () => {
      // Clean up recognition and timer on unmount
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error("Error stopping recognition:", e);
        }
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Fetch level progress data when difficulty changes
  useEffect(() => {
    if (difficulty) {
      // Reset any previously selected level
      setSelectedLevel(null);
      fetchLevelProgress();
    }
  }, [difficulty]);
  
  // Function to fetch user's level progress
  const fetchLevelProgress = async () => {
    if (!difficulty) return;
    
    setLoading(true);
    try {
      // Simple auth approach - get user info from localStorage
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001'; // Use default ID if not found
      
      // Create default progress array for 30 levels
      const defaultProgress = [];
      for (let i = 1; i <= 30; i++) {
        defaultProgress.push({
          level: i,
          stars: 0,
          completed: i <= 2, // Make first 2 levels completed by default for demo
          questionsCompleted: i <= 2 ? 5 : 0
        });
      }
      
      try {
        const response = await fetch(`/api/getPracticeProgress?skillArea=Speaking&difficulty=${difficulty}&userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (response.ok && data.progress) {
          // Find progress for this specific skill area and difficulty
          const speakingProgress = data.progress.find(p => 
            p.skillArea === 'Speaking' && p.difficulty === difficulty
          );
          
          if (speakingProgress && speakingProgress.levelProgress && speakingProgress.levelProgress.length > 0) {
            // Merge the API data with default data to ensure we have all 30 levels
            const mergedProgress = defaultProgress.map(defaultLevel => {
              const apiLevel = speakingProgress.levelProgress.find(l => l.level === defaultLevel.level);
              return apiLevel || defaultLevel;
            });
            setLevelProgress(mergedProgress);
          } else {
            setLevelProgress(defaultProgress);
          }
        } else {
          setLevelProgress(defaultProgress);
        }
      } catch (apiError) {
        console.error("API error, using default progress:", apiError);
        setLevelProgress(defaultProgress);
      }
      
      setShowLevelSelection(true);
    } catch (error) {
      console.error("Error in level progress logic:", error);
      
      // Initialize empty progress for all 30 levels as fallback
      const emptyProgress = Array.from({ length: 30 }, (_, i) => ({
        level: i + 1,
        stars: 0,
        completed: i < 2 // Make first 2 levels completed by default for demo
      }));
      setLevelProgress(emptyProgress);
      setShowLevelSelection(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions for a specific level
  const fetchQuestions = async () => {
    if (!difficulty || !selectedLevel) return;

    setLoading(true);
    try {
      console.log(`Fetching speaking practice questions for ${difficulty} level ${selectedLevel}`);
      
      // Simple auth approach - include user ID in the request body instead of using token in header
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001'; // Fallback to default ID
      
      const response = await fetch('/api/fetchPracticeQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // No Authorization header to avoid 431 error
        },
        body: JSON.stringify({
          skillArea: 'Speaking',
          difficulty: difficulty,
          count: 5,
          userId: userId, // Send user ID in the body instead
          level: selectedLevel // Include the selected level
        })
      });

      const data = await response.json();
      console.log('API response:', data);
      
      if (!response.ok) {
        // If unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('token');
          alert("सत्राचा कालावधी संपला आहे. कृपया पुनः लॉगिन करा.");
          router.push("/login");
          return;
        }
        throw new Error(data.error || 'प्रश्न लोड करण्यात अडचण आली.');
      }
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error('कोणतेही प्रश्न प्राप्त झाले नाहीत.');
      }

      setQuestions(data.questions);
      setShowLevelSelection(false);
      setTestStarted(true);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("स्पीकिंग प्रॅक्टिस प्रश्न लोड करण्यात अडचण आली आहे. कृपया नंतर पुन्हा प्रयत्न करा.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle level selection
  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    // Add a short delay to allow the UI to update before fetching questions
    setTimeout(() => {
      fetchQuestions();
    }, 100);
  };

  const startSpeechRecognition = () => {
    if (!speechSupported) return;
    
    // Initialize speech recognition
    if (!recognitionRef.current) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'mr-IN';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setUserResponse(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event);
        if (event.error === 'not-allowed') {
          alert("मायक्रोफोन परवानगी नाकारली. कृपया मायक्रोफोन अ‍ॅक्सेस चालू करा.");
        }
      };
    }
    
    // Start recording
    try {
      recognitionRef.current.start();
      setRecording(true);
      
      // Start timer
      const currentQuestion = questions[currentIndex];
      setTimeLeft(currentQuestion.timeLimit);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            stopSpeechRecognition();
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  };

  const stopSpeechRecognition = async () => {
    if (!speechSupported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error("Error stopping recognition:", e);
    }
    
    setRecording(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Submit for feedback if there's a response
    if (userResponse.trim()) {
      await submitForFeedback();
    }
  };

  const submitForFeedback = async () => {
    if (!userResponse.trim()) return;
    
    try {
      // Get user ID from localStorage to avoid token-in-header issues
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001';
      
      const currentQuestion = questions[currentIndex];
      // Check if the question has a valid MongoDB ObjectId
      let testIdToUse = null;
      if (currentQuestion._id && typeof currentQuestion._id === 'string' && currentQuestion._id.length === 24) {
        testIdToUse = currentQuestion._id;
      } else {
        // Don't send an invalid testId, the API will use a default
        console.log('No valid ObjectId found for question, using default');
      }
      
      const response = await fetch('/api/submitPracticeResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Don't include token in headers to avoid 431 errors
        },
        body: JSON.stringify({
          testId: testIdToUse, // Only send if it's a valid ObjectId
          cardId: currentQuestion.cardId,
          userResponse: userResponse,
          score: 0, // Will be assessed by AI
          timeSpent: currentQuestion.timeLimit - timeLeft,
          userId: userId, // Include userId in the body instead
          level: selectedLevel, // Include the level number
          difficulty: difficulty, // Include the difficulty
          skillArea: 'Speaking' // Explicitly set skill area to Speaking
        })
      });

      if (!response.ok) {
        throw new Error('प्रतिसाद सबमिट करण्यात अयशस्वी.');
      }

      const data = await response.json();
      setFeedback(data.feedback);
      
      // Determine score based on feedback sentiment (simplified)
      let questionScore = 1;
      if (data.feedback.includes("excellent") || data.feedback.includes("perfect")) {
        questionScore = 3;
      } else if (data.feedback.includes("good") || data.feedback.includes("well done")) {
        questionScore = 2;
      }
      setScore(questionScore);
      
      // Store response data for level evaluation
      setResponses(prevResponses => [...prevResponses, {
        cardId: currentQuestion.cardId,
        question: currentQuestion.instructions,
        expectedResponse: currentQuestion.expectedResponse,
        userResponse: userResponse,
        score: questionScore,
        timeSpent: currentQuestion.timeLimit - timeLeft,
        completedAt: new Date()
      }]);
    } catch (error) {
      console.error("Error submitting for feedback:", error);
      setFeedback("माफ करा, तुमचा प्रतिसाद स्वीकारला जाऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.");
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      // Move to next question
      setCurrentIndex(currentIndex + 1);
      setUserResponse('');
      setFeedback('');
      setScore(0);
      setTimeLeft(0);
    } else {
      // Complete the test
      setTestCompleted(true);
      // Evaluate level completion with Claude AI
      evaluateLevelCompletion();
    }
  };
  
  // Function to evaluate level completion using Claude AI
  const evaluateLevelCompletion = async () => {
    try {
      setLoading(true);
      // Get userId from localStorage
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001'; // Use default ID if not found
      
      // Ensure we have a valid level value (use 1 as default if none is selected)
      const levelToEvaluate = selectedLevel || 1;
      console.log('Evaluating level:', levelToEvaluate);
      
      const response = await fetch('/api/evaluateLevelCompletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          skillArea: 'Speaking',
          difficulty,
          level: levelToEvaluate, // Use the validated level value
          responses
        })
      });

      try {
        if (response.ok) {
          const result = await response.json();
          setEvaluationResult(result);
          setShowEvaluation(true);
          
          // Update local level progress data to show updated stars
          if (result.levelProgress) {
            setLevelProgress(prev => {
              const updatedProgress = [...prev];
              const levelIndex = updatedProgress.findIndex(p => p.level === selectedLevel);
              
              if (levelIndex > -1) {
                updatedProgress[levelIndex] = {
                  ...updatedProgress[levelIndex],
                  stars: result.levelProgress.stars,
                  completed: true
                };
              }
              
              return updatedProgress;
            });
          }
        } else {
          console.error('लेव्हल पूर्णतेचे मूल्यमापन करण्यात अडचण आली.');
          // Force show evaluation with default values even on error
          setEvaluationResult({
            evaluation: {
              overallRating: 1,
              feedback: "तुमच्या प्रतिसादांचे संपूर्ण मूल्यमापन शक्य झाले नाही, तरीही तुम्ही लेव्हल पूर्ण केला आहे.",
              completed: true
            },
            levelProgress: {
              level: selectedLevel,
              stars: 1,
              completed: true
            }
          });
          setShowEvaluation(true);
        }
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        // Force show evaluation with default values on parse error
        setEvaluationResult({
          evaluation: {
            overallRating: 1,
            feedback: "तुमच्या लेव्हलचे मूल्यांकन पूर्ण करू शकले नाही, तरीही तुमचा प्रगती नोंदवला आहे.",
            completed: true
          },
          levelProgress: {
            level: selectedLevel,
            stars: 1,
            completed: true
          }
        });
        setShowEvaluation(true);
      }
    } catch (error) {
      console.error('Error evaluating level completion:', error);
      // Even with complete failure, provide a graceful fallback
      setEvaluationResult({
        evaluation: {
          overallRating: 1,
          feedback: "सर्व्हरशी कनेक्ट होण्यात त्रुटी आली, पण तुमचा सराव सत्र नोंदवला आहे.",
          completed: true
        },
        levelProgress: {
          level: selectedLevel,
          stars: 1,
          completed: true
        }
      });
      setShowEvaluation(true);
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setUserResponse('');
    setFeedback('');
    setScore(0);
    setResponses([]);
    setEvaluationResult(null);
    setShowEvaluation(false);
    // We don't reset difficulty or level selection so user can continue with other levels
  };
  
  const backToLevelSelection = () => {
    resetTest();
    setShowLevelSelection(true);
    setSelectedLevel(null);
  };
return (
    <>
      <Head>
        <title>SHAKKTII AI - बोलण्याचा सराव</title>
      </Head>

      <div className="min-h-screen relative bg-[#0f0c29] font-sans text-white overflow-x-hidden">
        
        {/* Background Layer - Deep gradient overlay for readability */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/BG.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/95 via-[#302b63]/90 to-[#24243e]/90 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          
          {/* Header Navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <button 
              onClick={() => router.push('/practices')} 
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 backdrop-blur-md"
            >
              <div className="p-1.5 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                <img src="/2.svg" alt="Back" className="w-5 h-5 invert" />
              </div>
              <span className="text-sm font-medium tracking-wide text-gray-200 group-hover:text-white">सराव भागाकडे परत जा</span>
            </button>

            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-0.5 shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              <div className="w-full h-full rounded-full bg-[#1a103c] flex items-center justify-center overflow-hidden">
                 <img src="/logoo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {!testStarted ? (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              {!showLevelSelection ? (
                // --- Difficulty Selection Screen ---
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-6 drop-shadow-sm">
                    बोलण्याचा सराव (Speaking Practice)
                  </h1>
                  <p className="text-lg text-gray-300 mb-12 max-w-2xl">
                    परस्पर संवादात्मक AI सरावांद्वारे तुमचे उच्चार, ओघ आणि आत्मविश्वास वाढवा.
                  </p>

                  <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                      लेव्हल निवडा
                      <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    </h2>
                    <div className="space-y-4">
                      {['बिगिनर', 'मॉडरेट', 'एक्स्पर्ट'].map(level => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`w-full py-4 px-6 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                            difficulty === level 
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/30 ring-2 ring-white/20' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // --- Level Grid Selection (Implied from logic flow) ---
                <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl">
                   {/* If there is specific code for level grid selection, it would go here based on state logic. 
                       Assuming standard level grid logic needs to be here if showLevelSelection is true but test hasn't started. */}
                   <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">{difficulty} लेव्हल्स</h2>
                      <button 
                        onClick={() => {setShowLevelSelection(false); setDifficulty('');}}
                        className="text-pink-300 hover:text-pink-200 text-sm flex items-center justify-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Change Difficulty
                      </button>
                   </div>

                   {loading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-pink-200">Loading levels...</p>
                      </div>
                   ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Array.from({length: 30}, (_, i) => i + 1).map((level) => {
                          const levelData = levelProgress.find(p => p.level === level) || { level, completed: false, stars: 0 };
                          const prevLevelData = level > 1 ? levelProgress.find(p => p.level === level-1) : { completed: true };
                          const isLocked = level > 3 && !prevLevelData?.completed;
                          const isCompleted = levelData.completed;
                          const stars = levelData.stars || 0;
                          
                          return (
                            <div 
                              key={`level-${level}`}
                              onClick={() => !isLocked && handleLevelSelect(level)}
                              className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 ${
                                isLocked 
                                  ? 'bg-black/20 border border-white/5 cursor-not-allowed opacity-60' 
                                  : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 cursor-pointer hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1'
                              } ${selectedLevel === level ? 'ring-2 ring-pink-500 bg-white/15' : ''}`}
                            >
                              <span className={`text-2xl font-bold mb-1 ${isLocked ? 'text-gray-500' : 'text-white'}`}>{level}</span>
                              
                              {/* Stars */}
                              {!isLocked && (
                                <div className="flex gap-0.5">
                                  {[...Array(3)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-3 h-3 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-600 fill-current'}`}>
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                  ))}
                                </div>
                              )}

                              {isLocked && (
                                <svg className="w-5 h-5 text-gray-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              )}
                              
                              {isCompleted && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                   )}
                </div>
              )}
            </div>
          ) : testCompleted && showEvaluation && evaluationResult ? (
            
            // --- Evaluation Result Screen ---
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center animate-zoom-in">
              <h1 className="text-3xl font-bold text-white mb-2">अभिनंदन! (Congratulations!)</h1>
              <h2 className="text-xl text-pink-300 font-medium mb-8">लेव्हल {selectedLevel} पूर्ण झाली</h2>

              <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-white/5">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Performance Report</h3>
                
                {/* Big Stars */}
                <div className="flex justify-center gap-3 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-16 h-16 filter drop-shadow-lg transition-all duration-500 ${i < (evaluationResult.evaluation?.overallRating || 0) ? 'text-yellow-400 fill-current scale-110' : 'text-gray-700 fill-current'}`}>
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-gray-200 italic leading-relaxed border border-white/5">
                  "{evaluationResult.evaluation?.feedback || "उत्तम प्रयत्न! सातत्याने सराव केल्यास तुमचे कौशल्य नक्कीच सुधारेल."}"
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={backToLevelSelection}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10"
                >
                  लेव्हल्स यादी
                </button>
                {evaluationResult.nextLevel && (
                  <button
                    onClick={() => {
                      resetTest();
                      setSelectedLevel(evaluationResult.nextLevel);
                      setTimeout(() => fetchQuestions(), 100);
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-pink-500/30 transition-transform hover:-translate-y-0.5"
                  >
                    पुढील लेव्हल खेळा &rarr;
                  </button>
                )}
              </div>
            </div>

          ) : testCompleted && !showEvaluation ? (
            
            // --- Test Completed Confirmation ---
            <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center animate-fade-in">
              <h1 className="text-3xl font-bold text-white mb-6">सराव पूर्ण झाला!</h1>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-pink-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-lg text-pink-200 animate-pulse">AI तुमच्या उत्तरांचे विश्लेषण करत आहे...</p>
                </div>
              ) : (
                <>
                  <div className="w-40 h-40 mx-auto mb-8 bg-white/5 rounded-full p-6 border border-white/10 shadow-inner">
                    <img src="/completed.svg" alt="Complete" className="w-full h-full object-contain drop-shadow-lg" onError={(e) => { e.target.src = "/logoo.png"; }} />
                  </div>
                  <p className="text-xl text-gray-200 mb-8">
                    ग्रेट जॉब! तुम्ही हे सत्र यशस्वीरित्या पूर्ण केले आहे.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={backToLevelSelection}
                      className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10"
                    >
                      लेव्हल्सकडे परत जा
                    </button>
                    <button
                      onClick={() => setShowEvaluation(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-purple-500/30 transition-transform hover:-translate-y-0.5"
                    >
                      निकाल पहा (View Results)
                    </button>
                  </div>
                </>
              )}
            </div>

          ) : (
            // --- Active Test Interface ---
            <div className="max-w-3xl mx-auto animate-fade-in">
              
              {/* Progress Bar */}
              <div className="flex justify-between items-end mb-2 px-2">
                <span className="text-gray-400 text-sm font-bold tracking-wide">
                  QUESTION {currentIndex + 1} <span className="text-gray-600">/ {questions.length}</span>
                </span>
                <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full border border-white/10 text-pink-300">
                  {difficulty} • Level {selectedLevel}
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-8 overflow-hidden backdrop-blur-sm">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question Card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">
                  {questions[currentIndex]?.instructions || "Read the following prompt and respond:"}
                </h2>
                
                <div className="bg-black/20 rounded-2xl p-6 border border-white/5 text-lg text-gray-200 leading-relaxed shadow-inner">
                  {questions[currentIndex]?.content || "Loading content..."}
                </div>
              </div>

              {/* Recording Area */}
              <div className="flex flex-col items-center justify-center mb-10">
                <div className="relative">
                  {/* Pulse Effect rings */}
                  {recording && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
                      <div className="absolute inset-[-10px] rounded-full bg-red-500 opacity-10 animate-pulse"></div>
                    </>
                  )}
                  
                  <button
                    onClick={recording ? stopSpeechRecognition : startSpeechRecognition}
                    disabled={!!feedback}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-4 ${
                      recording 
                        ? 'bg-red-500 border-red-400 scale-110' 
                        : feedback 
                          ? 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-50' 
                          : 'bg-gradient-to-br from-pink-500 to-purple-600 border-white/10 hover:scale-105 hover:shadow-pink-500/40'
                    }`}
                  >
                    {recording ? (
                      <div className="w-8 h-8 bg-white rounded-md shadow-sm"></div>
                    ) : (
                      <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="mt-6 flex flex-col items-center gap-2">
                  <span className={`text-lg font-medium ${recording ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
                    {recording ? "Recording... (Tap to Stop)" : "Tap microphone to speak"}
                  </span>
                  
                  {timeLeft > 0 && (
                    <div className="w-16 h-16 mt-2 relative">
                      <div className="absolute inset-0 bg-white/5 rounded-full"></div>
                      <CircularProgressbar
                        value={timeLeft}
                        maxValue={questions[currentIndex]?.timeLimit || 60}
                        text={`${timeLeft}`}
                        styles={buildStyles({
                          textSize: '32px',
                          pathColor: timeLeft < 10 ? '#ef4444' : '#c084fc',
                          textColor: '#fff',
                          trailColor: 'transparent',
                          pathTransitionDuration: 0.5,
                        })}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Transcript & Feedback */}
              <div className="space-y-6">
                {userResponse && (
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 animate-fade-in-up">
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Your Transcript</h3>
                    <p className="text-gray-200 text-lg leading-relaxed font-medium">"{userResponse}"</p>
                  </div>
                )}

                {feedback && (
                  <div className={`p-6 rounded-2xl border backdrop-blur-md animate-fade-in-up ${
                    score === 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' :
                    score === 2 ? 'bg-blue-500/10 border-blue-500/30 text-blue-200' :
                    'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        AI Feedback
                      </h3>
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-5 h-5 ${i < score ? 'fill-current' : 'fill-white/10'}`}>
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-lg leading-relaxed font-medium">{feedback}</p>
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!feedback}
                  className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                    !feedback
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-purple-500/40'
                  }`}
                >
                  {currentIndex < questions.length - 1 ? 'पुढील प्रश्न (Next Question) &rarr;' : 'सराव पूर्ण करा (Finish) &rarr;'}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SpeakingPractice;
