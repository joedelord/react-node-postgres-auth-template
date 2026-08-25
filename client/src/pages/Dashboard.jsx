import { Link, useNavigate } from "react-router";

import { useAuth } from "../context/useAuth";

function Dashboard() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <main>
      <h1>Dashboard</h1>

      <p>Logged in as {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {user.role === "admin" && (
        <p>
          <Link to="/admin">Open admin page</Link>
        </p>
      )}

      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}

export default Dashboard;
