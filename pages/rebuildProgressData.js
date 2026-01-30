import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function RebuildProgressData() {
  const router = useRouter();
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get user ID from localStorage
    const userObj = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const id = userObj?._id || userObj?.id || '';
    setUserId(id);
  }, []);

  const handleRebuild = async () => {
    if (!userId) {
      setError("वापरकर्ता आयडी सापडला नाही. कृपया प्रथम लॉगिन करा.");
      return;
    }

    setIsRebuilding(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/rebuildPracticeProgress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'अज्ञात त्रुटी आली आहे.');
      }

      setResult(data);
    } catch (err) {
      console.error('प्रोग्रेस रीबिल्ड करताना एरर आली:', err);
      setError(err.message || 'प्रोग्रेस रीबिल्ड करताना एरर आली');
    } finally {
      setIsRebuilding(false);
    }
  };

return (
    <>
      <Head>
        <title>SHAKKTII AI - प्रोग्रेसची माहिती रीबिल्ड करा</title>
      </Head>

      <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden bg-[#0f0c29]">
        
        {/* Background Layer with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: "url('/BG.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#1a1638]/95 to-[#24243e]/90 backdrop-blur-[2px]"></div>
        </div>

        {/* Main Glass Card */}
        <div className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
          
          {/* Decorative Top Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>

          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-white mb-4">
                प्रॅक्टिस प्रोग्रेस रीबिल्ड (Data Rebuild)
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed">
                हा टूल तुमच्या मागील सर्व उत्तरांचे विश्लेषण करून तुमचा प्रोग्रेस रिपोर्ट (Progress Data) पुन्हा तयार करेल. जर डॅशबोर्डवर चुकीची माहिती दिसत असेल तरच याचा वापर करा.
              </p>
            </div>

            <div className="bg-black/20 rounded-xl p-4 mb-8 border border-white/5 flex justify-between items-center">
              <span className="text-gray-400 text-sm font-medium">वापरकर्ता आयडी (User ID)</span>
              <span className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded-lg border border-white/10">
                {userId || 'शोधत आहे...'}
              </span>
            </div>

            <button
              onClick={handleRebuild}
              disabled={isRebuilding || !userId}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all duration-300 transform ${
                isRebuilding || !userId
                  ? 'bg-gray-700/50 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/25 hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              {isRebuilding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>प्रक्रिया सुरू आहे...</span>
                </>
              ) : (
                <span>डेटा रीबिल्ड करा (Rebuild Data)</span>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm animate-shake">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-red-400">⚠️</div>
                  <div>
                    <h4 className="text-red-300 font-bold text-sm mb-1">त्रुटी (Error)</h4>
                    <p className="text-red-200/80 text-xs">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {result && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm transition-all duration-500">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-emerald-400">✅</div>
                  <div>
                    <h4 className="text-emerald-300 font-bold text-sm mb-1">यशस्वी! (Success)</h4>
                    <p className="text-emerald-200/80 text-xs mb-1">{result.message}</p>
                    <p className="text-emerald-100 text-xs font-mono bg-emerald-500/10 inline-block px-2 py-0.5 rounded">
                      Processed: {result.totalResponses} records
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/practiceProgress')}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors border-b border-transparent hover:border-pink-400 pb-0.5"
              >
                &larr; प्रोग्रेस डॅशबोर्डकडे परत जा
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
