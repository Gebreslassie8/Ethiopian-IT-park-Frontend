import React from "react";
import { Edit2, X } from "lucide-react";
import profilep from "../../assets/profilep.jpg"

const MyProfile = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Hide modal when not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[90%] sm:w-[400px] p-6 shadow-lg">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <img
              src={profilep}
              alt="User"
              className="w-full h-full rounded-full object-cover border"
            />
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
              <Edit2 size={14} className="text-gray-600" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Samrawit</h2>
            <p className="text-gray-500 text-sm">Samrawit@gmail.com</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Name</span>
            <span className="text-gray-900">Your name</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Email account</span>
            <span className="text-gray-900">yourname@gmail.com</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Mobile number</span>
            <span className="text-blue-500 cursor-pointer">Add number</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Location</span>
            <span className="text-gray-900">USA</span>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full mt-6 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Save Change
        </button>
      </div>
    </div>
  );
};

MyProfile.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };
export default MyProfile;
