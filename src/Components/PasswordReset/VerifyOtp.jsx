import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiKey, FiArrowLeft, FiShield, FiRefreshCw } from "react-icons/fi";
import * as Yup from "yup";
import Colors from "../../Styles/Colors";
import ReusableForm from "../../Components/Forms/ReusableForm";
import Button from "../../Components/Button/ReusableButton";

const API = "https://ethiopian-it-park-backend.onrender.com";

const VerifyOtpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^[A-Z0-9]{6}$/, "OTP must be 6 alphanumeric characters"),
});

const VerifyOtp = ({ onOtpVerified }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const fields = [
    {
      name: "otp",
      type: "text",
      label: "Enter verification code",
      placeholder: "6-character code",
      maxLength: 6,
      icon: <FiKey size={18} />,
    },
  ];

  const initialValues = { otp: "" };

  const handleSubmit = async (values, { resetForm }) => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is missing. Please restart the reset process.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP verified successfully.");
        if (onOtpVerified) onOtpVerified();
        resetForm();
        setTimeout(() => {
          navigate("/resetpassword", { state: { email } });
        }, 700);
      } else {
        setError(data.message || "Invalid or expired OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is missing. Cannot resend OTP.");
      return;
    }

    setResending(true);
    try {
      const res = await fetch(`${API}/api/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "A new OTP has been sent to your email.");
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-gray-50">
      <aside
        className="hidden lg:flex flex-col justify-between w-[42%] p-10 xl:p-14 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${Colors.deepTeal} 0%, ${Colors.deepBlue} 100%)`,
        }}
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <FiShield size={20} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Ethiopian IT Park</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            Check your inbox.
          </h1>
          <p className="text-white/80 text-base xl:text-lg leading-relaxed">
            We've sent a 6-character code to your email address. Enter it on the
            right to verify your identity.
          </p>
        </div>

        <div className="relative z-10 text-white/60 text-xs">
          © {new Date().getFullYear()} Ethiopian IT Park
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${Colors.deepTeal} 0%, ${Colors.deepBlue} 100%)`,
              }}
            >
              <FiShield size={24} className="text-white" />
            </div>
            <p className="text-sm text-gray-500">Ethiopian IT Park</p>
          </div>

          <Link
            to="/forgotpassword"
            className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:underline"
            style={{ color: Colors.deepTeal }}
          >
            <FiArrowLeft size={14} /> Use a different email
          </Link>

          <div className="mb-6 sm:mb-8">
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
              style={{ color: Colors.deepTeal }}
            >
              Verify your code
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              {email ? (
                <>
                  Sent to <strong className="text-gray-700">{email}</strong>
                </>
              ) : (
                "Check your email for the verification code."
              )}
            </p>
          </div>

          <ReusableForm
            fields={fields}
            initialValues={initialValues}
            validationSchema={VerifyOtpValidationSchema}
            onSubmit={handleSubmit}
            id="verifyOtpForm"
          />

          <Button
            type="submit"
            label={loading ? "Verifying..." : "Verify OTP"}
            className="w-full mt-4 py-3 text-base font-semibold shadow-sm hover:shadow-md transition-shadow"
            formId="verifyOtpForm"
            disabled={loading}
          />

          {message && (
            <div
              role="status"
              className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200"
            >
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="inline-flex items-center gap-2 text-sm font-semibold hover:underline disabled:opacity-50"
              style={{ color: Colors.deepTeal }}
            >
              <FiRefreshCw size={14} className={resending ? "animate-spin" : ""} />
              {resending ? "Resending..." : "Resend code"}
            </button>
          </div>

          <p className="lg:hidden mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Ethiopian IT Park
          </p>
        </div>
      </main>
    </div>
  );
};

export default VerifyOtp;