

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { Edit } from 'lucide-react';
// import EditPopup from '../../component/editPopup'; // Import the EditPopup modal
// import ReportDetailPopup from '../../component/reportDetailPopup'; // Import the ReportDetailPopup component

// function EmployeeProfiles() {
//   const [users, setUsers] = useState([]); // State to hold all employees
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
//   const [isReportOpen, setIsReportOpen] = useState(false); // State to control report modal visibility
//   const [selectedUser, setSelectedUser] = useState(null); // State to hold the user currently being edited
//   const [selectedReport, setSelectedReport] = useState(null); // State to hold the report for the selected user
//   const [newFullName, setNewFullName] = useState('');
//   const [newLastName, setNewLastName] = useState('');
//   const [newDOB, setNewDOB] = useState('');
//   const [newMobileNo,setNewMobileNo] = useState('');
//     const[newAddress ,setNewAddress] = useState('');
//     const[newEducation ,setNewEducation] = useState('');
//   const [newEmail, setNewEmail] = useState('');
//   const collageName = 'SPPU'; // Replace with the actual company name

//   // Fetch user data and their report data in one go
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`/api/editStudentProfile?collageName=${collageName}`);
//         const data = await response.json();

//         if (data.users && data.users.length > 0) {
//           // Get all emails and fetch reports for all of them at once
//           const emails = data.users.map(user => user.email);
//           const reportResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/saveAndGetReport?emails=${JSON.stringify(emails)}`);
//           const reportData = await reportResponse.json();

//           // Merge the user data and report data
//           const userReports = data.users.map(user => ({
//             ...user,
//             report: reportData.reports[user.email] || [],
//           }));

//           setUsers(userReports); // Set users with their reports
//         } else {
//           console.error('No users found for this company');
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, [collageName]);

//   // Function to handle the update of the user profile
//   const updateUserProfile = async () => {
//     if (!selectedUser) return;

//     const updatedData = {
//       email: selectedUser.email, // Email stays constant for this update
//       updatedData: {
//        fullName:newFullName,
//         email: newEmail,
//         DOB: newDOB,
//         mobileNo: newMobileNo,
//         address: newAddress ,
//         education:newEducation
//       },
//     };

//     try {
//       const res = await fetch('/api/editStudentProfile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedData),
//       });

//       const result = await res.json();

//       if (res.status === 200) {
//         // Successfully updated the user profile
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.email === selectedUser.email
//               ? { ...user, fullName: newFullName, DOB: newDOB, email: newEmail, mobileNo: newMobileNo, address: newAddress,education:newEducation }
//               : user
//           )
//         );
//       } else {
//         console.error(result.message);
//         alert('Failed to update user profile');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('Error updating user profile');
//     }
//   };

//   return (
//     <div className="grid grid-cols-3 gap-3 p-5 bg-[#6c57ec] bg-opacity-20 m-10 rounded-xl">
//       {users.map((user) => {
//         const userReport = user.report || []; // No need for a score field, just use the report array length

//         return (
//           <div key={user.email} className="h-[15rem] p-4 bg-white border border-gray-200 rounded-2xl shadow-md text-center relative">
//             <div className="flex items-center">
//               <Image
//                 src={user.profileImg || '/BOT.png'}
//                 width={60}
//                 height={60}
//                 alt="Profile Picture"
//                 className="rounded-full border-2 border-white shadow"
//               />
//               <div className="ml-10">
//                 <h1 className="text-lg text-start font-semibold">{user.fullName}</h1>
//                 <h2 className="text-sm text-start text-gray-600 font-bold">{user.education}</h2>
//                 <h2 className="text-sm text-start text-gray-600 font-bold">{user.DOB}</h2>
//                 <div className="text-xs text-start text-gray-500">{user.email}</div>
//               </div>
//             </div>
//             <hr className="h-px mt-2 bg-gray-200 border-0 dark:bg-gray-700" />
//             <div className="mt-3 text-sm font-medium text-gray-600">NUMBER OF ASSESSMENT</div>
//             <div className="text-lg font-bold text-gray-700">{userReport.length}</div> {/* Show the number of reports */}
//             <div className="flex justify-between mt-4">
//               <button
//                 onClick={() => {
//                   setSelectedUser(user);
//                   setSelectedReport(userReport[0]); // Take the first report, or set null
//                   setIsReportOpen(true);
//                 }}
//                 className="w-1/2 mr-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
//               >
//                 Detail Report
//               </button>

