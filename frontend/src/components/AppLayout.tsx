import { BarChart3, FolderKanban, ListTodo, LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/taskforge-logo.png" alt="TaskForge" />
          <div>
            <strong>TaskForge</strong>
            <span>Where Teams Build Progress.</span>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            <BarChart3 size={18} /> Dashboard
          </NavLink>
          <NavLink to="/projects">
            <FolderKanban size={18} /> Projects
          </NavLink>
          <NavLink to="/tasks">
            <ListTodo size={18} /> My Tasks
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="icon-button" onClick={handleLogout} aria-label="Log out" title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
