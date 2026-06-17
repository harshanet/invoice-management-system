import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protect pages that require login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading screen while checking login
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect user if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;