import * as Yup from 'yup';

const contentValidationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  tag: Yup.string().required('Tag is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  contentCreator: Yup.string().required('Content Creator is required'),
  access_level: Yup.string().required('Access Level is required'),
  file: Yup.mixed().nullable(),
});

export default contentValidationSchema;