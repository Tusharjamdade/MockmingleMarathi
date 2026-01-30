import React from 'react';

const TestResults = ({ results, onRetakeTest }) => {
  if (!results) return null;

  // return (
  //   <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
  //     <div className="max-w-5xl mx-auto rounded-xl overflow-hidden bg-white shadow-lg">
  //       {/* Header */}
  //       <div className="bg-gradient-to-r from-blue-900 to-black text-white p-8 text-center">
  //         <h1 className="text-4xl font-bold mb-2">{results.personalityType || 'व्यक्तिमत्त्व प्रोफाईल'}</h1>
  //         <p className="text-lg text-blue-200">
  //           तुमच्या व्यक्तिमत्त्वाच्या विशेष गुणधर्मांचे आणि वागणुकीच्या नमुन्यांचे सखोल विश्लेषण
  //         </p>
  //       </div>
        
  //       <div className="p-8 space-y-8">
  //         {/* Overall Summary */}
  //         <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 shadow-lg text-white">
  //           <div className="flex items-center mb-6">
  //             <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-4">
  //               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  //               </svg>
  //             </div>
  //             <h2 className="text-2xl font-semibold text-white">संक्षिप्त आढावा</h2>
  //           </div>
  //           <div className="prose prose-invert max-w-none">
  //             {(results.executiveSummary || results.summary || '').split('\n').map((paragraph, i) => (
  //               <p key={i} className="mb-4">{paragraph || <br />}</p>
  //             ))}
  //           </div>
  //           {results.reportId && (
  //             <p className="text-sm text-blue-200 text-opacity-80 mt-4">
  //               रिपोर्ट आयडी: {results.reportId}
  //             </p>
  //           )}
  //         </div>

  //         {/* Key Traits */}
  //         <div className="grid md:grid-cols-2 gap-6">
  //           {/* Strengths */}
  //           <div className="bg-white rounded-xl p-6 shadow-sm">
  //             <h3 className="text-xl font-semibold text-gray-800 mb-4">व्यक्तिमत्त्वातील सकारात्मक वैशिष्ट्ये</h3>
  //             <ul className="space-y-4">
  //               {results.strengths.map((strength, index) => (
  //                 <li key={index} className="bg-blue-50 p-4 rounded-lg">
  //                   <h4 className="font-semibold text-blue-800">{strength.title}</h4>
  //                   {strength.description && (
  //                     <p className="mt-1 text-gray-700 text-sm">{strength.description}</p>
  //                   )}
  //                 </li>
  //               ))}
  //             </ul>
  //           </div>

  //           {/* Areas for Growth */}
  //           <div className="bg-white rounded-xl p-6 shadow-sm">
  //             <h3 className="text-xl font-semibold text-gray-800 mb-4">विकासाची क्षेत्रे</h3>
  //             <ul className="space-y-4">
  //               {results.areasForGrowth.map((area, index) => (
  //                 <li key={index} className="bg-yellow-50 p-4 rounded-lg">
  //                   <h4 className="font-semibold text-yellow-800">{area.title}</h4>
  //                   {area.description && (
  //                     <p className="mt-1 text-gray-700 text-sm">{area.description}</p>
  //                   )}
  //                 </li>
  //               ))}
  //             </ul>
  //           </div>
  //         </div>

  //         {/* Career Matches */}
  //         {results.careerMatches && results.careerMatches.length > 0 && (
  //           <div className="bg-white rounded-xl p-6 shadow-sm">
  //             <h3 className="text-xl font-semibold text-gray-800 mb-4">नोकरी पर्याय</h3>
  //             <div className="grid md:grid-cols-2 gap-4">
  //               {results.careerMatches.map((career, index) => (
  //                 <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
  //                   <h4 className="font-semibold text-blue-800">{career.title}</h4>
  //                   {career.description && (
  //                     <p className="mt-1 text-gray-700 text-sm">{career.description}</p>
  //                   )}
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         )}

  //         {/* Development Suggestions */}
  //         <div className="bg-gradient-to-r from-blue-900 to-black text-white rounded-xl p-8 shadow-lg">
  //           <h3 className="text-2xl font-semibold mb-6 text-white">वैयक्तिक सल्ला</h3>
  //           <div className="space-y-6">
  //             {results.recommendations.map((rec, index) => (
  //               <div key={index} className="bg-white bg-opacity-10 p-4 rounded-lg">
  //                 <div className="flex items-start">
  //                   <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4 mt-0.5">
  //                     <span className="text-white font-bold">{index + 1}</span>
  //                   </div>
  //                   <div>
  //                     <h4 className="font-semibold text-blue-100">{rec.title || `Suggestion ${index + 1}`}</h4>
  //                     <p className="mt-1 text-blue-50">{rec.description || rec}</p>
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Action Buttons */}
  //         <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
  //           <button
  //             onClick={() => window.print()}
  //             className="px-6 py-3 bg-transparent border-2 border-black text-black rounded-lg hover:bg-[#D2E9FA] hover:text-black transition-colors flex items-center justify-center gap-2"
  //           >
  //             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  //             </svg>
  //             रिपोर्ट प्रिंट करा
  //           </button>
  //           <button
  //             onClick={onRetakeTest}
  //             className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-lg"
  //           >
  //             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  //             </svg>
  //             टेस्ट पुन्हा द्या
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5">
        
        {/* Modern Hero Section with Abstract Background */}
        <div className="relative bg-slate-900 text-white p-8 md:p-12 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10 text-center space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-sm font-medium tracking-wide">
              व्यक्तिमत्त्व विश्लेषण अहवाल
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-blue-200 bg-clip-text text-transparent">
              {results.personalityType || 'व्यक्तिमत्त्व प्रोफाईल'}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              तुमच्या व्यक्तिमत्त्वाच्या विशेष गुणधर्मांचे आणि वागणुकीच्या नमुन्यांचे सखोल विश्लेषण
            </p>
             {results.reportId && (
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-6">
                ID: {results.reportId}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 md:p-12 space-y-12">
          
          {/* Executive Summary Section */}
          <section className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-r-full"></div>
            <div className="pl-6 md:pl-8">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-slate-800">संक्षिप्त आढावा</h2>
              </div>
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
                {(results.executiveSummary || results.summary || '').split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>
          </section>

          {/* Dual Grid: Strengths & Growth */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Strengths Card */}
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-900">सकारात्मक वैशिष्ट्ये</h3>
              </div>
              <ul className="space-y-4">
                {results.strengths.map((strength, index) => (
                  <li key={index} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100/50">
                    <h4 className="font-bold text-slate-800 mb-1">{strength.title}</h4>
                    {strength.description && (
                      <p className="text-sm text-slate-600 leading-snug">{strength.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Areas Card */}
            <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-amber-900">विकासाची क्षेत्रे</h3>
              </div>
              <ul className="space-y-4">
                {results.areasForGrowth.map((area, index) => (
                  <li key={index} className="bg-white p-4 rounded-xl shadow-sm border border-amber-100/50">
                    <h4 className="font-bold text-slate-800 mb-1">{area.title}</h4>
                    {area.description && (
                      <p className="text-sm text-slate-600 leading-snug">{area.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Career Matches Section */}
          {results.careerMatches && results.careerMatches.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>💼</span> नोकरी पर्याय
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.careerMatches.map((career, index) => (
                  <div key={index} className="group bg-white border border-slate-200 p-5 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-default">
                    <h4 className="font-bold text-indigo-700 group-hover:text-indigo-600 mb-2">{career.title}</h4>
                    {career.description && (
                      <p className="text-sm text-slate-500 line-clamp-3">{career.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommendations / Personal Advice */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 md:p-10 shadow-xl text-white overflow-hidden relative">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="2" />
                <path d="M50 10 V90 M10 50 H90" stroke="white" strokeWidth="2" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold mb-8 relative z-10">वैयक्तिक सल्ला</h3>
            <div className="grid gap-6 relative z-10">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-indigo-400/30">
                    {index + 1}
                  </div>
                  <div className="pt-1">
                    <h4 className="text-lg font-semibold text-indigo-100 mb-1">{rec.title || `Suggestion ${index + 1}`}</h4>
                    <p className="text-slate-300 leading-relaxed text-sm md:text-base">{rec.description || rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <svg className="w-5 h-5 text-slate-500 group-hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              रिपोर्ट प्रिंट करा
            </button>
            
            <button
              onClick={onRetakeTest}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 text-white font-semibold shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              टेस्ट पुन्हा द्या
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TestResults;
