import { useFormik } from "formik";
import ButtonStyle from "../../Styles/ButtonStyle";
import Colors from "../../Styles/Colors";

const Form = ({ fields, onSubmit, initialValues, validationSchema ,submitButton}) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="font-semibold font-[Outfit] text-base" style={{color:Colors.smokyGray}}>{field.label}</label>

          {/* Text, Email, Password Inputs */}
          {["text", "email", "password"].includes(field.type) && (
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              {...formik.getFieldProps(field.name)}
              className="border p-2 rounded-xl " style={{backgroundColor:Colors.lightGray ,color:Colors.gray}}
            />
          )}

          {/* Dropdown (Select) */}
          {field.type === "select" && (
            <select {...formik.getFieldProps(field.name)} className="border p-2 rounded-xl" style={{backgroundColor:Colors.lightGray ,color:Colors.gray}}>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {/* Radio Buttons */}
          {field.type === "radio" &&
            field.options.map((option) => (
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

          {/* Checkboxes */}
          {field.type === "checkbox" &&
            field.options.map((option) => (
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

          {formik.touched[field.name] && formik.errors[field.name] && (
            <span className="text-red-500">{formik.errors[field.name]}</span>
          )}
        </div>
      ))}

{submitButton ? (
        typeof submitButton === "function" ? (
          submitButton(formik)
        ) : (
            <button
            type="submit"
            className={`${ButtonStyle.base} ${submitButton?.className || ""}`}
            style={{
              color: submitButton?.style?.color || ButtonStyle.color,
              backgroundColor: submitButton?.style?.backgroundColor || ButtonStyle.backgroundColor,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = submitButton?.style?.hoverBackgroundColor || ButtonStyle.hoverBackgroundColor)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = submitButton?.style?.backgroundColor || ButtonStyle.backgroundColor)}
          >
            {submitButton?.label || "Submit"}
          </button>
        )
      ) : (
        <button type="submit" className={`${ButtonStyle.base} ${ButtonStyle.hoverBackgroundColor}`}>
          Submit
        </button>
      )}
    </form>
  );
};

export default Form;
