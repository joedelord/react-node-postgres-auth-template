import { useEffect, useState } from "react";

import { useAuth } from "../context/useAuth";
import api from "../services/api";

function Admin() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        const response = await api.get("/users");

        if (!cancelled) {
          setUsers(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error.response?.data?.error || "Failed to load users",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setErrorMessage("");

    try {
      const response = await api.patch(`/users/${userId}/role`, {
        role: newRole,
      });

      const updatedUser = response.data.user;

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to update user role",
      );
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.username}?`,
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");

    try {
      await api.delete(`/users/${user.id}`);

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser.id !== user.id),
      );
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to delete user");
    }
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  return (
    <main>
      <h1>User management</h1>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {user.username}

                {user.id === currentUser.id && <> (you)</>}
              </td>

              <td>{user.email}</td>

              <td>
                <select
                  value={user.role}
                  disabled={user.id === currentUser.id}
                  onChange={(event) =>
                    handleRoleChange(user.id, event.target.value)
                  }
                >
                  <option value="user">User</option>

                  <option value="moderator">Moderator</option>

                  <option value="admin">Admin</option>
                </select>
              </td>

              <td>
                {user.id !== currentUser.id && (
                  <button type="button" onClick={() => handleDeleteUser(user)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Admin;
