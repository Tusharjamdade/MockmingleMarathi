import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function PracticeProgress() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [progressData, setProgressData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalSessionsCompleted: 0,
    totalQuestionsAttempted: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    formattedTimeSpent: '',
    skillBreakdown: {}
  });
  const [token, setToken] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      
      // Get user info from localStorage
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage) {
        setUserName(userFromStorage.fullName || '');
      }
      
      fetchProgressData('all');
    }
  }, []);

  const fetchProgressData = async (skill) => {
    setLoading(true);
    try {
      // Get user ID from localStorage for the query parameter instead of using auth header
      const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const userId = userObj?._id || userObj?.id || '6462d8fbf6c3e30000000001';
      
      // TEMPORARY: Remove auth header to avoid 431 error
      const response = await fetch(`/api/getPracticeProgress?skillArea=${skill}&userId=${userId}`, {
        method: 'GET'
        // Auth header temporarily removed
        /*headers: {
          'Authorization': `Bearer ${token}`
        }*/
      });

      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }

      const data = await response.json();
      
      setProgressData(data.progress);
      setRecentActivity(data.recentActivity);
      setOverallStats(data.overallStats);
      setSelectedSkill(skill);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get color based on skill area
  const getSkillColor = (skill) => {
    const colors = {
      'Speaking': 'from-pink-500 to-rose-700',
      'Listening': 'from-blue-500 to-cyan-700',
      'Reading': 'from-emerald-500 to-teal-700',
      'Writing': 'from-purple-500 to-indigo-700',
      'Personality': 'from-amber-500 to-orange-700'
    };
    return colors[skill] || 'from-gray-500 to-gray-700';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // return (
  //   <>
  //     <Head>
  //       <title>SHAKKTII AI - प्रॅक्टिस प्रोग्रेस</title>
  //     </Head>
  //     <div className="min-h-screen bg-gray-100" style={{ backgroundImage: "url('/BG.jpg')", backgroundSize: 'cover' }}>
  //       <div className="container mx-auto px-4 py-16">
  //         {/* Header */}
  //         <div className="flex items-center justify-between mb-12">
  //           <div>
  //             <button 
  //               onClick={() => router.push('/practices')} 
  //               className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
  //             >
  //               <img src="/2.svg" alt="Back" className="w-8 h-8 mr-2" />
  //               <span className="text-lg font-medium">सरावांकडे परत जा</span>
  //             </button>
  //           </div>
  //           <div className="flex items-center">
  //             <div className="mr-4 text-right">
  //               <p className="text-sm text-gray-600">प्रोग्रेस</p>
  //               <p className="font-semibold text-lg text-purple-900">{userName}</p>
  //             </div>
  //             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
  //               <img src="/logoo.png" alt="Logo" className="w-10 h-10" />
  //             </div>
  //           </div>
  //         </div>

  //         {/* Title */}
  //         <div className="text-center mb-12">
  //           <h1 className="text-4xl font-bold text-purple-900">प्रॅक्टिस प्रोग्रेस रिपोर्ट</h1>
  //           <p className="text-lg text-gray-700 mt-2">
  //             तुमच्या सुधारणा विविध प्रॅक्टिस क्षेत्रांमध्ये ट्रॅक करा.
  //           </p>
  //         </div>

  //         {/* Skill Filter */}
  //         <div className="mb-8 flex flex-wrap justify-center gap-2">
  //           {['all', 'Speaking', 'Listening', 'Reading', 'Writing', 'Personality'].map((skill) => (
  //             <button
  //               key={skill}
  //               onClick={() => fetchProgressData(skill)}
  //               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
  //                 selectedSkill === skill
  //                   ? 'bg-purple-600 text-white'
  //                   : 'bg-white text-gray-700 hover:bg-gray-100'
  //               }`}
  //             >
  //               {skill === 'all' ? 'All Skills' : skill}
  //             </button>
  //           ))}
  //         </div>

  //         {loading ? (
  //           <div className="flex justify-center items-center py-20">
  //             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  //           </div>
  //         ) : (
  //           <>
  //             {/* Overall Stats */}
  //             <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
  //               <h2 className="text-2xl font-bold text-gray-800 mb-6">ओव्हरऑल प्रोग्रेस</h2>
                
  //               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  //                 <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 flex flex-col items-center">
  //                   <span className="text-sm text-gray-600">सेशन्स पूर्ण झाले</span>
  //                   <span className="text-3xl font-bold text-purple-900">{overallStats.totalSessionsCompleted}</span>
  //                 </div>
                  
  //                 <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 flex flex-col items-center">
  //                   <span className="text-sm text-gray-600">प्रश्नांची उत्तरे दिली</span>
  //                   <span className="text-3xl font-bold text-purple-900">{overallStats.totalQuestionsAttempted}</span>
  //                 </div>
                  
  //                 <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 flex flex-col items-center">
  //                   <span className="text-sm text-gray-600">सरासरी गुण</span>
  //                   <span className="text-3xl font-bold text-purple-900">
  //                     {overallStats.averageScore.toFixed(1)} / 3
  //                   </span>
  //                 </div>
                  
  //                 <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 flex flex-col items-center">
  //                   <span className="text-sm text-gray-600">एकूण सरावाचा वेळ</span>
  //                   <span className="text-3xl font-bold text-purple-900">{overallStats.formattedTimeSpent}</span>
  //                 </div>
  //               </div>
                
  //               {/* Skill Breakdown Bar Chart */}
  //               {Object.keys(overallStats.skillBreakdown).length > 0 && (
  //                 <div className="mt-8">
  //                   <h3 className="text-lg font-semibold text-gray-700 mb-4">स्किल ब्रेकडाउन</h3>
  //                   <div className="space-y-4">
  //                     {Object.entries(overallStats.skillBreakdown).map(([skill, data]) => (
  //                       <div key={skill} className="space-y-1">
  //                         <div className="flex justify-between">
  //                           <span className="text-sm font-medium text-gray-700">{skill}</span>
  //                           <span className="text-sm text-gray-600">
  //                             {data.averageScore.toFixed(1)}/3 ({data.sessionsCompleted} sessions)
  //                           </span>
  //                         </div>
  //                         <div className="w-full bg-gray-200 rounded-full h-2.5">
  //                           <div 
  //                             className={`h-2.5 rounded-full bg-gradient-to-r ${getSkillColor(skill)}`}
  //                             style={{ width: `${(data.averageScore / 3) * 100}%` }}
  //                           ></div>
  //                         </div>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
              
  //             {/* Detailed Progress Cards */}
  //             {progressData.length > 0 ? (
  //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
  //                 {progressData.map((progress, index) => (
  //                   <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
  //                     <div className={`h-2 bg-gradient-to-r ${getSkillColor(progress.skillArea)}`}></div>
  //                     <div className="p-6">
  //                       <div className="flex justify-between items-start mb-4">
  //                         <div>
  //                           <h3 className="text-xl font-bold text-gray-800">{progress.skillArea}</h3>
  //                           <p className="text-sm text-gray-600">{progress.difficulty} लेव्हल</p>
  //                         </div>
  //                         <div className="w-16 h-16">
  //                           <CircularProgressbar
  //                             value={(progress.averageScore / 3) * 100}
  //                             text={`${progress.averageScore.toFixed(1)}`}
  //                             styles={buildStyles({
  //                               textSize: '30px',
  //                               pathColor: progress.skillArea === 'Speaking' ? '#ec4899' : 
  //                                         progress.skillArea === 'Listening' ? '#0ea5e9' : 
  //                                         progress.skillArea === 'Reading' ? '#10b981' : 
  //                                         progress.skillArea === 'Writing' ? '#8b5cf6' : '#f59e0b',
  //                               textColor: '#4a044e',
  //                               trailColor: '#e9d5ff',
  //                             })}
  //                           />
  //                         </div>
  //                       </div>
                        
  //                       <div className="grid grid-cols-2 gap-3 text-sm mb-4">
  //                         <div className="bg-gray-50 p-2 rounded">
  //                           <p className="text-gray-500">सेशन्स</p>
  //                           <p className="font-medium">{progress.sessionsCompleted}</p>
  //                         </div>
  //                         <div className="bg-gray-50 p-2 rounded">
  //                           <p className="text-gray-500">प्रश्न</p>
  //                           <p className="font-medium">{progress.questionsAttempted}</p>
  //                         </div>
  //                         <div className="bg-gray-50 p-2 rounded">
  //                           <p className="text-gray-500">लागलेला वेळ</p>
  //                           <p className="font-medium">{progress.formattedTimeSpent}</p>
  //                         </div>
  //                         <div className="bg-gray-50 p-2 rounded">
  //                           <p className="text-gray-500">अखेरचा सराव</p>
  //                           <p className="font-medium">{formatDate(progress.lastUpdated).split(',')[0]}</p>
  //                         </div>
  //                       </div>
                        
  //                       {progress.strengths.length > 0 && (
  //                         <div className="mb-3">
  //                           <h4 className="text-sm font-medium text-gray-700 mb-1">तुमची क्षमता:</h4>
  //                           <div className="flex flex-wrap gap-1">
  //                             {progress.strengths.map((strength, i) => (
  //                               <span 
  //                                 key={i} 
  //                                 className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
  //                               >
  //                                 {strength}
  //                               </span>
  //                             ))}
  //                           </div>
  //                         </div>
  //                       )}
                        
  //                       {progress.areasToImprove.length > 0 && (
  //                         <div>
  //                           <h4 className="text-sm font-medium text-gray-700 mb-1">सुधारणा आवश्यक क्षेत्रे:</h4>
  //                           <div className="flex flex-wrap gap-1">
  //                             {progress.areasToImprove.map((area, i) => (
  //                               <span 
  //                                 key={i} 
  //                                 className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full"
  //                               >
  //                                 {area}
  //                               </span>
  //                             ))}
  //                           </div>
  //                         </div>
  //                       )}
                        
  //                       <div className="mt-4 flex justify-center">
  //                         <button
  //                           onClick={() => {
  //                             const path = progress.skillArea === 'Speaking' ? '/speakingPractice' : 
  //                                         progress.skillArea === 'Listening' ? '/listeningPractice' :
  //                                         progress.skillArea === 'Reading' || progress.skillArea === 'Writing' ? '/readingWritingPractice' :
  //                                         '/personalityTest';
  //                             router.push(path);
  //                           }}
  //                           className={`px-4 py-2 rounded-lg text-white text-sm font-medium bg-gradient-to-r ${getSkillColor(progress.skillArea)} hover:opacity-90`}
  //                         >
  //                           सराव सुरू ठेवा
  //                         </button>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 ))}
  //               </div>
  //             ) : (
  //               <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-10">
  //                 <h3 className="text-xl font-bold text-gray-800 mb-3">सरावाचा डेटा अद्याप उपलब्ध नाही</h3>
  //                 <p className="text-gray-600 mb-6">
  //                   इथे तुमची प्रोग्रेस पाहण्यासाठी सराव सुरू करा. सुरूवात करण्यासाठी सरावाचा प्रकार आणि डिफिकल्टी लेव्हल निवडा.
  //                 </p>
  //                 <button
  //                   onClick={() => router.push('/practices')}
  //                   className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700"
  //                 >
  //                   सराव सुरू ठेवा
  //                 </button>
  //               </div>
  //             )}
              
  //             {/* Recent Activity */}
  //             <div className="bg-white rounded-xl shadow-lg p-6">
  //               <h2 className="text-2xl font-bold text-gray-800 mb-6">लेटेस्ट अ‍ॅक्टिव्हिटी</h2>
                
  //               {recentActivity.length > 0 ? (
  //                 <div className="divide-y divide-gray-200">
  //                   {recentActivity.map((activity, index) => (
  //                     <div key={index} className="py-4 flex items-start">
  //                       <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getSkillColor(activity.skillArea || 'Speaking')} flex items-center justify-center text-white font-bold mr-4`}>
  //                         {activity.cardId?.charAt(0) || 'A'}
  //                       </div>
  //                       <div className="flex-1">
  //                         <div className="flex justify-between items-start">
  //                           <h4 className="text-lg font-medium text-gray-800">
  //                             {activity.cardId || 'Practice Question'}
  //                           </h4>
  //                           <div className="flex">
  //                             {[1, 2, 3].map((star) => (
  //                               <svg
  //                                 key={star}
  //                                 xmlns="http://www.w3.org/2000/svg"
  //                                 className={`h-5 w-5 ${
  //                                   star <= activity.score ? 'text-yellow-500' : 'text-gray-300'
  //                                 }`}
  //                                 viewBox="0 0 20 20"
  //                                 fill="currentColor"
  //                               >
  //                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  //                               </svg>
  //                             ))}
  //                           </div>
  //                         </div>
  //                         <p className="text-gray-600 text-sm mt-1">
  //                           {activity.userResponse?.length > 100 
  //                             ? activity.userResponse.substring(0, 100) + '...' 
  //                             : activity.userResponse}
  //                         </p>
  //                         <div className="flex justify-between items-center mt-2">
  //                           <span className="text-xs text-gray-500">
  //                             {formatDate(activity.completedAt || activity.createdAt)}
  //                           </span>
  //                           {activity.timeSpent && (
  //                             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
  //                               {activity.timeSpent} सेकंद
  //                             </span>
  //                           )}
  //                         </div>
  //                       </div>
  //                     </div>
  //                   ))}
  //                 </div>
  //               ) : (
  //                 <div className="text-center py-6">
  //                   <p className="text-gray-600">
  //                    सध्या कोणतीही अ‍ॅक्टिव्हिटी उपलब्ध नाही. तुमच्या प्रोग्रेसचे परीक्षण करण्यासाठी कृपया सराव सुरू करा.
  //                   </p>                  </div>
  //               )}
  //             </div>
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   </>
  // );
return (
    <>
      <Head>
        <title>SHAKKTII AI - प्रॅक्टिस प्रोग्रेस</title>
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

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          
          {/* Header Navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <button 
              onClick={() => router.push('/practices')} 
              className="group flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 backdrop-blur-md"
            >
              <div className="p-1.5 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                <img src="/2.svg" alt="Back" className="w-5 h-5 invert" />
              </div>
              <span className="text-sm font-medium tracking-wide text-gray-200 group-hover:text-white">सरावांकडे परत जा</span>
            </button>

            <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-purple-300 font-bold uppercase tracking-wider">Student Profile</p>
                <p className="font-bold text-lg text-white leading-none">{userName}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <div className="w-full h-full rounded-full bg-[#1a103c] flex items-center justify-center overflow-hidden">
                   <img src="/logoo.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12 animate-fade-in-down">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-pink-200 mb-4 drop-shadow-sm">
              प्रॅक्टिस प्रोग्रेस रिपोर्ट
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              तुमच्या सुधारणा विविध प्रॅक्टिस क्षेत्रांमध्ये ट्रॅक करा आणि स्वतःला अधिक चांगले बनवा.
            </p>
          </div>

          {/* Skill Filter Pills */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {['all', 'Speaking', 'Listening', 'Reading', 'Writing', 'Personality'].map((skill) => (
              <button
                key={skill}
                onClick={() => fetchProgressData(skill)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${
                  selectedSkill === skill
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {skill === 'all' ? 'All Skills' : skill}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-purple-200 animate-pulse font-medium">डेटा लोड होत आहे...</p>
            </div>
          ) : (
            <div className="space-y-10 animate-fade-in-up">
              
              {/* Overall Stats Grid */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                  <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">ओव्हरऑल प्रोग्रेस (Overall Stats)</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Stat Card 1 */}
                  <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-gray-400 text-sm font-medium">सेशन्स पूर्ण</span>
                      <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:text-blue-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-white">{overallStats.totalSessionsCompleted}</span>
                  </div>
                  
                  {/* Stat Card 2 */}
                  <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-gray-400 text-sm font-medium">प्रश्नांची उत्तरे</span>
                      <div className="p-2 bg-green-500/20 rounded-lg text-green-400 group-hover:text-green-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-white">{overallStats.totalQuestionsAttempted}</span>
                  </div>
                  
                  {/* Stat Card 3 */}
                  <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-gray-400 text-sm font-medium">सरासरी गुण</span>
                      <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400 group-hover:text-yellow-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white">{overallStats.averageScore.toFixed(1)}</span>
                      <span className="text-sm text-gray-500 font-medium">/ 3</span>
                    </div>
                  </div>
                  
                  {/* Stat Card 4 */}
                  <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-gray-400 text-sm font-medium">एकूण वेळ</span>
                      <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400 group-hover:text-pink-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-white truncate">{overallStats.formattedTimeSpent}</span>
                  </div>
                </div>
                
                {/* Skill Breakdown Horizontal Bars */}
                {Object.keys(overallStats.skillBreakdown).length > 0 && (
                  <div className="mt-10 pt-8 border-t border-white/5">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">कौशल्य विश्लेषण (Skill Breakdown)</h3>
                    <div className="space-y-6">
                      {Object.entries(overallStats.skillBreakdown).map(([skill, data]) => (
                        <div key={skill} className="group">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-base font-medium text-white group-hover:text-purple-300 transition-colors">{skill}</span>
                            <span className="text-xs text-gray-400 font-mono">
                              <span className="text-white font-bold">{data.averageScore.toFixed(1)}</span>/3 Avg • {data.sessionsCompleted} sessions
                            </span>
                          </div>
                          <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getSkillColor(skill)} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.4)]`}
                              style={{ width: `${(data.averageScore / 3) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Detailed Progress Cards Grid */}
              {progressData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {progressData.map((progress, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 hover:shadow-2xl transition-all duration-300 group flex flex-col">
                      
                      {/* Top Color Bar */}
                      <div className={`h-2 bg-gradient-to-r ${getSkillColor(progress.skillArea)}`}></div>
                      
                      <div className="p-6 md:p-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{progress.skillArea}</h3>
                            <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-xs text-gray-300 border border-white/5">
                              {progress.difficulty} Level
                            </span>
                          </div>
                          
                          <div className="w-16 h-16 relative">
                            <CircularProgressbar
                              value={(progress.averageScore / 3) * 100}
                              text={`${progress.averageScore.toFixed(1)}`}
                              styles={buildStyles({
                                textSize: '28px',
                                pathColor: progress.skillArea === 'Speaking' ? '#ec4899' : 
                                          progress.skillArea === 'Listening' ? '#0ea5e9' : 
                                          progress.skillArea === 'Reading' ? '#10b981' : 
                                          progress.skillArea === 'Writing' ? '#8b5cf6' : '#f59e0b',
                                textColor: '#fff',
                                trailColor: 'rgba(255,255,255,0.1)',
                                backgroundColor: 'transparent'
                              })}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-500 uppercase font-bold">सेशन्स</p>
                            <p className="font-mono text-lg text-white">{progress.sessionsCompleted}</p>
                          </div>
                          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-500 uppercase font-bold">वेळ</p>
                            <p className="font-mono text-lg text-white truncate">{progress.formattedTimeSpent}</p>
                          </div>
                          <div className="col-span-2 bg-black/20 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                            <p className="text-xs text-gray-500 uppercase font-bold">Last Active</p>
                            <p className="font-mono text-sm text-gray-300">{formatDate(progress.lastUpdated).split(',')[0]}</p>
                          </div>
                        </div>
                        
                        {/* Tags Section */}
                        <div className="space-y-4 flex-1">
                          {progress.strengths.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-green-400 mb-2 uppercase flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Strengths
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {progress.strengths.slice(0, 3).map((strength, i) => (
                                  <span key={i} className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-300 text-xs">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {progress.areasToImprove.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold text-amber-400 mb-2 uppercase flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Focus Area
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {progress.areasToImprove.slice(0, 3).map((area, i) => (
                                  <span key={i} className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="mt-6 pt-4 border-t border-white/5">
                          <button
                            onClick={() => {
                              const path = progress.skillArea === 'Speaking' ? '/speakingPractice' : 
                                          progress.skillArea === 'Listening' ? '/listeningPractice' :
                                          progress.skillArea === 'Reading' || progress.skillArea === 'Writing' ? '/readingWritingPractice' :
                                          '/personalityTest';
                              router.push(path);
                            }}
                            className={`w-full py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 bg-gradient-to-r ${getSkillColor(progress.skillArea)} hover:opacity-90`}
                          >
                            सराव सुरू ठेवा &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">सरावाचा डेटा अद्याप उपलब्ध नाही</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    तुम्ही अजून कोणताही सराव पूर्ण केलेला नाही. तुमची प्रगती पाहण्यासाठी आजच सुरुवात करा!
                  </p>
                  <button
                    onClick={() => router.push('/practices')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1"
                  >
                    सराव सुरू करा
                  </button>
                </div>
              )}
              
              {/* Recent Activity Section */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                   <span className="w-1.5 h-6 bg-pink-500 rounded-full"></span>
                   <h2 className="text-xl md:text-2xl font-bold text-white">लेटेस्ट अ‍ॅक्टिव्हिटी (Recent Activity)</h2>
                </div>
                
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="bg-black/20 hover:bg-black/30 rounded-2xl p-4 transition-colors flex items-start gap-4 border border-white/5">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getSkillColor(activity.skillArea || 'Speaking')} flex flex-col items-center justify-center text-white shadow-lg shrink-0`}>
                          <span className="text-xs font-bold opacity-80">{activity.skillArea ? activity.skillArea.substring(0,3) : 'Gen'}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <h4 className="text-base font-bold text-white truncate pr-2">
                              {activity.cardId || 'Practice Question'}
                            </h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap bg-white/5 px-2 py-1 rounded">
                              {formatDate(activity.completedAt || activity.createdAt)}
                            </span>
                          </div>
                          
                          <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                            {activity.userResponse || "No text response recorded"}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex gap-1">
                              {[1, 2, 3].map((star) => (
                                <svg key={star} className={`h-4 w-4 ${star <= activity.score ? 'text-yellow-400 fill-current' : 'text-gray-700 fill-current'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              ))}
                            </div>
                            {activity.timeSpent && (
                              <span className="text-xs text-purple-300 font-mono">
                                {activity.timeSpent}s
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    सध्या कोणतीही अ‍ॅक्टिव्हिटी उपलब्ध नाही.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PracticeProgress;
