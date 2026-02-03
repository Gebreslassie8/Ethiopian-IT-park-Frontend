import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiKey } from "react-icons/fi";
import * as Yup from "yup";
import Colors from "../../Styles/Colors";
import ReusableForm from "../../Components/Forms/ReusableForm";
import Button from "../../Components/Button/ReusableButton";

const VerifyOtpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^[A-Z0-9]{6}$/, "OTP must be 6 alphanumeric characters"),
});

const VerifyOtp = ({ onOtpVerified }) => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Add navigation hook
  const email = location.state?.email || ""; // fallback to empty string if email is missing

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fields = [
    {
      name: "otp",
      type: "text",
      label: "OTP",
      placeholder: "Enter the 6-digit OTP",
      maxLength: 6,
      icon: <FiKey size={20} />,
    },
  ];

  const initialValues = {
    otp: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is missing. Cannot verify OTP.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setError("");
        if (onOtpVerified) onOtpVerified();
        resetForm();

        // ✅ Automatically redirect to reset-password with email
        navigate("/resetpassword", { state: { email } });
      } else {
        setError(data.message || "Invalid OTP.");
        setMessage("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setMessage("");
    }
  };

  const handleResendOtp = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is missing. Cannot resend OTP.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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
            Verify OTP
          </h2>
          <ReusableForm
            fields={fields}
            initialValues={initialValues}
            validationSchema={VerifyOtpValidationSchema}
            onSubmit={handleSubmit}
            id="verifyOtpForm"
          />
          <Button
            type="submit"
            label="Verify OTP"
            className="w-full mt-6"
            formId="verifyOtpForm"
          />
          {message && (
            <p className="text-sm text-green-600 mt-4 text-center">{message}</p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-4 text-center">{error}</p>
          )}
          <p className="text-sm text-center mt-4" style={{ color: Colors.smokyGray }}>
            Didn't receive the OTP?{" "}
            <span
              className="cursor-pointer text-sm text-blue-600 underline"
              style={{ color: Colors.deepTeal }}
              onClick={handleResendOtp}
            >
              Resend
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
