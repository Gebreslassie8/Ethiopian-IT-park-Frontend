import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Pencil } from "lucide-react";
import axios from "axios";
import ReusableModal from "../Modals/ReusableModal";
import { useProfile } from "../../Context/ProfileContext";
import { toast } from "sonner";

const API_URL = "https://ethiopian-it-park-backend.onrender.com";

const MyProfile = ({ onClose }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [tempPreview, setTempPreview] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);       // ← NEW
  const [uploading, setUploading] = useState(false); // ← NEW
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
    ? `${API_URL}/api/files/profile-picture/${fileName}?t=${profilePictureUpdatedAt}`
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

  // ── Upload Profile Picture ─────────────────────────────
  const handleConfirmImage = async () => {
    if (!file || uploading) return;
    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const form = new FormData();
      form.append("profileImage", file);

      const res = await axios.put(`${API_URL}/api/users/profile-picture`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Accept any 2xx as success
      updateProfilePictureTimestamp();
      await fetchProfile();
      setShowModal(false);
      setTempPreview("");
      setFile(null);
      toast.success(res.data?.message || "Profile picture updated!");
    } catch (error) {
      console.error("Upload error:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Image upload failed.";
      toast.error(msg);
    } finally {
      setUploading(false);
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

  // ── Save Profile ──────────────────────────────────────
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (saving) return;
    setSaving(true);

    console.log("Save clicked. Payload:", formData);   // ← DEBUG

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        onClose();
        return;
      }

      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
      };

      const res = await axios.put(`${API_URL}/api/users/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Save response:", res.status, res.data);   // ← DEBUG

      // ✅ Any 2xx = success unless backend explicitly says success: false
      const isSuccess =
        res.status >= 200 &&
        res.status < 300 &&
        res.data?.success !== false;

      if (isSuccess) {
        toast.success(res.data?.message || "Profile updated successfully!");
        await fetchProfile();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
      console.error("Response data:", err.response?.data);   // ← DEBUG
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Something went wrong.";
      toast.error(msg);
    } finally {
      setSaving(false);
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
            <img
              src={tempPreview}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover mb-4 border"
            />
            <span>Use this as your profile picture?</span>
          </div>
        }
        cancelText="Cancel"
        confirmText={uploading ? "Uploading..." : "Upload"}
        confirmColor="blue"
      />

      <div className="w-[420px] bg-white rounded-xl shadow-xl px-6 py-8 relative">
        <button
          type="button"
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
              type="button"
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

        {/* ✅ Changed from <form> to <div> + manual onClick — bypasses any form submit issues */}
        <div className="space-y-4 text-sm text-gray-700">
          <ProfileField
            label="Name"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          <ProfileField
            label="Email account"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            type="email"
          />
          <div className="pt-4 flex justify-start gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#007bff] text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="flex justify-between border-b pb-2 items-center">
    <label className="font-medium w-1/2">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-1/2 text-right outline-none text-gray-900"
      // ✅ Removed `required` — prevents silent validation blocks
    />
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