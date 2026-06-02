import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, redirectTo = '/login' }) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }
  return children;
};

export default ProtectedRoute;
