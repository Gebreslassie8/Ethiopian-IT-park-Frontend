import PropTypes from "prop-types";
import React, { useState } from "react";
import Navbar from "./Navbar";
import ResourceCard from "../Cards/ResourseCard";
import Colors from "../../Styles/Colors";
import defaultImage from "../../assets/PreviewUnavailable.jpg";
import MyProfile from "../Dashboard/MyProfile";
import Notification from "../Dashboard/Notification";
import Settings from "../Dashboard/Settings";

const API_BASE = "https://ethiopian-it-park-backend.onrender.com";

const LibraryLayout = ({
  categories,
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  filteredResources,
  recentContents,
  relatedContents,
  loading,
  error,
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ─── View / Download handlers ─────────────────────────
  const handleView = async (contentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/${contentId}/view`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to load file");
      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing content:", error);
    }
  };

  const handleDownload = async (contentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/${contentId}/download`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to download file");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = contentId + "_download";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading content:", error);
    }
  };

  // ─── Content section renderer ─────────────────────────
  const renderContentSection = (title, contents) => {
    if (!contents || contents.length === 0) return null;

    return (
      <section className="mb-10 sm:mb-14">
        {title && (
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <span
              className="w-1 h-6 sm:h-8 rounded-full"
              style={{ background: Colors.deepTeal }}
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              {title}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {contents.map((res) => (
            <ResourceCard
              key={res.content_id}
              title={res.title}
              description={res.description}
              category={res.category}
              previewUrl={
                res.preview_path
                  ? res.preview_path.startsWith("http")
                    ? res.preview_path
                    : `${API_BASE}/api/files/preview/${res.preview_path
                        .split(/[\\/]/)
                        .pop()}`
                  : defaultImage
              }
              previewType={res.preview_type}
              download={`${API_BASE}/${res.file_url}`}
              views={res.view_count || res.views || 0}
              downloads={res.download_count || res.downloads || 0}
              file_format={res.file_format}
              fileSize={res.file_size}
              onView={() => handleView(res.content_id)}
              onDownload={() => handleDownload(res.content_id)}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: Colors.softGray }}>
      <Navbar
        onProfileClick={() => setShowProfile(true)}
        onNotificationClick={() => setShowNotification(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

      {/* ─── Hero ─────────────────────────────────────── */}
      <header
        className="relative w-full flex items-center justify-center px-4 sm:px-6 md:px-10
                   h-[280px] sm:h-[340px] md:h-[420px] lg:h-[460px]"
        style={{
          background: `linear-gradient(135deg, ${Colors.deepBlue} 0%, ${Colors.deepTeal} 100%)`,
        }}
      >
        <div className="max-w-4xl text-center text-white">
          <p className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-white/80 mb-2 sm:mb-3">
            Ethiopian IT Park
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Explore Our Digital Enterprise Content Management System
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/85 max-w-2xl mx-auto">
            Discover videos, articles, tutorials, and research papers — all in one place.
          </p>
        </div>
      </header>

      {/* ─── Main ─────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        {/* ─── Search + Filters ─────────────────────── */}
        <div
          className="sticky top-0 z-30 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-3 mb-6 sm:mb-8
                     backdrop-blur-md border-b border-white/40"
          style={{ background: "rgba(255,255,255,0.85)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="md:hidden self-start inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium shadow-sm"
            >
              <span>Categories</span>
              <span className={`transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {/* Categories */}
            <nav
              className={`${mobileFiltersOpen ? "flex" : "hidden"} md:flex flex-wrap gap-2 sm:gap-3 -mx-1 px-1 overflow-x-auto md:overflow-visible no-scrollbar`}
            >
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveTab(cat.value);
                    setMobileFiltersOpen(false);
                  }}
                  className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base font-semibold transition ${
                    activeTab === cat.value
                      ? "text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                  style={
                    activeTab === cat.value
                      ? {
                          background: `linear-gradient(to right, ${Colors.deepTeal}, ${Colors.deepBlue})`,
                        }
                      : {}
                  }
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            {/* Search */}
            <input
              type="search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-72 lg:w-80 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none bg-white text-sm sm:text-base"
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${Colors.deepTeal}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* ─── Loading / Error / Content ────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-base sm:text-lg">Loading resources...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center py-16">
            <p className="text-red-500 text-base sm:text-lg text-center">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {searchTerm.trim() === "" &&
              renderContentSection("Recent Contents", recentContents)}

            {searchTerm.trim() !== "" && (
              <>
                {filteredResources.length > 0 ? (
                  renderContentSection("", filteredResources)
                ) : (
                  <div className="flex items-center justify-center py-16">
                    <p className="text-center text-gray-500 text-base sm:text-lg px-4">
                      No resources match your search or filter criteria.
                    </p>
                  </div>
                )}

                {relatedContents &&
                  relatedContents.length > 0 &&
                  renderContentSection("Related Contents", relatedContents)}
              </>
            )}
          </>
        )}
      </main>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer
        className="w-full text-white text-center py-6 sm:py-8 px-4"
        style={{ background: Colors.deepBlue }}
      >
        <p className="text-sm sm:text-base">
          © {new Date().getFullYear()} Ethiopian IT Park — Digital Enterprise Content Management System
        </p>
      </footer>

      {/* ─── Modals ──────────────────────────────────── */}
      {showProfile && (
        <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/30 p-4">
          <MyProfile onClose={() => setShowProfile(false)} />
        </div>
      )}
      {showNotification && (
        <div className="fixed top-20 right-3 sm:right-5 z-[9999] flex flex-col items-end space-y-3 max-w-[90vw]">
          <Notification
            type="success"
            message="You have a new message!"
            onClose={() => setShowNotification(false)}
          />
        </div>
      )}
      {showSettings && (
        <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/30 p-4">
          <Settings onClose={() => setShowSettings(false)} />
        </div>
      )}
    </div>
  );
};

LibraryLayout.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filteredResources: PropTypes.array.isRequired,
  recentContents: PropTypes.array.isRequired,
  relatedContents: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default LibraryLayout;




// import PropTypes from "prop-types";
// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import ResourceCard from "../Cards/ResourseCard";
// import Colors from "../../Styles/Colors";
// import defaultImage from "../../assets/PreviewUnavailable.jpg";
// import MyProfile from "../Dashboard/MyProfile";
// import Notification from "../Dashboard/Notification";
// import Settings from "../Dashboard/Settings";

// const LibraryLayout = ({
//   categories,
//   activeTab,
//   setActiveTab,
//   searchTerm,
//   setSearchTerm,
//   filteredResources,
//   recentContents,
//   relatedContents,
//   loading,
//   error,
// }) => {
//   const [showProfile, setShowProfile] = useState(false);
//   const [showNotification, setShowNotification] = useState(false);
//   const [showSettings, setShowSettings] = useState(false);

//   const handleView = async (contentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `https://ethiopian-it-park-backend.onrender.com/api/${contentId}/view`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!response.ok) throw new Error("Failed to load file");
//       const blob = await response.blob();
//       const fileURL = window.URL.createObjectURL(blob);
//       window.open(fileURL, "_blank");
//     } catch (error) {
//       console.error("Error viewing content:", error);
//     }
//   };

//   const handleDownload = async (contentId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `https://ethiopian-it-park-backend.onrender.com/api/${contentId}/download`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!response.ok) throw new Error("Failed to download file");
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = contentId + "_download";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (error) {
//       console.error("Error downloading content:", error);
//     }
//   };

// const renderContentSection = (title, contents) => {
//     if (!contents || contents.length === 0) return null;

//     return (
//       <section className="mb-10 w-full">
//         {title && (
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
//           {contents.map((res) => (
//             <ResourceCard
//               key={res.content_id}
//               title={res.title}
//               description={res.description}
//               category={res.category}
//               previewUrl={
//                 res.preview_path
//                   ? res.preview_path.startsWith("http")
//                     ? res.preview_path
//                     : `https://ethiopian-it-park-backend.onrender.com/api/files/preview/${res.preview_path
//                         .split(/[\\/]/)
//                         .pop()}`
//                   : defaultImage
//               }
//               previewType={res.preview_type}
//               download={`https://ethiopian-it-park-backend.onrender.com/${res.file_url}`}
//               views={res.view_count || res.views || 0}
//               downloads={res.download_count || res.downloads || 0}
//               file_format={res.file_format}
//               fileSize={res.file_size}
//               onView={() => handleView(res.content_id)}
//               onDownload={() => handleDownload(res.content_id)}
//             />
//           ))}
//         </div>
//       </section>
//     );
//   };

//   return (
//     <div className="min-h-screen w-full" style={{ background: Colors.softGray }}>
//       <Navbar
//         onProfileClick={() => setShowProfile(true)}
//         onNotificationClick={() => setShowNotification(true)}
//         onSettingsClick={() => setShowSettings(true)}
//       />

//       <header
//         className="relative w-full h-[50vh] flex items-center justify-center px-6"
//         style={{
//           background: `linear-gradient(to right, ${Colors.deepBlue}, ${Colors.deepTeal})`,
//         }}
//       >
//         <div className="max-w-4xl text-center text-white">
//           <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
//             Explore Our Digital Library Resources
//           </h1>
//         </div>
//       </header>

//       <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
//           <nav className="flex flex-wrap gap-4">
//             {categories.map((cat) => (
//               <button
//                 key={cat.value}
//                 onClick={() => setActiveTab(cat.value)}
//                 className={`px-5 py-2 rounded-full font-semibold transition ${
//                   activeTab === cat.value
//                     ? "text-white shadow-lg"
//                     : "bg-white text-gray-700 hover:bg-gray-100"
//                 }`}
//                 style={
//                   activeTab === cat.value
//                     ? {
//                         background: `linear-gradient(to right, ${Colors.deepTeal}, ${Colors.deepBlue})`,
//                       }
//                     : {}
//                 }
//               >
//                 {cat.label}
//               </button>
//             ))}
//           </nav>

//           <input
//             type="search"
//             placeholder="Search by title or description..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full sm:w-72 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-white"
//             onFocus={(e) => {
//               e.currentTarget.style.boxShadow = `0 0 0 2px ${Colors.deepTeal}`;
//             }}
//             onBlur={(e) => {
//               e.currentTarget.style.boxShadow = `none`;
//             }}
//           />
//         </div>

//         {loading && (
//           <div className="w-full text-center text-gray-500 py-10">
//             Loading resources...
//           </div>
//         )}
//         {!loading && error && (
//           <div className="w-full text-center text-red-500 py-10">{error}</div>
//         )}

//         {!loading && !error && (
//           <>
//             {searchTerm.trim() === "" && renderContentSection("Recent Contents", recentContents)}

//             {searchTerm.trim() !== "" && (
//               <>
//                 {filteredResources.length > 0 ? (
//                   renderContentSection("Search Results", filteredResources)
//                 ) : (
//                   <div className="w-full text-center text-gray-500 py-10">
//                     No resources match your search or filter criteria.
//                   </div>
//                 )}

//                 {relatedContents && relatedContents.length > 0 &&
//                   renderContentSection("Related Contents", relatedContents)}
//               </>
//             )}
//           </>
//         )}
//       </main>

//       {/* Modals */}
//       {showProfile && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <MyProfile onClose={() => setShowProfile(false)} />
//         </div>
//       )}
//       {showNotification && (
//         <div className="fixed top-20 right-5 z-[9999] flex flex-col items-end space-y-3">
//           <Notification
//             type="success"
//             message="You have a new message!"
//             onClose={() => setShowNotification(false)}
//           />
//         </div>
//       )}
//       {showSettings && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <Settings onClose={() => setShowSettings(false)} />
//         </div>
//       )}
//     </div>
//   );
// };

// LibraryLayout.propTypes = {
//   categories: PropTypes.arrayOf(
//     PropTypes.shape({
//       value: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   activeTab: PropTypes.string.isRequired,
//   setActiveTab: PropTypes.func.isRequired,
//   searchTerm: PropTypes.string.isRequired,
//   setSearchTerm: PropTypes.func.isRequired,
//   filteredResources: PropTypes.array.isRequired,
//   recentContents: PropTypes.array.isRequired,
//   relatedContents: PropTypes.array,
//   loading: PropTypes.bool.isRequired,
//   error: PropTypes.string,
// };

// export default LibraryLayout;