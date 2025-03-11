import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return null;
    }
  });

  // Funcția Login - conectată la backend
  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data) {
        setCurrentUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        console.log("User logged in:", data);
        return true; // ✅ Returnează `true` pentru a indica succes
      } else {
        console.error("Login failed:", data.message);
        return false; // ❌ Returnează `false` dacă login-ul eșuează
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return false; // ❌ Login-ul a eșuat
    }
  };

  // Funcția Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    console.log("User logged out.");
  };

  // Restaurarea utilizatorului după un refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser && storedUser) {
      setCurrentUser(storedUser);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
