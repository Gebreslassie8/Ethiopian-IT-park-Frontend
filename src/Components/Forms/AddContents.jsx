import PropTypes from "prop-types";
  import ReusableForm from "../Forms/ReusableForm";
  import Button from "../Button/ReusableButton";
  import Colors from "../../Styles/Colors";
  import contentValidationSchema from "../../Shared/ValidationSchema/contentValidationSchema";

  const AddContents = ({
    onClose,
    onSubmit,
    initialValues,
    setSelectedFile,
    selectedFile,
    previewUrl,
    setPreviewUrl,
    contentId,
  }) => {
    const formFields = [
      { name: "title", type: "text", label: "Title" },
      { name: "tag", type: "text", label: "Tag (comma-separated)" },
      { name: "description", type: "text", label: "Description" },
      {
        name: "category",
        type: "select",
        label: "Category",
        options: [
          { value: "", label: "Select Category" },
          { value: "Videos", label: "Videos" },
          { value: "Articles", label: "Articles" },
          { value: "Documentaries", label: "Documentaries" },
          { value: "Research Papers", label: "Research Papers" },
          { value: "Tutorials", label: "Tutorials" },
          { value: "Scientific Papers", label: "Scientific Papers" },
          { value: "Blog Posts", label: "Blog Posts" },
          { value: "News Articles", label: "News Articles" },
          { value: "Case Studies", label: "Case Studies" },
        ],
      },
      { name: "contentCreator", type: "text", label: "Content Creator" },
      {
        name: "access_level",
        type: "select",
        label: "Access Level",
        options: [
          { value: "", label: "Select Access Level" },
          { value: "internaluser", label: "Internal User" },
          { value: "externaluser", label: "External User" },
        ],
      },
      {
        name: "file",
        type: "file",
        label: "Upload File",
        accept: "image/*,application/pdf",
        preview: true,
      },
    ];

    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg w-full max-w-md md:max-w-xl lg:max-w-2xl h-auto max-h-full overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-10 text-[#007590]">
            {contentId ? "Edit Content" : "Upload Content"}
          </h2>

          <ReusableForm
            id="upload-contents-form"
            fields={formFields}
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={contentValidationSchema}
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            render={(formik) => (
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="submit"
                  label={contentId ? "Update Content" : "Upload Content"}
                  className="my-2 px-4 md:px-6 text-base md:text-lg gap-2 py-2"
                />
                <Button
                  onClick={() => {
                    formik.resetForm();
                    setSelectedFile(null);
                    setPreviewUrl(initialValues.file_url || null);
                    onClose();
                  }}
                  label="Cancel"
                  className="my-2 px-4 md:px-6 text-base md:text-lg gap-2 py-2"
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

  AddContents.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    contentId: PropTypes.string,
    setSelectedFile: PropTypes.func.isRequired,
    selectedFile: PropTypes.object,
    previewUrl: PropTypes.string,
    setPreviewUrl: PropTypes.func.isRequired,
  };

  export default AddContents;