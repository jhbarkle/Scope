import Navbar from "./components/organisms/Navbar/Navbar";
import HomePage from "./components/pages/HomePage/HomePage";
import LandingPage from "./components/pages/LandingPage/LandingPage";
import "./styles/global-styles.scss";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
};

// function ContextAppWrapper() {
//   const [searchState, setSearchState] = useState(defaultSearchState);

//   const setSearchStateContext = useCallback(
//     (update: SearchState) => {
//       setSearchState({ ...searchState, ...update });
//     },
//     [searchState, setSearchState]
//   );

//   const getSearchStateContext = useCallback(
//     () => ({
//       ...searchState,
//       setSearchStateContext,
//     }),
//     [searchState, setSearchStateContext]
//   );

//   return (
//     <SearchStateContext.Provider value={{ searchState, setSearchState }}>
//       <App />
//     </SearchStateContext.Provider>
//   );
// }

export default App;
