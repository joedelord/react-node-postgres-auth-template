import { useEffect, useState } from "react";

import { useAuth } from "../context/useAuth";
import api from "../services/api";
import UserTable from "../components/admin/UserTable";

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
    <main className="mx-auto max-w-6xl p-8 text-center">
      <h1 className="text-4xl font-bold mb-5 text-center">User management</h1>

      {errorMessage && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-red-700">
          {errorMessage}
        </p>
      )}

      <UserTable
        users={users}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
      />
    </main>
  );
}

export default Admin;
