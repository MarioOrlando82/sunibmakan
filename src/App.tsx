import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import RestaurantList from "./components/RestaurantList";
import RestaurantForm from "./components/RestaurantForm";

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
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">SunibMakan</h1>
        <nav className="mb-4 flex justify-between items-center">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-blue-500">
                Restaurant List
              </Link>
            </li>
            <li>
              <Link to="/add" className="text-blue-500">
                Add Restaurant
              </Link>
            </li>
          </ul>
          <div>
            {user ? (
              <>
                <span className="mr-4">Welcome, {user.displayName}!</span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <RestaurantList key={refreshList ? "refresh" : "no-refresh"} />
            }
          />
          <Route
            path="/add"
            element={<RestaurantForm onSubmit={handleFormSubmit} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
