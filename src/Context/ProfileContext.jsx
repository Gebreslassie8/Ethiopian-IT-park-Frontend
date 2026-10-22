// src/context/ProfileContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profilePictureUpdatedAt, setProfilePictureUpdatedAt] = useState(
    localStorage.getItem("profilePictureUpdated") || Date.now()
  );

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`https://ethiopian-it-park-backend.onrender.com/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedUser = res.data.user;
      setUser(fetchedUser);
      localStorage.setItem("profile", JSON.stringify(fetchedUser));
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleStorage = (e) => {
      if (e.key === "profilePictureUpdated") {
        setProfilePictureUpdatedAt(e.newValue || Date.now());
        fetchProfile();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateProfilePictureTimestamp = () => {
    const now = Date.now();
    localStorage.setItem("profilePictureUpdated", now);
    setProfilePictureUpdatedAt(now);
  };

  return (
    <ProfileContext.Provider
      value={{ user, fetchProfile, profilePictureUpdatedAt, updateProfilePictureTimestamp }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
