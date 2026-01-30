import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { processWordByWordTransliteration, handleSpecialKeys, handleKeyUp, shiftTransliterationPending } from '../utils/transliterator';

function ListeningPractice() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);
  const [token, setToken] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // Level-based progress states
  const [showLevelSelection, setShowLevelSelection] = useState(false);
  const [levelProgress, setLevelProgress] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [responses, setResponses] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  
  // Function to generate context-specific questions based on content
  const generateQuestionFromContent = (content) => {
    // Clean content if it contains audio tags
    const cleanContent = content.replace(/\[Audio:\s*|\]/g, '').toLowerCase();
    
    if (cleanContent.includes('weather')) {
      if (cleanContent.includes('temperature')) {
        return "What temperature is mentioned in the weather forecast?";
      } else if (cleanContent.includes('rain') || cleanContent.includes('rainy')) {
        return "Is rain predicted in the weather forecast?";
      } else if (cleanContent.includes('sunny')) {
        return "What type of weather is forecasted for today?";
      } else {
        return "What details are provided in the weather forecast?";
      }
    } else if (cleanContent.includes('train') || cleanContent.includes('station') || cleanContent.includes('platform')) {
      if (cleanContent.includes('depart') || cleanContent.includes('departure')) {
        return "What time does the train depart?";
      } else if (cleanContent.includes('platform')) {
        return "Which platform number is mentioned in the announcement?";
      } else {
        return "What information is being announced at the train station?";
      }
    } else if (cleanContent.includes('teacher') || cleanContent.includes('class') || cleanContent.includes('student')) {
      if (cleanContent.includes('page')) {
        return "What page number did the teacher mention?";
      } else if (cleanContent.includes('book') || cleanContent.includes('assignment')) {
        return "What did the teacher ask the students to do?";
      } else {
        return "What instructions did the teacher give to the class?";
      }
    } else if (cleanContent.includes('meeting') || cleanContent.includes('conference')) {
      return "What is the main purpose of the meeting mentioned in the audio?";
    } else if (cleanContent.includes('restaurant') || cleanContent.includes('food') || cleanContent.includes('menu')) {
      return "What food items or restaurant details are mentioned in the conversation?";
    } else if (cleanContent.includes('price') || cleanContent.includes('cost') || cleanContent.includes('dollar')) {
      return "What price or cost information is mentioned in the audio?";
    } else if (cleanContent.includes('doctor') || cleanContent.includes('hospital') || cleanContent.includes('appointment')) {
      return "What medical information is discussed in the conversation?";
    } else {
      // Generic but still specific enough questions for other contexts
      return "What specific details are mentioned in the audio?";
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      // Show difficulty selection initially
      setShowLevelSelection(false);
    }

    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Fetch level progress for the selected difficulty
  const fetchLevelProgress = async (selectedDifficulty) => {
    if (!selectedDifficulty) return;
    
    setLoading(true);
    try {
      // Initialize default progress for all 30 levels
      const defaultProgress = Array.from({ length: 30 }, (_, i) => ({
        level: i + 1,
        stars: 0,
        completed: i === 0, // Only first level is unlocked by default
        questionsCompleted: 0
      }));
      
      // Get user ID
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001';
      
      // Fetch progress data from API
      const response = await fetch(`/api/getPracticeProgress?skillArea=Listening&difficulty=${selectedDifficulty}&userId=${userId}`);
      const data = await response.json();
      
      if (response.ok && data.progress) {
        // Find progress for this specific skill area and difficulty
        const listeningProgress = data.progress.find(p => 
          p.skillArea === 'Listening' && p.difficulty === selectedDifficulty
        );
        
        if (listeningProgress && listeningProgress.levelProgress && listeningProgress.levelProgress.length > 0) {
          // Merge the API data with default data to ensure we have all 30 levels
          const mergedProgress = defaultProgress.map(defaultLevel => {
            const apiLevel = listeningProgress.levelProgress.find(l => l.level === defaultLevel.level);
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
      
      // Initialize empty progress for all 30 levels as fallback
      const emptyProgress = Array.from({ length: 30 }, (_, i) => ({
        level: i + 1,
        stars: 0,
        completed: i < 2 // Make first 2 levels completed by default for demo
      }));
      setLevelProgress(emptyProgress);
    } finally {
      setLoading(false);
      setShowLevelSelection(true);
    }
  };
  
  // Handle difficulty selection
  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    fetchLevelProgress(selectedDifficulty);
  };
  
  // Handle level selection
  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    // If it's a double-click or if it's a single click on a level that was already selected, start the practice
    if (selectedLevel === level) {
      fetchQuestions();
    }
  };
  
  // Handle level double click to immediately start practice
  const handleLevelDoubleClick = (level) => {
    setSelectedLevel(level);
    fetchQuestions();
  };
  
  // Back to level selection
  const backToLevelSelection = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setShowEvaluation(false);
    setResponses([]);
    setShowLevelSelection(true);
  };
  // Fetch questions for a specific level
  const fetchQuestions = async () => {
    if (!difficulty || !selectedLevel) return;

    setLoading(true);
    try {
      console.log(`Fetching listening practice questions for ${difficulty} level ${selectedLevel}`);
      
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
          skillArea: 'Listening',
          difficulty: difficulty,
          count: 5,
          userId: userId, // Send user ID in the body instead
          level: selectedLevel // Include the selected level
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        // If unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('token');
          alert("session संपला आहे. कृपया पुन्हा लॉगिन करा.");
          router.push("/login");
          return;
        }
        throw new Error(data.error || 'Failed to fetch questions');
      }
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions received');
      }

      setQuestions(data.questions);
      setTestStarted(true);
      setCurrentIndex(0);
      setResponses([]); // Clear any previous responses
      setShowLevelSelection(false); // Hide level selection
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("ऐकण्याच्या सरावाचे प्रश्न लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.");
    } finally {
      setLoading(false);
    }
  };

  // Play audio for the current question
  const playAudio = () => {
    if (!questions || !questions[currentIndex]) {
      console.error('No current question available to play audio');
      return;
    }
    
    try {
      // In a real implementation, this would play actual audio files
      // For demo purposes, we'll use text-to-speech as a placeholder
      const currentQuestion = questions[currentIndex];
      
      // Make sure we have content to speak
      if (!currentQuestion.content) {
        console.error('Question has no content to speak');
        alert('त्रुटी: प्रश्नाचा कन्टेन्ट उपलब्ध नाही. कृपया दुसरा प्रश्न निवडा.');
        return;
      }
      
      // Clean up content text for speaking
      const textToSpeak = currentQuestion.content
        .replace(/\[Audio:\s*|\]/g, '') // Remove [Audio:] tags if present
        .replace(/\n/g, ' ')           // Replace newlines with spaces
        .trim();                       // Trim any extra whitespace
      
      console.log('Speaking text:', textToSpeak);
      
      // Create and configure the speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'mr-IN';
      utterance.rate = 1.0;
      
      // Force voices to load if they haven't already
      speechSynthesis.getVoices();
      
      // Set up a timeout to ensure we get voices
      setTimeout(() => {
        // Try to select a good voice
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
        
        const preferredVoices = voices.filter(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Microsoft') || 
          voice.name.includes('Female')
        );
        
        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
          console.log('Using voice:', preferredVoices[0].name);
        } else if (voices.length > 0) {
          // Fallback to any available voice
          utterance.voice = voices[0];
          console.log('Using fallback voice:', voices[0].name);
        }
        
        // Set up events before speaking
        utterance.onstart = () => {
          console.log('Speech started');
        };
        
        utterance.onend = () => {
          console.log('Speech ended');
          startTimer();
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          // Start timer even if speech fails
          startTimer();
        };
        
        // Actually speak the text
        window.speechSynthesis.speak(utterance);
        setAudioPlayed(true);
      }, 100); // Short delay to make sure voices are loaded
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('ऑडिओ प्ले करताना त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.');
      // Still start the timer even if speech fails
      startTimer();
    }
  };

  // Start timer for the current question
  const startTimer = () => {
    const currentQuestion = questions[currentIndex];
    setTimeLeft(currentQuestion.timeLimit);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Handle selection of multiple choice options
  const handleOptionSelect = (option) => {
    setSelectedOptions(prevSelected => {
      // For single selection questions
      if (!Array.isArray(questions[currentIndex].options) || questions[currentIndex].options.length <= 4) {
        return [option];
      }
      
      // For multiple selection questions
      if (prevSelected.includes(option)) {
        return prevSelected.filter(item => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  // Handle text input change with shift-triggered transliteration to Marathi
  const handleTextResponseChange = async (e) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    try {
      // Only force transliteration if shift key was pressed
      const forceTransliterate = shiftTransliterationPending;
      
      // Process the text for transliteration (only happens when shift is pressed)
      const transliterated = await processWordByWordTransliteration(inputValue, userResponse, forceTransliterate);
      
      // Update the state with transliterated text
      setUserResponse(transliterated);
      
      // Restore cursor position after React re-renders the component
      setTimeout(() => {
        if (e.target) {
          // Calculate appropriate cursor position based on length changes
          const lengthDifference = transliterated.length - inputValue.length;
          const newPosition = cursorPosition + lengthDifference;
          e.target.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    } catch (error) {
      console.error('Transliteration error:', error);
      // Fall back to normal behavior if transliteration fails
      setUserResponse(inputValue);
    }
  };
  
  // Force transliteration of current text
  const forceTransliteration = async () => {
    try {
      const transliterated = await processWordByWordTransliteration(userResponse, userResponse, true);
      setUserResponse(transliterated);
    } catch (error) {
      console.error('Force transliteration error:', error);
    }
  };
  
  // Handle special key events for transliteration control
  const handleKeyDown = (e) => {
    // Pass the forceTransliteration callback to be executed when Shift is pressed
    const isHandled = handleSpecialKeys(e, forceTransliteration);
    
    // If the event has been handled by our utility, prevent default
    if (isHandled) {
      e.preventDefault();
    }
  };
  
  // Handle key up events to reset shift tracking
  const handleInputKeyUp = (e) => {
    // Reset the shift flag when shift key is released
    handleKeyUp(e);
  };

  // Submit answer and get feedback
  const submitAnswer = async () => {
    if (loading) return;

    // For multiple choice questions, check if an option is selected
    if (questions[currentIndex].type === 'multiple-choice' && selectedOptions.length === 0) {
      alert('कृपया दिलेल्या पर्यायांपैकी एक पर्याय निवडा.');
      return;
    }

    // For text input questions, check if there's a response
    if (questions[currentIndex].type === 'text-input' && !userResponse.trim()) {
      alert('कृपया तुमचा प्रतिसाद प्रविष्ट करा');
      return;
    }

    setLoading(true);
    
    try {
      // Determine which response to use based on question type
      const responseToSubmit = questions[currentIndex].type === 'multiple-choice' 
        ? selectedOptions.join(', ') 
        : userResponse;
      
      // Get user ID
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001';
      
      // Check if the question has a valid MongoDB ObjectId
      // Always ensure we have a valid cardId to use for database referencing
      const cardId = questions[currentIndex].cardId || `L-${difficulty.charAt(0)}-${selectedLevel.toString().padStart(2, '0')}-${(currentIndex + 1).toString().padStart(2, '0')}`;
      
      // Generate a unique ID based on the information we have
      // This is a simplified way to create something that looks like an ObjectId
      const timestamp = Math.floor(new Date().getTime() / 1000).toString(16).padStart(8, '0');
      const randomPart = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      const testIdToUse = timestamp + randomPart.padStart(16, '0');
      
      const response = await fetch('/api/submitPracticeResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId: testIdToUse, // Now we always send a valid-looking ID
          cardId: cardId, // Use our validated/generated cardId
          userResponse: responseToSubmit,
          score: 0, // To be determined by AI
          timeSpent: questions[currentIndex].timeLimit - timeLeft,
          userId,
          level: selectedLevel, // Include the level number
          difficulty: difficulty // Include the difficulty
        })
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback);
        setScore(data.score || 0);
        
        // Store response data for level evaluation
        // Extract expected response from question if available, or from listening content
        let expectedResponse = '';
        if (questions[currentIndex].expectedResponse) {
          expectedResponse = questions[currentIndex].expectedResponse;
        } else if (questions[currentIndex].content && questions[currentIndex].content.includes('[Audio:')) {
          // Try to extract expected response from audio content
          const audioText = questions[currentIndex].content.replace('[Audio:', '').replace(']', '').trim();
          if (audioText) {
            expectedResponse = audioText;
          }
        }
        
        console.log('Storing response with expected response:', expectedResponse);
        
        setResponses(prevResponses => [...prevResponses, {
          cardId: questions[currentIndex].cardId,
          question: questions[currentIndex].instructions || questions[currentIndex].content,
          expectedResponse: expectedResponse,
          userResponse: responseToSubmit,
          score: data.score || 1,
          timeSpent: questions[currentIndex].timeLimit - timeLeft,
          completedAt: new Date()
        }]);
      } else {
        throw new Error('Error submitting answer');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('समस्या उद्भवली आहे, कृपया पुन्हा प्रयत्न करून पहा.');
    } finally {
      setLoading(false);
    }
  };
  // Handle moving to the next question
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      // Move to next question
      setCurrentIndex(currentIndex + 1);
      setUserResponse('');
      setSelectedOptions([]);
      setAudioPlayed(false);
      setFeedback('');
      setScore(0);
      setTimeLeft(0);
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
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
      
      // Make sure we have responses to evaluate
      if (!responses || responses.length === 0) {
        console.error('No responses to evaluate!');
        setEvaluationResult({
          evaluation: {
            overallRating: 1,
            feedback: "मूल्यांकनासाठी कोणतीही प्रतिक्रिया नोंदविली गेली नाही. आम्ही डीफॉल्ट रेटिंग दिली आहे.",
            completed: true
          },
          levelProgress: {
            level: levelToEvaluate,
            stars: 1,
            completed: true
          }
        });
        setShowEvaluation(true);
        setLoading(false);
        return;
      }
      
      console.log('Evaluating level:', levelToEvaluate, 'with responses:', responses);
      
      const response = await fetch('/api/evaluateLevelCompletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          skillArea: 'Listening',
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
          console.error('Failed to evaluate level completion');
          // Force show evaluation with default values even on error
          setEvaluationResult({
            evaluation: {
              overallRating: 1,
              feedback: "आम्ही तुमच्या प्रतिसादांचे पूर्णतः मूल्यांकन करू शकलो नाही, तरीही तुम्ही लेव्हल पूर्ण केले आहे.",
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
            feedback: "आम्ही तुमचं लेव्हल मूल्यांकन प्रोसेस करू शकलो नाही, पण तुमचा प्रोग्रेस नोंदवला आहे.",
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
          feedback: "सर्व्हरशी कनेक्ट होताना अडचण आली, पण आम्ही तुमचा प्रॅक्टिस सेशन तरीही नोंदवला आहे.",
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
  
  // Reset the test
  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setUserResponse('');
    setAudioPlayed(false);
    setSelectedOptions([]);
    setResponses([]);
    setShowEvaluation(false);
    setFeedback('');
    setScore(0);
  };

  // return (
  //   <>
  //     <Head>
  //       <title>SHAKKTII AI - ऐकण्याचा सराव</title>
  //       <meta name="description" content="Improve your listening skills with AI-powered practice" />
  //     </Head>
      
  //     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4 sm:px-6 lg:px-8">
  //       <div className="max-w-4xl mx-auto">
  //         <div className="text-center mb-12">
  //           <h1 className="text-4xl font-bold text-white mb-2">ऐकण्याचा सराव</h1>
  //           <p className="text-lg text-pink-200">संवादात्मक सरावांद्वारे तुमच्या ऐकण्याच्या कौशल्यात वाढ करा.</p>
  //         </div>
          
  //         {!testStarted ? (
  //           <div className="flex flex-col space-y-8 items-center justify-center">
  //             <div className="w-full">
  //               <h2 className="text-xl font-bold text-white mb-4">डिफिकल्टी लेव्हल निवडा:</h2>
  //               <div className="flex flex-wrap gap-4">
  //                 {['बिगिनर', 'मॉडरेट', 'एक्स्पर्ट'].map((level) => (
  //                   <button
  //                     key={level}
  //                     onClick={() => handleDifficultySelect(level)}
  //                     className={`px-6 py-3 rounded-xl font-medium ${
  //                       difficulty === level
  //                         ? 'bg-purple-600 text-white'
  //                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  //                     }`}
  //                   >
  //                     {level}
  //                   </button>
  //                 ))}
  //               </div>
  //             </div>
              
  //             {showLevelSelection && (
  //               <div className="w-full bg-white rounded-xl p-4 shadow-md">
  //                 <h2 className="text-xl font-bold text-gray-800 mb-4">लेव्हल निवडा:</h2>
  //                 {selectedLevel && (
  //                   <div className="text-center mb-3 text-pink-600 font-medium">
  //                     लेव्हल {selectedLevel} निवडले आहे. लगेच सुरू करण्यासाठी डबल-क्लिक करा किंवा खालील 'स्टार्ट प्रॅक्टिस' वर क्लिक करा.
  //                   </div>
  //                 )}
  //                 {loading ? (
  //                   <div className="flex justify-center py-8">
  //                     <svg className="animate-spin h-10 w-10 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //                     </svg>
  //                   </div>
  //                 ) : (
  //                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
  //                     {Array.from({length: 30}, (_, i) => i + 1).map((level) => {
  //                       // Find the current level's progress (if it exists)
  //                       const levelData = levelProgress.find(p => p.level === level) || { level, completed: false, stars: 0 };
                        
  //                       // Find the previous level's progress
  //                       const prevLevelData = level > 1 ? levelProgress.find(p => p.level === level-1) : { completed: true };
                        
  //                       // Make first three levels always unlocked
  //                       const isLocked = level > 3 && !prevLevelData?.completed;
  //                       const isCompleted = levelData.completed;
  //                       const stars = levelData.stars || 0;
                        
  //                       return (
  //                         <div 
  //                           key={`level-${level}`}
  //                           onClick={() => !isLocked && handleLevelSelect(level)}
  //                           onDoubleClick={() => !isLocked && handleLevelDoubleClick(level)}
  //                           className={`bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center relative ${!isLocked ? 'cursor-pointer hover:shadow-xl hover:bg-pink-50 transform hover:scale-105' : 'cursor-not-allowed opacity-80'} transition-all duration-200 ${
  //                             isCompleted ? 'border-2 border-green-500' : ''
  //                           } ${
  //                             selectedLevel === level ? 'ring-4 ring-pink-500 ring-opacity-70 transform scale-105' : ''
  //                           }`}
  //                         >
  //                           <div className="text-2xl font-bold text-pink-900 mb-2">लेव्हल {level}</div>
                            
  //                           {/* Star display */}
  //                           <div className="flex space-x-1">
  //                             {[...Array(3)].map((_, i) => (
  //                               <svg 
  //                                 key={i} 
  //                                 xmlns="http://www.w3.org/2000/svg" 
  //                                 viewBox="0 0 24 24" 
  //                                 className={`w-6 h-6 ${i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300 fill-current'}`}
  //                               >
  //                                 <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  //                               </svg>
  //                             ))}
  //                           </div>
                            
  //                           {/* Show locked indicator for locked levels */}
  //                           {isLocked && (
  //                             <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-60">
  //                               <div className="bg-black bg-opacity-70 p-2 rounded-full">
  //                                 <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  //                                   <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  //                                 </svg>
  //                               </div>
  //                             </div>
  //                           )}
  //                         </div>
  //                       );
  //                     })}
  //                   </div>
  //                 )}
  //               </div>
  //             )}
              
  //             <button
  //               onClick={fetchQuestions}
  //               disabled={!difficulty || !selectedLevel || loading}
  //               className={`px-6 py-3 rounded-lg font-medium ${
  //                 !difficulty || !selectedLevel || loading
  //                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
  //                   : 'bg-gradient-to-r from-pink-800 to-purple-900 text-white hover:opacity-90'
  //               }`}
  //             >
  //               {loading ? 'डेटा लोड केला जात आहे...' : 'सराव सुरू करा'}
  //             </button>
  //           </div>
  //         ) : testCompleted && !showEvaluation ? (
  //           <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
  //             <h1 className="text-3xl font-bold text-gray-800 mb-4">सराव पूर्ण झाला</h1>
  //             {loading ? (
  //               <div className="flex flex-col items-center justify-center py-8">
  //                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-4"></div>
  //                 <p className="text-lg text-gray-600">मॉडेलच्या आधारे तुमच्या प्रतिसादांचे मूल्यांकन केले जात आहे</p>
  //               </div>
  //             ) : (
  //               <>
  //                 <div className="w-32 h-32 mx-auto my-6">
  //                   <img src="/completed.svg" alt="Complete" className="w-full h-full" onError={(e) => {
  //                     e.target.src = "/logoo.png";
  //                   }} />
  //                 </div>
  //                 <p className="text-lg text-gray-600 mb-6">
  //                   ग्रेट जॉब! तुम्ही लिसनिंग प्रॅक्टिस सेशन पूर्ण केलं आहे.
  //                 </p>
  //                 <div className="flex justify-center space-x-4">
  //                   <button
  //                     onClick={backToLevelSelection}
  //                     className="bg-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-700"
  //                   >
  //                     लेव्हल्सकडे परत जा
  //                   </button>
  //                   <button
  //                     onClick={() => setShowEvaluation(true)}
  //                     className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
  //                   >
  //                     निकाल दाखवा
  //                   </button>
  //                 </div>
  //               </>
  //             )}
  //           </div>
  //         ) : testCompleted && showEvaluation ? (
  //           <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
  //             <h1 className="text-3xl font-bold text-gray-800 mb-4">तुमच्या सरावाचे निकाल</h1>
              
  //             <div className="mb-6 p-4 bg-purple-50 rounded-lg">
  //               <h2 className="text-xl font-bold text-purple-800 mb-2">एकूण कामगिरी</h2>
  //               <div className="flex justify-center mb-4">
  //                 {/* Star display for overall rating */}
  //                 <div className="flex space-x-2">
  //                   {[...Array(3)].map((_, i) => (
  //                     <svg 
  //                       key={i} 
  //                       xmlns="http://www.w3.org/2000/svg" 
  //                       viewBox="0 0 24 24" 
  //                       className={`w-10 h-10 ${i < (evaluationResult?.levelProgress?.stars || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300 fill-current'}`}
  //                     >
  //                       <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  //                     </svg>
  //                   ))}
  //                 </div>
  //               </div>
                
  //               <div className="text-lg text-gray-700 mb-4">
  //                 {evaluationResult?.evaluation?.feedback || "तुम्ही ही लेव्हल पूर्ण केली आहे. तुमचे स्किल्स सुधारण्यासाठी प्रॅक्टिस करत राहा!"}
  //               </div>
  //             </div>
              
  //             <div className="mb-8">
  //               <h2 className="text-xl font-bold text-gray-800 mb-4">लेव्हल {selectedLevel} पूर्ण झाली!</h2>
  //               <p className="text-lg text-gray-600">
  //                 तुम्हाला या लेव्हलसाठी {evaluationResult?.levelProgress?.stars || 1} स्टार मिळाले आहेत.
  //               </p>
  //               {evaluationResult?.levelProgress?.stars === 3 && (
  //                 <div className="mt-2 text-green-600 font-bold">परिपूर्ण स्कोर! उत्कृष्ट कामगिरी!</div>
  //               )}
  //             </div>
              
  //             <div className="flex justify-center space-x-4">
  //               <button
  //                 onClick={backToLevelSelection}
  //                 className="bg-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-700"
  //               >
  //                लेव्हल्सकडे परत जा
  //               </button>
  //               {selectedLevel < 30 && (
  //                 <button
  //                   onClick={() => {
  //                     setSelectedLevel(prev => Math.min(prev + 1, 30));
  //                     setTestCompleted(false);
  //                     setShowEvaluation(false);
  //                     setResponses([]);
  //                     fetchQuestions();
  //                   }}
  //                   className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
  //                 >
  //                   पुढील लेव्हल
  //                 </button>
  //               )}
  //             </div>
  //           </div>
  //         ) : (
  //           <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8">
  //             <div className="mb-6">
  //               <div className="flex justify-between items-center mb-4">
  //                 <span className="text-sm font-medium text-gray-600">
  //                   प्रश्न {currentIndex + 1} / {questions.length}
  //                 </span>
  //                 <span className="text-sm font-medium text-gray-600">
  //                   {difficulty} लेव्हल • {selectedLevel || ''}
  //                 </span>
  //               </div>
  //               <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
  //                 <div 
  //                   className="bg-pink-500 h-1 rounded-full" 
  //                   style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
  //                 ></div>
  //               </div>
  //             </div>

  //             <div className="mb-6">
  //               <h2 className="text-xl font-bold text-gray-800 mb-2">
  //                 {questions[currentIndex]?.instructions || "ऑडिओ ऐका आणि उत्तर द्या:"}
  //               </h2>
                
  //               {/* Audio content section */}
  //               <div className="p-4 bg-pink-50 rounded-lg text-pink-900 mb-4">
  //                 {questions[currentIndex]?.content ? (
  //                   <div>
  //                     {questions[currentIndex].content
  //                       .split('\n')
  //                       .map((line, i) => {
  //                         // Process any audio tags in the line
  //                         const audioMatch = line.match(/\[Audio:\s*([^\]]*)\]/g);
  //                         if (audioMatch) {
  //                           const cleanLine = line.replace(/\[Audio:\s*([^\]]*)\]/g, '');
  //                           return (
  //                             <p key={i} className={i > 0 ? 'mt-2' : ''}>
  //                               {cleanLine}
  //                               {audioMatch.map((match, j) => {
  //                                 const audioContent = match.replace(/\[Audio:\s*|\]/g, '');
  //                                 return (
  //                                   <em key={`audio-${j}`} className="ml-2 text-gray-600">
  //                                     (Audio: {audioContent})
  //                                   </em>
  //                                 );
  //                               })}
  //                             </p>
  //                           );
  //                         }
  //                         return (
  //                           <p key={i} className={i > 0 ? 'mt-2' : ''}>
  //                             {line}
  //                           </p>
  //                         );
  //                       })}
  //                   </div>
  //                 ) : "कंटेंट उपलब्ध नाही"}
  //               </div>
                
  //               {/* Question text - Added to display the actual question */}
  //               <div className="p-4 bg-indigo-50 rounded-lg text-indigo-900 border border-indigo-100">
  //                 <h3 className="font-bold mb-2">प्रश्न:</h3>
  //                 {questions[currentIndex]?.questionText && 
  //                  questions[currentIndex]?.questionText !== "[Question text missing]" ? (
  //                   <p className="font-medium">{questions[currentIndex].questionText}</p>
  //                 ) : questions[currentIndex]?.question ? (
  //                   <p className="font-medium">{questions[currentIndex].question}</p>
  //                 ) : questions[currentIndex]?.content ? (
  //                   <p className="font-medium">
  //                     {generateQuestionFromContent(questions[currentIndex].content)}
  //                   </p>
  //                 ) : (
  //                   <div>
  //                     <p className="text-red-500 font-medium mb-2">या सरावासाठी विशिष्ट प्रश्नाचा मजकूर उपलब्ध नाही..</p>
  //                     <p className="text-sm text-gray-700">
  //                       कृपया ऑडिओमध्ये तुम्ही ऐकलेले आणि वरील सूचनांच्या आधारे उत्तर द्या.
  //                     </p>
  //                   </div>
  //                 )}
  //               </div>
                
  //               {/* Audio player section */}
  //               <div className="mt-4 flex justify-center">
  //                 <button
  //                   onClick={playAudio}
  //                   disabled={audioPlayed}
  //                   className={`${
  //                     audioPlayed 
  //                       ? 'bg-gray-300 cursor-not-allowed' 
  //                       : 'bg-purple-600 hover:bg-purple-700'
  //                   } text-white px-4 py-2 rounded-lg flex items-center`}
  //                 >
  //                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-3.536 5 5 0 00-1.414-3.536M2.757 12a9 9 0 002.828-6.364A9 9 0 002.757 2.636" />
  //                   </svg>
  //                   {audioPlayed ? 'ऑडिओ प्ले झाला' : 'ऑडिओ प्ले करा'}
  //                 </button>
  //               </div>
                
  //               {/* Timer display */}
  //               {timeLeft > 0 && (
  //                 <div className="mt-4 flex justify-center">
  //                   <div className="w-16 h-16 flex items-center justify-center">
  //                     <CircularProgressbar
  //                       value={timeLeft}
  //                       maxValue={questions[currentIndex]?.timeLimit || 30}
  //                       text={`${timeLeft}s`}
  //                       styles={buildStyles({
  //                         textSize: '24px',
  //                         pathColor: timeLeft < 5 ? '#ef4444' : '#8b5cf6',
  //                         textColor: timeLeft < 5 ? '#ef4444' : '#1f2937',
  //                         trailColor: '#e5e7eb',
  //                       })}
  //                     />
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
              
  //             <div className="mb-6">
  //               {questions[currentIndex]?.type === 'multiple-choice' ? (
  //                 <div>
  //                   <h3 className="font-medium text-gray-700 mb-2">तुमचा पर्याय निवडा:</h3>
  //                   <div className="space-y-2">
  //                     {questions[currentIndex]?.options?.map((option, index) => (
  //                       <div 
  //                         key={index}
  //                         onClick={() => handleOptionSelect(option)}
  //                         className={`p-3 rounded-lg border cursor-pointer transition-colors ${
  //                           selectedOptions.includes(option)
  //                             ? 'bg-purple-100 border-purple-500 text-purple-700'
  //                             : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
  //                         }`}
  //                       >
  //                         {option}
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               ) : (
  //                 <div>
  //                   <h3 className="font-medium text-gray-700 mb-2">तुमचा प्रतिसाद:</h3>
  //                   <textarea
  //                     value={userResponse}
  //                     onChange={handleTextResponseChange}
  //                     onKeyDown={handleKeyDown}
  //                     onKeyUp={handleInputKeyUp}
  //                     placeholder="कृपया आपले उत्तर येथे टाइप करा."
  //                     className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
  //                     rows="4"
  //                     lang="mr"
  //                     dir="ltr"
  //                     spellCheck="false"
  //                     inputMode="text"
  //                     autoComplete="off"
  //                     data-transliterate="true"
  //                   ></textarea>
  //                 </div>
  //               )}
  //             </div>
              
  //             {feedback ? (
  //               <div className="mb-6">
  //                 <div className={`p-4 rounded-lg ${
  //                   score === 3 ? 'bg-green-50 text-green-800' :
  //                   score === 2 ? 'bg-blue-50 text-blue-800' :
  //                   'bg-yellow-50 text-yellow-800'
  //                 }`}>
  //                   <div className="flex items-center mb-2">
  //                     <h3 className="font-bold text-lg">फीडबॅक:</h3>
  //                     <div className="ml-2 flex">
  //                       {[...Array(3)].map((_, i) => (
  //                         <svg 
  //                           key={i} 
  //                           xmlns="http://www.w3.org/2000/svg" 
  //                           viewBox="0 0 24 24" 
  //                           className={`w-5 h-5 ${i < score ? 'text-yellow-500 fill-current' : 'text-gray-300 fill-current'}`}
  //                         >
  //                           <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  //                         </svg>
  //                       ))}
  //                     </div>
  //                   </div>
  //                   <p>{feedback}</p>
  //                 </div>
                  
  //                 <button
  //                   onClick={handleNext}
  //                   className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg"
  //                 >
  //                   {currentIndex < questions.length - 1 ? 'पुढचा प्रश्न' : 'प्रॅक्टिस पूर्ण करा'}
  //                 </button>
  //               </div>
  //             ) : (
  //               <button
  //                 onClick={submitAnswer}
  //                 disabled={
  //                   loading || 
  //                   (questions[currentIndex]?.type === 'multiple-choice' && selectedOptions.length === 0) ||
  //                   (questions[currentIndex]?.type === 'text-input' && !userResponse.trim()) ||
  //                   !audioPlayed
  //                 }
  //                 className={`w-full font-medium py-2 px-4 rounded-lg ${
  //                   loading || 
  //                   (questions[currentIndex]?.type === 'multiple-choice' && selectedOptions.length === 0) ||
  //                   (questions[currentIndex]?.type === 'text-input' && !userResponse.trim()) ||
  //                   !audioPlayed
  //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
  //                     : 'bg-purple-600 hover:bg-purple-700 text-white'
  //                 }`}
  //               >
  //                 {loading ? 'सबमिट करत आहे...' : 'उत्तर सबमिट करा'}
  //               </button>
  //             )}
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </>
  // );
return (
    <>
      <Head>
        <title>SHAKKTII AI - ऐकण्याचा सराव</title>
        <meta name="description" content="Improve your listening skills with AI-powered practice" />
      </Head>

      <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-8 px-4 sm:px-6 lg:px-8 font-sans text-white overflow-x-hidden">
        
        {/* Background Ambient Glows */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-10 animate-fade-in-down">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-3 drop-shadow-sm">
              ऐकण्याचा सराव (Listening Practice)
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              AI-आधारित संवादात्मक सरावांद्वारे तुमचे इंग्रजी ऐकण्याचे आणि समजण्याचे कौशल्य वाढवा.
            </p>
          </div>

          {!testStarted ? (
            <div className="flex flex-col space-y-8 animate-fade-in-up">
              
              {/* Difficulty Selection */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                  कठीण पातळी निवडा (Select Difficulty)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['बिगिनर', 'मॉडरेट', 'एक्स्पर्ट'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleDifficultySelect(level)}
                      className={`relative overflow-hidden px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-[1.02] ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-white/20'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {difficulty === level && (
                        <div className="absolute inset-0 bg-white/20 blur-lg"></div>
                      )}
                      <span className="relative z-10">{level}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Selection Grid */}
              {showLevelSelection && (
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                      लेव्हल निवडा (Select Level)
                    </h2>
                    {selectedLevel && (
                      <span className="text-pink-300 text-sm font-medium bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                        Level {selectedLevel} Selected
                      </span>
                    )}
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400">Loading Levels...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((level) => {
                        const levelData = levelProgress.find(p => p.level === level) || { level, completed: false, stars: 0 };
                        const prevLevelData = level > 1 ? levelProgress.find(p => p.level === level - 1) : { completed: true };
                        const isLocked = level > 3 && !prevLevelData?.completed;
                        const isCompleted = levelData.completed;
                        const stars = levelData.stars || 0;

                        return (
                          <div
                            key={`level-${level}`}
                            onClick={() => !isLocked && handleLevelSelect(level)}
                            onDoubleClick={() => !isLocked && handleLevelDoubleClick(level)}
                            className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                              isLocked 
                                ? 'bg-black/20 border border-white/5 cursor-not-allowed' 
                                : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 cursor-pointer hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-1'
                            } ${
                              selectedLevel === level ? 'ring-2 ring-pink-500 bg-white/15' : ''
                            } ${
                              isCompleted ? 'border-emerald-500/30' : ''
                            }`}
                          >
                            {/* Level Number */}
                            <span className={`text-2xl font-bold mb-2 ${isLocked ? 'text-gray-600' : 'text-white group-hover:text-pink-200'}`}>
                              {level}
                            </span>

                            {/* Stars or Lock Icon */}
                            {isLocked ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            ) : (
                              <div className="flex gap-0.5">
                                {[...Array(3)].map((_, i) => (
                                  <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current drop-shadow-md' : 'text-gray-600 fill-current'}`}
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                ))}
                              </div>
                            )}

                            {/* Completion Badge */}
                            {isCompleted && (
                              <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={fetchQuestions}
                disabled={!difficulty || !selectedLevel || loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                  !difficulty || !selectedLevel || loading
                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white hover:shadow-purple-500/40 active:scale-95'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    लोड करत आहे...
                  </span>
                ) : (
                  'सराव सुरू करा (Start Practice)'
                )}
              </button>
            </div>
          ) : testCompleted && !showEvaluation ? (
            
            // --- Test Completed Screen ---
            <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center animate-zoom-in">
              <h1 className="text-3xl font-bold text-white mb-6">सराव पूर्ण झाला!</h1>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-pink-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-lg text-gray-300 animate-pulse">AI तुमच्या उत्तरांचे विश्लेषण करत आहे...</p>
                </div>
              ) : (
                <>
                  <div className="w-40 h-40 mx-auto mb-8 bg-white/5 rounded-full p-6 border border-white/10 shadow-inner">
                    <img 
                      src="/completed.svg" 
                      alt="Completed" 
                      className="w-full h-full object-contain drop-shadow-lg"
                      onError={(e) => { e.target.src = "/logoo.png"; }} 
                    />
                  </div>
                  <p className="text-xl text-gray-200 mb-8 font-light">
                    ग्रेट जॉब! तुम्ही लिसनिंग प्रॅक्टिस सेशन यशस्वीरित्या पूर्ण केले आहे.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={backToLevelSelection}
                      className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10"
                    >
                      लेव्हल्सकडे परत जा
                    </button>
                    <button
                      onClick={() => setShowEvaluation(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-pink-500/30 transition-transform hover:-translate-y-0.5"
                    >
                      निकाल पहा (View Results)
                    </button>
                  </div>
                </>
              )}
            </div>

          ) : testCompleted && showEvaluation ? (
            
            // --- Evaluation Screen ---
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center animate-fade-in-up">
              <div className="inline-block px-4 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-sm font-bold mb-4">
                LEVEL {selectedLevel} REPORT
              </div>
              <h1 className="text-3xl font-bold text-white mb-8">तुमच्या सरावाचे निकाल</h1>

              <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-white/5">
                <h2 className="text-lg font-semibold text-gray-300 mb-4 uppercase tracking-wider">एकूण कामगिरी</h2>
                
                {/* Huge Star Display */}
                <div className="flex justify-center gap-3 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={`w-16 h-16 filter drop-shadow-lg transition-all duration-500 ${
                        i < (evaluationResult?.levelProgress?.stars || 0) 
                          ? 'text-yellow-400 fill-current scale-110' 
                          : 'text-gray-700 fill-current'
                      }`}
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-gray-200 italic leading-relaxed border border-white/5">
                  "{evaluationResult?.evaluation?.feedback || "उत्तम प्रयत्न! सातत्याने सराव केल्यास तुमचे कौशल्य नक्कीच सुधारेल."}"
                </div>
              </div>

              <div className="mb-8">
                {evaluationResult?.levelProgress?.stars === 3 && (
                  <div className="text-emerald-400 font-bold text-lg animate-bounce">
                    🎉 परिपूर्ण स्कोर! उत्कृष्ट कामगिरी! 🎉
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={backToLevelSelection}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10 transition-colors"
                >
                  लेव्हल्स यादी
                </button>
                {selectedLevel < 30 && (
                  <button
                    onClick={() => {
                      setSelectedLevel(prev => Math.min(prev + 1, 30));
                      setTestCompleted(false);
                      setShowEvaluation(false);
                      setResponses([]);
                      fetchQuestions();
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg hover:shadow-emerald-500/30 transition-transform hover:-translate-y-0.5"
                  >
                    पुढील लेव्हल खेळा &rarr;
                  </button>
                )}
              </div>
            </div>

          ) : (
            
            // --- Active Test Interface ---
            <div className="max-w-3xl mx-auto animate-fade-in">
              
              {/* Progress & Info Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-4 px-2">
                <span className="text-gray-400 text-sm font-bold tracking-wide">
                  QUESTION {currentIndex + 1} <span className="text-gray-600">/ {questions.length}</span>
                </span>
                <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full border border-white/10 text-pink-300 mt-2 sm:mt-0">
                  {difficulty} • Level {selectedLevel}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-8 overflow-hidden backdrop-blur-sm">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                
                {/* Instruction */}
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">
                  {questions[currentIndex]?.instructions || "ऑडिओ काळजीपूर्वक ऐका आणि खालील प्रश्नाचे उत्तर द्या:"}
                </h2>

                {/* Content / Audio Transcript (Hidden or Collapsible usually, but displayed here per original logic) */}
                <div className="bg-black/20 rounded-2xl p-5 mb-6 border border-white/5 text-gray-300 text-sm leading-relaxed">
                  {questions[currentIndex]?.content ? (
                    <div>
                      {questions[currentIndex].content.split('\n').map((line, i) => {
                        const audioMatch = line.match(/\[Audio:\s*([^\]]*)\]/g);
                        if (audioMatch) {
                          const cleanLine = line.replace(/\[Audio:\s*([^\]]*)\]/g, '');
                          return (
                            <p key={i} className={i > 0 ? 'mt-3' : ''}>
                              {cleanLine}
                              {audioMatch.map((match, j) => {
                                const audioContent = match.replace(/\[Audio:\s*|\]/g, '');
                                return (
                                  <span key={`audio-${j}`} className="inline-flex items-center ml-2 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs italic border border-indigo-500/30">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path></svg>
                                    Audio: {audioContent}
                                  </span>
                                );
                              })}
                            </p>
                          );
                        }
                        return <p key={i} className={i > 0 ? 'mt-3' : ''}>{line}</p>;
                      })}
                    </div>
                  ) : "कंटेंट उपलब्ध नाही (Content Unavailable)"}
                </div>

                {/* Question Box */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl p-5 mb-8 border-l-4 border-indigo-500 shadow-md">
                  <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">प्रश्न (Question)</h3>
                  {questions[currentIndex]?.questionText && questions[currentIndex]?.questionText !== "[Question text missing]" ? (
                    <p className="text-lg font-medium text-white">{questions[currentIndex].questionText}</p>
                  ) : questions[currentIndex]?.question ? (
                    <p className="text-lg font-medium text-white">{questions[currentIndex].question}</p>
                  ) : questions[currentIndex]?.content ? (
                     <p className="text-lg font-medium text-white">{generateQuestionFromContent(questions[currentIndex].content)}</p>
                  ) : (
                    <div className="text-red-300 italic">प्रश्न उपलब्ध नाही. ऑडिओ ऐकून उत्तर द्या.</div>
                  )}
                </div>

                {/* Audio Player & Timer Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 bg-white/5 rounded-2xl p-4 border border-white/5">
                  <button
                    onClick={playAudio}
                    disabled={audioPlayed}
                    className={`flex-1 w-full sm:w-auto flex items-center justify-center py-3 px-6 rounded-xl font-bold transition-all ${
                      audioPlayed 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
                        : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02]'
                    }`}
                  >
                    {audioPlayed ? (
                       <>
                         <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         प्ले झाले (Played)
                       </>
                    ) : (
                       <>
                         <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                         ऑडिओ प्ले करा (Play Audio)
                       </>
                    )}
                  </button>

                  {/* Circular Timer */}
                  {timeLeft > 0 && (
                    <div className="w-14 h-14 flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                      <CircularProgressbar
                        value={timeLeft}
                        maxValue={questions[currentIndex]?.timeLimit || 30}
                        text={`${timeLeft}s`}
                        styles={buildStyles({
                          textSize: '28px',
                          pathColor: timeLeft < 5 ? '#ef4444' : '#c084fc',
                          textColor: '#fff',
                          trailColor: 'transparent',
                          pathTransitionDuration: 0.5,
                        })}
                      />
                    </div>
                  )}
                </div>

                {/* Answer Section */}
                <div className="mb-8">
                  {questions[currentIndex]?.type === 'multiple-choice' ? (
                    <div>
                      <h3 className="text-gray-400 text-sm font-bold uppercase mb-3 ml-1">पर्याय निवडा (Select Option):</h3>
                      <div className="grid gap-3">
                        {questions[currentIndex]?.options?.map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center ${
                              selectedOptions.includes(option)
                                ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                : 'bg-black/20 border-transparent text-gray-300 hover:bg-black/40 hover:border-white/10'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${selectedOptions.includes(option) ? 'border-purple-400 bg-purple-400' : 'border-gray-500'}`}>
                              {selectedOptions.includes(option) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="font-medium text-lg">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-gray-400 text-sm font-bold uppercase mb-3 ml-1">उत्तर लिहा (Type Answer):</h3>
                      <div className="relative">
                        <textarea
                          value={userResponse}
                          onChange={handleTextResponseChange}
                          onKeyDown={handleKeyDown}
                          onKeyUp={handleInputKeyUp}
                          placeholder="येथे टाइप करा..."
                          className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-lg min-h-[120px]"
                          lang="mr"
                          spellCheck="false"
                        ></textarea>
                        <div className="absolute bottom-3 right-3 text-xs text-gray-500">Marathi/English Input</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feedback & Actions */}
                {feedback ? (
                  <div className="animate-fade-in-up">
                    <div className={`p-5 rounded-xl border mb-6 ${
                      score === 3 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' :
                      score === 2 ? 'bg-blue-500/10 border-blue-500/30 text-blue-200' :
                      'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold uppercase tracking-wider text-xs opacity-70">AI Feedback</span>
                        <div className="flex">
                          {[...Array(3)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-4 h-4 ${i < score ? 'fill-current' : 'fill-white/10'}`}>
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-base font-medium leading-relaxed">{feedback}</p>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full py-4 rounded-xl bg-white text-purple-900 font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      {currentIndex < questions.length - 1 ? 'पुढचा प्रश्न (Next Question) &rarr;' : 'प्रॅक्टिस पूर्ण करा (Finish) &rarr;'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={submitAnswer}
                    disabled={
                      loading ||
                      (questions[currentIndex]?.type === 'multiple-choice' && selectedOptions.length === 0) ||
                      (questions[currentIndex]?.type === 'text-input' && !userResponse.trim()) ||
                      !audioPlayed
                    }
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
                      loading || (questions[currentIndex]?.type === 'multiple-choice' && selectedOptions.length === 0) || (questions[currentIndex]?.type === 'text-input' && !userResponse.trim()) || !audioPlayed
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-purple-500/40'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        तपासत आहे...
                      </span>
                    ) : (
                      'उत्तर सबमिट करा (Submit Answer)'
                    )}
                  </button>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ListeningPractice;
