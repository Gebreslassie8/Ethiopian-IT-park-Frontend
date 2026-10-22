import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Pencil } from "lucide-react";
import axios from "axios";
import ReusableModal from "../Modals/ReusableModal";
import { useProfile } from "../../Context/ProfileContext";
import { toast } from "sonner"; // Import toast from Sonner

const MyProfile = ({ onClose }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [tempPreview, setTempPreview] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const { user, fetchProfile, profilePictureUpdatedAt, updateProfilePictureTimestamp } = useProfile();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const fileName = user?.profile_picture?.split("/").pop();
  const preview = fileName
    ? `https://ethiopian-it-park-backend.onrender.com/api/files/profile-picture/${fileName}?t=${profilePictureUpdatedAt}`
    : "";

  const handleEditIconClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTempPreview(ev.target.result);
      setShowModal(true);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleConfirmImage = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("profileImage", file);

      const res = await axios.put(`https://ethiopian-it-park-backend.onrender.com/api/users/profile-picture`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        updateProfilePictureTimestamp();
        fetchProfile(); 
        setShowModal(false);
        setTempPreview("");
        toast.success("Profile picture updated successfully!"); 
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed.");
    }
  };

  const handleCancelImage = () => {
    setTempPreview("");
    setShowModal(false);
    setFile(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = { username: formData.username, email: formData.email };

      const res = await axios.put(`https://ethiopian-it-park-backend.onrender.com/api/users/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!"); // Use toast for success message
        fetchProfile();
        onClose();
      } else {
        toast.error("Failed to update profile."); // Use toast for error message
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong."); // Use toast for error message
    }
  };

  return (
    <div className="fixed top-16 right-0 z-50 px-4 font-['Outfit']">
      <ReusableModal
        isOpen={showModal}
        onClose={handleCancelImage}
        onConfirm={handleConfirmImage}
        title="Confirm Profile Picture"
        body={
          <div className="flex flex-col items-center">
            <img src={tempPreview} alt="Preview" className="w-32 h-32 rounded-full object-cover mb-4 border" />
            <span>Use this as your profile picture?</span>
          </div>
        }
        cancelText="Cancel"
        confirmText="Upload"
        confirmColor="blue"
      />

      <div className="w-[420px] bg-white rounded-xl shadow-xl px-6 py-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-sm text-gray-400">
                No Image
              </div>
            )}
            <button
              onClick={handleEditIconClick}
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow"
            >
              <Pencil size={14} className="text-gray-600" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-800">{formData.username}</p>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-700">
          <ProfileField label="Name" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your name" />
          <ProfileField label="Email account" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" type="email" />
          <div className="pt-4 flex justify-start gap-2">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition">Cancel</button>
            <button type="submit" className="bg-[#007bff] text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="flex justify-between border-b pb-2 items-center">
    <label className="font-medium w-1/2">{label}</label>
    <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-1/2 text-right outline-none text-gray-900" required />
  </div>
);

MyProfile.propTypes = {
  onClose: PropTypes.func.isRequired,
};

ProfileField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default MyProfile;