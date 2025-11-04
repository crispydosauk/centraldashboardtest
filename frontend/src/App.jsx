import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/index.jsx";
import Dashboard from "./components/dashboard/dashboard.jsx";
import AccessManagement from "./pages/access/index.jsx";
import Roles from "./pages/roles/index.jsx"; 

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
     
        <Route path="/login" element={<LoginPage />} />

    
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

         <Route
          path="/access"
          element={
            <PrivateRoute>
              <AccessManagement />
            </PrivateRoute>
          }
        />

         <Route
          path="/access/roles"
          element={
            <PrivateRoute>
              <Roles />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
