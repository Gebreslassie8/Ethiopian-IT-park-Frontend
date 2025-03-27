import * as yup from "yup";

const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const ValidationSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, "username must be at least 2 characters long")
    .max(30, "username must be less than 30 characters long")
    .matches(/^[a-zA-Z_]\w*$/ ,'Username must only contain alphanumeric characters and underscores')
    .required("Username is required"),
  email: yup
    .string()
    .matches(validEmail, "Invalid Email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Pasword must be 8 or more characters")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])\w+/,
      "Password ahould contain at least one uppercase and lowercase character"
    )
    .matches(/\d/, "Password should contain at least one number")
    .matches(
      /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/,
      "Password should contain at least one special character"
    )
    .required("password is required"),
});
export default ValidationSchema;
