import { useEffect, useState } from "react";

import { useAuth } from "../context/useAuth";
import api from "../services/api";
import UserTable from "../components/admin/UserTable";
import AddUserForm from "../components/admin/AddUserForm";
import { useNavigate } from "react-router";

function Admin() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

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

  const handleCreateUser = async (userData) => {
    setErrorMessage("");

    try {
      const response = await api.post("/users", userData);

      setUsers((currentUsers) => [...currentUsers, response.data.user]);

      setIsAddUserOpen(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to create user");

      throw error;
    }
  };

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  return (
    <main className="mx-auto max-w-4xl p-8 text-center bg-gray-100">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-4xl font-bold">User management</h1>

        <button
          type="button"
          onClick={() => setIsAddUserOpen((current) => !current)}
          className="
    flex h-10 w-10
    items-center justify-center
    rounded-full
    bg-blue-600
    text-white
    hover:bg-blue-700
  "
          aria-label={isAddUserOpen ? "Close" : "Add user"}
        >
          <span className="text-xl mb-1">{isAddUserOpen ? "×" : "+"}</span>
        </button>
      </div>

      {errorMessage && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-red-700">
          {errorMessage}
        </p>
      )}

      {isAddUserOpen && (
        <AddUserForm
          onCreateUser={handleCreateUser}
          onCancel={() => setIsAddUserOpen(false)}
        />
      )}

      <UserTable
        users={users}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
      />

      <button className="my-4" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </main>
  );
}

export default Admin;
