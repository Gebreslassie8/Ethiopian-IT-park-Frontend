import React, { useEffect, useState } from "react";
import axios from "axios";
import LibraryLayout from "../Components/Library/LibraryLayout";

export default function InternalLibrary() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([{ label: "All", value: "" }]);
  const [allCategories, setAllCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedContents, setRelatedContents] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch categories
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const resTabs = await axios.get(`${import.meta.env.VITE_API_URL}/api/tabs`);
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

  // Combine active tab and its children for query
  const getCategoryQuery = (tabId) => {
    if (!tabId) return "";
    const childIds = allCategories
      .filter((cat) => cat.parent === tabId)
      .map((cat) => cat.key);
    return [tabId, ...childIds].join(",");
  };

  // Fetch filtered and related resources
  useEffect(() => {
    const fetchFilteredResources = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/search`, {
          params: {
            search: searchTerm,
            category: getCategoryQuery(activeTab),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setResources(res.data);

        if (res.data.length > 0) {
          const relatedRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/related/internal`,
            {
              params: { for: res.data[0].content_id },
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setRelatedContents(relatedRes.data);
        } else {
          setRelatedContents([]);
        }
      } catch (err) {
        console.error("Error fetching internal contents:", err);
        setError("Failed to load resources.");
        setRelatedContents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredResources();
  }, [searchTerm, activeTab]);

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
