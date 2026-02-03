import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRoleId }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    console.log("No user found — redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (requiredRoleId && user.role_id !== requiredRoleId) {
    console.log("Unauthorized role — redirecting to home");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
