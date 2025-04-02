import PropTypes from "prop-types";
import ButtonStyle from "../../Styles/ButtonStyle";
import * as LucideIcons from "lucide-react";

const ReusableButton = ({
  label,
  icon,
  onClick,
  className = "",
  style = {},
  type = "button",
  formId,
}) => {
  const IconComponent = icon ? LucideIcons[icon] : null;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${ButtonStyle.base} ${className} flex items-center justify-center space-x-0.5 p-2 md:p-4 lg:p-6`}
      style={{
        color: style.color || ButtonStyle.color,
        backgroundColor: style.backgroundColor || ButtonStyle.backgroundColor,
        ...style,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor =
          style.hoverBackgroundColor || ButtonStyle.hoverBackgroundColor)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor =
          style.backgroundColor || ButtonStyle.backgroundColor)
      }
      form={formId} // Links the button to a specific form
    >
      {IconComponent && <IconComponent size={24} />}
      <span className="text-sm md:text-base lg:text-lg">{label}</span>
    </button>
  );
};

ReusableButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  formId: PropTypes.string,
};

export default ReusableButton;