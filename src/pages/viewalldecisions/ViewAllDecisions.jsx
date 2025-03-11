import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./viewAllDecisions.scss";

const ViewAllDecisions = () => {
  const [decisions, setDecisions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [editingDecisionId, setEditingDecisionId] = useState(null);
  const [editedDecision, setEditedDecision] = useState({});
  const [judgeDecisionCounts, setJudgeDecisionCounts] = useState([]);
  const [caseDecisionCounts, setCaseDecisionCounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDecisions();
    fetchJudgeDecisionCounts();
    fetchCaseDecisionCounts();
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
    }
  };

  const fetchJudgeDecisionCounts = async () => {
    try {
      const response = await fetch("http://localhost:3000/judges/decision-counts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setJudgeDecisionCounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching judge decision counts:", error);
    }
  };

  const fetchCaseDecisionCounts = async () => {
    try {
      const response = await fetch("http://localhost:3000/cases/decision-counts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setCaseDecisionCounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching case decision counts:", error);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await fetch("http://localhost:3000/decisions/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision_type: filterType }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setDecisions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error filtering decisions:", error);
    }
  };

  const handleEditDecision = (decision) => {
    setEditingDecisionId(decision.id);
    setEditedDecision({
      decision_date: decision.decision_date,
      decision_type: decision.decision_type,
    });
  };

  const handleCancelEdit = () => {
    setEditingDecisionId(null);
    setEditedDecision({});
  };

  const handleUpdateDecision = async () => {
    try {
      const response = await fetch("http://localhost:3000/decisions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingDecisionId,
          decision_date: editedDecision.decision_date,
          decision_type: editedDecision.decision_type,
        }),
      });

      if (!response.ok) throw new Error("Error updating decision");

      fetchDecisions();
      setEditingDecisionId(null);
    } catch (error) {
      console.error("❌ Error updating decision:", error);
    }
  };

  return (
    <div className="view-all-decisions">
      <header className="decisions-header">
        <button className="back-button" onClick={() => navigate("/decisions")}>🔙 Back</button>
        <h1>All Decisions</h1>
      </header>

      {/* Filter Section */}
      <div className="filter-container">
        <label>Filter by Decision Type:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All</option>
          <option value="Sentinta definitiva">Sentinta definitiva</option>
          <option value="Sentinta - poate fi contestata">Sentinta - poate fi contestata</option>
        </select>
        <button onClick={handleFilter}>🔍 Filter</button>
      </div>

      {/* Decisions Table */}
      <h2>Decisions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Case ID</th>
            <th>Judge Name</th>
            <th>Date</th>
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
              <td>
                {editingDecisionId === decision.id ? (
                  <input
                    type="date"
                    value={editedDecision.decision_date}
                    onChange={(e) =>
                      setEditedDecision({ ...editedDecision, decision_date: e.target.value })
                    }
                  />
                ) : (
                  new Date(decision.decision_date).toLocaleDateString()
                )}
              </td>
              <td>
                {editingDecisionId === decision.id ? (
                  <select
                    value={editedDecision.decision_type}
                    onChange={(e) =>
                      setEditedDecision({ ...editedDecision, decision_type: e.target.value })
                    }
                  >
                    <option value="Sentinta definitiva">Sentinta definitiva</option>
                    <option value="Sentinta - poate fi contestata">Sentinta - poate fi contestata</option>
                  </select>
                ) : (
                  decision.decision_type
                )}
              </td>
              <td>
                {editingDecisionId === decision.id ? (
                  <>
                    <button onClick={handleUpdateDecision}>💾 Save</button>
                    <button onClick={handleCancelEdit}>❌ Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEditDecision(decision)}>✏️ Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Judge Decision Counts */}
      <h2>Judge Decision Counts</h2>
      <table>
        <thead>
          <tr>
            <th>Judge Name</th>
            <th>Total Decisions</th>
          </tr>
        </thead>
        <tbody>
          {judgeDecisionCounts.map((entry) => (
            <tr key={entry.judge_name}>
              <td>{entry.judge_name}</td>
              <td>{entry.decision_count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Case Decision Counts */}
      <h2>Case Decision Counts</h2>
      <table>
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Total Decisions</th>
          </tr>
        </thead>
        <tbody>
          {caseDecisionCounts.map((entry) => (
            <tr key={entry.case_id}>
              <td>{entry.case_id}</td>
              <td>{entry.decision_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllDecisions;
