import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const AddNewUser = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[420px] p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-[#007590] text-2xl font-semibold mb-6">Add New User</h2>

        {/* User Name */}
        <div className="mb-4">
          <label className="block text-[#707171] text-base font-medium mb-1">User Name</label>
          <input
            type="text"
            className="w-full h-10 px-3 bg-white shadow-sm border border-gray-300 rounded-md"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[#707171] text-base font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full h-10 px-3 bg-white shadow-sm border border-gray-300 rounded-md"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-[#707171] text-base font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full h-10 px-3 bg-white shadow-sm border border-gray-300 rounded-md"
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-[#707171] text-base font-medium mb-1">Role</label>
          <div className="relative">
            <select className="w-full h-10 px-3 bg-white shadow-sm border border-gray-300 rounded-md appearance-none">
              <option>Admin</option>
              <option>User</option>
              <option>Editor</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#707171]" />
          </div>
        </div>

        {/* Register Button */}
        <button className="w-full h-10 bg-[#007590] text-white text-base font-semibold rounded-md shadow-sm">
          Register
        </button>
      </div>
    </div>
  );
};

export default AddNewUser;