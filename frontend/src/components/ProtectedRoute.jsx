import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authStore.js';
export default function ProtectedRoute({ children, role }) {
  const { user, ready } = useAuth();
  if (!ready) return <p className="container muted">იტვირთება...</p>;
  if (!user) return <Navigate to="/login" replace />;

  const normalizedRole = String(user.role || "").toLowerCase();
  if (role) {
    const requiredRole = String(role).toLowerCase();
    const allowed = requiredRole === "editor"
      ? normalizedRole === "editor" || normalizedRole === "admin"
      : normalizedRole === requiredRole;
    if (!allowed) return <Navigate to="/" replace />;
  }

  return children;
}
