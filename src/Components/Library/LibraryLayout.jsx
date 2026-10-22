
import PropTypes from "prop-types";
import React, { useState } from "react";
import Navbar from "./Navbar";
import ResourceCard from "../Cards/ResourseCard";
import Colors from "../../Styles/Colors";
import defaultImage from "../../assets/PreviewUnavailable.jpg";
import MyProfile from "../Dashboard/MyProfile";
import Notification from "../Dashboard/Notification";
import Settings from "../Dashboard/Settings";

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

  const handleView = async (contentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://ethiopian-it-park-backend.onrender.com/api/${contentId}/view`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const response = await fetch(
        `https://ethiopian-it-park-backend.onrender.com/api/${contentId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  // ✅ Renders content sections (Recent, Filtered, Related)
  const renderContentSection = (title, contents) => {
    if (!contents || contents.length === 0) return null;

    return (
      <section className="mb-10">
        {title && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    : `https://ethiopian-it-park-backend.onrender.com/api/files/preview/${res.preview_path
                        .split(/[\\/]/)
                        .pop()}`
                  : defaultImage
              }
              previewType={res.preview_type}
              download={`https://ethiopian-it-park-backend.onrender.com/${res.file_url}`}
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
    <div className="min-h-screen" style={{ background: Colors.softGray }}>
      <Navbar
        onProfileClick={() => setShowProfile(true)}
        onNotificationClick={() => setShowNotification(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

      <header
        className="relative w-full h-[50vh] flex items-center justify-center px-6"
        style={{
          background: `linear-gradient(to right, ${Colors.deepBlue}, ${Colors.deepTeal})`,
        }}
      >
        <div className="max-w-4xl text-center text-white">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Explore Our Digital Resource_core_Library 
          </h1>
        </div>
      </header>

      <main className="w-full max-w-[1440px] mx-auto p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <nav className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                className={`px-5 py-2 rounded-full font-semibold transition ${
                  activeTab === cat.value
                    ? "text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
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

          <input
            type="search"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-white"
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${Colors.deepTeal}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = `none`;
            }}
          />
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading resources...</p>
        )}
        {!loading && error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <>
            {searchTerm.trim() === "" && renderContentSection("Recent Contents", recentContents)}

            {searchTerm.trim() !== "" && (
              <>
                {filteredResources.length > 0 ? (
                  renderContentSection("", filteredResources)
                ) : (
                  <p className="text-center text-gray-500 mt-10">
                    No resources match your search or filter criteria.
                  </p>
                )}

                {relatedContents && relatedContents.length > 0 &&
                  renderContentSection("Related Contents", relatedContents)}
              </>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showProfile && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <MyProfile onClose={() => setShowProfile(false)} />
        </div>
      )}
      {showNotification && (
        <div className="fixed top-20 right-5 z-[9999] flex flex-col items-end space-y-3">
          <Notification
            type="success"
            message="You have a new message!"
            onClose={() => setShowNotification(false)}
          />
        </div>
      )}
      {showSettings && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
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