import { useEffect, useState } from 'react';
import { FaYoutube, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Suggestion = () => {
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videosByDate, setVideosByDate] = useState({});

  useEffect(() => {

    const fetchRecommendations = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userEmail = user?.email;
      console.log(userEmail);
      try {
        const response = await fetch('/api/youtube', {
          method: 'GET',
          headers: {
            'user-email': userEmail
          }
        });

        const data = await response.json();
        if (data.success && data.data.length > 0) {
          // Group videos by date
          const groupedVideos = {};

          data.data.forEach(entry => {
            if (entry.recommendations && Array.isArray(entry.recommendations)) {
              const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              if (!groupedVideos[date]) {
                groupedVideos[date] = [];
              }

              entry.recommendations.forEach(recommendation => {
                groupedVideos[date].push({
                  ...recommendation,
                  createdAt: entry.createdAt
                });
              });
            }
          });

          // Sort dates in descending order (newest first)
          const sortedGroups = {};
          Object.keys(groupedVideos)
            .sort((a, b) => new Date(b) - new Date(a))
            .forEach(key => {
              sortedGroups[key] = groupedVideos[key];
            });

          setVideosByDate(sortedGroups);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchRecommendations();
  }, []);

  const extractVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.searchParams.get("v") || parsedUrl.pathname.split("/").pop();
    } catch (err) {
      return null;
    }
  };

  const renderYoutubeRecommendations = () => {
    // --- Loading State ---
    if (loadingVideos) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-blue-200 font-medium animate-pulse tracking-wide">
            Curating the best tutorials for you...
          </p>
        </div>
      );
    }

    // --- Empty State ---
    if (!videosByDate || Object.keys(videosByDate).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="bg-gray-700/50 p-6 rounded-full mb-4">
            <FaYoutube className="text-4xl text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Recommendations Yet</h3>
          <p className="text-gray-400 text-center max-w-md">
            We haven't found any specific video recommendations based on your current skill analysis. Check back after completing more assessments.
          </p>
        </div>
      );
    }

    // --- Content State ---
    return (
      <div className="w-full space-y-12 animate-fade-in-up">
        {/* Header Section for the List */}
        <div className="flex items-center gap-3 pb-6 border-b border-white/10">
          <div className="bg-red-600/20 p-3 rounded-xl border border-red-500/30">
            <FaYoutube className="text-2xl text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Recommended Learning Path
            </h2>
            <p className="text-gray-400 text-sm">
              Handpicked videos to bridge your skill gaps
            </p>
          </div>
        </div>

        {Object.entries(videosByDate).map(([date, groups]) => (
          <div key={date} className="relative">
            {/* Date Sticky Header */}
            <div className="sticky top-0 z-10 flex items-center mb-6 py-4 bg-[#0f0c29]/95 backdrop-blur-md border-b border-white/5">
              <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                {date}
              </h2>
            </div>

            <div className="space-y-10 pl-2 md:pl-5">
              {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="relative">
                  {/* Skill Group Label */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full">
                      Target Skill
                    </span>
                    <h3 className="text-lg font-semibold text-white">
                      {group.skill}
                    </h3>
                  </div>

                  {/* Video Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {group.videos.map((video, videoIndex) => {
                      const videoId = extractVideoId(video.url);
                      return (
                        <div
                          key={videoIndex}
                          className="group bg-[#1a1638] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 flex flex-col"
                        >
                          {/* Video Aspect Ratio Container */}
                          <div className="relative w-full aspect-video bg-black">
                            <iframe
                              className="absolute inset-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>

                          {/* Video Content */}
                          <div className="p-5 flex flex-col flex-1 justify-between">
                            <div>
                              <h4 className="font-bold text-white text-lg leading-snug line-clamp-2 mb-3 group-hover:text-blue-300 transition-colors">
                                {video.title}
                              </h4>
                              <div className="flex items-center gap-2 mb-4">
                                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                                  {group.skill}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                              <span>Added</span>
                              <span className="font-mono text-gray-400">
                                {new Date(video.createdAt || Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0c29] bg-gradient-to-br from-[#0f0c29] via-[#1a1638] to-[#24243e] text-white">
      {/* Background Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation */}
        <button
          onClick={() => router.push('/dashboard')}
          className="group flex items-center gap-2 mb-8 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 w-fit"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Main Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200 mb-4 drop-shadow-sm">
            Skill-Based Video Suggestions
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Enhance your knowledge with these curated video resources tailored to specific skills identified in your assessment history.
          </p>
        </div>

        {/* Content Render */}
        <div className="w-full">
          {renderYoutubeRecommendations()}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
