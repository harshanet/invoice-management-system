import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only allow admin users to access this route
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait until login check is finished
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if user is not an admin
  if (user.role !== "admin") {
    return <Navigate to="/payments" replace />;
  }

  return children;
};

export default AdminRoute;