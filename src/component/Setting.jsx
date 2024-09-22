import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Setting = ({ userDetails, showModal3 }) => {
  const { user_fname, user_lname, user_email, user_phone, country_name, user_profile } = userDetails;
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedFile, setSelectedFile] = useState(null);
   const [isLoading,setIsLoading]=useState(false)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleProfileChange = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
  
    const formData = new FormData();
    formData.append("profile", selectedFile);
    formData.append("email", user_email);

    setIsLoading(true);
  
    try {
      const response = await axios.post("http://localhost/buzzchat_backend/action/update_profile_img.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const res = response.data;
      if(res.status){
        toast.success(res.msg,{
          autoClose:5000
        })
      }else{
         toast.error(res.msg,{
          autoClose:5000
         })
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    finally{
      setIsLoading(false);
}
  };

  return (
    <>
      <section id="setting" className="md:w-full min-h-screen relative py-4">
        <header className="border-b w-full px-5 flex flex-col gap-y-5 h-64">
          <div>
            <h3 className="text-xl font-semibold">Settings</h3>
          </div>
          <div className="flex flex-col w-full justify-center items-center gap-y-3">
            <div className="relative">
              <img
                src={`http://localhost/buzzchat_backend/assets/${user_profile}`}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border p-1"
              />
              <a
                href="#"
                className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-white p-2 rounded-full border shadow hover:bg-gray-300 transition duration-300 z-10"
                onClick={toggleModal}
              >
                <i className="bx bx-pencil text-gray-600" />
              </a>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-y-1">
              <h3 className="text-md font-semibold">{user_fname} {user_lname}</h3>
              <a href="#" className="text-sm text-gray-600 flex items-center gap-x-1">
                Available
                <i className="bx bx-chevron-down text-gray-600 group-open:rotate-180 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </header>
        <div className="mt-5 w-full px-5">
          <details className="group bg-gray-100 open:bg-gray-200 duration-300 rounded-lg overflow-hidden">
            <summary className="cursor-pointer py-3 px-5 bg-gray-300 text-gray-800 font-semibold flex justify-between items-center">
              <span className="text-sm font-semibold">Personal Info</span>
              <i className="bx bx-chevron-down text-gray-600 group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="px-5 py-4 text-gray-700 bg-white flex flex-row justify-between">
              <div className="text-gray-700 flex flex-col gap-y-3">
                <div>
                  <h3 className="text-sm text-gray-500">Name</h3>
                  <p className="text-sm font-semibold">{user_fname} {user_lname}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Email</h3>
                  <p className="text-sm font-semibold">{user_email}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Phone Number</h3>
                  <p className="text-sm font-semibold">{user_phone}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Country</h3>
                  <p className="text-sm font-semibold">{country_name}</p>
                </div>
              </div>
              <div>
                <button
                  id="modalbutton3"
                  type="button"
                  className="border px-4 py-1 rounded-sm bg-gray-200 hover:bg-gray-300 transition duration-300"
                  onClick={showModal3}
                >
                  Edit
                </button>
              </div>
            </div>
          </details>
        </div>
      </section>

      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-5 rounded-lg shadow-lg md:w-1/2 w-full mx-1">
      <h3 className="text-xl font-semibold mb-4">Edit Profile Picture</h3>
      <div className="flex flex-col gap-y-3 items-center">
        <img
          src={`http://localhost/buzzchat_backend/assets/${user_profile}`}
          alt="User Profile"
          className="w-48 h-48 rounded-full object-cover border p-1"
        />
        <label className="mt-4 w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
          <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.94l-4.24-4.24a1.5 1.5 0 00-2.12 0L7.88 8.34a1.5 1.5 0 000 2.12l4.24 4.24a1.5 1.5 0 002.12 0l2.64-2.64a1.5 1.5 0 000-2.12zM10 12.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
          <span className="mt-2 text-base leading-normal">Select a file</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <div className="w-full flex justify-between items-center mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-sm transition duration-300"
          onClick={toggleModal}
        >
          Close
        </button>
        <button
            type="button"
            className="px-4 py-2 text-white rounded-sm transition duration-300"
            style={{ backgroundColor: "#007BFF" }}
            onClick={handleProfileChange}
            disabled={isLoading}
        >
            {isLoading ? (
            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ) : (
            "Change"
            )}
        </button>
      </div>
    </div>
  </div>
)}


    </>
  );
};

export default Setting;
