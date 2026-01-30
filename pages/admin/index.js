

import { useState, useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import {useRouter} from 'next/router';


export default function Index() {

  const router = useRouter();
  // State to hold the active test count, loading state, and total users
  const [activeTests, setActiveTests] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCompleteTest, setTotalCompleteTest] = useState(0);


 const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/admin/login");
    } else {
      const userFromStorage = JSON.parse(localStorage.getItem('user'));
      if (userFromStorage) {
        setUser(userFromStorage);
        
      }
    }
  }, []);


  useEffect(() => {
    const collageName = 'SPPU'; // Example company name

    const fetchActiveTests = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/isActive?collageName=${collageName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        const collageData = data[0];
        if (collageData && collageData.isActive !== undefined) {
          return collageData.isActive;
        }
      }
      return 0; // Default value in case of error
    };

    const fetchTotalUsers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/totalUsers?collageName=${collageName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.totalUsers !== undefined) {
          return data.totalUsers;
        }
      }
      return 0; // Default value in case of error
    };

    const fetchCompletedTestReports = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getReportByCollageName?collageName=${collageName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.reports && Array.isArray(data.reports)) {
          return data.reports.length;
        }
      }
      return 0; // Default value in case of error
    };

    // Fetch all data concurrently
    const fetchData = async () => {
      try {
        const [activeTestsData, totalUsersData, completedTestData] = await Promise.all([
          fetchActiveTests(),
          fetchTotalUsers(),
          fetchCompletedTestReports(),
        ]);

        // Set the state once all data is fetched
        setActiveTests(activeTestsData);
        setTotalUsers(totalUsersData);
        setTotalCompleteTest(completedTestData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setActiveTests(0);
        setTotalUsers(0);
        setTotalCompleteTest(0);
      }
    };

    fetchData();
  }, []);

  // return (
  //   <>
     
  //     <main className="flex-1 p-8 bg-[#6c57ec] bg-opacity-20 m-20 rounded-xl">
  //       <div className="bg-white text-center flex items-center justify-around gap-4 p-4 rounded-lg">
  //         <div>
  //           <h2 className="text-4xl font-bold text-purple-700">Total User</h2>
  //           <h2 className="text-xl">Number of registered Students</h2>
  //         </div>
  //         {/* Displaying the fetched total users */}
  //         <div className='bg-purple-200 p-5 rounded-full'>
  //           <p className="text-center rounded-lg  text-4xl  text-purple-700 font-bold">{totalUsers}</p>
  //         </div>
  //       </div>

  //       {/* Cards Section */}
  //       <div className="grid grid-cols-3 md:grid-cols-2 gap-4 bg-white mt-20 rounded-xl p-4">
  //         <div className="m-2">
  //           <h2 className="text-purple-700 font-bold text-lg">Active Tests</h2>
  //           <div className="bg-purple-200 rounded-2xl p-4 w-64 shadow-md">
  //             <div className="flex items-center gap-4 mt-3">
  //               <div className="w-20 h-16">
                  
                   
  //                   <h2 className="text-center mt-2 text-4xl text-purple-700 font-bold">
  //                     {activeTests }
  //                   </h2>
                
  //               </div>
  //               <div>
  //                 <p className="text-gray-700 font-semibold">Active Test</p>
  //                 <p className="text-purple-600 text-sm">Ongoing tests being attempted</p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="m-2">
  //           <h2 className="text-purple-700 font-bold text-lg">Completed Tests</h2>
  //           <div className="bg-purple-200 rounded-2xl p-4 w-64 shadow-md">
  //             <div className="flex items-center gap-4 mt-3">
  //               <div className="w-20 h-16">
  //                 <h2 className="text-center mt-2 text-4xl text-purple-700 font-bold">
  //                   {totalCompleteTest}
  //                 </h2>
  //               </div>
  //               <div>
  //                 <p className="text-gray-700 font-semibold">Completed Tests</p>
  //                 <p className="text-purple-600 text-sm">Total tests completed so far</p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

          
  //       </div>
  //     </main>
  //   </>
  // );
return (
    <main className="flex-1 min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Title / Welcome (Optional Context) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1">Real-time metrics and student performance insights.</p>
          </div>
          <div className="text-sm font-medium text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Hero Stats Section - Total Users */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-8 md:p-10 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 transition-all hover:shadow-lg group">
          {/* Decorative Background Blob */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-violet-50 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Registration Stats
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                Total Students
              </h2>
              <p className="text-slate-500 text-lg max-w-md mx-auto md:mx-0">
                Total number of students currently registered and active on the platform.
              </p>
            </div>
            
            <div className="flex items-center justify-center bg-violet-600 text-white px-10 py-8 rounded-2xl shadow-xl shadow-violet-200 min-w-[200px] transform group-hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <span className="block text-5xl md:text-6xl font-black tracking-tighter">
                  {totalUsers}
                </span>
                <span className="text-violet-100 text-sm font-medium mt-1 block">Registered Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Active Tests Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-5 hover:border-violet-200 hover:shadow-md transition-all duration-300 group">
            <div className="shrink-0 h-14 w-14 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 group-hover:bg-amber-100 transition-colors">
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Live Assessments</p>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{activeTests}</h3>
              <p className="text-sm text-slate-500">Ongoing tests currently being attempted by students.</p>
            </div>
          </div>

          {/* Completed Tests Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-5 hover:border-emerald-200 hover:shadow-md transition-all duration-300 group">
            <div className="shrink-0 h-14 w-14 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Completed</p>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{totalCompleteTest}</h3>
              <p className="text-sm text-slate-500">Total assessments successfully finished to date.</p>
            </div>
          </div>

          {/* Optional: Call to Action / Placeholder for 3rd Column if needed */}
          {/* <div className="hidden lg:flex bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-sm items-center justify-center text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative z-10">
               <h3 className="text-lg font-bold text-white mb-2">View Analytics</h3>
               <p className="text-slate-300 text-sm mb-4">Check detailed reports and graphs.</p>
               <button className="text-xs font-bold bg-white text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                 Go to Reports &rarr;
               </button>
             </div>
          </div> */}

        </div>
      </div>
    </main>
  );
}
