import HomePage from "./components/pages/HomePage/HomePage";
import LandingPage from "./components/pages/LandingPage/LandingPage";
import "./styles/global-styles.scss";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <LandingPage />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
