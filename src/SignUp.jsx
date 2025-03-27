import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ValidationSchema from "./Schema/SignupValidationSchema";
import { Link } from "react-router-dom";
import Colors from "./Styles/Colors";
import ReusableForm from "./Components/Forms/ReusableForm";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const fields = [
    { name: "username", type: "text",label:"Username", placeholder: "Enter Your Name" },
    { name: "email", type: "email", label:"Email",placeholder: "Enter Your Email" },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      placeholder: "Enter Your Password",
      icon: showPassword ? <Eye size={20} /> : <EyeOff size={20} />,
      onIconClick: () => setShowPassword(!showPassword),
    },
  ];

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log(values);
    resetForm();
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[890px] h-[600px] flex bg-white rounded-xl overflow-hidden shadow-lg">
        {/* left section */}
        <div className="w-[400px] rounded-tl-xl rounded-bl-xl" style={{ backgroundColor: Colors.deepTeal }}></div>
        {/* right Section - Form */}
        <div className="w-[440px] flex flex-col justify-center items-center px-10">
          <h2 className="justify-start text-3xl font-bold font-['Outfit'] mb-8" style={{ color: Colors.deepTeal }}>
            SignUp
          </h2>
          <ReusableForm
            fields={fields}
            initialValues={initialValues}
            validationSchema={ValidationSchema}
            onSubmit={handleSubmit}
            submitButton={{
              label: "SignUp",
            }}
          />
          <p className="text-sm text-center mt-4" style={{ color: Colors.smokyGray }}>
            Do you have an account?{" "}
            <Link to="/login" className="cursor-pointer" style={{ color: Colors.deepTeal }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;