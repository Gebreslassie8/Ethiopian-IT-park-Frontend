import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Colors from "./Styles/Colors";
import ReusableForm from "./Components/Forms/ReusableForm";
import Button from "./Components/Button/ReusableButton";
import { Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import LoginValidationSchema from "./Shared/ValidationSchema/LoginValidationSchema";

const API = "https://ethiopian-it-park-backend.onrender.com";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const fields = [
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Enter your email",
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      placeholder: "Enter your password",
      icon: showPassword ? <Eye size={18} /> : <EyeOff size={18} />,
      onIconClick: () => setShowPassword((v) => !v),
    },
  ];

  const initialValues = { email: "", password: "" };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post(`${API}/api/users/login`, values);
      const { token, user } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("profile", JSON.stringify(user));
      resetForm();

      if (user.role_id === 5) navigate("/admin");
      else if (user.role_id === 6) navigate("/content-manager");
      else if (user.role_id === 3) navigate("/internal-library");
      else setErrorMessage("Unauthorized role");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-gray-50">
      {/* ─── Left Panel (Desktop only — hidden on mobile) ─────── */}
      <aside
        className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[50%] p-10 xl:p-14 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${Colors.deepTeal} 0%, ${Colors.deepBlue} 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5" />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Ethiopian IT Park
            </span>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            Your digital library, reimagined.
          </h1>
          <p className="text-white/80 text-base xl:text-lg leading-relaxed">
            Access curated videos, articles, tutorials, and research papers —
            all in one secure place.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Secure role-based access",
              "Instant search across all content",
              "Track engagement with built-in analytics",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={14} className="text-white" />
                </div>
                <span className="text-sm xl:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-xs">
          © {new Date().getFullYear()} Ethiopian IT Park
        </div>
      </aside>

      {/* ─── Right Panel (Login form) ─────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="w-full max-w-md">
          {/* Mobile brand (visible only on mobile/tablet) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${Colors.deepTeal} 0%, ${Colors.deepBlue} 100%)`,
              }}
            >
              <Sparkles size={26} className="text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-center"
              style={{ color: Colors.deepTeal }}
            >
              Ethiopian IT Park
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Digital Enterprise Content Management
            </p>
          </div>

          {/* Heading */}
          <div className="mb-6 sm:mb-8">
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
              style={{ color: Colors.deepTeal }}
            >
              Welcome back
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Form */}
          <ReusableForm
            id="loginForm"
            fields={fields}
            initialValues={initialValues}
            validationSchema={LoginValidationSchema}
            onSubmit={handleSubmit}
          />

          {/* Error message */}
          {errorMessage && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <span className="text-red-600 text-sm leading-tight">
                {errorMessage}
              </span>
            </div>
          )}

          {/* Forgot password */}
          <div className="flex justify-end mt-3 mb-6">
            <Link
              to="/forgotpassword"
              className="text-sm font-medium hover:underline transition"
              style={{ color: Colors.deepTeal }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            label={loading ? "Signing in..." : "Sign in"}
            className="w-full mt-2 py-3 text-base font-semibold shadow-sm hover:shadow-md transition-shadow"
            formId="loginForm"
            disabled={loading}
          />

          {/* Divider */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Need help?
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Support note */}
          <p className="mt-4 text-center text-sm text-gray-500">
            Contact your administrator if you don't have an account.
          </p>

          {/* Footer (mobile only) */}
          <p className="lg:hidden mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Ethiopian IT Park
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;