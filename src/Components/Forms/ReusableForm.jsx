import { useFormik } from "formik";
import Colors from "../../Styles/Colors";

const ReusableForm = ({ id, fields, onSubmit, initialValues, validationSchema }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form id={id} onSubmit={formik.handleSubmit} className="space-y-4 w-full">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col ">
          <label className="font-normal font-[sans-serif] text-base" style={{ color: Colors.smokyGray }}>
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
              {/* Optional Icon for fields like Password */}
              {field.icon && (
                <span
                  className="absolute right-3 cursor-pointer"
                  onClick={field.onIconClick}
                  style={{color:Colors.mediumGray}}
                >
                  {field.icon}
                </span>
              )}
            </div>
          )}

          {/* Dropdown (Select) */}
          {field.type === "select" && (
            <select {...formik.getFieldProps(field.name)} className="border p-2 rounded-xl w-full" 
              style={{ backgroundColor: Colors.lightGray, color: Colors.gray }}>
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
            <span className="text-red-500">{formik.errors[field.name]}</span>
          )}
        </div>
      ))}
    </form>
  );
};

export default ReusableForm;
