import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
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

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
      if (!token) return toast.error("Session expired.");

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
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Image upload failed."
      );
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
        toast.error("Session expired.");
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

      if (res.status >= 200 && res.status < 300 && res.data?.success !== false) {
        toast.success(res.data?.message || "Profile updated!");
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

  return createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 99998,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
          zIndex: 99999,
          boxSizing: "border-box",
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-title"
          style={{
            width: "100%",
            maxWidth: "420px",
            maxHeight: "calc(100vh - 24px)",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "14px 16px",
              borderBottom: "1px solid #e5e7eb",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#f3f4f6",
                  border: "2px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <User size={20} color="#9ca3af" />
                )}
              </div>
              <button
                type="button"
                onClick={handleEditIconClick}
                aria-label="Change picture"
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  right: "-2px",
                  width: "22px",
                  height: "22px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Camera size={10} color="#4b5563" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
              <h2
                id="profile-title"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Profile
              </h2>
              <p
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  margin: "3px 0 0 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {formData.email || "Manage your account"}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                flexShrink: 0,
                padding: "4px",
                borderRadius: "6px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 16px",
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
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

          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              padding: "10px 16px",
              borderTop: "1px solid #d1d5db",
              backgroundColor: "#f3f4f6",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                backgroundColor: "#ffffff",
                color: "#374151",
                border: "1px solid #9ca3af",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: saving ? "#93c5fd" : "#2563eb",
                color: "#ffffff",
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                minWidth: "90px",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <ReusableModal
        isOpen={showModal}
        onClose={handleCancelImage}
        onConfirm={handleConfirmImage}
        title="Confirm Profile Picture"
        body={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={tempPreview}
              alt="Preview"
              style={{
                width: "128px",
                height: "128px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "16px",
                border: "1px solid #e5e7eb",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                color: "#4b5563",
                textAlign: "center",
              }}
            >
              Use this as your profile picture?
            </span>
          </div>
        }
        cancelText="Cancel"
        confirmText={uploading ? "Uploading..." : "Upload"}
        confirmColor="blue"
      />
    </>,
    document.body
  );
};

const Field = ({
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
      style={{
        display: "block",
        fontSize: "12px",
        fontWeight: 500,
        color: "#4b5563",
        marginBottom: "6px",
      }}
    >
      {label}
    </label>
    <div style={{ position: "relative" }}>
      {icon && (
        <span
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        >
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
        style={{
          width: "100%",
          paddingLeft: "40px",
          paddingRight: "12px",
          paddingTop: "10px",
          paddingBottom: "10px",
          fontSize: "14px",
          color: "#111827",
          backgroundColor: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  </div>
);

MyProfile.propTypes = { onClose: PropTypes.func.isRequired };

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