import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--color-bg, #efe9dc)",
        color: "var(--color-text-muted, #55503f)",
        fontFamily: "var(--font-body, sans-serif)",
        fontSize: "0.95rem"
      }}>
        Authenticating admin session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
