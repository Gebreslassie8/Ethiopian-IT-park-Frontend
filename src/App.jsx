import SignUp from "./SignUp";
import Login from "./Login";
import Dashboard from "./AdminDashboard/Dashboard";
import { Routes, Route ,Navigate} from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route path="/Dashboard/*" element={<Dashboard />}/>
        <Route path="*" element={<Navigate to="/dashboard" />}/>
      </Routes>
    </>
  );
}

export default App;
