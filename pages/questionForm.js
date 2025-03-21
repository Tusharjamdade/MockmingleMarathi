


import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FcSpeaker } from 'react-icons/fc'; 

const QuestionForm = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordedText, setRecordedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [isIphone, setIsIphone] = useState(false);

  const [micTimeout, setMicTimeout] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const[collageName,setCollageName]=useState('')
     
 
     useEffect(() => {
         if (!localStorage.getItem("token")) {
           router.push("/login");
         } else {
           const userFromStorage = JSON.parse(localStorage.getItem('user'));
         //   console.log(userFromStorage);
           
           if (userFromStorage) {
             
             setCollageName(userFromStorage.collageName || '');  // Initialize email here directly
           }
         }
       }, []);
        // Check if the device is an iPhone
       

  useEffect(() => {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setIsIphone(true);
    }
    // Request microphone (audio) access
    const requestPermissions = async () => {
      try {
        // Requesting audio permission (microphone)
        await navigator.mediaDevices.getUserMedia({ audio: true, sound: true });
        console.log("Microphone and sound access granted.");
      } catch (err) {
        console.error("Microphone and sound access denied:", err);
        // Optionally, show an alert or message to the user about the permission issue
      }
    };

    requestPermissions();

    // Check if there’s a notification stored in localStorage when the component mounts
    const checkStorage = () => {
      const storedNotification = localStorage.getItem("store");
      if (storedNotification) {
        console.log("setNotification(true);")
      }
    };

    checkStorage();
  }, []);

 
  const goodResponses = [
        "Great! Let's move on to the next question.",
        "Awesome! Let's continue to the next one",
        "Perfect, let's go ahead with the next question.",
        "Let's move on to the next question now and keep going strong!",
        "Wonderful! Proceeding to the next question.",
        "Let’s move forward to the next one with excitement!",
        "Next question, please—let's dive right in!",
        "Let’s go to the next one and keep the momentum going.",
        "Moving on to the next question, excited to see what's next!",
        "Let's continue with the next question and keep up the good work!",
        "Now, let’s go to the next question and stay on track!",
        "Time to proceed with the next question—let’s keep it up!",
        "Next question, let’s go, we’re doing great!",
        "Let’s keep going with the next question and stay positive!",
        "Let’s continue with the next one, things are going well!"
      ];
    
    
      
      
    
      const badResponses = [
        "Um, okay, let's move to the next question.",
        "Not quite, but let's move to the next question.",
        "Hmm, not exactly, let's continue to the next question.",
        "Well, that’s not right, but let’s go on to the next one.",
        "Close enough, let’s move on to the next question.",
        "It’s not perfect, but let’s proceed to the next one.",
        "Hmm, I see where you’re going, but let’s move to the next one.",
        "That’s not the answer we were looking for, but let’s continue.",
        "Not quite right, but let's continue to the next question.",
        "Almost, but we’ll keep going.",
        "I think we missed it, let’s move on.",
        "Hmm, not quite, but let’s keep going.",
        "That’s a bit off, but let's move to the next one.",
        "Not exactly what we needed, but let's continue.",
        "Close, but not quite there, let’s move on."
      ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      } else {
        const userFromStorage = JSON.parse(localStorage.getItem('user'));
        if (userFromStorage) {
          setUser(userFromStorage);
          setEmail(userFromStorage.email || '');
        }
      }
    }
  }, []);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _id = localStorage.getItem('_id');
      if (_id) {
        setUserId(_id);
      }
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!email || !userId) {
        console.error('Email or _id is missing');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/fetchQuestionsFormDb?email=${email}&_id=${userId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch questions: ${res.statusText}`);
        }

        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert('An error occurred while fetching the questions.');
      }
    };

    if (email && userId) {
      fetchQuestions();
    }
  }, [email, userId]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = true;
      recognitionInstance.maxAlternatives = 1;
      recognitionInstance.continuous = true;

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setRecordedText((prevText) => prevText + ' ' + transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setLoading(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        setLoading(false);
      };

      setRecognition(recognitionInstance);
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  }, [currentQuestionIndex]);

  const handleMicClick = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
        setLoading(false);
        const currentQuestion = questions[currentQuestionIndex];
        const answer = recordedText;
        setAnswers((prevAnswers) => [
          ...prevAnswers,
          { questionId: currentQuestion._id, answer: answer }
        ]);
        submitAnswer(currentQuestion._id, answer);
        handleNext();
      } else {
        recognition.start();
        setIsListening(true);
        setLoading(true);

        if (micTimeout) {
          clearTimeout(micTimeout);
          setMicTimeout(null);
        }
      }
    }
  };

  const submitAnswer = async (questionId, answer) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/saveAnswer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: userId,
          email: user?.email,
          questionId: questionId,
          answer: answer,
        }),
      });

      if (res.ok) {
        console.log('Answer submitted successfully');
      } else {
        const errorData = await res.json();
        console.error('Error saving answer:', errorData);
        alert(`Error saving data: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Network or other error:', error);
      alert('Network or other error occurred');
    }
  };

  const speakQuestion = (questionText) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      // Start the microphone timeout after the question has been spoken
      startMicTimeout();
    };

    speechSynthesis.speak(utterance);
  };

  // Start the 20-second microphone timeout when the question is spoken
  const startMicTimeout = () => {
    // Clear any existing timeout
    if (micTimeout) {
      clearTimeout(micTimeout);
    }

    const timeout = setTimeout(() => {
      if (!isListening && !isAnswerSubmitted) {
        speakResponse("You're too late to turn on the mic.");
        handleNext();
      }
    }, 20000); // Timeout of 20 seconds for the user to respond

    setMicTimeout(timeout);
  };

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const cleanedQuestionText = currentQuestion.questionText.replace(/(currentQuestion|[,*])/g, "");
      speakQuestion(cleanedQuestionText);
    }
  }, [currentQuestionIndex, questions]);

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = recordedText.trim();

    const questionWords = currentQuestion.questionText.split(' ').map(word => word.toLowerCase());
    const answerWords = answer.split(' ').map(word => word.toLowerCase());

    const isGoodAnswer = questionWords.some(word => answerWords.includes(word));

    const responseText = Math.random() > 0.15 
      ? goodResponses[Math.floor(Math.random() * goodResponses.length)] 
      : badResponses[Math.floor(Math.random() * badResponses.length)];

    speakResponse(responseText);

    if (answer) {
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { questionId: currentQuestion._id, answer: answer }
      ]);
    }

    if (currentQuestionIndex === questions.length - 1) {
      speakResponse("Your interview has ended.");
      setInterviewComplete(true);
      setIsModalVisible(true);
      localStorage.removeItem("_id");
      updateIsActive();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRecordedText('');
      setIsAnswerSubmitted(false);
    }

    // Reset the mic timeout after each question
    if (micTimeout) {
      clearTimeout(micTimeout);
      setMicTimeout(null);
    }
  };

  const speakResponse = (responseText) => {
    const utterance = new SpeechSynthesisUtterance(responseText);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    router.push('/report');
  };

  const handleBeforeUnload = (event) => {
    if (!interviewComplete) {
      const message = "Are you sure you want to leave? Your interview will be lost.";
      event.returnValue = message;
      return message;
    }
  };

  const handleExitModalClose = () => {
    setIsExitModalVisible(false);
  };

  const handleExitConfirmation = () => {
    setIsExitModalVisible(false);
    router.push('/report');
    updateIsActive();
  };

  const handlePopState = () => {
    if (!interviewComplete) {
      setIsExitModalVisible(true);
    }
  };

  useEffect(() => {
    window.history.pushState(null, document.title);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [interviewComplete]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [interviewComplete]);


  const updateIsActive = async () => {
    // Example company name

    try {
        // Step 1: Fetch the current `isActive` value for the company
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/isActive?collageName=${collageName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            const data = await res.json();
            console.log(data); // Check what the data structure looks like

            // Assuming that data is an array, get the first object
            const collageData = data[0]; // Access the first object in the array
            if (collageData) {
                let currentIsActive = collageData.isActive; // Now accessing the isActive from the first object
                console.log(currentIsActive);

                // Check if the `isActive` value is valid
                if (currentIsActive === null || currentIsActive === undefined) {
                    console.error('Invalid isActive value:', currentIsActive);
                    alert('Error: Current isActive value is invalid');
                    return; // Exit if the value is invalid
                }

                // Step 2: Decrement the value of `isActive`
                const newIsActive = currentIsActive - 1;

                // Step 3: Send the updated value back with the PUT request
                const updateRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/isActive`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        collageName: collageName,
                        isActive: newIsActive, // Send the updated value
                    }),
                });

                if (updateRes.ok) {
                    console.log("Successfully updated isActive value");
                } else {
                    const errorData = await updateRes.json();
                    console.error('Error updating isActive:', errorData);
                    alert(`Error updating isActive: ${errorData.message}`);
                }
            } else {
                console.error('Company data not found in the response');
                alert('Error: Company data not found');
            }
        } else {
            const errorData = await res.json();
            console.error('Error fetching current isActive:', errorData);
            alert(`Error fetching current isActive: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Network or other error:', error);
        alert('Error updating isActive value');
    }
};


  return (
    <div className="m-auto items-center justify-center min-h-screen bg-cover bg-center " style={{ backgroundImage: "url('/BG.jpg')" }}>
      {/* Main content */}
      <div className="flex justify-center">
        <img id="mainImage" src="main.gif" className="w-60 h-60 text-center" alt="Shakti AI Logo" />
      </div>
      {questions.length > 0 && (
        <div className="p-4 pb-10 rounded-lg m-auto">
          <label className="block text-xl font-semibold text-center text-white">
            {questions[currentQuestionIndex].questionText}
          </label>
          <div className=" hidden input-box mt-6 relative flex items-center bg-gray-800 rounded-xl px-4 py-2">
            <input
              type="text"
              id="textContent"
              className="bg-transparent border-none text-white focus:outline-none w-full"
              placeholder="Type Here"
              value={recordedText}
              onChange={(e) => setRecordedText(e.target.value)}
              disabled={isListening || loading || isSpeaking}
            />
          </div>
          <div className="text-center mt-10">
            {(isListening || isSpeaking) && (
              <div className="sound-waves">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>
            )}
             {isIphone && (
              <button
                onClick={() => speakQuestion(questions[currentQuestionIndex].questionText)}
                className="px-6 py-3 text-5xl text-white font-semibold rounded-lg shadow-md focus:outline-none"
              >
                <FcSpeaker />
              </button>
            )}
            <div className="flex justify-center">
            <button
                className={`mic-button absolute text-5xl ${isListening || isSpeaking ? 'text-red-500' : 'text-pink-400'}`}
                onClick={handleMicClick}
                disabled={isSpeaking}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10">
                  <path fill="currentColor" d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM5 10a1 1 0 1 1 2 0v2a5 5 0 0 0 10 0v-2a1 1 0 1 1 2 0v2a7 7 0 0 1-6 6.93V21a1 1 0 1 1-2 0v-2.07A7 7 0 0 1 5 12v-2z" />
                </svg>
              </button>

            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex hidden justify-center">
        <button
          onClick={handleNext}
          disabled={isListening || loading || isSpeaking || currentQuestionIndex === questions.length - 1}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>

      {/* Modal for interview end */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Your interview has ended</h2>
            <button
              onClick={handleModalClose}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {isExitModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to leave? Your interview will be lost.</h2>
            <div className="flex justify-between">
              <button
                onClick={handleExitConfirmation}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
              >
                Yes, Exit
              </button>
              <button
                onClick={handleExitModalClose}
                className="px-6 py-2 bg-gray-300 text-black font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none"
              >
                No, Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;