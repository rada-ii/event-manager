import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import EventList from "./components/EventList";

const TOKEN_STORAGE_KEY = "event_manager_token";

const App: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load token from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (savedToken) {
      // Validate token format (basic check)
      try {
        const payload = JSON.parse(atob(savedToken.split(".")[1]));
        const currentTime = Date.now() / 1000;

        // Check if token is not expired
        if (payload.exp && payload.exp > currentTime) {
          setToken(savedToken);
        } else {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Invalid token found, removing:", error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Save/remove token in localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  const handleSetToken = (newToken: string): void => {
    setToken(newToken);
  };

  const handleLogout = (): void => {
    setToken("");
    setShowLogin(true);
  };

  const switchToLogin = (): void => {
    setShowLogin(true);
  };

  const switchToRegister = (): void => {
    setShowLogin(false);
  };

  // Show loading screen while checking for saved token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth forms if no token
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showLogin ? (
            <Login setToken={handleSetToken} switchForm={switchToRegister} />
          ) : (
            <Register switchForm={switchToLogin} />
          )}
        </div>
      </div>
    );
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <EventList token={token} logout={handleLogout} />
    </div>
  );
};

export default App;
