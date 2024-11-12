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
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const handleFormSubmit = () => setRefreshList(!refreshList);
  const handleSignIn = () => signInWithPopup(auth, googleProvider);
  const handleSignOut = () => signOut(auth);
  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className="bg-pastel-light min-h-screen">
      <Router>
        <ErrorBoundary>
          <div className="container mx-auto p-6 bg-pastel-light min-h-screen">
            <a href="/">
              <h1 className="text-4xl font-bold text-pastel-dark mb-10 text-center">
                SunibMakan
              </h1>
            </a>
            <nav className="flex justify-between items-center bg-pastel-lightDark p-4 rounded-lg shadow-md">
              <div>
                {user && (
                  <span className="text-pastel-dark font-semibold">
                    Welcome, {user.displayName}!
                  </span>
                )}
              </div>

              <ul className="hidden md:flex space-x-6">
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

              <div className="hidden md:block">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="bg-pastel-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-all"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="bg-pastel-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
                  >
                    Sign In with Google
                  </button>
                )}
              </div>

              <button
                className="md:hidden text-pastel-primary focus:outline-none"
                onClick={toggleNav}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </nav>

            <div
              className={`${
                isNavOpen ? "translate-x-0" : "-translate-x-full"
              } fixed top-0 left-0 h-full w-3/4 bg-pastel-lightDark z-50 transition-transform duration-300 ease-in-out md:hidden`}
            >
              <button
                className="absolute top-4 right-4 text-white"
                onClick={toggleNav}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="black"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <ul className="flex flex-col items-start space-y-6 p-6">
                <li>
                  <Link
                    to="/"
                    onClick={toggleNav}
                    className="text-pastel-dark font-semibold text-lg hover:text-pastel-primary"
                  >
                    Review List
                  </Link>
                </li>
                <li>
                  <Link
                    to="/add"
                    onClick={toggleNav}
                    className="text-pastel-dark font-semibold text-lg hover:text-pastel-primary"
                  >
                    Add Review
                  </Link>
                </li>
                <li>
                  <Link
                    to="/roulette"
                    onClick={toggleNav}
                    className="text-pastel-dark font-semibold text-lg hover:text-pastel-primary"
                  >
                    Roulette
                  </Link>
                </li>
                <li>
                  <Link
                    to="/leaderboard"
                    onClick={toggleNav}
                    className="text-pastel-dark font-semibold text-lg hover:text-pastel-primary"
                  >
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quest"
                    onClick={toggleNav}
                    className="text-pastel-dark font-semibold text-lg hover:text-pastel-primary"
                  >
                    Quest
                  </Link>
                </li>
              </ul>

              <div className="p-6">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="bg-pastel-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-all w-full"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="bg-pastel-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all w-full"
                  >
                    Sign In with Google
                  </button>
                )}
              </div>
            </div>

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
    </div>
  );
};

export default App;
