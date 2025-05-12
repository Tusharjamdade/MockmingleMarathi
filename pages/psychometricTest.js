import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PsychometricTest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [reasonings, setReasonings] = useState([]);
  const [results, setResults] = useState(null);
  const [token, setToken] = useState('');
  const [profileType, setProfileType] = useState(null); // 'student' or 'employee'
  const [showCardSelection, setShowCardSelection] = useState(true); // Show card selection by default

  const generateTest = async (type) => {
    try {
      setLoading(true);
      setGenerating(true);
      setShowCardSelection(false); // Hide card selection
      
      // For testing, we'll use a fixed userId
      const response = await axios.post('/api/psychometricTests/generatePsychometricTest', {
        userId: "6462a8d8f12c6d92f9f1b9e3", // Test user ID
        profileType: type // Pass the profile type to the API
      });
      
      if (response.data.success) {
        setTest(response.data.test);
        // Initialize arrays for responses
        setSelectedOptions(new Array(response.data.test.questions.length).fill(null));
        setReasonings(new Array(response.data.test.questions.length).fill(''));
      } else {
        toast.error('Failed to load test');
        setShowCardSelection(true); // Show card selection again on error
      }
    } catch (error) {
      console.error('Error generating test:', error);
      toast.error('Error loading test: ' + (error.response?.data?.message || error.message));
      setShowCardSelection(true); // Show card selection again on error
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };
  
  const handleCardSelection = (type) => {
    setProfileType(type);
    generateTest(type);
  };

  const handleOptionSelect = (optionIndex) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  const handleReasoningChange = (e) => {
    const newReasonings = [...reasonings];
    newReasonings[currentQuestionIndex] = e.target.value;
    setReasonings(newReasonings);
  };

  const goToNextQuestion = () => {
    if (selectedOptions[currentQuestionIndex] === null) {
      toast.warning('Please select an option before continuing');
      return;
    }
    
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, submit test
      submitTest();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitTest = async () => {
    try {
      setEvaluating(true);
      
      // Prepare responses data
      const responses = selectedOptions.map((optionIndex, questionIndex) => ({
        questionIndex,
        selectedOption: optionIndex,
        reasoning: reasonings[questionIndex]
      }));
      
      const response = await axios.post('/api/psychometricTests/evaluatePsychometricTest', {
        testId: test._id,
        responses,
        userId: "6462a8d8f12c6d92f9f1b9e3", // Test user ID
        profileType: profileType
      });
      
      if (response.data.success) {
        setResults(response.data.evaluation);
      } else {
        toast.error('Failed to evaluate test');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Error evaluating test: ' + (error.response?.data?.message || error.message));
    } finally {
      setEvaluating(false);
    }
  };

  const renderStarRating = (score) => {
    return (
      <div className="flex items-center">
        {[...Array(3)].map((_, i) => (
          <svg 
            key={i}
            className={`w-6 h-6 ${i < score ? 'text-yellow-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Card selection screen
  if (showCardSelection) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Psychometric Test | SHAKKTII AI</title>
        </Head>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Psychometric Assessment</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your profile type to generate a personalized psychometric test that evaluates your competencies, decision-making style, and personality traits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Card */}
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition duration-300"
              onClick={() => handleCardSelection('student')}
            >
              <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-6">
                <img 
                  src="/student.png" 
                  alt="Student" 
                  className="h-32 w-32 object-contain"
                  onError={(e) => {
                    e.target.src = "/logoo.png";
                  }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Student Profile</h2>
                <p className="text-gray-600 mb-4">
                  Designed for students and academic environments. Evaluates academic potential, learning style, teamwork, and leadership qualities in educational contexts.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Academic collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Learning environment ethics</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Educational leadership</span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Select Student Profile
                </button>
              </div>
            </div>
            
            {/* Employee Card */}
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition duration-300"
              onClick={() => handleCardSelection('employee')}
            >
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center p-6">
                <img 
                  src="/employee.png" 
                  alt="Employee" 
                  className="h-32 w-32 object-contain"
                  onError={(e) => {
                    e.target.src = "/logoo.png";
                  }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional Profile</h2>
                <p className="text-gray-600 mb-4">
                  Tailored for working professionals. Evaluates workplace competencies, conflict resolution, leadership potential, and professional decision-making.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Workplace dynamics</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Professional ethics</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Management potential</span>
                  </li>
                </ul>
                <button className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                  Select Professional Profile
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              This assessment takes approximately 15-20 minutes to complete. Your responses are confidential and will be used to provide personalized insights into your competencies and potential.
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Head>
          <title>Psychometric Test | SHAKKTII AI</title>
        </Head>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl">
            {generating ? 'Generating your psychometric test...' : 'Loading...'}
          </p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Head>
          <title>Evaluating Test | SHAKKTII AI</title>
        </Head>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl">Evaluating your responses with AI...</p>
          <p className="mt-2 text-gray-600">This may take a minute. We're analyzing your decision-making style.</p>
        </div>
        <ToastContainer />
      </div>
    );
  }

  if (results) {
    const competencyAreas = [];
    const recommendations = [];
    
    // Extract evaluation data from the API response
    const evaluation = results.evaluation || {};
    const profileType = results.profileType || 'employee';
    
    // Helper function to safely access nested properties
    const safeGet = (obj, path, defaultValue) => {
      try {
        const parts = path.split('.');
        let current = obj;
        
        for (const part of parts) {
          if (current === undefined || current === null) {
            return defaultValue;
          }
          current = current[part];
        }
        
        return current === undefined || current === null ? defaultValue : current;
      } catch (e) {
        return defaultValue;
      }
    };
    
    if (profileType === 'student') {
      // Only add items if they exist
      if (evaluation.academicCollaboration) {
        competencyAreas.push({
          name: 'Academic Collaboration',
          score: safeGet(evaluation, 'academicCollaboration.score', 2),
          comments: safeGet(evaluation, 'academicCollaboration.comments', 'No comments available')
        });
      }
      
      if (evaluation.learningEthics) {
        competencyAreas.push({
          name: 'Learning Ethics',
          score: safeGet(evaluation, 'learningEthics.score', 2),
          comments: safeGet(evaluation, 'learningEthics.comments', 'No comments available')
        });
      }
      
      if (evaluation.educationalLeadership) {
        competencyAreas.push({
          name: 'Educational Leadership',
          score: safeGet(evaluation, 'educationalLeadership.score', 2),
          comments: safeGet(evaluation, 'educationalLeadership.comments', 'No comments available')
        });
      }
      
      if (evaluation.studyGroupDynamics) {
        competencyAreas.push({
          name: 'Study Group Dynamics',
          score: safeGet(evaluation, 'studyGroupDynamics.score', 2),
          comments: safeGet(evaluation, 'studyGroupDynamics.comments', 'No comments available')
        });
      }
      
      if (evaluation.academicConflictResolution) {
        competencyAreas.push({
          name: 'Academic Conflict Resolution',
          score: safeGet(evaluation, 'academicConflictResolution.score', 2),
          comments: safeGet(evaluation, 'academicConflictResolution.comments', 'No comments available')
        });
      }
      
      if (evaluation.classroomParticipation) {
        competencyAreas.push({
          name: 'Classroom Participation',
          score: safeGet(evaluation, 'classroomParticipation.score', 2),
          comments: safeGet(evaluation, 'classroomParticipation.comments', 'No comments available')
        });
      }
      
      recommendations.push(
        { 
          title: 'Recommended Learning Styles', 
          items: safeGet(evaluation, 'recommendedLearningStyles', ['Visual learning', 'Practical application', 'Group study']) 
        },
        { 
          title: 'Academic Path Recommendations', 
          items: safeGet(evaluation, 'academicPathRecommendations', ['Consider peer tutoring', 'Join study groups', 'Seek hands-on learning opportunities']) 
        }
      );
    } else {
      // Employee profile - use the original competencies
      // Empathy
      competencyAreas.push({
        name: 'Empathy',
        score: safeGet(evaluation, 'empathy.score', 2),
        comments: safeGet(evaluation, 'empathy.comments', 'No comments available')
      });
      
      // Assertiveness
      competencyAreas.push({
        name: 'Assertiveness',
        score: safeGet(evaluation, 'assertiveness.score', 2),
        comments: safeGet(evaluation, 'assertiveness.comments', 'No comments available')
      });
      
      // Ethical Reasoning
      competencyAreas.push({
        name: 'Ethical Reasoning',
        score: safeGet(evaluation, 'ethicalReasoning.score', 2),
        comments: safeGet(evaluation, 'ethicalReasoning.comments', 'No comments available')
      });
      
      // Collaboration
      competencyAreas.push({
        name: 'Collaboration',
        score: safeGet(evaluation, 'collaboration.score', 2),
        comments: safeGet(evaluation, 'collaboration.comments', 'No comments available')
      });
      
      // Conflict Resolution
      competencyAreas.push({
        name: 'Conflict Resolution',
        score: safeGet(evaluation, 'conflictResolution.score', 2),
        comments: safeGet(evaluation, 'conflictResolution.comments', 'No comments available')
      });
      
      // Leadership Potential
      competencyAreas.push({
        name: 'Leadership Potential',
        score: safeGet(evaluation, 'leadershipPotential.score', 2),
        comments: safeGet(evaluation, 'leadershipPotential.comments', 'No comments available')
      });
      
      recommendations.push(
        { 
          title: 'Career Path Recommendations', 
          items: safeGet(evaluation, 'careerPathRecommendations', ['Project management', 'Team leadership', 'Specialized technical role']) 
        },
        { 
          title: 'Role Fit Recommendations', 
          items: safeGet(evaluation, 'roleFitRecommendations', ['Team lead', 'Project coordinator', 'Technical specialist']) 
        }
      );
    }
    
    // If no competency areas were added (due to missing data), add default ones
    if (competencyAreas.length === 0) {
      if (profileType === 'student') {
        competencyAreas.push(
          { name: 'Academic Collaboration', score: 2, comments: 'Default assessment' },
          { name: 'Learning Ethics', score: 2, comments: 'Default assessment' },
          { name: 'Educational Leadership', score: 2, comments: 'Default assessment' }
        );
      } else {
        competencyAreas.push(
          { name: 'Workplace Dynamics', score: 2, comments: 'Default assessment' },
          { name: 'Professional Ethics', score: 2, comments: 'Default assessment' },
          { name: 'Management Potential', score: 2, comments: 'Default assessment' }
        );
      }
    }

    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Psychometric Test Results | SHAKKTII AI</title>
        </Head>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Your Psychometric Assessment Results</h1>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Competency Ratings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {competencyAreas.map((area, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{area.name}</h3>
                      {renderStarRating(area.score)}
                    </div>
                    <p className="text-sm text-gray-600">{area.comments}</p>
                  </div>
                ))}
              </div>
            </div>
            

            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Overall Assessment</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Overall Score</h3>
                  <div className="flex">
                    {renderStarRating(safeGet(evaluation, 'overallScore', 2))}
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{safeGet(evaluation, 'analysis', 'This is an automatically generated analysis based on your responses to the psychometric test questions.')}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Strengths</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {safeGet(evaluation, 'strengths', ['Communication skills', 'Problem-solving ability', 'Adaptability']).map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Areas to Improve</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    {safeGet(evaluation, 'areasToImprove', ['Time management', 'Group collaboration', 'Self-assessment']).map((area, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-amber-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {recommendations.map((rec, i) => (
              <div key={i} className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{rec.title}</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {rec.items.map((item, index) => (
                    <li key={index} className="ml-4">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => router.push('/psychometricTestHistory')}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                View Test History
              </button>
              <button
                onClick={() => {
                  setResults(null);
                  setTest(null);
                  setCurrentQuestionIndex(0);
                  setShowCardSelection(true); // Show card selection again
                }}
                className="ml-4 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Take New Test
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Head>
          <title>Psychometric Test | SHAKKTII AI</title>
        </Head>
        <div className="text-center">
          <p className="text-xl text-red-600">Failed to load test. Please try again.</p>
          <button
            onClick={() => checkExistingTest(token)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Psychometric Test | SHAKKTII AI</title>
      </Head>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Psychometric Assessment</h1>
            <p className="text-blue-100">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </p>
          </div>
          
          <div className="w-full bg-gray-200 h-2">
            <div 
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="inline-block px-3 py-1 text-sm font-medium rounded-full mb-2"
                style={{ 
                  backgroundColor: currentQuestion.difficulty === 'Easy' ? '#e0f2fe' : 
                                  currentQuestion.difficulty === 'Moderate' ? '#fef3c7' : 
                                  '#fee2e2',
                  color: currentQuestion.difficulty === 'Easy' ? '#0369a1' : 
                         currentQuestion.difficulty === 'Moderate' ? '#92400e' : 
                         '#b91c1c'
                }}
              >
                {currentQuestion.difficulty} Difficulty
              </div>
              <h2 className="text-xl font-medium text-gray-800">{currentQuestion.scenario}</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOptions[currentQuestionIndex] === index 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-5 w-5 mt-0.5 border rounded-full flex items-center justify-center ${
                      selectedOptions[currentQuestionIndex] === index 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {selectedOptions[currentQuestionIndex] === index && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-base ${
                        selectedOptions[currentQuestionIndex] === index 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-700'
                      }`}>
                        {option.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <label htmlFor="reasoning" className="block text-sm font-medium text-gray-700 mb-1">
                Optional: Why did you choose this response? (Your reasoning)
              </label>
              <textarea
                id="reasoning"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain your thought process..."
                value={reasonings[currentQuestionIndex] || ''}
                onChange={handleReasoningChange}
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={goToNextQuestion}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {currentQuestionIndex < test.questions.length - 1 ? 'Next' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
