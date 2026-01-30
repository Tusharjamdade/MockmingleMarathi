import React, { useState } from 'react';

const EditPopup = ({ 
  user, 
  isOpen, 
  setIsOpen, 
  updateUserProfile, 
  setNewFullName, 
  setNewDOB, 
  setNewEmail, 
  setNewEducation, 
  setNewAddress, 
  setNewMobileNo, 
  newFullName, 
  newDOB, 
  newEmail, 
  newEducation, 
  newAddress, 
  newMobileNo  
}) => {
  if (!isOpen) return null; // Don't render the modal if it's closed

  // Optional state for error message (e.g. validation)
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle closing the modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  // Optional validation before saving the profile
  const handleSave = () => {
    if (!newFullName || !newDOB|| !newEmail || !newEducation || !newAddress || !newMobileNo) {
      setErrorMessage('All fields are required.');
      return;
    }

    // Clear error message if all fields are filled
    setErrorMessage('');
    updateUserProfile(); // Proceed with updating the profile
    setIsOpen(false); // Close modal after saving
  };

  // return (
  //   <div 
  //     className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50"
  //     onClick={handleOutsideClick} // Close modal if clicked outside
  //   >
  //     <div className="bg-white p-8 rounded-lg shadow-lg w-1/2" onClick={(e) => e.stopPropagation()}>
  //       <h2 className="text-xl font-semibold mb-4">प्रोफाइल अपडेट करा</h2>
        
  //       {errorMessage && (
  //         <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
  //       )}

  //       <div className="grid grid-cols-2 gap-4">
  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-700">संपूर्ण नाव</label>
  //           <input
  //             type="text"
  //             value={newFullName}
  //             onChange={(e) => setNewFullName(e.target.value)}
  //             className="w-full p-2 border border-gray-300 rounded-lg mb-4"
  //           />
  //         </div>
  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-700">मोबाईल नंबर</label>
  //           <input
  //             type="text"
  //             value={newMobileNo}
  //             onChange={(e) => setNewMobileNo(e.target.value)}
  //             className="w-full p-2 border border-gray-300 rounded-lg mb-4"
  //           />
  //         </div>
  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-700">जन्म तारीख</label>
  //           <input
  //             type="text"
  //             value={newDOB}
  //             onChange={(e) => setNewDOB(e.target.value)}
  //             className="w-full p-2 border border-gray-300 rounded-lg mb-4"
  //           />
  //         </div>

  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-700">ई-मेल</label>
  //           <input
  //             type="text"
  //             value={newEmail}
  //             onChange={(e) => setNewEmail(e.target.value)}
  //             className="w-full p-2 border border-gray-300 rounded-lg mb-4"
  //           />
  //         </div>
  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-700">शिक्षण</label>
  //           <input
  //             type="text"
  //             value={newEducation}
  //             onChange={(e) => setNewEducation(e.target.value)}
  //             className="w-full p-2 border border-gray-300 rounded-lg mb-4"
  //           />
  //         </div>
  //         <div>
  //           <label className="block mb-2 text-sm font-medium text-gray-700">पत्ता</label>
  //           <input
  //             type="text"
  //             value={newAddress}
  //             onChange={(e) => setNewAddress(e.target.value)}
  //             className="w-full p-2 border border-gray-300 rounded-lg mb-4"
  //           />
  //         </div>
  //       </div>

  //       <div className="flex justify-between mt-4">
  //         <button
  //           onClick={() => setIsOpen(false)} // Close the modal
  //           className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
  //         >
  //           रद्द करा
  //         </button>
  //         <button
  //           onClick={handleSave}
  //           disabled={!newFullName || !newDOB || !newEmail || !newEducation || !newAddress || !newMobileNo} // Disable button if fields are empty
  //           className={`px-4 py-2 text-white rounded-lg ${!newFullName || !newDOB || !newEmail || !newEducation || !newAddress || !newMobileNo ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c3baf7] hover:bg-purple-600'}`}
  //         >
  //          जतन करा
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleOutsideClick}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800">प्रोफाइल अपडेट करा</h2>
          {errorMessage && (
            <div className="mt-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <span className="font-bold">Error:</span> {errorMessage}
            </div>
          )}
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600 ml-1">संपूर्ण नाव</label>
              <input
                type="text"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                placeholder="Ex. Rahul Patil"
              />
            </div>

            {/* Mobile No */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600 ml-1">मोबाईल नंबर</label>
              <input
                type="text"
                value={newMobileNo}
                onChange={(e) => setNewMobileNo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                placeholder="+91 0000000000"
              />
            </div>

            {/* DOB */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600 ml-1">जन्म तारीख</label>
              <input
                type="text" // You might want to change this to 'date' for better UX
                value={newDOB}
                onChange={(e) => setNewDOB(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                placeholder="DD/MM/YYYY"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600 ml-1">ई-मेल</label>
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                placeholder="email@example.com"
              />
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600 ml-1">शिक्षण</label>
              <input
                type="text"
                value={newEducation}
                onChange={(e) => setNewEducation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                placeholder="Degree / Class"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-600 ml-1">पत्ता</label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                placeholder="City, State"
              />
            </div>
            
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            रद्द करा
          </button>
          <button
            onClick={handleSave}
            disabled={!newFullName || !newDOB || !newEmail || !newEducation || !newAddress || !newMobileNo}
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl shadow-md transition-all duration-200 flex items-center gap-2
              ${!newFullName || !newDOB || !newEmail || !newEducation || !newAddress || !newMobileNo 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'}`}
          >
            जतन करा
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditPopup;

