import { createContext, useState, useEffect } from "react";
import { getUser } from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  useEffect(() => {
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  console.log({ user })

  useEffect(() => {
    if (!isLoggedIn) {
      setUser(null);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    getUser(token)
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        toast.error(`Erro ao obter usuário: ${error.message}`);
      });
  }, [isLoggedIn])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
