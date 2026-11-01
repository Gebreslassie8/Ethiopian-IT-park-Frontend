import { useState } from "react";
import { FiMail, FiArrowLeft, FiShield } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Colors from "../../Styles/Colors";
import Button from "../../Components/Button/ReusableButton";
import ForgotPasswordValidationSchema from "../../Shared/ValidationSchema/ForgotPasswordSchema";

const API = "https://ethiopian-it-park-backend.onrender.com";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = ForgotPasswordValidationSchema(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "OTP sent to your email.");
        setError("");
        setTimeout(() => {
          navigate("/verifyotp", { state: { email: values.email } });
        }, 800);
        setValues({ email: "" });
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-gray-50">
      {/* Left panel (desktop only) */}
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
            Recover your access.
          </h1>
          <p className="text-white/80 text-base xl:text-lg leading-relaxed">
            Enter the email associated with your account. We'll send you a one-time
            code to reset your password securely.
          </p>
        </div>

        <div className="relative z-10 text-white/60 text-xs">
          © {new Date().getFullYear()} Ethiopian IT Park
        </div>
      </aside>

      {/* Right panel (form) */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
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
            to="/login"
            className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:underline"
            style={{ color: Colors.deepTeal }}
          >
            <FiArrowLeft size={14} /> Back to login
          </Link>

          <div className="mb-6 sm:mb-8">
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
              style={{ color: Colors.deepTeal }}
            >
              Forgot your password?
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              No worries — we'll send you a reset code.
            </p>
          </div>

          <form onSubmit={handleSubmit} id="forgotPasswordForm" className="w-full">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-1.5 text-sm font-semibold text-gray-700"
              >
                Email address
              </label>
              <div
                className={`flex items-center border rounded-lg px-3 py-2.5 bg-white transition ${
                  errors.email
                    ? "border-red-400 focus-within:ring-2 focus-within:ring-red-200"
                    : "border-gray-300 focus-within:ring-2 focus-within:ring-teal-100 focus-within:border-teal-500"
                }`}
              >
                <FiMail size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={handleChange}
                  className="ml-2.5 flex-grow outline-none bg-transparent text-sm sm:text-base"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs sm:text-sm mt-1.5">{errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              label={loading ? "Sending..." : "Send OTP"}
              className="w-full mt-4 py-3 text-base font-semibold shadow-sm hover:shadow-md transition-shadow"
              formId="forgotPasswordForm"
              disabled={loading}
            />
          </form>

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

          <p className="text-sm text-center mt-6 text-gray-500">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: Colors.deepTeal }}
            >
              Sign in
            </Link>
          </p>

          <p className="lg:hidden mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Ethiopian IT Park
          </p>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;