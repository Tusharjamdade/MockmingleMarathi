import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function FixProgress() {
  const router = useRouter();
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progressId, setProgressId] = useState(router.query.id || '');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get progress ID from query parameter if provided
    if (router.query.id) {
      setProgressId(router.query.id);
    }
    
    // Get user ID from localStorage
    const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const id = userObj?._id || userObj?.id || '';
    setUserId(id);
  }, [router.query]);

  const handleFix = async () => {
    if (!progressId) {
      setError("प्रोग्रेस आयडी आवश्यक आहे.");
      return;
    }

    setIsFixing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/fixProgressData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          progressId,
          userId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'कृपया पुन्हा प्रयत्न करा');
      }

      setResult(data);
    } catch (err) {
      console.error('त्रुटी दुरुस्त केली जात आहे...:', err);
      setError(err.message || 'प्रोग्रेस डेटा दुरुस्त करण्यात अयशस्वी.');
    } finally {
      setIsFixing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 font-sans overflow-hidden bg-[#0f0c29]">
      <Head>
        <title>SHAKKTII AI - प्रोग्रेस डेटा दुरुस्त करा</title>
      </Head>

      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: "url('/BG.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#1a1638]/90 to-[#24243e]/90 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-3">
              प्रोग्रेस रेकॉर्ड दुरुस्त करा
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              विद्यमान डेटा वापरून तुमच्या प्रगतीचा अहवाल (Progress Record) पुन्हा कॅल्क्युलेट आणि अपडेट करा.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Input Field */}
            <div className="group">
              <label htmlFor="progressId" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-purple-400 transition-colors">
                प्रोग्रेस रेकॉर्ड आयडी
              </label>
              <div className="relative">
                <input
                  id="progressId"
                  type="text"
                  value={progressId}
                  onChange={(e) => setProgressId(e.target.value)}
                  className="w-full px-4 py-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all shadow-inner"
                  placeholder="ID येथे पेस्ट करा..."
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleFix}
              disabled={isFixing || !progressId}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transform transition-all duration-300 ${
                isFixing || !progressId
                  ? 'bg-gray-700/50 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              {isFixing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>दुरुस्त करत आहे...</span>
                </>
              ) : (
                <span>रेकॉर्ड अपडेट करा (Fix Now)</span>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm animate-shake">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                <div>
                  <h4 className="text-red-400 font-bold text-sm mb-1">त्रुटी आढळली</h4>
                  <p className="text-red-200 text-xs opacity-90">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Result Card */}
          {result && (
            <div className="mt-6 overflow-hidden rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm transition-all duration-500">
              <div className="p-4 bg-emerald-500/20 border-b border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <h4 className="text-emerald-100 font-bold text-sm">यशस्वी! {result.message}</h4>
                </div>
              </div>

              {result.updatedRecord && (
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-400">सेशन्स पूर्ण:</span>
                    <span className="text-white font-mono">{result.updatedRecord.sessionsCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-400">प्रश्न सोडवले:</span>
                    <span className="text-white font-mono">{result.updatedRecord.questionsAttempted}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-400">सरासरी गुण:</span>
                    <span className="text-emerald-300 font-bold font-mono">{result.updatedRecord.averageScore.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span className="text-gray-400">वेळ (सेकंद):</span>
                    <span className="text-white font-mono">{result.updatedRecord.timeSpent}s</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-gray-500">अंतिम अपडेट:</span>
                    <span className="text-gray-400">{formatDate(result.updatedRecord.lastUpdated)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/practiceProgress')}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-purple-400 pb-0.5"
            >
              &larr; प्रोग्रेस डॅशबोर्डकडे परत जा
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
