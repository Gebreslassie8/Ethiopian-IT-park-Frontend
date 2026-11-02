import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Pencil, X, User, Mail, Camera } from "lucide-react";
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
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });

  const {
    user,
    fetchProfile,
    profilePictureUpdatedAt,
    updateProfilePictureTimestamp,
  } = useProfile();

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

      const res = await axios.put(
        `${API_URL}/api/users/profile-picture`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (saving) return;
    setSaving(true);

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
    <>
      {/* ─── Backdrop (mobile: full-screen; desktop: transparent) ─── */}
      <div
        className="fixed inset-0 z-40 bg-black/40 sm:bg-transparent sm:pointer-events-none"
        onClick={onClose}
      />

      {/* ─── Modal Container ──────────────────────────────────── */}
      <div
        className="fixed z-50 inset-x-0 bottom-0 sm:inset-auto sm:top-16 sm:right-0
                   px-0 sm:px-4 font-['Outfit']"
      >
        <div
          className="w-full sm:w-[420px] bg-white rounded-t-2xl sm:rounded-xl shadow-2xl
                     max-h-[90vh] overflow-y-auto
                     px-5 sm:px-6 py-6 sm:py-8 relative"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400
                       hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* ─── Header: avatar + name ─────────────────────── */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={28} />
                  </div>
                )}
              </div>

              {/* Edit icon overlay */}
              <button
                type="button"
                onClick={handleEditIconClick}
                className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200
                           rounded-full shadow flex items-center justify-center
                           hover:bg-gray-50 transition"
                aria-label="Change profile picture"
              >
                <Camera size={14} className="text-gray-600" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {formData.username || "Unnamed user"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {formData.email || "No email"}
              </p>
            </div>
          </div>

          {/* ─── Form fields ───────────────────────────────── */}
          <div className="space-y-4">
            <ProfileField
              icon={<User size={16} />}
              label="Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            <ProfileField
              icon={<Mail size={16} />}
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              type="email"
            />
          </div>

          {/* ─── Actions ───────────────────────────────────── */}
          <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium
                         bg-gray-100 text-gray-700 hover:bg-gray-200
                         transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold
                         bg-[#007bff] text-white hover:bg-blue-700
                         transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Image confirm modal (already ReusableModal, works) ─── */}
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
            <span className="text-center text-sm text-gray-600">
              Use this as your profile picture?
            </span>
          </div>
        }
        cancelText="Cancel"
        confirmText={uploading ? "Uploading..." : "Upload"}
        confirmColor="blue"
      />
    </>
  );
};

// ─── Reusable form field with icon ────────────────────────
const ProfileField = ({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
    >
      {label}
    </label>
    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition">
      {icon && (
        <span className="text-gray-400 flex-shrink-0 mr-2">{icon}</span>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-grow outline-none bg-transparent text-sm text-gray-900"
      />
    </div>
  </div>
);

MyProfile.propTypes = {
  onClose: PropTypes.func.isRequired,
};

ProfileField.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default MyProfile;