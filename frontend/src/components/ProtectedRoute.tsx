import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="screen-loader">Loading TaskForge...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
