import PropTypes from "prop-types";
import { Eye, Download } from "lucide-react";
import Colors from "../../Styles/Colors";
import { motion } from "framer-motion";
import defaultImage from "../../assets/PreviewUnavailable.jpg"

const ResourceCard = ({
  title,
  description,
  category,
  previewUrl,
  file_format,
  fileSize,
  duration,
  views,
  downloads,
  onView,
  onDownload,
  fallbackImage = defaultImage
}) => {
  // Function to format file size
  const formatFileSize = (bytes) => {
    if (typeof bytes !== 'number') {
      bytes = Number(bytes);
      if (isNaN(bytes)) return 'Unknown size';
    }

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // Base button style
  const baseButtonStyle = {
    color: "white",
    padding: "8px 16px",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.3s",
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col bg-gray-50"
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
    >
      <motion.div 
        className="w-full h-48 mb-4 overflow-hidden rounded-md"
        variants={imageVariants}
      >
        <img
          src={previewUrl}
          alt={`Preview of ${title}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
      </motion.div>

      <div className="space-y-2 text-sm text-gray-800 flex-1">
        <p><strong>Title:</strong> {title}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Category:</strong> {category}</p>
        <p><strong>File Format:</strong> {file_format}</p>
        <p><strong>File Size:</strong> {formatFileSize(fileSize)}</p>
        {duration && (
          <p><strong>Duration:</strong> {duration}</p>
        )}
        <p className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-500" />
          <span><strong>Views:</strong> {views}</span>
        </p>
        <p className="flex items-center gap-2">
          <Download className="w-4 h-4 text-green-600" />
          <span><strong>Downloads:</strong> {downloads}</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <motion.button
          style={{ ...baseButtonStyle, background: Colors.deepTeal }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = Colors.skyTeal)}
          onMouseLeave={(e) => (e.currentTarget.style.background = Colors.deepTeal)}
          onClick={onView}
        >
          <Eye className="w-4 h-4 mr-2" /> View
        </motion.button>
        <motion.button
          style={{ ...baseButtonStyle, background: Colors.deepBlue }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = Colors.deepBlueHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = Colors.deepBlue)}
          onClick={onDownload}
        >
          <Download className="w-4 h-4 mr-2" /> Download
        </motion.button>
      </div>
    </motion.div>
  );
};

ResourceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  previewUrl: PropTypes.string.isRequired,
  file_format: PropTypes.string.isRequired,
  fileSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  duration: PropTypes.string,
  views: PropTypes.number.isRequired,
  downloads: PropTypes.number.isRequired,
  onView: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default ResourceCard;