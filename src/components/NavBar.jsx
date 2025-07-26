import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: 64,
      background: "linear-gradient(90deg,#232526 0%,#414345 100%)",
      boxShadow: "0 2px 12px #0003",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    }}>
      <div style={{ display: "flex", gap: 32 }}>
        <Link to="/journal" style={{
          color: location.pathname === "/journal" ? "#4f8cff" : "#fff",
          fontWeight: 700,
          fontSize: "1.15rem",
          textDecoration: "none",
          padding: "8px 18px",
          borderRadius: 8,
          background: location.pathname === "/journal" ? "#18191a" : "transparent",
          boxShadow: location.pathname === "/journal" ? "0 2px 8px #4f8cff33" : "none",
          transition: "background 0.2s,color 0.2s"
        }}>Journal</Link>
        <Link to="/dashboard" style={{
          color: location.pathname === "/dashboard" ? "#4f8cff" : "#fff",
          fontWeight: 700,
          fontSize: "1.15rem",
          textDecoration: "none",
          padding: "8px 18px",
          borderRadius: 8,
          background: location.pathname === "/dashboard" ? "#18191a" : "transparent",
          boxShadow: location.pathname === "/dashboard" ? "0 2px 8px #4f8cff33" : "none",
          transition: "background 0.2s,color 0.2s"
        }}>Dashboard</Link>
      </div>
    </nav>
  );
}
