import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import CarrinhoContextProvider from "./context/CarrinhoContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CarrinhoContextProvider>
        <App />
      </CarrinhoContextProvider>
    </AuthProvider>
  </BrowserRouter>
);