//               <button
//                 onClick={() => {
//                   setSelectedUser(user);
//                   setNewFullName(user.fullName);
//                   setNewDOB(user.DOB);
//                   setNewEmail(user.email);
//                   setNewMobileNo(user.mobileNo);
//                   setNewEducation(user.education);
//                   setNewAddress(user.address);
//                   setIsModalOpen(true);
//                 }}
//                 className="w-1/2 flex items-center gap-1 px-4 py-2 bg-[#c3baf7] text-white rounded-lg hover:bg-purple-600"
//               >
//                 <Edit size={16} /> Edit
//               </button>
//             </div>
//           </div>
//         );
//       })}

//       {/* Edit Modal */}
//       {selectedUser && (
//         <EditPopup
//           user={selectedUser}
//           isOpen={isModalOpen}
//           setIsOpen={setIsModalOpen}
//           updateUserProfile={updateUserProfile}
//           setNewFullName={setNewFullName}
//           setNewDOB={setNewDOB}
//           setNewEmail={setNewEmail}
//           setNewAddress={setNewAddress}
          
//           setNewMobileNo={setNewMobileNo}
//           setNewEducation={setNewEducation}

//           newFullName={newFullName}
//           newDOB={newDOB}
//           newEmail={newEmail}
//           newEducation={newEducation}
//           newMobileNo={newMobileNo}
//           newAddress={newAddress}

//         />
//       )}

//       {/* Report Detail Modal */}
//       {isReportOpen && (
//         <ReportDetailPopup
//           user={selectedUser}
//           isOpen={isReportOpen}
//           setIsOpen={setIsReportOpen}
//         />
//       )}
//     </div>
//   );
// }

// export default EmployeeProfiles;


import React, { useState, useEffect } from 'react'; 
import Image from 'next/image'; 
import { Edit } from 'lucide-react'; 
import EditPopup from '../../components/editPopup'; 
import ReportDetailPopup from '../../components/reportDetailPopup'; 
import Chart from '../../components/chart'; // Import the Chart component/components/Chart'; // Import the Chart component
import { useRouter } from 'next/router';

