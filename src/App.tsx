import { useState } from "react";
import HomePage from "./components/pages/HomePage/HomePage";
import LandingPage from "./components/pages/LandingPage/LandingPage";
import { UserContext } from "./context/UserContext";
import "./styles/global-styles.scss";
import { Route, Routes } from "react-router-dom";
import { UserProfile } from "./models/Profile";

function App() {
  const [user, setUser] = useState<UserProfile>();

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
