import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom"; // <-- import useNavigate
import Colors from "../../Styles/Colors";
import Button from "../../Components/Button/ReusableButton";
import ForgotPasswordValidationSchema from "../../../../Shared/ValidationSchema/ForgotPasswordSchema";

const ForgotPassword = () => {
  const navigate = useNavigate(); // <-- initialize navigate

  const [values, setValues] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fields = [
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Enter your email",
      icon: <FiMail size={20} />,
    },
  ];

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = ForgotPasswordValidationSchema(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setMessage("");
      setError("");
      try {
        const res = await fetch("http://localhost:3000/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message);
          setError("");
          // Navigate to verify-otp page immediately with email in state
          navigate("/verifyotp", { state: { email: values.email } });
          setValues({ email: "" });
        } else {
          setError(data.message || "Something went wrong.");
          setMessage("");
        }
      } catch (err) {
        setError("Network error. Please try again.");
        setMessage("");
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[840px] h-[400px] flex bg-white rounded-xl overflow-hidden shadow-lg">
        <div
          className="w-[400px] rounded-tl-xl rounded-bl-xl"
          style={{ backgroundColor: Colors.deepTeal }}
        ></div>
        <div className="w-[400px] flex flex-col justify-center items-center px-10">
          <h2
            className="justify-start text-3xl font-bold font-['Outfit'] mb-8"
            style={{ color: Colors.deepTeal }}
          >
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit} id="forgotPasswordForm" className="w-full">
            {fields.map(({ name, type, label, placeholder, icon }) => (
              <div key={name} className="mb-4">
                <label
                  htmlFor={name}
                  className="block mb-1 font-semibold"
                  style={{ color: Colors.deepTeal }}
                >
                  {label}
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  {icon}
                  <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={values[name]}
                    onChange={handleChange}
                    className="ml-2 flex-grow outline-none"
                  />
                </div>
                {errors[name] && (
                  <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
            <Button
              type="submit"
              label="Send OTP"
              className="w-full mt-6"
              formId="forgotPasswordForm"
            />
          </form>
          {message && (
            <p className="text-sm text-green-600 mt-4 text-center">{message}</p>
          )}
          {error && <p className="text-sm text-red-600 mt-4 text-center">{error}</p>}
          <p
            className="text-sm text-center mt-4"
            style={{ color: Colors.smokyGray }}
          >
            Remembered your password?{" "}
            <Link
              to="/login"
              className="cursor-pointer"
              style={{ color: Colors.deepTeal }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
