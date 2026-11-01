import React, { useEffect, useState } from "react";
import axios from "axios";
import LibraryLayout from "../Components/Library/LibraryLayout";

const API_URL = "https://ethiopian-it-park-backend.onrender.com";

export default function ExternalLibrary() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([{ label: "All", value: "" }]);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedContents, setRelatedContents] = useState([]);

  // ── Fetch tabs ──────────────────────────────────────────
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const resTabs = await axios.get(`${API_URL}/api/tabs`);
        const allTabs = Array.isArray(resTabs.data) ? resTabs.data : [];
        setAllCategories(allTabs);
        const parentTabs = allTabs
          .filter((tab) => !tab.parent)
          .map((tab) => ({ label: tab.name, value: tab.key }));
        setCategories([{ label: "All", value: "" }, ...parentTabs]);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories.");
      }
    };
    fetchTabs();
  }, []);

  const getCategoryQuery = (tabId) => {
    if (!tabId) return "";
    const childIds = allCategories
      .filter((cat) => cat.parent === tabId)
      .map((cat) => cat.key);
    return [tabId, ...childIds].join(",");
  };

  // ── Fetch resources ─────────────────────────────────────
  useEffect(() => {
    const fetchFilteredResources = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Only send params that have real values
        const params = {};
        if (searchTerm && searchTerm.trim()) params.search = searchTerm.trim();
        const categoryQuery = getCategoryQuery(activeTab);
        if (categoryQuery) params.category = categoryQuery;

        const res = await axios.get(`${API_URL}/api/search`, { params });

        // ✅ Handle different response shapes safely
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setResources(data);

        if (data.length > 0 && data[0]?.content_id) {
          try {
            const relatedRes = await axios.get(`${API_URL}/api/related`, {
              params: { for: data[0].content_id },
            });
            setRelatedContents(
              Array.isArray(relatedRes.data) ? relatedRes.data : []
            );
          } catch (relErr) {
            console.warn("Related fetch failed:", relErr);
            setRelatedContents([]);
          }
        } else {
          setRelatedContents([]);
        }
      } catch (err) {
        console.error("Error fetching external contents:", err);
        setError(
          err.response?.data?.message || "Failed to load resources."
        );
        setResources([]);
        setRelatedContents([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce — avoids firing on every keystroke
    const timer = setTimeout(fetchFilteredResources, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, activeTab, allCategories]);

  const recentContents = [...resources]
    .filter((res) => res.uploaded_date)
    .sort((a, b) => new Date(b.uploaded_date) - new Date(a.uploaded_date))
    .slice(0, 20);

  return (
    <LibraryLayout
      categories={categories}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filteredResources={resources}
      recentContents={recentContents}
      loading={loading}
      error={error}
      relatedContents={relatedContents}
      showRecent={activeTab === "" && searchTerm === ""}
    />
  );
}