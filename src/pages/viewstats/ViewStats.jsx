import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./viewstats.scss";

const ViewStats = () => {
  const [cases, setCases] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchCaseNumber, setSearchCaseNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
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
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await fetch("http://localhost:3000/cases/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: filterStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error filtering cases:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch("http://localhost:3000/cases/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_number: searchCaseNumber }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error searching cases:", error);
    }
  };

  return (
    <div className="viewstats-container">
      <header className="viewstats-header">
        <button className="back-button" onClick={() => navigate("/cases")}>🔙 Cases</button>
        <h1>View Statistics</h1>
      </header>

      <div className="filter-container">
        <label>Status:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Finalizat">Finalizat</option>
          <option value="În desfasurare">În desfasurare</option>
        </select>
        <button onClick={handleFilter}>🔍 Filter</button>

        <label>Search by Case Number:</label>
        <input
          type="text"
          placeholder="Enter Case Number"
          value={searchCaseNumber}
          onChange={(e) => setSearchCaseNumber(e.target.value)}
        />
        <button onClick={handleSearch}>🔎 Search</button>
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
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => (
              <tr key={caseItem.id}>
                <td>{caseItem.id}</td>
                <td>{caseItem.case_number}</td>
                <td>{caseItem.judge}</td>
                <td>{new Date(caseItem.start_date).toLocaleDateString()}</td>
                <td>{caseItem.case_type}</td>
                <td>{caseItem.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewStats;
