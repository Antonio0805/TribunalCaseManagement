import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./defendants.scss";

const Defendants = () => {
  const [defendants, setDefendants] = useState([]);
  const [caseDetails, setCaseDetails] = useState([]); // Prima interogare
  const [caseCounts, setCaseCounts] = useState([]); // A doua interogare
  const [filterType, setFilterType] = useState("All"); // Stare pentru filtrare
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDefendants();
    fetchCaseDetails();
    fetchCaseCounts();
  }, []);

  const fetchDefendants = async () => {
    try {
      const response = await fetch("http://localhost:3000/defendants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setDefendants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching defendants:", error);
      setError("Failed to load defendants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseDetails = async () => {
    try {
      const response = await fetch("http://localhost:3000/cases/defendant-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setCaseDetails(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching case details:", error);
      setError("Failed to load case details. Please try again.");
    }
  };

  const fetchCaseCounts = async () => {
    try {
      const response = await fetch("http://localhost:3000/defendants/case-counts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setCaseCounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching case counts:", error);
      setError("Failed to load case counts. Please try again.");
    }
  };

  const handleFilter = async () => {
    try {
      const response = await fetch("http://localhost:3000/defendants/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: filterType }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setDefendants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error filtering defendants:", error);
      setError("Failed to filter defendants. Please try again.");
    }
  };

  return (
    <div className="defendants">
      <div className="defendants-header">
        <button className="home-button" onClick={() => navigate("/")}>🏠 Home</button>
        <h1>Defendants & Case Details</h1>
      </div>

      {/* Filtrare */}
      <div className="filter-container">
        <label>Filter by Party Type:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All</option>
          <option value="Reclamant">Reclamant</option>
          <option value="Pârât">Pârât</option>
        </select>
        <button onClick={handleFilter}>🔍 Filter</button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {/* Tabel pentru lista defendantilor */}
          <h2>Defendants List</h2>
          {defendants.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Party Type</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Age</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {defendants.map((defendant) => (
                  <tr key={defendant.id}>
                    <td>{defendant.id}</td>
                    <td>{defendant.party_type}</td>
                    <td>{defendant.name}</td>
                    <td>{defendant.surname}</td>
                    <td>{defendant.age}</td>
                    <td>{defendant.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>⚠️ No defendants found in the database.</p>
          )}

          {/* Tabel pentru prima interogare */}
          <h2>Cases with Defendant Details</h2>
          {caseDetails.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Case Number</th>
                  <th>Defendant Name</th>
                  <th>Defendant Surname</th>
                  <th>Party Type</th>
                </tr>
              </thead>
              <tbody>
                {caseDetails.map((entry) => (
                  <tr key={`${entry.case_number}-${entry.defendant_name}`}>
                    <td>{entry.case_number}</td>
                    <td>{entry.defendant_name}</td>
                    <td>{entry.defendant_surname}</td>
                    <td>{entry.party_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>⚠️ No case details found in the database.</p>
          )}

          {/* Tabel pentru a doua interogare */}
          <h2>Defendants & Case Counts</h2>
          {caseCounts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Defendant Name</th>
                  <th>Defendant Surname</th>
                  <th>Total Cases</th>
                </tr>
              </thead>
              <tbody>
                {caseCounts.map((entry) => (
                  <tr key={`${entry.defendant_name}-${entry.defendant_surname}`}>
                    <td>{entry.defendant_name}</td>
                    <td>{entry.defendant_surname}</td>
                    <td>{entry.total_cases}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>⚠️ No data available for case counts.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Defendants;
