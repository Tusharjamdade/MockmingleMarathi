import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const InterviewProgress = ({ userData = null }) => {
  const router = useRouter();
  const [interviewStats, setInterviewStats] = useState({
    no_of_interviews: 1,
    no_of_interviews_completed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // First set stats from props or localStorage for immediate display
    if (userData) {
      setInterviewStats({
        no_of_interviews: userData.no_of_interviews || 1,
        no_of_interviews_completed: userData.no_of_interviews_completed || 0,
      });
    } else {
      const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
      setInterviewStats({
        no_of_interviews: userFromStorage.no_of_interviews || 1,
        no_of_interviews_completed: userFromStorage.no_of_interviews_completed || 0,
      });
    }
    
    // Then fetch the latest data from the API
    fetchUserStats();
  }, [userData]);
  
  const fetchUserStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get email from localStorage
      const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
      const email = userFromStorage.email;
      
      if (!email) {
        setLoading(false);
        return;
      }
      
      // Try to fetch from API but don't break the component if it fails
      try {
        const response = await fetch(`/api/getUserStats?email=${encodeURIComponent(email)}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.stats) {
            // Update the stats with the latest data from the API
            setInterviewStats({
              no_of_interviews: data.stats.no_of_interviews || 1,
              no_of_interviews_completed: data.stats.no_of_interviews_completed || 0,
            });
            
            // Also update the user in localStorage for consistency
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {
              ...currentUser,
              no_of_interviews: data.stats.no_of_interviews,
              no_of_interviews_completed: data.stats.no_of_interviews_completed
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } else {
          // If API fails, use the user data from localStorage as fallback
          console.log('Using fallback user data from localStorage');
        }
      } catch (apiErr) {
        // If there's an error with the API, log it but don't break the component
        console.log('API request failed, using localStorage data instead');
      }
    } catch (err) {
      console.error('Error processing user stats:', err);
      setError('Unable to load interview statistics');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle starting a new interview
  const handleStartInterview = () => {
    router.push('/role');
  };

  // Always show 100% completion since interviews are unlimited
  const completionPercentage = 100;

  // return (
  //   <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 relative">
  //     {loading && (
  //       <div className="absolute top-2 right-2">
  //         <div className="w-4 h-4 border-2 border-t-2 border-blue-500 rounded-full animate-spin"></div>
  //       </div>
  //     )}
  //     <h2 className="text-xl font-semibold mb-4 text-white">मुलाखतीच्या प्रगतीचा आढावा</h2>
      
  //     <div className="flex justify-between items-center mb-4">
  //       <span className="text-lg font-medium text-white">मुलाखतीची प्रगती</span>
  //       <span className="text-xl font-bold text-white">
  //         {interviewStats.no_of_interviews_completed} पूर्ण
  //       </span>
  //     </div>
      
  //     <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
  //       <div 
  //         className="bg-gradient-to-r from-indigo-500 to-pink-500 h-4 rounded-full transition-all duration-500" 
  //         style={{ width: `${completionPercentage}%` }}
  //       ></div>
  //     </div>
      
  //     <div className="flex justify-between text-sm text-gray-400">
  //       <span>0%</span>
  //       <span>50%</span>
  //       <span>100%</span>
  //     </div>
      
  //     <div className="mt-4 text-sm text-gray-300">
  //       {interviewStats.no_of_interviews_completed === 0 
  //         ? "तुम्ही अद्याप कोणतीही मुलाखत पूर्ण केलेली नाही. पहिली मुलाखत सुरू करा!" 
  //         : `तुम्ही आतापर्यंत ${interviewStats.no_of_interviews_completed} मुलाखती पूर्ण केल्या आहेत.`}
  //     </div>
      
  //     <div className="mt-6 text-center">
  //       <button 
  //         onClick={handleStartInterview} 
  //         className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-pink-600 transition-all duration-200"
  //       >
  //         नवीन मुलाखत सुरू करा
  //       </button>
  //     </div>
  //   </div>
  // );
return (
    <div className="relative w-full bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
      
      {/* Decorative Background Blur (Natural Feel) */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      {/* Header Section */}
      <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            मुलाखतीच्या प्रगतीचा आढावा
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            आपल्या मागील कामगिरीचे विश्लेषण आणि प्रगती
          </p>
        </div>

        {/* Big Stat Counter */}
        <div className="flex items-baseline gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 min-w-[100px] justify-center">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            {interviewStats.no_of_interviews_completed}
          </span>
          <span className="text-sm font-semibold text-slate-600">पूर्ण</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-end px-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</span>
          <span className="text-sm font-bold text-slate-700">{completionPercentage}%</span>
        </div>
        
        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
            style={{ width: `${Math.max(completionPercentage, 2)}%` }} // Minimum width for visibility
          ></div>
        </div>
      </div>

      {/* Status Message Box */}
      <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50 mb-8">
        <div className="flex gap-3">
          <div className="shrink-0 mt-0.5">
            {/* Info Icon */}
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {interviewStats.no_of_interviews_completed === 0 
              ? "तुम्ही अद्याप कोणतीही मुलाखत पूर्ण केलेली नाही. पहिली मुलाखत सुरू करून आपला प्रवास सुरू करा!" 
              : `अभिनंदन! तुम्ही आतापर्यंत ${interviewStats.no_of_interviews_completed} मुलाखती यशस्वीरित्या पूर्ण केल्या आहेत.`}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-center md:justify-start">
        <button 
          onClick={handleStartInterview} 
          disabled={loading}
          className="group relative inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl shadow-lg hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>लोड होत आहे...</span>
            </>
          ) : (
            <>
              <span>नवीन मुलाखत सुरू करा</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InterviewProgress;
