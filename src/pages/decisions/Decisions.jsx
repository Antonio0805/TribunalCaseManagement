import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./decisions.scss";

const Decisions = () => {
  const [decisions, setDecisions] = useState([]);
  const [cases, setCases] = useState([]);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [newDecision, setNewDecision] = useState({
    case_id: "",
    judge_id: "",
    decision_date: "",
    result: "",
    description: "",
    decision_type: "Sentinta definitiva",
  });

  useEffect(() => {
    fetchDecisions();
    fetchCases();
    fetchJudges();
  }, []);

  const fetchDecisions = async () => {
    try {
      const response = await fetch("http://localhost:3000/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setDecisions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching decisions:", error);
      setError("Failed to load decisions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const response = await fetch("http://localhost:3000/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching cases:", error);
    }
  };

  const fetchJudges = async () => {
    try {
      const response = await fetch("http://localhost:3000/judges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setJudges(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching judges:", error);
    }
  };

  const handleInsertDecision = async () => {
    try {
      const response = await fetch("http://localhost:3000/decisions/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDecision),
      });

      if (!response.ok) throw new Error("Error inserting decision");

      fetchDecisions();
      setNewDecision({
        case_id: "",
        judge_id: "",
        decision_date: "",
        result: "",
        description: "",
        decision_type: "Sentinta definitiva",
      });

      setSuccessMessage("✅ Decision added successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("❌ Error inserting decision:", error);
    }
  };

  const handleDeleteDecision = async (id) => {
    if (!window.confirm("Are you sure you want to delete this decision?")) return;

    try {
      const response = await fetch("http://localhost:3000/decisions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Error deleting decision");

      fetchDecisions();
      setSuccessMessage("❌ Decision deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("❌ Error deleting decision:", error);
    }
  };

  return (
    <div className="decisions">
      <header className="decisions-header">
        <button className="home-button" onClick={() => navigate("/")}>🏠 Home</button>
        <h1>Court Decisions</h1>
        <button className="more-button" onClick={() => navigate("/view-all-decisions")}>📜 More</button>
      </header>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="insert-decision">
        <h2>Insert New Decision</h2>
        <div className="form-grid">
          <select value={newDecision.case_id} onChange={(e) => setNewDecision({ ...newDecision, case_id: e.target.value })}>
            <option value="">Select Case</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.case_number} (ID: {c.id})
              </option>
            ))}
          </select>

          <select value={newDecision.judge_id} onChange={(e) => setNewDecision({ ...newDecision, judge_id: e.target.value })}>
            <option value="">Select Judge</option>
            {judges.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name} {j.surname}
              </option>
            ))}
          </select>

          <input type="date" value={newDecision.decision_date} onChange={(e) => setNewDecision({ ...newDecision, decision_date: e.target.value })} />
          <input type="text" placeholder="Result" value={newDecision.result} onChange={(e) => setNewDecision({ ...newDecision, result: e.target.value })} />
          <input type="text" placeholder="Description" value={newDecision.description} onChange={(e) => setNewDecision({ ...newDecision, description: e.target.value })} />
          <select value={newDecision.decision_type} onChange={(e) => setNewDecision({ ...newDecision, decision_type: e.target.value })}>
            <option value="Sentinta definitiva">Sentinta definitiva</option>
            <option value="Sentinta - poate fi contestata">Sentinta - poate fi contestata</option>
          </select>
        </div>
        <button className="insert-button" onClick={handleInsertDecision}>➕ Insert Decision</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Case ID</th>
            <th>Judge Name</th>
            <th>Date</th>
            <th>Result</th>
            <th>Description</th>
            <th>Decision Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {decisions.map((decision) => (
            <tr key={decision.id}>
              <td>{decision.id}</td>
              <td>{decision.case_id}</td>
              <td>{decision.judge_id}</td>
              <td>{new Date(decision.decision_date).toLocaleDateString()}</td>
              <td>{decision.result}</td>
              <td>{decision.description}</td>
              <td>{decision.decision_type}</td>
              <td><button onClick={() => handleDeleteDecision(decision.id)}>❌ Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Decisions;
