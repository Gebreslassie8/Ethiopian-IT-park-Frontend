import { useFormik } from "formik";
import PropTypes from "prop-types";
import { useState } from "react";
import Colors from "../../Styles/Colors";

const ReusableForm = ({ id, fields, onSubmit, initialValues, validationSchema, render }) => {
  const [previews, setPreviews] = useState({});
  const [files, setFiles] = useState({});

  const formik = useFormik({
    initialValues,
    validationSchema,
   onSubmit: (values, formikHelpers) => {
  const hasFileField = fields.some((field) => field.type === "file");

  const finalValues = hasFileField ? { ...values, ...files } : values;

  onSubmit(finalValues, formikHelpers);
    },

  });

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({ ...prev, [fieldName]: file }));
    const url = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [fieldName]: { url, type: file.type } }));
    formik.setFieldValue(fieldName, file.name); // Store file name for validation
  };

  return (
    <form id={id} onSubmit={formik.handleSubmit} className="space-y-4 w-full">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="font-normal font-[sans-serif] text-base mb-1" style={{ color: Colors.smokyGray }}>
            {field.label}
          </label>

          {/* Text, Email, Password Inputs */}
          {["text", "email", "password"].includes(field.type) && (
            <div className="relative flex items-center">
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                {...formik.getFieldProps(field.name)}
                className="border p-2 rounded-xl w-full"
                style={{ backgroundColor: Colors.lightGray, color: Colors.gray }}
              />
              {field.icon && (
                <button
                  type="button"
                  className="absolute right-3 cursor-pointer"
                  onClick={field.onIconClick}
                  style={{ color: Colors.mediumGray }}
                >
                  {field.icon}
                </button>
              )}
            </div>
          )}

          {/* File Upload Input */}
          {field.type === "file" && (
            <div className="relative flex flex-col">
              <input
                id={field.name}
                type="file"
                accept={field.accept || "image/*,application/pdf"}
                onChange={(e) => handleFileChange(e, field.name)}
                className="border p-2 rounded-xl w-full cursor-pointer"
                style={{ backgroundColor: Colors.lightGray, color: Colors.gray }}
              />
              {previews[field.name] && (
                <div className="mt-3">
                  <p className="text-sm mb-1" style={{ color: Colors.smokyGray }}>
                    Preview
                  </p>
                  {previews[field.name].type === "application/pdf" ? (
                    <iframe
                      src={previews[field.name].url}
                      className="w-full h-64 border rounded-xl"
                      title="PDF Preview"
                    />
                  ) : (
                    <img
                      src={previews[field.name].url}
                      alt="Preview"
                      className="max-h-60 rounded-xl shadow"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dropdown (Select) */}
          {field.type === "select" && (
            <select
              {...formik.getFieldProps(field.name)}
              className="border p-2 rounded-xl w-full"
              style={{ backgroundColor: Colors.lightGray, color: Colors.gray }}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {/* Radio Buttons */}
          {field.type === "radio" && (
            <div className="flex gap-4">
              {field.options.map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formik.values[field.name] === option.value}
                    onChange={formik.handleChange}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Checkboxes */}
          {field.type === "checkbox" && (
            <div className="flex flex-col gap-2">
              {field.options.map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={option.value}
                    checked={formik.values[field.name]?.includes(option.value)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      const currentValues = formik.values[field.name] || [];
                      formik.setFieldValue(
                        field.name,
                        checked ? [...currentValues, value] : currentValues.filter((v) => v !== value)
                      );
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Form Validation Error Messages */}
          {formik.touched[field.name] && formik.errors[field.name] && (
            <span className="text-red-500 text-sm">{formik.errors[field.name]}</span>
          )}
        </div>
      ))}

      {/* Render buttons or custom elements inside Formik */}
      {render && render(formik)}
    </form>
  );
};

ReusableForm.propTypes = {
  id: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["text", "email", "password", "select", "radio", "checkbox", "file"]).isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      icon: PropTypes.element,
      onIconClick: PropTypes.func,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      accept: PropTypes.string,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object.isRequired,
  render: PropTypes.func,
};

export default ReusableForm;
