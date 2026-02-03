import React from "react";
import { X } from "lucide-react";

export default function Settings({ onClose }) {
  return (
    <div className="fixed top-4 right-4">
      <div className="w-72 rounded-2xl bg-white shadow-md p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={18} />
          </button>
        </div>

        <hr className="border-gray-200" />

        {/* Theme Selection */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Theme</span>
          <select className="text-sm text-gray-700 bg-transparent focus:outline-none">
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Language</span>
          <select className="text-sm text-gray-700 bg-transparent focus:outline-none">
            <option>Eng</option>
            <option>አማ</option>
          </select>
        </div>
      </div>
    </div>
  );
}