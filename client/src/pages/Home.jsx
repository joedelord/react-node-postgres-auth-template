import { Link } from "react-router";

import { useAuth } from "../context/useAuth";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main>
      <h1>Auth Template</h1>

      {isAuthenticated ? (
        <Link to="/dashboard">Open dashboard</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </main>
  );
}

export default Home;
