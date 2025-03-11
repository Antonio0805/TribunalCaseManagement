import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cases.scss";

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [editedCase, setEditedCase] = useState({});
  const navigate = useNavigate();

  const [newCase, setNewCase] = useState({
    judge_id: "",
    prosecutor_id: "",
    case_number: "",
    start_date: "",
    end_date: "",
    case_type: "Penal",
    status: "În desfasurare",
  });

  useEffect(() => {
    fetchCases();
    fetchJudges();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch("http://localhost:3000/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "Fetching cases" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching cases:", error);
      setError("Failed to load cases. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJudges = async () => {
    try {
      const response = await fetch("http://localhost:3000/judges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setJudges(data);
    } catch (error) {
      console.error("❌ Error fetching judges:", error);
    }
  };

  const handleInsert = async () => {
    if (!judges.some(j => j.id === Number(newCase.judge_id))) {
      alert("⚠️ Invalid Judge ID. Please select a valid judge.");
      return;
    }

    if (cases.some(c => c.case_number === newCase.case_number)) {
      alert("⚠️ Case number must be unique.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cases/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCase),
      });

      if (!response.ok) {
        throw new Error(`Error inserting case`);
      }

      fetchCases();
      setNewCase({
        judge_id: "",
        prosecutor_id: "",
        case_number: "",
        start_date: "",
        end_date: "",
        case_type: "Penal",
        status: "În desfasurare",
      });

      setSuccessMessage("✅ Case added, now you must add a new decision.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("❌ Error inserting case:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch("http://localhost:3000/cases/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`Error deleting case`);
      }

      fetchCases();
    } catch (error) {
      console.error("❌ Error deleting case:", error);
    }
  };

  const handleEdit = (caseItem) => {
    setEditingCaseId(caseItem.id);
    setEditedCase({ case_type: caseItem.case_type, status: caseItem.status });
  };

  const handleCancelEdit = () => {
    setEditingCaseId(null);
    setEditedCase({});
  };

  const handleUpdate = async () => {
    if (!editingCaseId) return;

    try {
      const response = await fetch("http://localhost:3000/cases/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCaseId,
          case_type: editedCase.case_type,
          status: editedCase.status,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating case`);
      }

      fetchCases();
      setEditingCaseId(null);
      setSuccessMessage("✅ Case updated successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("❌ Error updating case:", error);
    }
  };

  return (
    <div className="cases-container">
      <header className="cases-header">
        <button className="home-button" onClick={() => navigate("/")}>🏠 Home</button>
        <div className="cases-header">
    <h1>Tribunal Cases</h1>
    <button className="view-stats-button" onClick={() => navigate("/view-stats")}>📊 View Stats</button>
    </div>
      </header>

      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="insert-case">
        <h2>Insert New Case</h2>
        <div className="form-grid">
          <select value={newCase.judge_id} onChange={(e) => setNewCase({ ...newCase, judge_id: e.target.value })}>
            <option value="">Select Judge</option>
            {judges.map(judge => <option key={judge.id} value={judge.id}>{judge.name} {judge.surname}</option>)}
          </select>

          <input type="text" placeholder="Prosecutor ID" value={newCase.prosecutor_id} onChange={(e) => setNewCase({ ...newCase, prosecutor_id: e.target.value })} />
          <input type="text" placeholder="Case Number" value={newCase.case_number} onChange={(e) => setNewCase({ ...newCase, case_number: e.target.value })} />
          <input type="date" value={newCase.start_date} onChange={(e) => setNewCase({ ...newCase, start_date: e.target.value })} />
          <input type="date" value={newCase.end_date} onChange={(e) => setNewCase({ ...newCase, end_date: e.target.value })} />

          <select value={newCase.case_type} onChange={(e) => setNewCase({ ...newCase, case_type: e.target.value })}>
            <option value="Penal">Penal</option>
            <option value="Civil">Civil</option>
          </select>

          <select value={newCase.status} onChange={(e) => setNewCase({ ...newCase, status: e.target.value })}>
            <option value="Finalizat">Finalizat</option>
            <option value="În desfasurare">În desfasurare</option>
          </select>
        </div>
        <button className="insert-button" onClick={handleInsert}>➕ Insert Case</button>
      </div>

      {!loading && cases.length > 0 && (
        <table className="cases-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Case Number</th>
              <th>Judge ID</th>
              <th>Start Date</th>
              <th>Case Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(caseItem => (
              <tr key={caseItem.id}>
                <td>{caseItem.id}</td>
                <td>{caseItem.case_number}</td>
                <td>{caseItem.judge}</td>
                <td>{new Date(caseItem.start_date).toLocaleDateString()}</td>
                <td>
                  {editingCaseId === caseItem.id ? (
                    <select value={editedCase.case_type} onChange={(e) => setEditedCase({ ...editedCase, case_type: e.target.value })}>
                      <option value="Penal">Penal</option>
                      <option value="Civil">Civil</option>
                    </select>
                  ) : caseItem.case_type}
                </td>
                <td>
                  {editingCaseId === caseItem.id ? (
                    <select value={editedCase.status} onChange={(e) => setEditedCase({ ...editedCase, status: e.target.value })}>
                      <option value="Finalizat">Finalizat</option>
                      <option value="În desfasurare">În desfasurare</option>
                    </select>
                  ) : caseItem.status}
                </td>
                <td>
                  {editingCaseId === caseItem.id ? (
                    <>
                      <button onClick={handleUpdate}>💾 Save</button>
                      <button onClick={handleCancelEdit}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(caseItem)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(caseItem.id)}>❌ Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Cases;

