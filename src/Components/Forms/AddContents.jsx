import React from 'react';
import ReusableForm from './ReusableForm';
import ValidationSchema from "../../Schema/SignupValidationSchema";
import Button from "../Button/ReusableButton";
import Colors from "../../Styles/Colors"

const AddContents= ({ onClose }) => {
  const formFields = [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'tag', type: 'text', label: 'Tag' },
    { name: 'description', type: 'text', label: 'Description' },
    { name: 'category', type: 'text', label: 'Category' },
    { name: 'contentCreator', type: 'text', label: 'Content Creator' },
    { name: 'filePath', type: 'text', label: 'File Path' },
    { name: 'previewPath', type: 'text', label: 'Preview Path' },
    { name: 'accessLevel', type: 'select', label: 'Access Level', options: [
      { value: 'internal user', label: 'Internal User' },
      { value: 'external user', label: 'External User' },
    ]},
  ];
  
  const initialValues = {
    title: '',
    tag: '',
    description: '',
    contentCreator: '',
    category:'',
    accessLevel: 'internal user',
    filePath: '',
    previewPath: '',
  };
  const handleSubmit = (values) => {
    console.log('Form values:', values);
    onClose(); // close the form after submission
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg w-120">
        <h2 className="text-3xl font-semibold mb-10 text-[#007590]">Upload Content</h2>
        <ReusableForm
          id="upload-contents-form"
          fields={formFields}
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={ValidationSchema}
        />
        <div className='flex justify-end gap-4 mt-4'>
        <Button
            type="submit"
            label="Upload Content"
            className="my-2 px-4 md:px-6 text-lg md:text-lg gap-2 py-2"
          />
          <Button
          onClick={onClose}
            label="Cancel"
            className="my-2 px-4 md:px-6 text-lg md:text-lg gap-2 py-2"
            style={{backgroundColor:Colors.white ,color:Colors.red ,hoverBackgroundColor:Colors.lightGray,
            borderColor:Colors.red,
            borderWidth:"2px",
            borderStyle:"solid"
            }}
          />
          </div>
      </div>
    </div>
  );
};
export default AddContents;