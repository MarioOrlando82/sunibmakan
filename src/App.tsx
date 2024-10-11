import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import ReviewList from "./components/ReviewList";
import ReviewForm from "./components/ReviewForm";
import ErrorBoundary from "./components/ErrorBoundary";
import RoulettePage from "./components/RoulettePage";
import ReviewDetail from "./components/ReviewDetail";
import Leaderboard from "./components/Leaderboard";
import QuestPage from "./components/QuestPage";

const App: React.FC = () => {
  const [user] = useAuthState(auth);
  const [refreshList, setRefreshList] = React.useState(false);

  const handleFormSubmit = () => {
    setRefreshList(!refreshList);
  };

  const handleSignIn = () => {
    signInWithPopup(auth, googleProvider);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <Router>
      <ErrorBoundary>
        <div className="container mx-auto p-6 bg-pastel-light min-h-screen">
          <h1 className="text-4xl font-bold text-pastel-dark mb-10 text-center">
            SunibMakan
          </h1>
          <nav className="mb-8 flex justify-between items-center bg-pastel-lightDark p-4 rounded-lg shadow-md">
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/"
                  className="text-pastel-primary font-semibold hover:text-pastel-dark"
                >
                  Review List
                </Link>
              </li>
              <li>
                <Link
                  to="/add"
                  className="text-pastel-primary font-semibold hover:text-pastel-dark"
                >
                  Add Review
                </Link>
              </li>
              <li>
                <Link
                  to="/roulette"
                  className="text-pastel-primary font-semibold hover:text-pastel-dark"
                >
                  Roulette
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-pastel-primary font-semibold hover:text-pastel-dark"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/quest"
                  className="text-pastel-primary font-semibold hover:text-pastel-dark"
                >
                  Quest
                </Link>
              </li>
            </ul>
            <div>
              {user ? (
                <>
                  <span className="mr-4 text-pastel-dark">Welcome, {user.displayName}!</span>
                  <button
                    onClick={handleSignOut}
                    className="bg-pastel-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="bg-pastel-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<ReviewList />} />
            <Route
              path="/add"
              element={<ReviewForm onSubmit={handleFormSubmit} />}
            />
            <Route path="/roulette" element={<RoulettePage />} />
            <Route path="/review/:id" element={<ReviewDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/quest" element={<QuestPage />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
