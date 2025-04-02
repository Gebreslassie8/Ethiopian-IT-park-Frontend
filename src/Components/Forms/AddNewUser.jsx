import React from 'react';
import PropTypes from 'prop-types';
import ReusableForm from './ReusableForm';
import ValidationSchema from "../../Schema/SignupValidationSchema";
import Button from "../Button/ReusableButton";
import Colors from "../../Styles/Colors";

const AddUserForm = ({ onClose }) => {
  const formFields = [
    { name: 'username', type: 'text', label: 'Username', placeholder: 'Enter username' },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'Enter email' },
    { name: 'password', type: 'password', label: 'Password', placeholder: 'Enter password' },
    { name: 'role', type: 'select', label: 'Role', options: [
      { value: 'internal user', label: 'Internal User' },
      { value: 'external user', label: 'External User' },
    ]},
  ];

  const initialValues = {
    username: '',
    email: '',
    password: '',
    role: 'internal user',
  };

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-10 text-[#007590]">Add User</h2>
        <ReusableForm
          id="add-user-form"
          fields={formFields}
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={ValidationSchema}
          render={(formik) => (
            <div className='flex justify-end gap-4 mt-4'>
              <Button
                type="submit"
                label="Add User"
                className="my-2 px-4 md:px-6 text-base md:text-lg gap-2 py-2"
              />
              <Button
                onClick={() => {
                  formik.resetForm(); // Reset the form fields
                  onClose(); // Close the form
                }}
                label="Cancel"
                className="my-2 px-4 md:px-6 text-base md:text-lg gap-2 py-2"
                style={{
                  backgroundColor: Colors.white,
                  color: Colors.red,
                  hoverBackgroundColor: Colors.lightGray,
                  borderColor: Colors.red,
                  borderWidth: "2px",
                  borderStyle: "solid"
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
  onClose: PropTypes.func.isRequired,
};

export default AddUserForm;
