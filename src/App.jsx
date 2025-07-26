
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Journal from "./pages/Journal";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
        <Link to="/dashboard" style={{ marginRight: "1rem" }}>Analytics Dashboard</Link>
        <Link to="/journal">Journal</Link>
      </nav>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App
