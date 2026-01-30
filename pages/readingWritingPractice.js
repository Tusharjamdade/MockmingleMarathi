import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { processWordByWordTransliteration, handleSpecialKeys, handleKeyUp } from '../utils/transliterator';

function ReadingWritingPractice() {
  const router = useRouter();
  const [mode, setMode] = useState(''); // 'reading' or 'writing'
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [userResponse, setUserResponse] = useState('');
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
  const [shiftTransliterationPending, setShiftTransliterationPending] = useState(false);

  const timerRef = useRef(null);
  const audioRef = useRef(null);



  useEffect(() => {
    // Check if user is authenticated
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      // Show mode selection initially
      setShowLevelSelection(false);
    }

    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Fetch level progress for the selected difficulty and mode
  const fetchLevelProgress = async (selectedDifficulty) => {
    if (!selectedDifficulty || !mode) return;

    setLoading(true);
    try {
      // Initialize default progress for all 30 levels
      const defaultProgress = Array.from({ length: 30 }, (_, i) => ({
        level: i + 1,
        stars: 0,
        completed: i === 0, // Only level 1 is unlocked by default
        questionsCompleted: 0
      }));

      // Get user ID
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001';

      // Fetch progress data from API
      const response = await fetch(`/api/getPracticeProgress?skillArea=${mode === 'reading' ? 'Reading' : 'Writing'}&difficulty=${selectedDifficulty}&userId=${userId}`);
      const data = await response.json();

      if (response.ok && data.progress) {
        // Find progress for this specific skill area and difficulty
        const skillProgress = data.progress.find(p =>
          p.skillArea === (mode === 'reading' ? 'Reading' : 'Writing') && p.difficulty === selectedDifficulty
        );

        if (skillProgress && skillProgress.levelProgress && skillProgress.levelProgress.length > 0) {
          // Merge the API data with default data to ensure we have all 30 levels
          const mergedProgress = defaultProgress.map(defaultLevel => {
            const apiLevel = skillProgress.levelProgress.find(l => l.level === defaultLevel.level);
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
        completed: i === 0, // Only level 1 is unlocked by default
        questionsCompleted: 0 // No initial progress shown
      }));
      setLevelProgress(emptyProgress);
    } finally {
      setLoading(false);
    }
  };

  // Handle difficulty selection
  const handleDifficultySelect = async (level) => {
    setDifficulty(level);
    // Fetch level progress and immediately show level selection
    await fetchLevelProgress(level);
    setShowLevelSelection(true);
    // Skip the second difficulty screen
    setSelectedLevel(1); // Default to level 1
  };

  // Handle level selection
  const handleLevelSelect = (level) => {
    // Get the level object
    const levelObj = levelProgress.find(p => p.level === level);

    // Determine if the level is locked using the same logic as the UI
    // A level is locked if it's not level 1, it's not completed, and it's not exactly the next level after the highest completed level
    const highestCompletedLevel = Math.max(...levelProgress.filter(l => l.completed).map(l => l.level), 0);
    const isLocked = level !== 1 &&
      !levelObj?.completed &&
      level !== highestCompletedLevel + 1;

    // Only allow selecting levels that are not locked
    if (!isLocked && levelObj) {
      setSelectedLevel(level);

      // Reset all user interaction states to prevent old feedback from showing
      setUserResponse('');
      setSelectedOptions([]);
      setFeedback('');
      setScore(0);
      setResponses([]);

      // Keep current test state paused until user clicks Start Practice
      setTestStarted(false);

      // If it's a double-click or if it's a single click on a level that was already selected, start the practice
      if (selectedLevel === level) {
        fetchQuestions();
      }
    } else {
      alert('हा लेव्हल लॉक आहे. अनलॉक करण्यासाठी मागील लेव्हल्स पूर्ण करा.');
    }
  };

  // Handle level double click to immediately start practice
  const handleLevelDoubleClick = (level) => {
    // Get the level object
    const levelObj = levelProgress.find(p => p.level === level);

    // Determine if the level is locked using the same logic as the UI
    // A level is locked if it's not level 1, it's not completed, and it's not exactly the next level after the highest completed level
    const highestCompletedLevel = Math.max(...levelProgress.filter(l => l.completed).map(l => l.level), 0);
    const isLocked = level !== 1 &&
      !levelObj?.completed &&
      level !== highestCompletedLevel + 1;

    // Only proceed if the level is not locked
    if (!isLocked && levelObj) {
      setSelectedLevel(level);
      // Reset states
      setUserResponse('');
      setSelectedOptions([]);
      setFeedback('');
      setScore(0);
      setResponses([]);
      // Start practice
      fetchQuestions();
    } else {
      alert('हा लेव्हल लॉक आहे. अनलॉक करण्यासाठी मागील लेव्हल्स पूर्ण करा.');
    }
  };

  // Back to level selection
  const backToLevelSelection = async () => {
    // Reset all test-related states
    setTestStarted(false);
    setTestCompleted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setShowEvaluation(false);
    setResponses([]);

    // Set a loading state while we refresh the level data
    setLoading(true);

    try {
      // Get user ID for API request
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001';

      // Fetch the latest level progress from the API
      const response = await fetch('/api/getUserProgress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          skillArea: mode === 'reading' ? 'Reading' : 'Writing',
          difficulty
        })
      });

      if (response.ok) {
        const skillProgress = await response.json();

        // Initialize default progress for all 30 levels
        const defaultProgress = Array.from({ length: 30 }, (_, i) => ({
          level: i + 1,
          stars: 0,
          completed: i === 0, // Only level 1 is unlocked by default
          questionsCompleted: 0
        }));

        // Merge API data with default data
        if (skillProgress && skillProgress.levelProgress && skillProgress.levelProgress.length > 0) {
          // First, create a merged progress array
          const mergedProgress = defaultProgress.map(defaultLevel => {
            const apiLevel = skillProgress.levelProgress.find(l => l.level === defaultLevel.level);
            return apiLevel || defaultLevel;
          });

          // Then, ensure only one level after the highest completed level is unlocked
          const completedLevels = mergedProgress.filter(level => level.completed);
          const highestCompletedLevel = completedLevels.length > 0 ?
            Math.max(...completedLevels.map(l => l.level)) : 0;

          // Update the merged progress to ensure only the next level is unlocked
          const fixedProgress = mergedProgress.map(level => {
            // If it's level 1, it's always unlocked
            if (level.level === 1) return level;

            // If it's already completed, keep it that way
            if (level.completed) return level;

            // If it's exactly the next level after highest completed, unlock it
            if (level.level === highestCompletedLevel + 1) {
              return { ...level, completed: true };
            }

            // Otherwise, it should be locked
            return { ...level, completed: false };
          });

          setLevelProgress(fixedProgress);
        }
      }
    } catch (error) {
      console.error('Error refreshing level progress:', error);
    } finally {
      setLoading(false);
      setShowLevelSelection(true);
    }
  };

  const fetchQuestions = async () => {
    if (!mode || !difficulty || !selectedLevel) return;

    setLoading(true);
    try {
      console.log(`${mode}" मोडमध्ये "${difficulty}" लेव्हल ${selectedLevel} साठी प्रॅक्टिस प्रश्न लोड करत आहे.`);

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
          skillArea: mode === 'वाचन सराव' ? 'वाचन सराव' : 'लेखन सराव',
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
          alert("तुमचे सेशन संपले आहे. कृपया पुन्हा लॉग इन करा.");
          router.push("/login");
          return;
        }
        throw new Error(data.error || 'Failed to fetch questions');
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions received');
      }

      // Add default properties to questions if not present and ensure question text is properly set
      const processedQuestions = data.questions.map(question => {
        // Extract actual question text, filtering out any text that looks like instructions or card IDs
        let questionText = question.questionText || question.question;

        // Filter out questionText that contains card ID patterns or generic instructions
        if (questionText && (
          questionText.match(/card\s+[a-zA-Z]+-[a-zA-Z]+-\d+-\d+/i) ||
          questionText.match(/read the (passage|story|text) and answer/i) ||
          questionText.length > 100 // Question text shouldn't be too long
        )) {
          // This is likely not a real question but instructions or card ID
          questionText = null;
        }

        // If no valid question text, generate a default question based on content
        if (!questionText && question.content) {
          // Extract a subject from the content if possible
          const firstSentence = question.content.split('.')[0];
          const subjects = firstSentence.match(/([A-Z][a-z]+)/) || ['Someone'];
          const subject = subjects[0];
          // Create a generic but reasonable question
          questionText = `What did ${subject} do in this story?`;
        }

        return {
          ...question,
          // Ensure we always have a questionText property that is an actual question
          questionText: questionText || 'What happens in this passage?',
          // Default timeLimit
          timeLimit: question.timeLimit || 60, // Default to 60 seconds if not specified
          // Ensure we have content
          content: question.content || question.passage || question.text || 'Read the content carefully and answer the question',
          // Default instructions
          instructions: question.instructions || 'Read the passage and answer the question.'
        };
      });

      // Set the processed questions
      setQuestions(processedQuestions);
      setTestStarted(true);
      setCurrentIndex(0);
      setResponses([]); // Clear any previous responses
      setShowLevelSelection(false); // Hide level selection

      // Reset all user interaction states to prevent old feedback from showing
      setUserResponse('');
      setSelectedOptions([]);
      setFeedback(''); // Clear any existing feedback
      setScore(0); // Reset score

      // Only start timer if we have valid questions
      if (processedQuestions.length > 0) {
        // Slight delay to ensure state is updated
        setTimeout(() => {
          startTimer();
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert(`${mode} प्रॅक्टिस प्रश्न लोड करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.`);
      // Reset to level selection on failure
      backToLevelSelection();
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    // Safety check to make sure questions and currentIndex are valid
    if (!questions) {
      console.log('No valid question found to start timer1');
      return;
    }
    if (!questions.length) {
      console.log('No valid question found to start timer2');
      return;
    }
    if (currentIndex >= questions.length) {
      console.log('No valid question found to start timer3');
      return;
    }

    const currentQuestion = questions[currentIndex];
    // Safety check for timeLimit property
    const timeLimit = currentQuestion?.timeLimit || 60; // Default to 60 seconds if not specified

    setTimeLeft(timeLimit);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
  // ✅ Ensure timer starts for each question, including first one
  useEffect(() => {
    startTimer();

    // Cleanup timer when component unmounts or question changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, questions]);

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

  // Handle keyboard events for Marathi transliteration
  const handleKeyDown = (e) => {
    handleSpecialKeys(e, async () => {
      // When Shift key is pressed, force transliteration of current text
      try {
        const transliterated = await processWordByWordTransliteration(userResponse, userResponse, true);
        setUserResponse(transliterated);
      } catch (error) {
        console.error('Transliteration error on Shift press:', error);
      }
    });
  };

  // Handle key up events to reset transliteration flags
  const handleKeyUpEvent = (e) => {
    handleKeyUp(e);
  };

  // Enhanced text response handler with transliteration
  const handleTextResponseChange = async (e) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart;

    try {
      // Use the transliterator utility with space and shift triggers
      const forceTransliterate = false; // Let the utility handle triggers internally
      const transliterated = await processWordByWordTransliteration(inputValue, userResponse, forceTransliterate);

      setUserResponse(transliterated);

      // Preserve cursor position after transliteration
      setTimeout(() => {
        if (e.target) {
          const lengthDifference = transliterated.length - inputValue.length;
          const newPosition = cursorPosition + lengthDifference;
          e.target.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    } catch (error) {
      console.error('Transliteration error:', error);
      setUserResponse(inputValue);
    }
  };

  // Function to count words in a string
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const submitResponse = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const currentQuestion = questions[currentIndex];
    const responseToSubmit = selectedOptions.length > 0
      ? selectedOptions.join(', ')
      : userResponse;

    if (!responseToSubmit.trim()) {
      alert("सबमिट करण्यापूर्वी कृपया उत्तर द्या.");
      return;
    }

    // Check minimum word count for writing practice
    if (mode === 'writing' && !isMultipleChoice() && countWords(responseToSubmit) < 50) {
      alert("तुमचे उत्तर किमान ५० शब्दांचे असावे. कृपया अधिक लिहा.");
      return;
    }

    setLoading(true);
    try {
      // Get userId from localStorage
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001';

      // Get or generate a valid cardId
      let cardId = currentQuestion?.cardId;
      if (!cardId) {
        // Generate a simple ID if none exists
        cardId = `${mode}-${difficulty}-level${selectedLevel}-q${currentIndex}`;
      }

      // Generate a test ID if one doesn't exist
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
          timeSpent: (currentQuestion?.timeLimit || 60) - (timeLeft || 0), // Add safety check
          userId,
          level: selectedLevel, // Include the level number
          difficulty: difficulty, // Include the difficulty
          skillArea: mode === 'reading' ? 'Reading' : 'Writing' // Explicitly specify skill area based on mode
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Check if this is an MCQ question
        const isMCQ = currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0;

        // For MCQ questions, if the answer is correct, override Claude's feedback with more appropriate feedback
        if (isMCQ && currentQuestion.expectedResponse && responseToSubmit.includes(currentQuestion.expectedResponse)) {
          const mcqFeedback = "छान! तुम्ही बरोबर उत्तर निवडले आहे.";
          setFeedback(mcqFeedback);
          setScore(3); // Give full score for correct MCQ answer
        } else if (isMCQ) {
          // If MCQ but incorrect answer
          const mcqFeedback = "तुमचे उत्तर बरोबर नाही. कृपया पुन्हा प्रयत्न करा आणि परिच्छेद काळजीपूर्वक वाचा.";
          setFeedback(mcqFeedback);
          setScore(data.score || 1);
        } else {
          // For non-MCQ questions, use Claude's feedback
          setFeedback(data.feedback);
          setScore(data.score || 0);
        }

        // Store response data for level evaluation
        // Extract expected response from question if available
        let expectedResponse = '';
        if (currentQuestion.expectedResponse) {
          expectedResponse = currentQuestion.expectedResponse;
        } else if (currentQuestion.answer) {
          // Some questions may have an 'answer' field instead
          expectedResponse = currentQuestion.answer;
        }

        console.log('Storing response with expected response:', expectedResponse);

        // Calculate correct score for storing in responses
        let calculatedScore = data.score || 1;
        if (isMCQ && expectedResponse && responseToSubmit.includes(expectedResponse)) {
          calculatedScore = 3; // Full stars for correct MCQ answer
        }

        setResponses(prevResponses => [...prevResponses, {
          cardId: currentQuestion.cardId || cardId,
          question: currentQuestion.instructions || currentQuestion.content,
          expectedResponse: expectedResponse,
          userResponse: responseToSubmit,
          score: calculatedScore,
          timeSpent: currentQuestion.timeLimit - timeLeft,
          completedAt: new Date()
        }]);
      } else {
        throw new Error('Error submitting answer');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('त्रुटी आली आहे. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      // Move to next question
      setCurrentIndex(currentIndex + 1);
      setUserResponse('');
      setSelectedOptions([]);
      setFeedback('');
      setScore(0);
      setTimeLeft(0);

      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Start timer for next question
      startTimer();
    } else {
      // Complete the test
      setTestCompleted(true);
      // Evaluate level completion with Claude AI
      evaluateLevelCompletion();
    }
  };

  // Function to evaluate responses with Claude AI
  const evaluateWithClaude = async () => {
    // Evaluate responses with Claude AI
    // This is a placeholder for actual evaluation logic
    console.log('Evaluating responses with Model');
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
            feedback: "मूल्यमापनासाठी कोणतेही उत्तर नोंदवले गेले नाहीत. आम्ही डिफॉल्ट रेटिंग दिली आहे.",
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
          skillArea: mode === 'reading' ? 'Reading' : 'Writing',
          difficulty,
          level: levelToEvaluate, // Use the validated level value
          responses
        })
      });

      try {
        if (response.ok) {
          const result = await response.json();
          console.log('API returned evaluation result:', result);
          // Ensure we're using the correct star rating from the API
          if (result && result.levelProgress && typeof result.levelProgress.stars === 'number') {
            console.log('Using star rating from API:', result.levelProgress.stars);
          }
          setEvaluationResult(result);
          setShowEvaluation(true);

          // Update local level progress data to show updated stars and unlock next level
          if (result.levelProgress) {
            setLevelProgress(prev => {
              const updatedProgress = [...prev];
              const levelIndex = updatedProgress.findIndex(p => p.level === selectedLevel);

              if (levelIndex > -1) {
                // Update current level as completed
                updatedProgress[levelIndex] = {
                  ...updatedProgress[levelIndex],
                  stars: result.levelProgress.stars,
                  completed: true
                };

                // Unlock only the next level when a level is completed
                if (selectedLevel < 30) {
                  const nextLevelIndex = updatedProgress.findIndex(p => p.level === selectedLevel + 1);
                  if (nextLevelIndex > -1) {
                    // Unlock only the next level
                    updatedProgress[nextLevelIndex] = {
                      ...updatedProgress[nextLevelIndex],
                      completed: true,  // Mark as available
                      locked: false     // Ensure it's not locked
                    };
                  }
                }
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
              feedback: "आम्ही तुमचे प्रतिसाद पूर्णपणे मूल्यमापन करू शकलो नाही, पण तुम्ही हा लेव्हल पूर्ण केला आहे.",
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
            feedback: "आम्ही तुमच्या लेव्हलचे मूल्यमापन प्रक्रिया करू शकलो नाही, पण तुमची प्रगती नोंदवली आहे.",
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
          feedback: "सर्व्हरशी कनेक्ट होण्यात अडचण आली, पण तुमचा प्रॅक्टिस सेशन नोंदवला गेला आहे.",
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
    setQuestions([]);
    setCurrentIndex(0);
    setUserResponse('');
    setSelectedOptions([]);
    setFeedback('');
    setScore(0);
    setDifficulty('');
    setMode('');
    setTestCompleted(false);
  };

  // Determine if the current question is multiple choice or text input
  const isMultipleChoice = () => {
    // For writing practice, always use text input regardless of options
    if (mode === 'writing') return false;

    // For reading practice, check if options exist
    const currentQuestion = questions[currentIndex];
    return currentQuestion && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0;
  };

  // Format time function
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // return (
  //   <>
  //     <Head>
  //       <title>SHAKKTII AI - वाचन आणि लेखन सराव</title>
  //     </Head>
  //     <div className="min-h-screen bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/BG.jpg')" }}>
  //       <div className="absolute top-4 left-4">
  //         <button 
  //           onClick={() => router.push('/practices')} 
  //           className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
  //         >
  //           <img src="/2.svg" alt="Back" className="w-8 h-8 mr-2" />
  //           <span className="text-lg font-medium">मागे जा</span>
  //         </button>
  //       </div>

  //       <div className="absolute top-4 right-4">
  //         <div className="rounded-full flex items-center justify-center">
  //           <img src="/logoo.png" alt="Logo" className="w-16 h-16" />
  //         </div>
  //       </div>

  //       <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-12">
  //         {!mode ? (
  //           <div className="p-8 text-center">
  //             <h1 className="text-3xl font-bold text-gray-800 mb-4">वाचन आणि लेखन सराव</h1>
  //             <p className="text-lg text-gray-600 mb-8">
  //               तुम्हाला कोणती कौशल्ये प्रॅक्टिस करायची आहेत ती निवडा.
  //             </p>

  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //               <div 
  //                 onClick={() => setMode('reading')}
  //                 className="p-6 border-2 border-purple-200 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
  //               >
  //                 <div className="h-24 flex items-center justify-center">
  //                   <img 
  //                     src="/reading.png" 
  //                     alt="Reading" 
  //                     className="h-20 w-20 object-contain"
  //                     onError={(e) => {
  //                       e.target.src = "/logoo.png";
  //                     }}  
  //                   />
  //                 </div>
  //                 <h3 className="text-xl font-bold text-purple-900 mt-4">वाचन सराव</h3>
  //                 <p className="text-gray-600 mt-2">
  //                   आकर्षक उतारे आणि लेखांद्वारे तुमचे वाचन आकलन सुधारा.
  //                 </p>
  //               </div>

  //               <div 
  //                 onClick={() => setMode('writing')}
  //                 className="p-6 border-2 border-purple-200 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
  //               >
  //                 <div className="h-24 flex items-center justify-center">
  //                   <img 
  //                     src="/writing.png" 
  //                     alt="Writing" 
  //                     className="h-20 w-20 object-contain"
  //                     onError={(e) => {
  //                       e.target.src = "/logoo.png";
  //                     }}
  //                   />
  //                 </div>
  //                 <h3 className="text-xl font-bold text-purple-900 mt-4">लेखन सराव</h3>
  //                 <p className="text-gray-600 mt-2">
  //                   मार्गदर्शित लेखन सरावांद्वारे तुमची लेखन कौशल्ये विकसित करा.
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         ) : mode && !difficulty ? (  
  //           <div className="p-8 text-center">  
  //             <h1 className="text-3xl font-bold text-gray-800 mb-4">  
  //               {mode === 'reading' ? 'वाचन सराव' : 'लेखन सराव'}  
  //             </h1>  
  //             <p className="text-lg text-gray-600 mb-6">  
  //               सराव सुरू करण्यासाठी एक लेवल निवडा.  
  //             </p>  

  //             <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">  
  //               {['बिगिनर', 'मॉडरेट', 'एक्स्पर्ट'].map((level) => (  
  //                 <button  
  //                   key={level}  
  //                   onClick={() => handleDifficultySelect(level)}  
  //                   className={`p-4 rounded-lg font-medium border-2 transition-colors ${  
  //                     difficulty === level  
  //                       ? 'border-purple-500 bg-purple-50 text-purple-800'  
  //                       : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'  
  //                   }`}  
  //                 >  
  //                   {level}  
  //                 </button>  
  //               ))}  
  //             </div>  

  //             <button  
  //               onClick={() => setMode('')}  
  //               className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"  
  //             >  
  //               मागे जा  
  //             </button>  
  //           </div>  
  //         ) : showLevelSelection ? (  
  //           <div className="p-8 text-center">  
  //             <h1 className="text-3xl font-bold text-gray-800 mb-4">  
  //               {mode === 'reading' ? 'वाचन सराव' : 'लेखनाचा सराव'} - {difficulty}  
  //             </h1>  
  //             <p className="text-lg text-gray-600 mb-6">  
  //               सराव सुरू करण्यासाठी एक लेवल निवडा  
  //             </p>  

  //             {loading ? (  
  //               <div className="flex justify-center items-center py-12">  
  //                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>  
  //               </div>  
  //             ) : (  
  //               <div className="mb-8">  
  //                 {levelProgress && (  
  //                   <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">  
  //                     {levelProgress.map((levelData) => {  
  //                       const isSelected = selectedLevel === levelData.level;  
  //                       // A level is locked if it's not level 1, it's not completed, and it's not exactly the next level after the highest completed level
  //                       // First, find the highest completed level
  //                       const highestCompletedLevel = Math.max(...levelProgress.filter(l => l.completed).map(l => l.level), 0);

  //                       // A level is locked if: it's not level 1, it's not already completed, and it's not exactly the next level
  //                       const isLocked = levelData.level !== 1 && 
  //                                    !levelData.completed && 
  //                                    levelData.level !== highestCompletedLevel + 1;

  //                       return (  
  //                         <div  
  //                           key={levelData.level}  
  //                           onClick={() => !isLocked && handleLevelSelect(levelData.level)}  
  //                           onDoubleClick={() => !isLocked && handleLevelDoubleClick(levelData.level)}  
  //                           className={`relative p-4 rounded-xl cursor-pointer transition-all transform ${  
  //                             isLocked ? 'bg-gray-200 cursor-not-allowed' :  
  //                             isSelected ? 'bg-purple-100 border-2 border-purple-500 shadow-md scale-105' :  
  //                             'bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50'  
  //                           } flex flex-col items-center justify-center`}  
  //                         >  
  //                           <div className="text-2xl font-bold text-pink-900 mb-2">लेव्हल {levelData.level}</div>  

  //                           {/* Star display */}  
  //                           <div className="flex space-x-1">  
  //                             {[...Array(3)].map((_, i) => (  
  //                               <svg   
  //                                 key={i}   
  //                                 xmlns="http://www.w3.org/2000/svg"   
  //                                 viewBox="0 0 24 24"   
  //                                 className={`w-6 h-6 ${i < (levelData.stars || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300 fill-current'}`}  
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

  //             <div className="flex justify-center space-x-4">  
  //               <button  
  //                 onClick={() => {  
  //                   setDifficulty('');  
  //                   setSelectedLevel(null);  
  //                 }}  
  //                 className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"  
  //               >  
  //                 मागे जा  
  //               </button>  
  //               <button  
  //                 onClick={fetchQuestions}  
  //                 disabled={!difficulty || !selectedLevel || loading}  
  //                 className={`px-6 py-3 rounded-lg font-medium ${  
  //                   !difficulty || !selectedLevel || loading  
  //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'  
  //                     : 'bg-gradient-to-r from-pink-800 to-purple-900 text-white hover:opacity-90'  
  //                 }`}  
  //               >  
  //                 {loading ? 'लोड होत आहे...' : 'सराव सुरु करा'}  
  //               </button>  
  //             </div>  
  //           </div>            ) : !testStarted ? (
  //           <div className="p-8 text-center">
  //             <h1 className="text-3xl font-bold text-gray-800 mb-4">
  //               {mode === 'reading' ? 'वाचनाचा सराव' : 'लेखनाचा सराव'}
  //             </h1>
  //             <p className="text-lg text-gray-600 mb-6">
  //               {mode === 'reading' 
  //                 ? 'आमच्या संवादात्मक सरावांद्वारे तुमच्या वाचन समजण्याच्या कौशल्यांत सुधारणा करा.'
  //                 : 'आमच्या नियोजित लेखन सरावांमुळे तुमचे लेखन कौशल्य अधिक प्रगल्भ करा.'}
  //             </p>

  //             <div className="bg-purple-100 rounded-lg p-4 mb-6">
  //               <h2 className="font-bold text-purple-800 mb-2">सूचना:</h2>
  //               <ul className="text-left text-purple-700 list-disc pl-5 space-y-1">
  //                 {mode === 'reading' ? (
  //                   <>
  //                     <li>आपणास आपल्या स्तरानुसार वेगवेगळ्या प्रमाणात कठीण असणारे उतारे वाचण्यासाठी दिले जातील.</li>
  //                     <li>वाचनानंतर, आपल्या चाचणी प्रश्न विचारले जातील.</li>
  //                     <li>प्रश्नांची उत्तरे देण्यासाठी निश्चित वेळ मर्यादा असेल.</li>
  //                     <li>कृपया काळजीपूर्वक वाचा आणि मुख्य कल्पना तसेच महत्त्वाचे तपशील लक्षात ठेवा.</li>
  //                   </>
  //                 ) : (
  //                   <>
  //                     <li>आपल्याला आपल्या स्तरानुसार लेखनासाठी विषय दिले जातील.</li>
  //                     <li>दिलेल्या मजकूर क्षेत्रात आपल्या विचारांचे स्पष्ट आणि सुसंगत लेखन करा.</li>
  //                     <li>प्रत्येक लेखन कार्य पूर्ण करण्यासाठी निश्चित वेळ मर्यादा असणार आहे.</li>
  //                     <li>लेखनामध्ये स्पष्टता, सुव्यवस्था, तसेच व्याकरणाच्या शुद्धतेवर विशेष लक्ष द्या</li>
  //                   </>
  //                 )}
  //               </ul>
  //             </div>

  //             <div className="flex justify-center space-x-4">
  //               <button
  //                 onClick={() => {
  //                   // Go back to difficulty selection instead of showing another difficulty selector
  //                   setDifficulty('');
  //                 }}
  //                 className="px-4 py-2 rounded-lg font-medium bg-gray-600 text-white hover:bg-gray-700"
  //               >
  //                 मागे जा
  //               </button>
  //               <button
  //                 onClick={fetchQuestions}
  //                 disabled={!difficulty || loading}
  //                 className={`px-6 py-2 rounded-lg font-medium ${
  //                   !difficulty || loading
  //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
  //                     : 'bg-gradient-to-r from-pink-800 to-purple-900 text-white hover:opacity-90'
  //                 }`}
  //               >
  //                 {loading ? 'लोड होत आहे...' : 'सराव सुरु करा'}
  //               </button>
  //             </div>
  //           </div>
  //         ) : testCompleted && !showEvaluation ? (
  //           <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
  //             <h1 className="text-3xl font-bold text-gray-800 mb-4">सराव यशस्वीरीत्या पूर्ण झाला.</h1>
  //             {loading ? (
  //               <div className="flex flex-col items-center justify-center py-8">
  //                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-4"></div>
  //                 <p className="text-lg text-gray-600">मॉडेलच्या आधारे तुमच्या प्रतिसादांचे मूल्यांकन सुरू आहे...</p>
  //               </div>
  //             ) : (
  //               <>
  //                 <div className="w-32 h-32 mx-auto my-6">
  //                   <img src="/completed.svg" alt="Complete" className="w-full h-full" onError={(e) => {
  //                     e.target.src = "/logoo.png";
  //                   }} />
  //                 </div>
  //                 <p className="text-lg text-gray-600 mb-6">
  //                   छान! तुम्ही {mode} सराव सत्र पूर्ण केले आहे.
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
  //                     निकाल पाहा
  //                   </button>
  //                 </div>
  //               </>
  //             )}
  //           </div>
  //         ) : testCompleted && showEvaluation ? (
  //           <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
  //             <h1 className="text-3xl font-bold text-gray-800 mb-4">तुमच्या सरावाचे निकाल</h1>

  //             <div className="mb-6 p-4 bg-purple-50 rounded-lg">
  //               <h2 className="text-xl font-bold text-purple-800 mb-2">एकूण परफॉर्मन्स</h2>
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
  //                 {evaluationResult?.evaluation?.feedback || "You've completed this level. Keep practicing to improve your skills!"}
  //               </div>
  //             </div>

  //             <div className="mb-8">
  //               <h2 className="text-xl font-bold text-gray-800 mb-4">लेव्हल {selectedLevel} यशस्वीरित्या पूर्ण झाला!</h2>
  //               <p className="text-lg text-gray-600">
  //                 तुम्हाला या लेव्हलसाठी {evaluationResult?.levelProgress?.stars || 1} स्टार{(evaluationResult?.levelProgress?.stars || 1) !== 1 ? 's' : ''} मिळाले आहेत.
  //               </p>
  //               {evaluationResult?.levelProgress?.stars === 3 && (
  //                 <div className="mt-2 text-green-600 font-bold">अभिनंदन! तुम्ही सर्वोत्तम गुण मिळवले आहेत.</div>
  //               )}
  //               {evaluationResult?.levelProgress?.stars === 2 && (
  //                 <div className="mt-2 text-blue-600 font-bold">छान! सराव चालू ठेवा!</div>
  //               )}
  //               {evaluationResult?.levelProgress?.stars === 1 && (
  //                 <div className="mt-2 text-purple-600 font-bold">तुमच्या कौशल्यांवर काम करत रहा!</div>
  //               )}
  //             </div>

  //             <div className="flex justify-center space-x-4">
  //               <button
  //                 onClick={backToLevelSelection}
  //                 className="bg-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-700"
  //               >
  //                 लेव्हल्सकडे परत जा
  //               </button>
  //               {selectedLevel < 30 && (
  //                 <button
  //                   onClick={() => {
  //                     // Only allow proceeding if evaluation is complete
  //                     if (evaluationResult && !loading) {
  //                       // First update the selectedLevel
  //                       const nextLevel = Math.min(selectedLevel + 1, 30);
  //                       setSelectedLevel(nextLevel);

  //                       // Reset all states for a fresh start
  //                       setTestCompleted(false);
  //                       setShowEvaluation(false);
  //                       setResponses([]);
  //                       setUserResponse('');
  //                       setSelectedOptions([]);
  //                       setFeedback('');
  //                       setScore(0);

  //                       // Fetch questions with a slight delay to ensure state is updated
  //                       setTimeout(() => {
  //                         fetchQuestions();
  //                       }, 100);
  //                     }
  //                   }}
  //                   className={`px-4 py-2 rounded-lg font-medium ${
  //                     loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
  //                   }`}
  //                   disabled={loading}
  //                 >
  //                   {loading ? (
  //                     <>
  //                       <span className="inline-block animate-spin h-4 w-4 border-t-2 border-white rounded-full mr-2"></span>
  //                        रिव्ह्यू होत आहे..
  //                     </>
  //                   ) : (
  //                     'पुढील लेव्हल'
  //                   )}
  //                 </button>
  //               )}
  //             </div>
  //           </div>
  //         ) : (
  //           <div className="p-8">
  //             <div className="flex justify-between items-center mb-6">
  //               <div className="w-20 h-20">
  //                 <CircularProgressbar
  //                   value={((currentIndex + 1) / questions.length) * 100}
  //                   text={`${currentIndex + 1}/${questions.length}`}
  //                   styles={buildStyles({
  //                     textSize: '22px',
  //                     pathColor: '#9333ea',
  //                     textColor: '#4a044e',
  //                     trailColor: '#e9d5ff',
  //                   })}
  //                 />
  //               </div>
  //               <div className="text-center">
  //                 <h2 className="text-2xl font-bold text-purple-900">
  //                   {mode === 'reading' ? 'वाचनाचा सराव' : 'लेखनाचा सराव'}
  //                 </h2>
  //                 <p className="text-sm text-gray-600">{difficulty} लेव्हल</p>
  //               </div>
  //               <div className="bg-purple-100 px-4 py-2 rounded-lg">
  //                 <span className="text-lg font-medium text-purple-800">
  //                   {formatTime(timeLeft)}
  //                 </span>
  //               </div>
  //             </div>

  //             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
  //               {/* STEP 1: INSTRUCTIONS */}
  //               <h3 className="text-lg font-semibold mb-2">सूचना:</h3>
  //               <p className="text-gray-700 mb-4">
  //                 {questions[currentIndex]?.instructions || "उतारा वाचा आणि प्रश्नाची उत्तर द्या."}
  //               </p>

  //               {/* STEP 2: READING CONTENT/STORY OR WRITING PROMPT */}
  //               {mode === 'reading' ? (
  //                 <div className="bg-gray-100 p-4 rounded-lg mb-6">
  //                   <h3 className="text-lg font-semibold mb-2">उतारा:</h3>
  //                   <div className="prose max-w-none">
  //                     <p className="text-gray-800 whitespace-pre-line">
  //                       {questions[currentIndex]?.content || questions[currentIndex]?.passage || questions[currentIndex]?.text || "परिच्छेद लोड होत आहे..."}
  //                     </p>
  //                   </div>

  //                   {questions[currentIndex]?.imageUrl && (
  //                     <div className="mt-4 flex justify-center">
  //                       <img 
  //                         src={questions[currentIndex].imageUrl} 
  //                         alt="Content image" 
  //                         className="max-h-48 rounded-lg shadow-sm"
  //                         onError={(e) => {
  //                           e.target.src = "/default-card.png";
  //                         }}
  //                       />
  //                     </div>
  //                   )}
  //                 </div>
  //               ) : (
  //                 /* For writing practice, we don't show a passage section */
  //                 questions[currentIndex]?.imageUrl && (
  //                   <div className="bg-gray-100 p-4 rounded-lg mb-6 flex justify-center">
  //                     <img 
  //                       src={questions[currentIndex].imageUrl} 
  //                       alt="Writing prompt image" 
  //                       className="max-h-64 rounded-lg shadow-sm"
  //                       onError={(e) => {
  //                         e.target.src = "/default-card.png";
  //                       }}
  //                     />
  //                   </div>
  //                 )
  //               )}

  //               {/* STEP 3: QUESTION OR WRITING PROMPT */}
  //               <h3 className="text-lg font-semibold mb-3">{mode === 'reading' ? 'प्रश्न:' : 'लेखन विषय:'}</h3>
  //               <p className="text-gray-700 mb-5 font-medium">
  //                 {mode === 'reading' ?
  //                   (questions[currentIndex]?.questionText || 
  //                    (questions[currentIndex]?.content && !questions[currentIndex]?.questionText ? 
  //                      "कथेतील मुख्य घटना काय आहे?" : "प्रश्न लोड होत आहे...")) :
  //                   (questions[currentIndex]?.content || questions[currentIndex]?.passage || questions[currentIndex]?.text || 
  //                    questions[currentIndex]?.questionText || "तुमच्या आवडत्या छंदाची किंवा उपक्रमाची थोडक्यात ओळख देणारा परिच्छेद लिहा.")
  //                 }
  //               </p>

  //               {/* STEP 4: MULTIPLE CHOICE OPTIONS OR TEXT INPUT */}
  //               {isMultipleChoice() ? (
  //                 <div>
  //                   <h3 className="text-lg font-semibold mb-3">योग्य पर्याय निवडा:</h3>
  //                   <div className="space-y-3 mb-4">
  //                     {questions[currentIndex].options.map((option, index) => (
  //                       <div 
  //                         key={index}
  //                         onClick={() => handleOptionSelect(option)}
  //                         className={`p-4 rounded-lg cursor-pointer transition-all flex items-center ${
  //                           selectedOptions.includes(option)
  //                             ? 'bg-purple-600 text-white border-2 border-purple-800 shadow-md transform scale-[1.02]'
  //                             : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
  //                         }`}
  //                       >
  //                         <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
  //                           selectedOptions.includes(option)
  //                             ? 'bg-white text-purple-600' 
  //                             : 'bg-white border border-gray-400'
  //                         }`}>
  //                           {selectedOptions.includes(option) && (
  //                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
  //                               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  //                             </svg>
  //                           )}
  //                         </div>
  //                         <span className="flex-1">{option}</span>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               ) : (
  //                 <div className="mb-4">
  //                   <textarea
  //                     value={userResponse}
  //                     onChange={handleTextResponseChange}
  //                     onKeyDown={handleKeyDown}
  //                     onKeyUp={handleKeyUp}
  //                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
  //                     rows={6}
  //                     placeholder={mode === 'reading' ? "इथे तुमचे उत्तर लिहा..." : "कृपया इथे तुमचा प्रतिसाद लिहा (किमान ५० शब्द असणे आवश्यक आहे)..."}
  //                     disabled={!!feedback}
  //                     lang="mr"
  //                     dir="ltr"
  //                     spellCheck="false"
  //                     inputMode="text"
  //                     autoComplete="off"
  //                   />
  //                   {mode === 'writing' && (
  //                     <div className="mt-2 flex justify-between items-center">
  //                       <div className="text-sm text-gray-600">
  //                         शब्द: <span className={`font-medium ${countWords(userResponse) >= 50 ? 'text-green-600' : 'text-red-600'}`}>
  //                           {countWords(userResponse)}
  //                         </span> / किमान ५०
  //                       </div>
  //                       {countWords(userResponse) >= 50 && (
  //                         <div className="text-sm text-green-600 flex items-center">
  //                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
  //                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  //                           </svg>
  //                           किमान शब्द मर्यादा पूर्ण झाली
  //                         </div>
  //                       )}
  //                     </div>
  //                   )}
  //                 </div>
  //               )}

  //               {!feedback && (
  //                 <div className="flex justify-center">
  //                   <button
  //                     onClick={submitResponse}
  //                     disabled={
  //                       // For multiple choice, require at least one option selected
  //                       (isMultipleChoice() && selectedOptions.length === 0) ||
  //                       // For text input in reading practice, require non-empty response
  //                       (!isMultipleChoice() && mode === 'reading' && !userResponse.trim()) ||
  //                       // For writing practice, require at least 50 words
  //                       (!isMultipleChoice() && mode === 'writing' && countWords(userResponse) < 50)
  //                     }
  //                     className={`px-4 py-2 rounded-lg font-medium ${
  //                       // For multiple choice, require at least one option selected
  //                       (isMultipleChoice() && selectedOptions.length === 0) ||
  //                       // For text input in reading practice, require non-empty response
  //                       (!isMultipleChoice() && mode === 'reading' && !userResponse.trim()) ||
  //                       // For writing practice, require at least 50 words
  //                       (!isMultipleChoice() && mode === 'writing' && countWords(userResponse) < 50)
  //                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
  //                         : 'bg-purple-600 text-white hover:bg-purple-700'
  //                     }`}
  //                   >
  //                     उत्तर सबमिट करा
  //                   </button>
  //                 </div>
  //               )}

  //               {feedback && (
  //                 <div className="mt-4">
  //                   <div className="flex items-center mb-2">
  //                     <h4 className="font-medium text-gray-700">फीडबॅक:</h4>
  //                     <div className="ml-3 flex">
  //                       {[1, 2, 3].map((star) => (
  //                         <svg
  //                           key={star}
  //                           xmlns="http://www.w3.org/2000/svg"
  //                           className={`h-5 w-5 ${
  //                             star <= score ? 'text-yellow-500' : 'text-gray-300'
  //                           }`}
  //                           viewBox="0 0 20 20"
  //                           fill="currentColor"
  //                         >
  //                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //                         </svg>
  //                       ))}
  //                     </div>
  //                   </div>
  //                   <p className="text-gray-600 bg-purple-50 p-3 rounded-lg border border-purple-100">
  //                     {feedback}
  //                   </p>
  //                 </div>
  //               )}
  //             </div>

  //             {feedback && (
  //               <div className="flex justify-end">
  //                 <button
  //                   onClick={handleNext}
  //                   className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
  //                 >
  //                   {currentIndex < questions.length - 1 ? 'पुढील प्रश्न' : 'सराव पूर्ण करा'}
  //                 </button>
  //               </div>
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
        <title>SHAKKTII AI - वाचन आणि लेखन सराव</title>
      </Head>

      <div className="min-h-screen relative bg-[#0f0c29] font-sans text-white overflow-x-hidden">

        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('/BG.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/95 via-[#1a1638]/90 to-[#2e1065]/80 backdrop-blur-[2px]"></div>
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
              <span className="text-sm font-medium tracking-wide text-gray-200 group-hover:text-white">सरावाकडे परत जा</span>
            </button>

            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <div className="w-full h-full rounded-full bg-[#1a103c] flex items-center justify-center overflow-hidden">
                <img src="/logoo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">

            {!mode ? (
              // --- MODE SELECTION ---
              <div className="p-8 md:p-12 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-pink-200 mb-6 drop-shadow-sm">
                  वाचन आणि लेखन सराव
                </h1>
                <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
                  तुमची भाषिक कौशल्ये सुधारण्यासाठी खालीलपैकी एक पर्याय निवडा.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                  {/* Reading Card */}
                  <div
                    onClick={() => setMode('reading')}
                    className="group relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="h-28 flex items-center justify-center mb-6">
                      <div className="relative w-24 h-24 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <img
                          src="/reading.png"
                          alt="Reading"
                          className="h-16 w-16 object-contain drop-shadow-lg"
                          onError={(e) => { e.target.src = "/logoo.png"; }}
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">वाचन सराव (Reading)</h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                      आकर्षक उतारे आणि लेखांद्वारे तुमचे वाचन आकलन आणि शब्दसंग्रह सुधारा.
                    </p>
                  </div>

                  {/* Writing Card */}
                  <div
                    onClick={() => setMode('writing')}
                    className="group relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-pink-500/50 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20"
                  >
                    <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    <div className="h-28 flex items-center justify-center mb-6">
                      <div className="relative w-24 h-24 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <img
                          src="/writing.png"
                          alt="Writing"
                          className="h-16 w-16 object-contain drop-shadow-lg"
                          onError={(e) => { e.target.src = "/logoo.png"; }}
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">लेखन सराव (Writing)</h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                      मार्गदर्शित लेखन सरावांद्वारे तुमची विचार मांडण्याची पद्धत आणि व्याकरण विकसित करा.
                    </p>
                  </div>
                </div>
              </div>

            ) : mode && !difficulty ? (
              // --- DIFFICULTY SELECTION ---
              <div className="p-8 md:p-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {mode === 'reading' ? 'वाचन सराव' : 'लेखन सराव'}
                </h1>
                <p className="text-gray-400 text-lg mb-10">
                  सराव सुरू करण्यासाठी तुमची कठीण पातळी (Difficulty Level) निवडा.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
                  {['बिगिनर', 'मॉडरेट', 'एक्स्पर्ट'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleDifficultySelect(level)}
                      className={`relative py-4 px-6 rounded-xl font-bold text-lg border transition-all duration-300 transform hover:-translate-y-1 ${difficulty === level
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-lg shadow-purple-500/40'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setMode('')}
                  className="text-gray-400 hover:text-white text-sm font-medium border-b border-transparent hover:border-gray-400 transition-colors pb-0.5"
                >
                  &larr; सराव प्रकार बदला (Change Mode)
                </button>
              </div>

            ) : showLevelSelection ? (
              // --- LEVEL SELECTION GRID ---
              <div className="p-8 md:p-12">
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {mode === 'reading' ? 'वाचन' : 'लेखन'} - {difficulty} लेव्हल्स
                  </h1>
                  <button
                    onClick={() => { setDifficulty(''); }}
                    className="text-sm text-pink-400 hover:text-pink-300 font-medium"
                  >
                    Change Difficulty
                  </button>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-purple-300">Loading levels...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-10">
                    {levelProgress && levelProgress.map((levelData) => {
                      const isSelected = selectedLevel === levelData.level;
                      const highestCompletedLevel = Math.max(...levelProgress.filter(l => l.completed).map(l => l.level), 0);
                      const isLocked = levelData.level !== 1 && !levelData.completed && levelData.level !== highestCompletedLevel + 1;

                      return (
                        <div
                          key={levelData.level}
                          onClick={() => !isLocked && handleLevelSelect(levelData.level)}
                          onDoubleClick={() => !isLocked && handleLevelDoubleClick(levelData.level)}
                          className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${isLocked
                              ? 'bg-black/20 border border-white/5 cursor-not-allowed opacity-50'
                              : 'bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1'
                            } ${isSelected ? 'ring-2 ring-purple-500 bg-purple-500/20' : ''}`}
                        >
                          <span className={`text-2xl font-bold mb-1 ${isLocked ? 'text-gray-500' : 'text-white group-hover:text-purple-300'}`}>{levelData.level}</span>

                          {/* Stars */}
                          {!isLocked && (
                            <div className="flex gap-0.5">
                              {[...Array(3)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-3 h-3 ${i < (levelData.stars || 0) ? 'text-yellow-400 fill-current' : 'text-gray-600 fill-current'}`}>
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

                          {levelData.completed && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4 border-t border-white/5 pt-8">
                  <button
                    onClick={() => { setDifficulty(''); setSelectedLevel(null); }}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                  >
                    मागे जा
                  </button>
                  <button
                    onClick={fetchQuestions}
                    disabled={!difficulty || !selectedLevel || loading}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 ${!difficulty || !selectedLevel || loading
                        ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40'
                      }`}
                  >
                    {loading ? 'लोड होत आहे...' : 'सराव सुरू करा (Start)'}
                  </button>
                </div>
              </div>

            ) : !testStarted ? (
              // --- INSTRUCTIONS SCREEN ---
              <div className="p-8 md:p-12 text-center max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-4">
                  {mode === 'reading' ? 'वाचनाचा सराव' : 'लेखनाचा सराव'}
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                  {mode === 'reading'
                    ? 'आमच्या संवादात्मक सरावांद्वारे तुमचे वाचन समजण्याचे कौशल्य सुधारा.'
                    : 'आमच्या नियोजित लेखन सरावांमुळे तुमचे लेखन कौशल्य अधिक प्रगल्भ करा.'}
                </p>

                <div className="bg-purple-900/30 border border-purple-500/20 rounded-2xl p-6 mb-8 text-left">
                  <h2 className="font-bold text-purple-300 mb-3 text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    महत्वाच्या सूचना:
                  </h2>
                  <ul className="text-gray-300 space-y-2 list-disc pl-5 text-sm md:text-base leading-relaxed">
                    {mode === 'reading' ? (
                      <>
                        <li>तुम्हाला तुमच्या स्तरानुसार एक उतारा वाचण्यासाठी दिला जाईल.</li>
                        <li>वाचनानंतर, त्या उताऱ्यावर आधारित प्रश्न विचारले जातील.</li>
                        <li>प्रश्नांची उत्तरे देण्यासाठी वेळेचे भान ठेवा.</li>
                        <li>कृपया काळजीपूर्वक वाचा आणि मुख्य मुद्दे लक्षात ठेवा.</li>
                      </>
                    ) : (
                      <>
                        <li>तुम्हाला तुमच्या स्तरानुसार लेखनासाठी एक विषय दिला जाईल.</li>
                        <li>दिलेल्या जागेत तुमचे विचार स्पष्ट आणि सुसंगतपणे लिहा.</li>
                        <li>लेखनासाठी निश्चित शब्दमर्यादा आणि वेळ असेल.</li>
                        <li>स्पष्टता, व्याकरण आणि वाक्यरचना यावर विशेष लक्ष द्या.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => setDifficulty('')}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
                  >
                    मागे जा
                  </button>
                  <button
                    onClick={fetchQuestions}
                    disabled={!difficulty || loading}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 ${!difficulty || loading
                        ? 'bg-gray-700/50 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-emerald-500/40'
                      }`}
                  >
                    {loading ? 'लोड होत आहे...' : 'सुरू करा (Start Practice)'}
                  </button>
                </div>
              </div>

            ) : testCompleted && !showEvaluation ? (
              // --- COMPLETED SCREEN ---
              <div className="p-8 md:p-12 text-center max-w-2xl mx-auto animate-zoom-in">
                <h1 className="text-3xl font-bold text-white mb-6">सराव पूर्ण झाला!</h1>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-purple-200 animate-pulse">AI तुमच्या उत्तरांचे विश्लेषण करत आहे...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-40 h-40 mx-auto mb-8 bg-white/5 rounded-full p-6 border border-white/10 shadow-inner">
                      <img src="/completed.svg" alt="Complete" className="w-full h-full object-contain drop-shadow-lg" onError={(e) => { e.target.src = "/logoo.png"; }} />
                    </div>
                    <p className="text-xl text-gray-300 mb-8">
                      छान! तुम्ही {mode === 'reading' ? 'वाचन' : 'लेखन'} सराव सत्र यशस्वीरित्या पूर्ण केले आहे.
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
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-purple-500/30 transition-transform hover:-translate-y-0.5"
                      >
                        निकाल पहा (View Results)
                      </button>
                    </div>
                  </>
                )}
              </div>

            ) : testCompleted && showEvaluation ? (
              // --- EVALUATION SCREEN ---
              <div className="p-8 md:p-12 text-center max-w-3xl mx-auto animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-8">तुमच्या सरावाचे निकाल</h1>

                <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-white/5">
                  <h2 className="text-lg font-bold text-purple-300 uppercase tracking-wider mb-4">एकूण परफॉर्मन्स</h2>

                  {/* Big Stars */}
                  <div className="flex justify-center gap-3 mb-6">
                    {[...Array(3)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-12 h-12 filter drop-shadow-lg ${i < (evaluationResult?.levelProgress?.stars || 0) ? 'text-yellow-400 fill-current' : 'text-gray-700 fill-current'}`}>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 text-gray-200 italic leading-relaxed border border-white/5 text-lg">
                    "{evaluationResult?.evaluation?.feedback || "उत्तम प्रयत्न! सातत्याने सराव केल्यास तुमचे कौशल्य नक्कीच सुधारेल."}"
                  </div>
                </div>

                <div className="mb-8">
                  {evaluationResult?.levelProgress?.stars === 3 && <div className="text-emerald-400 font-bold text-xl animate-bounce">🎉 अभिनंदन! उत्कृष्ट कामगिरी! 🎉</div>}
                  {evaluationResult?.levelProgress?.stars === 2 && <div className="text-blue-400 font-bold text-xl">छान! अजून थोडे प्रयत्न करा!</div>}
                  {evaluationResult?.levelProgress?.stars === 1 && <div className="text-purple-400 font-bold text-xl">सराव करत रहा, तुम्ही नक्कीच सुधाराल!</div>}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={backToLevelSelection}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10"
                  >
                    लेव्हल्सकडे परत जा
                  </button>
                  {selectedLevel < 30 && (
                    <button
                      onClick={() => {
                        if (evaluationResult && !loading) {
                          const nextLevel = Math.min(selectedLevel + 1, 30);
                          setSelectedLevel(nextLevel);
                          setTestCompleted(false);
                          setShowEvaluation(false);
                          setResponses([]);
                          setUserResponse('');
                          setSelectedOptions([]);
                          setFeedback('');
                          setScore(0);
                          setTimeout(() => { fetchQuestions(); }, 100);
                        }
                      }}
                      className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${loading ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-emerald-500/30'
                        }`}
                      disabled={loading}
                    >
                      {loading ? 'लोड होत आहे...' : <>पुढील लेव्हल &rarr;</>}
                    </button>
                  )}
                </div>
              </div>

            ) : (
              // --- ACTIVE TEST INTERFACE ---
              <div className="p-6 md:p-10 max-w-4xl mx-auto">

                {/* Progress Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                  <div className="relative w-16 h-16">
                    <CircularProgressbar
                      value={((currentIndex + 1) / questions.length) * 100}
                      text={`${currentIndex + 1}/${questions.length}`}
                      styles={buildStyles({
                        textSize: '24px',
                        pathColor: '#c084fc',
                        textColor: '#fff',
                        trailColor: 'rgba(255,255,255,0.1)',
                      })}
                    />
                  </div>

                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {mode === 'reading' ? 'वाचन (Reading)' : 'लेखन (Writing)'}
                    </h2>
                    <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-purple-300 border border-white/5">
                      {difficulty} • Level {selectedLevel}
                    </span>
                  </div>

                  <div className={`px-5 py-2 rounded-xl font-mono text-lg font-bold border ${timeLeft < 10 ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse' : 'bg-purple-500/20 border-purple-500/30 text-purple-200'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Question Area */}
                <div className="bg-black/20 rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner mb-8">

                  {/* Instructions */}
                  <div className="mb-6 pb-4 border-b border-white/5">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Instructions</h3>
                    <p className="text-lg text-white font-medium">
                      {questions[currentIndex]?.instructions || "उतारा वाचा आणि प्रश्नाचे उत्तर द्या."}
                    </p>
                  </div>

                  {/* Content (Passage or Image) */}
                  {mode === 'reading' ? (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-6">
                      <h3 className="text-xs font-bold text-purple-300 uppercase mb-3">Passage</h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-200 whitespace-pre-line leading-relaxed text-lg">
                          {questions[currentIndex]?.content || questions[currentIndex]?.passage || questions[currentIndex]?.text || "परिच्छेद लोड होत आहे..."}
                        </p>
                      </div>

                      {questions[currentIndex]?.imageUrl && (
                        <div className="mt-6 flex justify-center">
                          <img
                            src={questions[currentIndex].imageUrl}
                            alt="Content"
                            className="max-h-64 rounded-xl shadow-lg border border-white/10"
                            onError={(e) => { e.target.src = "/default-card.png"; }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Writing Prompt Image */
                    questions[currentIndex]?.imageUrl && (
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-6 flex justify-center">
                        <img
                          src={questions[currentIndex].imageUrl}
                          alt="Prompt"
                          className="max-h-72 rounded-xl shadow-lg"
                          onError={(e) => { e.target.src = "/default-card.png"; }}
                        />
                      </div>
                    )
                  )}

                  {/* The Question/Prompt */}
                  <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-5 rounded-xl border-l-4 border-purple-500 mb-6">
                    <h3 className="text-xs font-bold text-purple-300 uppercase mb-1">
                      {mode === 'reading' ? 'Question' : 'Topic'}
                    </h3>
                    <p className="text-xl font-bold text-white">
                      {mode === 'reading' ?
                        (questions[currentIndex]?.questionText ||
                          (questions[currentIndex]?.content && !questions[currentIndex]?.questionText ? "कथेतील मुख्य घटना काय आहे?" : "Loading...")) :
                        (questions[currentIndex]?.content || questions[currentIndex]?.passage || questions[currentIndex]?.text ||
                          questions[currentIndex]?.questionText || "Write a paragraph about the topic above.")
                      }
                    </p>
                  </div>

                  {/* Interaction Area (Multiple Choice or Text) */}
                  {isMultipleChoice() ? (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">Select Answer:</h3>
                      <div className="space-y-3">
                        {questions[currentIndex].options.map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            className={`p-4 rounded-xl cursor-pointer transition-all flex items-center border ${selectedOptions.includes(option)
                                ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                              }`}
                          >
                            <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-4 border-2 ${selectedOptions.includes(option) ? 'border-purple-500 bg-purple-500' : 'border-gray-500'
                              }`}>
                              {selectedOptions.includes(option) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="flex-1 text-lg font-medium">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase">Your Response:</h3>
                      <textarea
                        value={userResponse}
                        onChange={handleTextResponseChange}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        className="w-full p-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-lg leading-relaxed min-h-[150px]"
                        placeholder={mode === 'reading' ? "येथे उत्तर लिहा..." : "तुमचे विचार येथे मांडा (Min 50 words)..."}
                        disabled={!!feedback}
                        spellCheck="false"
                      />
                      {mode === 'writing' && (
                        <div className="mt-2 flex justify-end">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${countWords(userResponse) >= 50 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {countWords(userResponse)} / 50 Words
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback Display */}
                  {feedback && (
                    <div className="mt-8 animate-fade-in-up">
                      <div className={`p-5 rounded-xl border ${score >= 2 ? 'bg-green-500/10 border-green-500/30 text-green-100' : 'bg-amber-500/10 border-amber-500/30 text-amber-100'
                        }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold uppercase text-xs opacity-80 tracking-wider">AI Feedback</h4>
                          <div className="flex gap-1">
                            {[1, 2, 3].map((star) => (
                              <svg key={star} className={`h-4 w-4 ${star <= score ? 'fill-current' : 'fill-white/10'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-lg leading-relaxed">{feedback}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end">
                  {!feedback ? (
                    <button
                      onClick={submitResponse}
                      disabled={
                        (isMultipleChoice() && selectedOptions.length === 0) ||
                        (!isMultipleChoice() && mode === 'reading' && !userResponse.trim()) ||
                        (!isMultipleChoice() && mode === 'writing' && countWords(userResponse) < 50)
                      }
                      className={`px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 ${(isMultipleChoice() && selectedOptions.length === 0) ||
                          (!isMultipleChoice() && mode === 'reading' && !userResponse.trim()) ||
                          (!isMultipleChoice() && mode === 'writing' && countWords(userResponse) < 50)
                          ? 'bg-gray-700/50 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40'
                        }`}
                    >
                      उत्तर सबमिट करा (Submit)
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-8 py-3.5 rounded-xl bg-white text-purple-900 font-bold shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      {currentIndex < questions.length - 1 ? 'पुढील प्रश्न &rarr;' : 'सराव पूर्ण करा (Finish) &rarr;'}
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReadingWritingPractice;
