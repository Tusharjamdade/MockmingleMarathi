import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function FixInterviewTracking() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [updateAllUsers, setUpdateAllUsers] = useState(false);
  const [updatedUsers, setUpdatedUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userFromStorage = localStorage.getItem('user');
    if (!userFromStorage) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userFromStorage);
    setUser(userData);
    setEmail(userData.email || '');
  }, []);

  const handleFixTracking = async () => {
    if (!updateAllUsers && !email) {
      setMessage('Email is required for single user update');
      return;
    }

    setLoading(true);
    setMessage('');
    setSuccess(false);
    setUpdatedUsers([]);

    try {
      // Call the force update API
      const response = await fetch('/api/forceUpdateUserFields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          updateAll: updateAllUsers 
        }),
      });

      const data = await response.json();

       if (response.ok) {
        setSuccess(true);
        
        if (updateAllUsers) {
          setMessage(`${data.updatedCount} वापरकर्ता खात्यांमध्ये इंटरव्ह्यू ट्रॅकिंग फील्ड्स यशस्वीरित्या अद्ययावत करण्यात आले आहेत.`);
          setUpdatedUsers(data.updatedUsers || []);
        } else {
          setMessage('इंटरव्ह्यू ट्रॅकिंग फील्ड्स यशस्वीरित्या अद्ययावत करण्यात आले आहेत! तुमच्या खात्यात आता ' + 
            `${data.user.no_of_interviews} उपलब्ध मुलाखती आणि ` +
            `${data.user.no_of_interviews_completed} पूर्ण झालेल्या मुलाखती आहेत.`);
          
          // Update user in localStorage
          if (user) {
            const updatedUser = {
              ...user,
              no_of_interviews: data.user.no_of_interviews,
              no_of_interviews_completed: data.user.no_of_interviews_completed
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      } else {
        setMessage(`त्रुटी: ${data.error || 'इंटरव्ह्यू ट्रॅकिंग फील्ड्स अपडेट होऊ शकले नाहीत. कृपया पुन्हा प्रयत्न करा.'}`);
      }
    } catch (error) {
      setMessage(`त्रुटी: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="min-h-screen w-full bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#1a1638] to-[#24243e] flex flex-col items-center justify-center py-12 px-4 sm:px-6 font-sans text-white relative overflow-hidden">
      <Head>
        <title>इंटरव्ह्यू ट्रॅकिंग अपडेट करा | SHAKKTII AI</title>
        <meta name="description" content="Fix interview tracking fields for user accounts" />
      </Head>

      {/* Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300 mb-2">
              सिस्टम युटिलिटी
            </h1>
            <p className="text-gray-400 text-sm">
              इंटरव्ह्यू ट्रॅकिंग डेटा सिंक्रोनायझेशन
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <p className="text-gray-300 text-sm leading-relaxed text-center">
                हे साधन वापरकर्त्याच्या खात्यात गहाळ झालेली <span className="text-indigo-400 font-semibold">ट्रॅकिंग फील्ड्स</span> दुरुस्त करेल आणि डेटाबेस अद्ययावत करेल.
              </p>
            </div>

            {/* Custom Toggle Switch for Admin Option */}
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-white/5 transition-colors hover:border-white/10">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">बल्क अपडेट (Admin)</span>
                <span className="text-xs text-gray-500">सर्व युजर्सचा डेटाबेस स्कॅन करा</span>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={updateAllUsers}
                  onChange={(e) => setUpdateAllUsers(e.target.checked)}
                  disabled={loading}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500"></div>
              </label>
            </div>

            {/* Email Input (Conditional) */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${updateAllUsers ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                वापरकर्ता ई-मेल
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                disabled={loading || updateAllUsers}
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleFixTracking}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transform transition-all duration-200 active:scale-95 ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed opacity-70' 
                  : updateAllUsers
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/30'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-indigo-500/30'
              }`}
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading 
                ? 'प्रक्रिया सुरू आहे...' 
                : updateAllUsers 
                  ? 'सर्व डेटाबेस अपडेट करा' 
                  : 'फिक्स करा (Update Now)'
              }
            </button>
          </div>

          {/* Status Messages */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl border backdrop-blur-md flex items-start gap-3 ${
              success 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' 
                : 'bg-red-500/10 border-red-500/20 text-red-200'
            }`}>
              <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${success ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Individual Success Action */}
          {success && !updateAllUsers && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => router.push('/profile')}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm text-white transition-all hover:scale-105"
              >
                प्रोफाइल तपासा &rarr;
              </button>
            </div>
          )}

          {/* Bulk Update Table Results */}
          {success && updateAllUsers && updatedUsers.length > 0 && (
            <div className="mt-8 animate-fade-in-up">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">अद्ययावत यादी</h3>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                  Total: {updatedUsers.length}
                </span>
              </div>
              
              <div className="max-h-64 overflow-y-auto overflow-x-auto rounded-xl border border-white/10 bg-black/40 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-black/50 sticky top-0 backdrop-blur-md">
                    <tr>
                      <th className="px-4 py-3 font-medium">नाव</th>
                      <th className="px-4 py-3 font-medium">ई-मेल</th>
                      <th className="px-4 py-3 text-right">स्टेटस</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {updatedUsers.map((user, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{user.fullName}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{user.email}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            {user.no_of_interviews_completed}/{user.no_of_interviews} Done
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
