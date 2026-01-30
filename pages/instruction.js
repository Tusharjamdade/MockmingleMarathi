import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

function Instruction() {
    const router = useRouter();
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [testPhase, setTestPhase] = useState('speaker'); // 'speaker', 'mic', 'done'
    const [testMessage, setTestMessage] = useState('Testing speaker...');
    const [micPermissionGranted, setMicPermissionGranted] = useState(false);
    const recognitionRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [collageName, setCollageName] = useState('');
    const slides = [
        {
            id: 1,
            title: "नोकरीची भूमिका समजून घ्या",
            img: '/Shawn.png',
            content: "1. नोकरीची भूमिका समजून घेणे म्हणजे त्या पदाच्या मुख्य जबाबदाऱ्या, आवश्यक कौशल्ये आणि अपेक्षा यांचा अभ्यास करणे होय. यामुळे तुम्हाला तुमचा रेज्युमे योग्य प्रकारे तयार करता येतो, मुलाखतीतील प्रश्नांना आत्मविश्वासाने उत्तर देता येतात आणि तुमच्या क्षमतेचा त्या पदाशी कसा संबंध आहे हे प्रभावीपणे दाखवता येते.",
        },
        {
            id: 2,
            img: '/Job_Discrioption.png',
            title: "पदाचे तपशील समजून घ्या",
            content: "2. नोकरीचे वर्णन काळजीपूर्वक वाचा आणि त्यातील मुख्य पात्रता, जबाबदाऱ्या, आणि अपेक्षा समजून घ्या. तुमच्या कौशल्यां आणि अनुभवांचा नोकरीच्या गरजांशी कसा सुसंगत आहे याची उदाहरणे तयार ठेवा.",
        },
        {
            id: 3,
            img: '/collages_background..png',
            title: "कॉलेजची पार्श्वभूमी समजून घ्या",
            content: "3. कॉलेजची पार्श्वभूमी समजून घेणे म्हणजे त्याचा इतिहास, ध्येय, मूल्ये, उत्पादने, सेवा आणि उद्योगातील स्थान याबद्दल जाणून घेणे होय. यामुळे तुम्ही मुलाखतीत तुमची उत्तरे योग्य प्रकारे सादर करू शकता आणि संस्थेत खरी रुची दर्शवू शकता.",
        },
        {
            id: 4,
            img: '/Self_Introduction.png',
            title: "तुमची स्वतःची ओळख मांडण्याचा सराव करा",
            content: "4. स्वतःची थोडक्यात ओळख द्या, महत्वाची कौशल्ये, अनुभव आणि यशे नमूद करा, आणि ते नोकरीच्या भूमिकेशी जोडा.",
        },
        {
            id: 5,
            img: '/Resume.png',
            title: "तुमचा रेज्युमे अपडेट करा आणि १-२ प्रती सोबत ठेवा",
            content: "5. तुमचा रेज्युमे आणि इतर अर्जाच्या कागदपत्रे अद्ययावत, नोकरीच्या अनुरूप आणि नीटनेटके असतील याची खात्री करा. तुमचा रेज्युमे आणि इतर मागवलेली दस्तऐवजच्या अनेक प्रती सोबत आणा.",
        },
        {
            id: 6,
            img: '/Yourself_Professionally.png',
            title: "प्रोफेशनलपणे स्वतःला सादर करा",
            content: "6. इंडस्ट्री आणि कॉलेज संस्कृतीनुसार योग्य ड्रेसिंग करा. ग्रूमिंग आणि स्वच्छतेकडे लक्ष द्या, सकारात्मक प्रभावासाठी.",
        },
        {
            id: 7,
            img: '/Essential_Documents.png',
            title: "आवश्यक दस्तऐवज जमा करून नीटनेटके ठेवा",
            content: "7.सर्व आवश्यक कागदपत्रे जसे की प्रमाणपत्रे, शिफारसी, आणि ओळखपत्र गोळा करा आणि नीटनेटके ठेवाः फोल्डर किंवा पोर्टफोलिओचा वापर करा जेणेकरून सर्व काही व्यवस्थित आणि सहज उपलब्ध राहील.",
        },
        {
            id: 8,
            img: '/collage_News.png',
            title: "कॉलेजच्या बातम्यांवर अपडेट रहा",
            content: "8. कॉलेजच्या अलीकडील बातम्या, यश आणि उपक्रमांचा अभ्यास करा. यामुळे कॉलेजबद्दल तुमची रुची दिसून येते आणि मुलाखतीसाठी उपयुक्त चर्चा विषय मिळू शकतात.",
        },
        {
            id: 9,
            img: '/Thoughtful_Questions.png',
            title: " तपशिलवार प्रश्न तयार करा",
            content: '9. मुलाखत घेतल्यावर विचारण्यासाठी विचारपूर्वक प्रश्नांची यादी तयार करा, जसे की “संघाला सर्वात मोठे आव्हाने कोणती आहेत?” किंवा “कॉलेजच्या संस्कृतीबद्दल थोडक्यात सांगू शकता का?”',
        },
        {
            id: 10,
            img: '/Rest_Preparation.png',
            title: " योग्य विश्रांती घ्या आणि तयारी करा",
            content: '10. मुलाखतीपूर्वी तुम्हाला पुरेशी झोप आणि तयारीसाठी वेळ मिळावा याची खात्री करा. यामुळे तुम्हाला आत्मविश्वास, एकाग्रता आणि सकारात्मक छाप देण्यासाठी तयारी होईल.',
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
        utterance.lang = 'en-US';
        utterance.rate = 1.2;
        window.speechSynthesis.speak(utterance);
        return new Promise(resolve => {
            utterance.onend = resolve;
        });
    };

    // Test speaker by reading a sentence
    const testSpeaker = async () => {
        setTestMessage('स्पीकर तपासणी चालू आहे... कृपया काळजीपूर्वक ऐका');
        await speak('हा स्पीकर चाचणी संदेश आहे. जर तुम्हाला हा स्पष्टपणे ऐकू येत असेल, तर तुमचा स्पीकर व्यवस्थित कार्यरत आहे.');
        setTestMessage('स्पीकर तपासणी पूर्ण झाली आहे. मायक्रोफोन तपासण्यासाठी कृपया पुढील बटणावर क्लिक करा.');
    };

    // Test microphone by having user read a sentence
    const testMicrophone = async () => {
        setTestMessage('मायक्रोफोन तपासणी सुरू आहे. कृपया खालील वाक्य नीट उच्चारावे: "The quick brown fox jumps over the lazy dog."');

        // Initialize speech recognition
        recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        // Speak the test sentence
        await speak('कृपया माझ्या नंतर पुनः उच्चार करा: The quick brown fox jumps over the lazy dog.');

        // Start listening for user response
        recognitionRef.current.start();
        setTestMessage('आम्ही तुमचा आवाज ऐकत आहोत, कृपया बोला: "The quick brown fox jumps over the lazy dog."');

        return new Promise(resolve => {
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript.toLowerCase().includes('quick brown fox')) {
                    setTestMessage('मायक्रोफोन तपासणी यशस्वीरीत्या पूर्ण झाली आहे');
                    resolve(true);
                } else {
                    setTestMessage('कृपया पुन्हा प्रयत्न करा. खालील वाक्य माझ्या नंतर बोला: "The quick brown fox jumps over the lazy dog."');
                    resolve(false);
                }
            };

            recognitionRef.current.onerror = () => {
                setTestMessage('मायक्रोफोन एक्सेस डिनायड आहे. कृपया मायक्रोफोनसाठी परवानगी ऑन करा.');
                resolve(false);
            };
        });
    };

    // Handle test progression
    const handleNextTest = async () => {
        if (testPhase === 'speaker') {
            await testSpeaker();
            setTestPhase('mic');
        } else if (testPhase === 'mic') {
            const micWorking = await testMicrophone();
            if (micWorking) {
                setTestPhase('done');
                setTestMessage('डिव्हाइस टेस्ट पूर्ण झाल्या आहेत! आता तुम्ही मुलाखत सुरू करू शकता.');
                setIsButtonEnabled(true);
            }
        }
    };

    // Run speaker test on component mount
    useEffect(() => {
        testSpeaker();

        // Cleanup speech recognition on unmount
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

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

    // Check API response status periodically
    useEffect(() => {
        const checkApiResponseStatus = () => {
            const responseStatus = localStorage.getItem("apiResponseStatus");
            if (responseStatus === "success") {
                setIsButtonEnabled(true);
            } else {
                setIsButtonEnabled(false);
            }
        };

        const intervalId = setInterval(checkApiResponseStatus, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleButtonClick = async (e) => {
        // Remove apiResponseStatus from localStorage
        localStorage.removeItem("apiResponseStatus");

        router.push("/questionForm");

        try {
            // const collageName = "Dynamic Crane Engineers Pvt. Ltd.";  // You can replace this with dynamic data

            // 1. Attempt to get the existing collage data by collageName using GET method
            const getRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/isActive?collageName=${collageName}`, {
                method: 'GET',  // Use GET method to check if the collage exists
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            let isActive = 1;  // Default is 1 if collage doesn't exist
            let collageExists = false;

            if (getRes.ok) {
                const collageData = await getRes.json();
                if (collageData?.isActive !== undefined) {
                    isActive = collageData.isActive + 1;  // collage exists, increment isActive
                    collageExists = true;
                }
            }

            // 2. Prepare the data to be saved
            const data = { collageName, isActive };

            let finalRes;

            // 3. Use PUT if the collage already exists, else POST to create
            if (collageExists) {
                // collage exists, update with PUT method
                finalRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/isActive`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            } else {
                // collage doesn't exist, create with POST method
                finalRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/isActive`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            }

            if (!finalRes.ok) {
                const errorData = await finalRes.json();
                throw new Error(errorData?.error || "कॉलेजची माहिती जतन करण्यात अयशस्वी झाले.");
            }

            const finalResponse = await finalRes.json();
            if (finalResponse.success) {
                console.log("कॉलेज डेटा यशस्वीपणे अपडेट/तयार केला गेला आहे.");
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden font-sans">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/BG.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
            </div>

            {/* Top Navigation Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 md:p-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full transition-all duration-300 shadow-lg border border-white/20 group"
                >
                    <img src="/2.svg" className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" alt="Back" />
                </button>

                <div className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg p-1">
                    <img src="/logoo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
            </div>

            {/* Main Content Card */}
            <div className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row min-h-[500px]">

                {/* Left Side: Instructions / Carousel */}
                <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col relative">
                    <div className="mb-6 inline-flex self-start px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-700 to-purple-800 text-white text-xs font-bold tracking-wide uppercase shadow-sm">
                        मार्गदर्शक सूचना
                    </div>

                    <div className="flex-1 relative min-h-[300px] md:min-h-0">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 flex flex-col transition-opacity duration-700 ease-in-out ${currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-50 p-1 border-2 border-purple-200 overflow-hidden shadow-sm">
                                        <img src={slide.img} alt="" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                                        {slide.title}
                                    </h2>
                                </div>

                                <div className="mt-2 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
                                        {slide.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center gap-2 mt-4 md:mt-0">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-purple-800 w-6' : 'bg-gray-300 hover:bg-purple-400'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side: Device Test & Actions */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:p-10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-purple-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-6 bg-purple-600 rounded-full block"></span>
                            डिव्हाइस टेस्ट
                        </h3>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 mb-6 min-h-[100px] flex items-center justify-center text-center">
                            <p className={`text-sm font-medium ${testPhase === 'done' ? 'text-green-600' : 'text-purple-800'}`}>
                                {testMessage}
                            </p>
                        </div>

                        {testPhase !== 'done' && (
                            <button
                                onClick={handleNextTest}
                                className="w-full py-3 bg-white hover:bg-purple-50 text-purple-700 font-semibold rounded-xl border border-purple-200 hover:border-purple-300 shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {testPhase === 'speaker' ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        पुढे जा (Check Speaker)
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                                        माईक टेस्ट करा
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleButtonClick}
                            disabled={!isButtonEnabled}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform ${isButtonEnabled ? 'bg-gradient-to-r from-pink-700 to-purple-900 hover:shadow-purple-500/30 hover:-translate-y-1 active:scale-95' : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
                        >
                            मी तयार आहे, सुरू करूया!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Instruction;