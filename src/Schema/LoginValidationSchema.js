 import * as yup from "yup";

 const validEmail=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
 const LoginValidationSchema = yup.object().shape({
    email: yup
        .string()
        .matches(validEmail, "Invalid Email")
        .required("Email is required"),
      password: yup
        .string()
        .min(8, "Password must be 8 or more characters")
        .required("password is required"),
 });
 export default LoginValidationSchema;