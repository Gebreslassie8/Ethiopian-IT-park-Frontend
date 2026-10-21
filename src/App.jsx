
// import Login from "./Login";
// import Dashboard from "./AdminDashboard/Dashboard";
// import CMDashboard from "./ContentManagerDashboard/CMDashboard";
// import { Routes, Route } from "react-router-dom";
// import InternalLibrary from "./pages/ResourceLibraryInternal";
// import ExternalLibrary from "./pages/ResourceLibrary";
// import ForgotPassword from "./Components/PasswordReset/ForgotPassword";
// import VerifyOtp from "./Components/PasswordReset/VerifyOtp";
// import ResetPassword from "./Components/PasswordReset/ResetPassword";
// import { ProfileProvider } from "./Context/ProfileContext";

// function App() {
//   return (
//     <ProfileProvider>
//       <Routes>
//         <Route path="/" element={<ExternalLibrary />} />
//         <Route path="/login" element={<Login />} />

//         <Route path="/forgotpassword" element={<ForgotPassword />} />
//         <Route path="/verifyotp" element={<VerifyOtp />} />
//         <Route path="/resetpassword" element={<ResetPassword />} />

//         {/* Temporarily removing ProtectedRoute for easy access */}
//         <Route path="/admin/*" element={<Dashboard />} />
//         <Route path="/content-manager/*" element={<CMDashboard />} />
//         <Route path="/internal-library" element={<InternalLibrary />} />
//       </Routes>
//     </ProfileProvider>
//   );
// }

// export default App;



import Login from "./Login";
import Dashboard from "./AdminDashboard/Dashboard";
import CMDashboard from "./ContentManagerDashboard/CMDashboard";
import ProtectedRoute from "./ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import InternalLibrary from "./pages/ResourceLibraryInternal";
import ExternalLibrary from "./pages/ResourceLibrary";
import ForgotPassword from "./Components/PasswordReset/ForgotPassword";
import VerifyOtp from "./Components/PasswordReset/VerifyOtp";
import ResetPassword from "./Components/PasswordReset/ResetPassword";
import { ProfileProvider } from "./Context/ProfileContext";
 

function App() {
  return (
    <ProfileProvider>
    <Routes>
     <Route path="/" element={<ExternalLibrary/>} />
    <Route path="/login" element={<Login />} /> 

     <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verifyotp" element={<VerifyOtp />} />
      <Route path="/resetpassword" element={<ResetPassword />} />

     <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRoleId={5}>
           <Dashboard />
          </ProtectedRoute>
        }
       />

      <Route
        path="/content-manager/*"
       element={
          <ProtectedRoute requiredRoleId={6}>
            <CMDashboard />
         </ProtectedRoute>
        }
      />
      <Route
       path="/internal-library"
       element={
          <ProtectedRoute requiredRoleId={3}>
            <InternalLibrary/>
          </ProtectedRoute>
       }
       />
    </Routes>
    </ProfileProvider>
  );
 }

export default App;
