import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Colors from "./Styles/Colors";
import ReusableForm from "./Components/Forms/ReusableForm";
import Button from "./Components/Button/ReusableButton";
import { Eye, EyeOff } from "lucide-react";
import LoginValidationSchema from "./Shared/ValidationSchema/LoginValidationSchema";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const fields = [
    { name: "email", type: "text", label: "Email", placeholder: "Enter Your Email" },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      placeholder: "Enter Your Password",
      icon: showPassword ? <Eye size={20} /> : <EyeOff size={20} />,
      onIconClick: () => setShowPassword(!showPassword),
    },
  ];

  const initialValues = { email: "", password: "" };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, values);
      const { token, user } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("profile", JSON.stringify(user));
      resetForm();

      if (user.role_id === 5) {
        navigate("/admin");
      } else if (user.role_id === 6) {
        navigate("/content-manager");
      } 
      else if (user.role_id === 3) {
        navigate("/internal-library");
      } 
      else {
        setErrorMessage("Unauthorized role");
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[840px] h-[600px] flex bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="w-[400px] rounded-tl-xl rounded-bl-xl" style={{ backgroundColor: Colors.deepTeal }}></div>
        <div className="w-[400px] flex flex-col justify-center items-center px-10 ">
          <h2 className="text-3xl font-bold font-['Outfit'] mb-8" style={{ color: Colors.deepTeal }}>Login</h2>

          <ReusableForm
            id="loginForm"
            fields={fields}
            initialValues={initialValues}
            validationSchema={LoginValidationSchema}
            onSubmit={handleSubmit}
          />

          {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}

          <div className="w-[300px] flex justify-end mt-2">
            <a href="/forgotpassword" className="text-sm" style={{ color: Colors.deepTeal }}>
              Forgot Password?
            </a>
          </div>

          <Button type="submit" label="Login" className="w-full mt-4" formId="loginForm" disabled={loading} />
        </div>
      </div>
    </div>
  );
};

export default Login;
