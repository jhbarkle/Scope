import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global-styles.scss";
import Navbar from "./components/organisms/Navbar/Navbar.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Navbar />
    <App />
  </React.StrictMode>
);
