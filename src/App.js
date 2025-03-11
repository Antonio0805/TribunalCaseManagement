import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Judges from "./pages/judges/Judges";
import Home from "./pages/home/Home";
import Decisions from "./pages/decisions/Decisions";
import Defendants from "./pages/defendants/Defendants";
import Statistics from "./pages/statistics/Statistics";
import ViewStats from "./pages/viewstats/ViewStats";
import ViewAllDecisions from "./pages/viewalldecisions/ViewAllDecisions";
import Cases from "./pages/cases/Cases";
import "./style.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/cases" element={<Cases />} />
            <Route path="/judges" element={<Judges />} />
            <Route path="/view-stats" element={<ViewStats />} /> 
            <Route path="/decisions" element={<Decisions />} />
            <Route path="/defendants" element={<Defendants />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/view-all-decisions" element={<ViewAllDecisions />} />
          </Routes>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
