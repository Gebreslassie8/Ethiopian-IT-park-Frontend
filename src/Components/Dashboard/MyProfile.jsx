import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, User, Mail, Camera } from "lucide-react";
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

  // Lock background scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const fileName = user?.profile_picture?.split("/").pop();
  const preview = fileName
    ? `${API_URL}/api/files/profile-picture/${fileName}?t=${profilePictureUpdatedAt}`
    : "";

  const handleEditIconClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTempPreview(ev.target.result);
      setShowModal(true);
    };
    reader.readAsDataURL(selected);
  };

  const handleConfirmImage = async () => {
    if (!file || uploading) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Session expired. Please log in again.");

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

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e?.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return onClose();
      }

      const res = await axios.put(
        `${API_URL}/api/users/profile`,
        {
          username: formData.username.trim(),
          email: formData.email.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const ok =
        res.status >= 200 && res.status < 300 && res.data?.success !== false;

      if (ok) {
        toast.success(res.data?.message || "Profile updated successfully!");
        await fetchProfile();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* ═══════ BACKDROP ═══════ */}
      <div
        className="fixed inset-0 bg-black/50"
        style={{ zIndex: 100 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ═══════ MODAL WRAPPER ═══════ */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4
                   sm:items-start sm:justify-end sm:p-6 sm:pt-20"
        style={{ zIndex: 101 }}
      >
        {/* ═══════ MODAL PANEL ═══════ */}
        <div
          className="w-full max-w-md sm:max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col"
          style={{ maxHeight: "90vh" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-title"
        >
          {/* ═══════ HEADER ═══════ */}
          <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-gray-100">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-100 bg-gray-50">
                {preview ? (
                  <img
                    src={preview}
                    alt="Your avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={22} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleEditIconClick}
                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center"
                aria-label="Change profile picture"
              >
                <Camera size={11} className="text-gray-600" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            {/* Title + subtitle */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h2
                id="profile-title"
                className="text-base font-semibold text-gray-900 leading-tight"
              >
                Profile
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {formData.email || "Manage your account"}
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 -mr-1 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* ═══════ BODY ═══════ */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-4">
              <Field
                label="Name"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your name"
                icon={<User size={16} />}
              />
              <Field
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                type="email"
                icon={<Mail size={16} />}
              />
            </div>
          </div>

          {/* ═══════ FOOTER ═══════ */}
          <div className="flex gap-2 justify-end px-5 py-3.5 border-t border-gray-100 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                backgroundColor: saving ? "#93c5fd" : "#2563eb",
                color: "#ffffff",
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════ IMAGE CONFIRM MODAL ═══════ */}
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
            <span className="text-sm text-gray-600 text-center">
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

/* ═══════ FIELD COMPONENT ═══════ */
const Field = ({ icon, label, name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
      />
    </div>
  </div>
);

MyProfile.propTypes = {
  onClose: PropTypes.func.isRequired,
};

Field.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default MyProfile;