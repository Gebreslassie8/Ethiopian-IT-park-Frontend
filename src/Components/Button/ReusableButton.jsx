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
      className={`${ButtonStyle.base} ${className}`}
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
      <span>{label}</span>
    </button>
  );
};

export default ReusableButton;
