import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authStore.js';
export default function ProtectedRoute({ children, role }) {
  const { user, ready } = useAuth();
  if (!ready) return <p className="container muted">იტვირთება...</p>;
  if (!user || (role && user.role !== role)) return <Navigate to="/login" replace />;
  return children;
}