function EmployeeProfiles() { 
  const router = useRouter();
  const [users, setUsers] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isReportOpen, setIsReportOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [selectedReport, setSelectedReport] = useState(null); 
  const [newFullName, setNewFullName] = useState(''); 
  const [newLastName, setNewLastName] = useState(''); 
  const [newDOB, setNewDOB] = useState(''); 
  const [newMobileNo, setNewMobileNo] = useState(''); 
  const [newAddress, setNewAddress] = useState(''); 
  const [newEducation, setNewEducation] = useState(''); 
  const [newEmail, setNewEmail] = useState(''); 
  const collageName = 'SPPU'; // Replace with the actual company name
  const [showChart, setShowChart] = useState(false); // State to toggle chart visibility
  const [chartData, setChartData] = useState([]); // Store chart data



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


  // Fetch user data and their report data in one go
  useEffect(() => { 
    const fetchUserData = async () => { 
      try { 
        const response = await fetch(`/api/editStudentProfile?collageName=${collageName}`); 
        const data = await response.json(); 
        if (data.users && data.users.length > 0) { 
          // Get all emails and fetch reports for all of them at once 
          const emails = data.users.map(user => user.email); 
          const reportResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/saveAndGetReport?emails=${JSON.stringify(emails)}`); 
          const reportData = await reportResponse.json(); 

          // Merge the user data and report data 
          const userReports = data.users.map(user => ({ 
            ...user, 
            report: reportData.reports[user.email] || [], 
          })); 

          setUsers(userReports); // Set users with their reports 
        } else { 
          console.error('No users found for this company'); 
        } 
      } catch (error) { 
        console.error('Error fetching user data:', error); 
      } 
    };

    fetchUserData();
  }, [collageName]);
  
  const fetchChartData = async (email) => {
    try {
      const res = await fetch(`/api/overallScore?email=${email}`);
      const data = await res.json();
      
      
      if (data.reports && data.reports.length > 0) {
        // Prepare chart data
        const scores = data.reports.map(report => ({
          x: report.createdAt.toLocaleString(),
          y: report.overallScore,
        }));
        setChartData(scores);
      } else {
        console.error('No score data available');
      }
    } catch (error) {
      console.error('Error fetching score data:', error);
    }
  };
  // Function to handle the update of the user profile
  const updateUserProfile = async () => { 
    if (!selectedUser) return;

    const updatedData = { 
      email: selectedUser.email, 
      updatedData: { 
        fullName: newFullName, 
        email: newEmail, 
        DOB: newDOB, 
        mobileNo: newMobileNo, 
        address: newAddress, 
        education: newEducation, 
      },
    };

    try { 
      const res = await fetch('/api/editStudentProfile', { 
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json', 
        }, 
        body: JSON.stringify(updatedData), 
      });

      const result = await res.json();
      if (res.status === 200) { 
        // Successfully updated the user profile
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === selectedUser.email
              ? { ...user, fullName: newFullName, DOB: newDOB, email: newEmail, mobileNo: newMobileNo, address: newAddress, education: newEducation }
              : user
          )
        );
      } else { 
        console.error(result.message); 
        alert('Failed to update user profile'); 
      } 
    } catch (error) { 
      console.error(error); 
      alert('Error updating user profile'); 
    } 
  };

//   return (
//     <div className="grid grid-cols-3 gap-3 p-5 bg-[#6c57ec] bg-opacity-20 m-10 rounded-xl">
//       {users.map((user) => {
//         const userReport = user.report || [];
//         return (
//           <div key={user.email} className="h-[15rem] p-4 bg-white border border-gray-200 rounded-2xl shadow-md text-center relative">
//             <div className="flex items-center">
//               <Image
//                 src={user.profileImg || '/BOT.png'}
//                 width={60}
//                 height={60}
//                 alt="Profile Picture"
//                 className="rounded-full border-2 border-white shadow"
//               />
//               <div className="ml-10">
//                 <h1 className="text-lg text-start font-semibold">{user.fullName}</h1>
//                 <h2 className="text-sm text-start text-gray-600 font-bold">{user.education}</h2>
//                 <h2 className="text-sm text-start text-gray-600 font-bold">{user.DOB}</h2>
//                 <div className="text-xs text-start text-gray-500">{user.email}</div>
//               </div>
//             </div>
//             <hr className="h-px mt-2 bg-gray-200 border-0 dark:bg-gray-700" />
            
//             <div className="mt-3 text-sm font-medium text-gray-600">NUMBER OF ASSESSMENT</div>
//             <div className="text-lg font-bold text-gray-700">{userReport.length}</div>
//             <div className="flex justify-between mt-2">
//               <button
//                 onClick={() => {
//                   setSelectedUser(user);
//                   setSelectedReport(userReport[0]);
//                   setIsReportOpen(true);
//                 }}
//                 className="w-1/2 px-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
//               >
//                 Detail Report
//               </button>
//               <div className="w-full mt-4 text-center">
//   <button
//     onClick={() => {
//       setShowChart(!showChart);
//       if (!showChart) {
//         fetchChartData(user.email); // Fetch chart data when the chart is shown
//       }
//     }}
//     className="px-4 py-2 bg-[#c3baf7] text-white rounded-lg hover:bg-purple-600"
//   >
//     {showChart ? 'Hide Chart' : 'Show Chart'}
//   </button>
// </div>
//               <button
//                 onClick={() => {
//                   setSelectedUser(user);
//                   setNewFullName(user.fullName);
//                   setNewDOB(user.DOB);
//                   setNewEmail(user.email);
//                   setNewMobileNo(user.mobileNo);
//                   setNewEducation(user.education);
//                   setNewAddress(user.address);
//                   setIsModalOpen(true);
//                 }}
//                 className="w-1/2 flex items-center gap-1 px-4 py-2 bg-[#c3baf7] text-white rounded-lg hover:bg-purple-600"
//               >
//                 <Edit size={16} /> Edit
//               </button>
//             </div>
//           </div>
//         );
//       })}

//       {/* Chart Toggle Button */}
      

//       {/* Show Chart component if showChart is true */}
//       {/* {showChart && <Chart chartData={chartData} />} */}
//       {showChart && <Chart chartData={chartData} closeChart={() => setShowChart(false)} />}
//       {/* Edit Modal */}
//       {selectedUser && (
//         <EditPopup
//           user={selectedUser}
//           isOpen={isModalOpen}
//           setIsOpen={setIsModalOpen}
//           updateUserProfile={updateUserProfile}
//           setNewFullName={setNewFullName}
//           setNewDOB={setNewDOB}
//           setNewEmail={setNewEmail}
//           setNewAddress={setNewAddress}
//           setNewMobileNo={setNewMobileNo}
//           setNewEducation={setNewEducation}
//           newFullName={newFullName}
//           newDOB={newDOB}
//           newEmail={newEmail}
//           newEducation={newEducation}
//           newMobileNo={newMobileNo}
//           newAddress={newAddress}
//         />
//       )}

//       {/* Report Detail Modal */}
//       {isReportOpen && (
//         <ReportDetailPopup
//           user={selectedUser}
//           isOpen={isReportOpen}
//           setIsOpen={setIsReportOpen}
//         />
//       )}
//     </div>
//   );
return (
    <div className="flex-1 w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans text-slate-600">
      
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Profiles</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage registrations and view performance reports</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right mr-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered</p>
             </div>
             <span className="flex items-center justify-center min-w-[3rem] px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
               {users.length}
             </span>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {users.map((user) => {
            const userReport = user.report || [];
            return (
              <div 
                key={user.email} 
                className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="p-6 flex items-start gap-5">
                  <div className="relative shrink-0">
                    {/* Gradient Ring for Avatar */}
                    <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-br from-indigo-400 via-violet-400 to-fuchsia-400 shadow-sm">
                      <Image
                        src={user.profileImg || '/BOT.png'}
                        width={64}
                        height={64}
                        alt="Profile"
                        className="rounded-full bg-white object-cover w-full h-full border-2 border-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-1 space-y-1">
                    <h2 className="text-lg font-bold text-slate-800 truncate leading-tight group-hover:text-indigo-700 transition-colors">
                      {user.fullName || 'Unknown User'}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 truncate">{user.education || 'Student'}</p>
                    
                    <div className="flex items-center gap-2 pt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-500 border border-slate-100 truncate max-w-full">
                          {user.email}
                        </span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="px-6 py-4 bg-[#F8FAFC] border-y border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Assessments</span>
                        <span className="text-xl font-bold text-slate-700">{userReport.length}</span>
                    </div>
                    <div>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                         <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                         </span>
                    </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 mt-auto grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedReport(userReport[0]);
                      setIsReportOpen(true);
                    }}
                    disabled={userReport.length === 0}
                    className={`col-span-1 py-2.5 px-3 text-sm font-semibold rounded-xl border transition-all duration-200 
                      ${userReport.length === 0 
                        ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 hover:shadow-sm'}`}
                  >
                    View Report
                  </button>

                  <button
                    onClick={() => {
                        fetchChartData(user.email);
                        setShowChart(true);
                    }}
                    disabled={userReport.length === 0}
                    className={`col-span-1 py-2.5 px-3 text-sm font-semibold rounded-xl border transition-all duration-200 flex items-center justify-center gap-2
                        ${userReport.length === 0
                            ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-md hover:shadow-indigo-200'}`}
                  >
                     {/* Tiny Icon for Analytics */}
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                     Analytics
                  </button>

                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setNewFullName(user.fullName);
                      setNewDOB(user.DOB);
                      setNewEmail(user.email);
                      setNewMobileNo(user.mobileNo);
                      setNewEducation(user.education);
                      setNewAddress(user.address);
                      setIsModalOpen(true);
                    }}
                    className="col-span-2 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 group/edit"
                  >
                    <Edit size={16} className="text-slate-400 group-hover/edit:text-slate-600" />
                    <span>Edit Profile Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODALS */}

      {/* Analytics Chart Modal */}
      {showChart && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Performance Analytics</h3>
                    <p className="text-slate-500 text-sm mt-1">Comprehensive score trends and insights</p>
                </div>
                <button 
                    onClick={() => setShowChart(false)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-200"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div className="flex-1 w-full min-h-[400px] overflow-auto custom-scrollbar p-1">
                {/*  - Placeholder for Visual Context */}
                <Chart chartData={chartData} closeChart={() => setShowChart(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {selectedUser && (
        <EditPopup
          user={selectedUser}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          updateUserProfile={updateUserProfile}
          setNewFullName={setNewFullName}
          setNewDOB={setNewDOB}
          setNewEmail={setNewEmail}
          setNewAddress={setNewAddress}
          setNewMobileNo={setNewMobileNo}
          setNewEducation={setNewEducation}
          newFullName={newFullName}
          newDOB={newDOB}
          newEmail={newEmail}
          newEducation={newEducation}
          newMobileNo={newMobileNo}
          newAddress={newAddress}
        />
      )}

      {/* Report Detail Modal */}
      {isReportOpen && (
        <ReportDetailPopup
          user={selectedUser}
          isOpen={isReportOpen}
          setIsOpen={setIsReportOpen}
        />
      )}
    </div>
  );
}

export default EmployeeProfiles;
