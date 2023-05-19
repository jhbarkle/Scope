import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global-styles.scss";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
