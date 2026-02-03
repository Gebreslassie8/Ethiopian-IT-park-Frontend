import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Colors from "../../Styles/Colors";
import Button from "../../Components/Button/ReusableButton";
import ResetPasswordValidationSchema from "../../../../Shared/ValidationSchema/ResetPasswordValidationSchema";

const ResetPassword = () => {
  const { state } = useLocation();
  const email = state?.email || "";
  const navigate = useNavigate();

  const [values, setValues] = useState({ password: "", confirmPass: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const fields = [
    {
      name: "password",
      type: showPassword ? "text" : "password",
      label: "New Password",
      placeholder: "Enter new password",
      icon: showPassword ? <Eye size={20} /> : <EyeOff size={20} />,
      onToggle: togglePassword,
    },
    {
      name: "confirmPass",
      type: showConfirm ? "text" : "password",
      label: "Confirm Password",
      placeholder: "Confirm new password",
      icon: showConfirm ? <Eye size={20} /> : <EyeOff size={20} />,
      onToggle: toggleConfirm,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const validationErrors = ResetPasswordValidationSchema(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await fetch("http://localhost:3000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: values.password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset successfully.");
        setValues({ password: "", confirmPass: "" });
        setErrors({});
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[840px] h-[400px] flex bg-white rounded-xl shadow-lg overflow-hidden">
        <div
          className="w-[400px] rounded-l-xl"
          style={{ backgroundColor: Colors.deepTeal }}
        />
        <div className="w-[440px] flex flex-col justify-center px-10">
          <h2
            className="text-3xl font-bold font-['Outfit'] mb-8"
            style={{ color: Colors.deepTeal }}
          >
            Reset Password
          </h2>

          <form id="resetPasswordForm" onSubmit={handleSubmit} className="w-full">
            {fields.map(({ name, type, label, placeholder, icon, onToggle }) => (
              <div key={name} className="mb-4">
                <label
                  htmlFor={name}
                  className="block mb-1 font-semibold"
                  style={{ color: Colors.deepTeal }}
                >
                  {label}
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={values[name]}
                    onChange={handleChange}
                    className="flex-grow outline-none"
                    aria-label={label}
                    required
                  />
                  <button
                    type="button"
                    onClick={onToggle}
                    className="ml-2 text-gray-500"
                    aria-label={type === "password" ? "Show password" : "Hide password"}
                  >
                    {icon}
                  </button>
                </div>
                {errors[name] && (
                  <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}

            <Button
              type="submit"
              label="Reset Password"
              className="w-full mt-6"
              formId="resetPasswordForm"
            />
          </form>

          {message && <p className="text-sm text-green-600 mt-4">{message}</p>}
          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

          <p className="text-sm mt-4 text-center" style={{ color: Colors.smokyGray }}>
            Remembered your password?{" "}
            <Link to="/login" className="font-medium" style={{ color: Colors.deepTeal }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
