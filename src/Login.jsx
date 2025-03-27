import { useState } from "react";
import { Link } from "react-router-dom";
import Colors from "./Styles/Colors";
import { Eye, EyeOff } from "lucide-react";
import ReusableForm from "./Components/Forms/ReusableForm";
import LoginValidationSchema from "./Schema/LoginValidationSchema";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields Configuration
  const fields = [
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Enter Your Email",
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      placeholder: "Enter Your Password",
      icon: showPassword ? <Eye size={20} /> : <EyeOff size={20} />,
      onIconClick: () => setShowPassword(!showPassword),
    },
  ];

  // Initial Form Values
  const initialValues = {
    email: "",
    password: "",
  };


  // Form Submission Handler
  const handleSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm();
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[890px] h-[600px] flex bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Left Section */}
        <div className="w-[400px] rounded-tl-xl rounded-bl-xl" style={{ backgroundColor: Colors.deepTeal }}></div>

        {/* Right Section - Form */}
        <div className="w-[440px] flex flex-col justify-center items-center px-10">
          <h2 className="justify-start text-3xl font-bold font-['Outfit'] mb-8" style={{ color: Colors.deepTeal }}>
            Login
          </h2>

          {/* Reusable Form Component */}
          <ReusableForm
            fields={fields}
            initialValues={initialValues}
            validationSchema={LoginValidationSchema}
            onSubmit={handleSubmit}
            submitButton={{
              label: "Login"
            }}
          />

          <div className="w-[300px] flex justify-end mt-2">
            <Link to="/forgot-password" className="text-sm" style={{ color: Colors.deepTeal }}>
              Forgot Password?
            </Link>
          </div>

          <p className="text-sm text-center mt-4" style={{ color: Colors.smokyGray }}>
            Don't have an account?{" "}
            <Link to="/signup" className="cursor-pointer" style={{ color: Colors.deepTeal }}>
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
