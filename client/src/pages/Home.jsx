import { Link } from "react-router";

import { useAuth } from "../context/useAuth";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center">Auth Template</h1>

      {isAuthenticated ? (
        <Link to="/dashboard">Open dashboard</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </main>
  );
}

export default Home;
