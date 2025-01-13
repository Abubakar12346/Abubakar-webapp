import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Static credentials for login
    if (username === "maaz" && password === "maaz") {
      navigate("/reels"); // Navigate to Reels page
    } else {
      setError("Invalid username or password!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Login</h1>
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 shadow-lg rounded-lg px-8 pt-6 pb-8 w-full max-w-sm"
      >
        {error && (
          <div className="mb-4 text-red-400 text-center font-semibold">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-300 mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
            placeholder="Enter username"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
