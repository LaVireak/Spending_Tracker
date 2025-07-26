import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

const LOCAL_KEY = "spending-records";
const CATEGORY_KEY = "spending-categories";

function loadCategories() {
  const local = localStorage.getItem(CATEGORY_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  // fallback to default
  return ["Food", "Transport", "Utilities", "Entertainment", "Health", "Shopping", "Education", "Other"];
}


function Journal() {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState(loadCategories());
  const [form, setForm] = useState({ date: "", category: (Array.isArray(loadCategories()) && loadCategories().length > 0) ? loadCategories()[0] : "", amount: "", note: "" });
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setRecords(Array.isArray(parsed) ? parsed : []);
      } catch {
        setRecords([]);
      }
    }
  }, []);



  function handleChange(e) {
    if (e.target.name === "amount") {
      let val = e.target.value;
      // Only allow numbers, default to 0 if invalid
      let num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        setForm({ ...form, amount: "0" });
      } else {
        setForm({ ...form, amount: val });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  function addRecord(e) {
    e.preventDefault();
    const numAmount = parseFloat(form.amount);
    if (!form.date || !form.category || isNaN(numAmount) || numAmount <= 0) return;
    const safeRecords = Array.isArray(records) ? records : [];
    const safeCategories = Array.isArray(categories) ? categories : [];
    let updatedCategories = safeCategories;
    // If the record's category is not in categories, add it and sync localStorage
    if (!safeCategories.includes(form.category)) {
      updatedCategories = [...safeCategories, form.category];
      setCategories(updatedCategories);
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(updatedCategories));
    }
    const updated = [...safeRecords, { ...form, amount: numAmount }];
    setRecords(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    setForm({ date: "", category: (Array.isArray(updatedCategories) && updatedCategories.length > 0) ? updatedCategories[0] : "", amount: "", note: "" });
  }
  function addCategory() {
    if (!newCategory.trim()) return;
    const safeCategories = Array.isArray(categories) ? categories : [];
    const updated = [...safeCategories, newCategory.trim()];
    setCategories(updated);
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(updated));
    setNewCategory("");
  }

  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "linear-gradient(135deg,#232526 0%,#414345 100%)", position: "relative" }}>
      <NavBar order={["dashboard", "journal"]} labels={{ dashboard: "Dashboard", journal: "Journal" }} />
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 64 }}>
        <div style={{ maxWidth: 540, width: "100%", padding: "2.7rem 2.7rem 2rem 2.7rem", background: "#18191a", borderRadius: 32, boxShadow: "0 12px 40px rgba(0,0,0,0.32)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 18px" }}>
          <h2 style={{ fontSize: "2.7rem", fontWeight: 800, marginBottom: "2.3rem", color: "#fff", textAlign: "center", letterSpacing: "1px", fontFamily: 'Segoe UI', textShadow: "0 2px 8px #0002" }}>Spending Journal</h2>
          {/* ...existing code... */}
          <form onSubmit={addRecord} style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: "2.2rem", justifyContent: "center" }}>
            <input name="date" type="date" value={form.date} onChange={handleChange} required style={{ flex: "1 1 120px", padding: "0.9rem", borderRadius: 14, border: "1.5px solid #333", background: "#222", color: "#fff", fontSize: "1.12rem", fontFamily: 'Segoe UI', boxShadow: "0 1px 4px #0001" }} />
            <select name="category" value={form.category} onChange={handleChange} required style={{ flex: "1 1 120px", padding: "0.9rem", borderRadius: 14, border: "1.5px solid #333", background: "#222", color: "#fff", fontSize: "1.12rem", fontFamily: 'Segoe UI', boxShadow: "0 1px 4px #0001" }}>
              {(Array.isArray(categories) ? categories : []).map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} required style={{ flex: "1 1 80px", padding: "0.9rem", borderRadius: 14, border: "1.5px solid #333", background: "#222", color: "#fff", fontSize: "1.12rem", fontFamily: 'Segoe UI', boxShadow: "0 1px 4px #0001" }} />
            <input name="note" type="text" value={form.note} onChange={handleChange} placeholder="Note" style={{ flex: "2 1 160px", padding: "0.9rem", borderRadius: 14, border: "1.5px solid #333", background: "#222", color: "#fff", fontSize: "1.12rem", fontFamily: 'Segoe UI', boxShadow: "0 1px 4px #0001" }} />
            <button type="submit" style={{ flex: "1 1 100px", padding: "0.9rem 2.2rem", borderRadius: 14, background: "linear-gradient(90deg,#4f8cff,#6a82fb)", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "1.12rem", fontFamily: 'Segoe UI', boxShadow: "0 2px 8px #4f8cff44", transition: "background 0.2s" }}>Add</button>
          </form>
          <div style={{ display: "flex", gap: 20, marginBottom: "2.7rem", justifyContent: "center" }}>
            <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category" style={{ flex: "2 1 160px", padding: "0.9rem", borderRadius: 14, border: "1.5px solid #333", background: "#222", color: "#fff", fontSize: "1.12rem", fontFamily: 'Segoe UI', boxShadow: "0 1px 4px #0001" }} />
            <button onClick={addCategory} style={{ flex: "1 1 100px", padding: "0.9rem 2.2rem", borderRadius: 14, background: "linear-gradient(90deg,#00c49f,#43e97b)", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "1.12rem", fontFamily: 'Segoe UI', boxShadow: "0 2px 8px #00c49f44", transition: "background 0.2s" }}>Add Category</button>
          </div>
          <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#fff", marginBottom: 16, textAlign: "center", fontFamily: 'Segoe UI' }}>Records</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, width: "100%" }}>
            {(Array.isArray(records) && records.length === 0) && <li style={{ color: "#aaa", fontStyle: "italic", textAlign: "center", fontSize: "1.12rem" }}>No records yet.</li>}
            {(Array.isArray(records) ? records : []).map((rec, i) => (
              <li key={i} style={{ background: "#222", color: "#fff", borderRadius: 14, marginBottom: 14, padding: "1.1rem 1.3rem", boxShadow: "0 2px 12px #0002", textAlign: "center", fontSize: "1.12rem", fontFamily: 'Segoe UI' }}>
                <span style={{ fontWeight: 700 }}>{rec.date}</span> — <span style={{ color: "#4f8cff" }}>{rec.category}</span> — <span style={{ color: "#00c49f" }}>${rec.amount.toFixed(2)}</span> {rec.note && <span style={{ color: "#aaa" }}>— {rec.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Journal;
