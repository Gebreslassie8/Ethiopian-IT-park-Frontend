const ResetPasswordValidationSchema = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!values.confirmPass) {
    errors.confirmPass = 'Please confirm your password';
  } else if (values.password !== values.confirmPass) {
    errors.confirmPass = 'Passwords do not match';
  }

  return errors;
};

export default ResetPasswordValidationSchema;