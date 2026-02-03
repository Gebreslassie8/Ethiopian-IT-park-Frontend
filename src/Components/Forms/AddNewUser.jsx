import PropTypes from "prop-types";
import { useState } from "react";
import ReusableForm from "./ReusableForm";
import ValidationSchema from "../../../../Shared/ValidationSchema/UserValidationSchema";
import Button from "../Button/ReusableButton";
import Colors from "../../Styles/Colors";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const AddUserForm = ({ onSubmit, onClose, initialValues, formTitle }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const formFields = [
    {
      name: "username",
      type: "text",
      label: "Username",
      placeholder: "Enter username",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Enter email",
    },
    {
      name: "password",
      type: showPassword ? "text" : "password", // Toggle type based on state
      label: "Password",
      placeholder: "Enter password",
      icon: showPassword ? <FaEyeSlash /> : <FaEye />, // Use eye icon
      onIconClick: togglePasswordVisibility, // Handle icon click
    },
    {
      name: "role",
      type: "select",
      label: "Role",
      placeholder: "Select role",
      options: [
        { label: "Select role", value: "" },
        { label: "Admin", value: "admin" },
        { label: "Content Manager", value: "contentmanager" },
        { label: "Internal User", value: "internaluser" },
        { label: "External User", value: "externaluser" },
      ],
    },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-auto max-h-full overflow-y-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-[#007590]">
          {formTitle}
        </h2>
        <ReusableForm
          id="add-user-form"
          fields={formFields}
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={ValidationSchema}
          render={(formik) => (
            <div className="flex justify-end gap-2 sm:gap-4 mt-4">
              <Button
                type="submit"
                label={formTitle}
                className="my-2 px-3 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg gap-2 py-2"
              />
              <Button
                onClick={() => {
                  formik.resetForm();
                  onClose();
                }}
                label="Cancel"
                className="my-2 px-3 sm:px-4 md:px-6 text-sm sm:text-base md:text-lg gap-2 py-2"
                style={{
                  backgroundColor: Colors.white,
                  color: Colors.red,
                  hoverBackgroundColor: Colors.lightGray,
                  borderColor: Colors.red,
                  borderWidth: "2px",
                  borderStyle: "solid",
                }}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

AddUserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  formTitle: PropTypes.string.isRequired,
};

export default AddUserForm;