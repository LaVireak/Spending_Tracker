import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { SpendingLineChart, SpendingPieChart } from "../components/Charts";

const LOCAL_KEY = "spending-records";
const CATEGORY_KEY = "spending-categories";

function groupRecords(records, period) {
  // period: 'daily', 'weekly', 'monthly'
  const groups = {};
  records.forEach(rec => {
    const date = new Date(rec.date);
    let key = "";
    if (period === "daily") key = rec.date;
    else if (period === "weekly") key = `${date.getFullYear()}-W${getWeek(date)}`;
    else if (period === "monthly") key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!groups[key]) groups[key] = {};
    if (!groups[key][rec.category]) groups[key][rec.category] = 0;
    groups[key][rec.category] += rec.amount;
  });
  return groups;
}

function getWeek(date) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - firstJan) / 86400000 + firstJan.getDay() + 1) / 7);
}

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [period, setPeriod] = useState("monthly");
  const [month, setMonth] = useState("");
  const [categories, setCategories] = useState([]);

  // Helper to load records and categories from localStorage
  function loadData() {
    // Ensure records key exists
    let local = localStorage.getItem(LOCAL_KEY);
    if (!local) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify([]));
      local = '[]';
    }
    try {
      const parsed = JSON.parse(local);
      setRecords(Array.isArray(parsed) ? parsed : []);
    } catch {
      setRecords([]);
    }
    // Ensure categories key exists
    let cats = localStorage.getItem(CATEGORY_KEY);
    const defaultCategories = ["Food", "Transport", "Utilities", "Entertainment", "Health", "Shopping", "Education", "Other"];
    if (!cats) {
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(defaultCategories));
      cats = JSON.stringify(defaultCategories);
    }
    try {
      const parsed = JSON.parse(cats);
      setCategories(Array.isArray(parsed) ? parsed : defaultCategories);
    } catch {
      setCategories(defaultCategories);
    }
  }

  useEffect(() => {
    loadData();
    // Listen for localStorage changes (from other tabs or Journal page)
    function handleStorage(e) {
      if (e.key === LOCAL_KEY || e.key === CATEGORY_KEY) {
        loadData();
      }
    }
    // Listen for tab visibility changes (same tab navigation)
    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    }
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Filter records by selected month
  const safeRecords = Array.isArray(records) ? records : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const filtered = month ? safeRecords.filter(r => r.date && r.date.startsWith(month)) : safeRecords;

  // Total spending
  const totalAll = safeRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalMonth = filtered.reduce((sum, r) => sum + (r.amount || 0), 0);

  // Grouped data for charts
  const grouped = groupRecords(filtered, period);
  // Ensure every lineData object has all category keys, even if value is 0
  const lineData = Object.entries(grouped).map(([key, cats]) => {
    const dataPoint = { name: key };
    safeCategories.forEach(cat => {
      dataPoint[cat] = cats[cat] || 0;
    });
    return dataPoint;
  });

  // Pie chart data
  const pieData = safeCategories.map(cat => ({
    name: cat,
    value: filtered.filter(r => r.category === cat).reduce((sum, r) => sum + (r.amount || 0), 0)
  })).filter(d => d.value > 0);

  // Month options
  const monthOptions = Array.from(new Set(safeRecords.map(r => r.date ? r.date.slice(0, 7) : "")));

  // Debug output for troubleshooting
  const debug = false; // set to true to show debug info

  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "linear-gradient(135deg,#232526 0%,#414345 100%)", position: "relative" }}>
      <NavBar />
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 64 }}>
        <div style={{ maxWidth: 940, width: "100%", padding: "2.7rem 2.7rem 2rem 2.7rem", background: "#18191a", borderRadius: 32, boxShadow: "0 12px 40px rgba(0,0,0,0.32)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 18px" }}>
          <h2 style={{ fontSize: "2.7rem", fontWeight: 800, marginBottom: "2.3rem", color: "#fff", textAlign: "center", letterSpacing: "1px", fontFamily: 'Segoe UI', textShadow: "0 2px 8px #0002" }}>Analytics Dashboard</h2>
          {debug && (
            <div style={{ background: '#222', color: '#fff', padding: '1rem', borderRadius: 8, marginBottom: 16, fontSize: '0.95rem', maxWidth: 900, overflowX: 'auto' }}>
              <strong>Debug Info:</strong>
              <div><b>filtered:</b> <pre>{JSON.stringify(filtered, null, 2)}</pre></div>
              <div><b>grouped:</b> <pre>{JSON.stringify(grouped, null, 2)}</pre></div>
              <div><b>lineData:</b> <pre>{JSON.stringify(lineData, null, 2)}</pre></div>
              <div><b>safeCategories:</b> <pre>{JSON.stringify(safeCategories, null, 2)}</pre></div>
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 28, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ color: "#fff", fontWeight: 500, fontSize: "1.1rem" }}>Period:</label>
              <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: "0.7rem", borderRadius: 12, border: "1.5px solid #444", background: "#222", color: "#fff", fontSize: "1.1rem" }}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ color: "#fff", fontWeight: 500, fontSize: "1.1rem" }}>Month:</label>
              <select value={month} onChange={e => setMonth(e.target.value)} style={{ padding: "0.7rem", borderRadius: 12, border: "1.5px solid #444", background: "#222", color: "#fff", fontSize: "1.1rem" }}>
                <option value="">All Time</option>
                {monthOptions.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 28, background: "#181818", borderRadius: 16, padding: "1.3rem 2rem", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", width: "100%", textAlign: "center" }}>
            <strong style={{ fontSize: "1.25rem" }}>Total Spending (All Time):</strong> <span style={{ color: "#00c49f", fontWeight: 700, fontSize: "1.25rem" }}>${totalAll.toFixed(2)}</span><br />
            <strong style={{ fontSize: "1.25rem" }}>Total Spending ({month || "All Time"}):</strong> <span style={{ color: "#4f8cff", fontWeight: 700, fontSize: "1.25rem" }}>${totalMonth.toFixed(2)}</span>
          </div>
          <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#fff", marginBottom: 18, textAlign: "center" }}>Line Chart (Spending by {period})</h3>
          <div style={{ background: "#181818", borderRadius: 16, padding: "1.3rem", marginBottom: 28, width: "100%", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {lineData.length === 0 || safeCategories.length === 0 ? (
              <span style={{ color: "#aaa", fontSize: "1.2rem", fontStyle: "italic" }}>No spending data to display.</span>
            ) : (
              <SpendingLineChart data={lineData} categories={safeCategories} />
            )}
          </div>
          <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#fff", marginBottom: 18, textAlign: "center" }}>Pie Chart (Spending by Category)</h3>
          <div style={{ background: "#181818", borderRadius: 16, padding: "1.3rem", width: "100%", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {pieData.length === 0 ? (
              <span style={{ color: "#aaa", fontSize: "1.2rem", fontStyle: "italic" }}>No spending data to display.</span>
            ) : (
              <SpendingPieChart data={pieData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
