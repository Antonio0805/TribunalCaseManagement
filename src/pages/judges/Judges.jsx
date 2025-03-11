import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./judges.scss";

const Judges = () => {
  const [judges, setJudges] = useState([]);
  const [judgesWithCases, setJudgesWithCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJudgesWithCases();
    fetchJudgesAndCases();
  }, []);

  // ✅ Funcție pentru a prelua judecătorii și numărul de procese gestionate
  const fetchJudgesWithCases = async () => {
    try {
      console.log("📌 Fetching judges with case count...");

      const response = await fetch("http://localhost:3000/judges/cases-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📌 Judges data received:", data);

      if (Array.isArray(data) && data.length > 0) {
        setJudges(data);
      } else {
        console.warn("⚠️ No judges found.");
        setJudges([]);
      }
    } catch (error) {
      console.error("❌ Error fetching judges:", error);
      setError("Failed to load judges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Funcție pentru a prelua judecătorii și procesele lor
  const fetchJudgesAndCases = async () => {
    try {
      console.log("📌 Fetching judges with cases...");

      const response = await fetch("http://localhost:3000/judges/cases-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📌 Judges with cases data received:", data);

      if (Array.isArray(data) && data.length > 0) {
        setJudgesWithCases(data);
      } else {
        console.warn("⚠️ No judge-case data found.");
        setJudgesWithCases([]);
      }
    } catch (error) {
      console.error("❌ Error fetching judge-case data:", error);
      setError("Failed to load judges with cases. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="judges">
      <div className="judges-header">
        <button className="home-button" onClick={() => navigate("/")}>🏠 Home</button>
        <h1>Judges & Case Data</h1>
      </div>

      <p className="judges-motto">
        "Justice is the constant and perpetual will to render to each their due."
      </p>

      {loading ? (
        <p>Loading judges...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          {/* 🔹 Tabel 1: Numărul de cazuri per judecător */}
          <div className="judges-section">
            <h2 className="judges-title">📊 Number of Cases Handled by Each Judge</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Total Cases Managed</th>
                </tr>
              </thead>
              <tbody>
                {judges.map((judge) => (
                  <tr key={judge.id}>
                    <td>{judge.id}</td>
                    <td>{judge.judge_name}</td>
                    <td>{judge.case_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Tabel 2: Lista proceselor fiecărui judecător */}
          <div className="judges-section">
            <h2 className="judges-title">📋 Cases Managed by Each Judge</h2>
            <table>
              <thead>
                <tr>
                  <th>Judge Name</th>
                  <th>Case ID</th>
                  <th>Case Number</th>
                  <th>Case Status</th>
                </tr>
              </thead>
              <tbody>
                {judgesWithCases.map((record) => (
                  <tr key={`${record.judge_id}-${record.case_id}`}>
                    <td>{record.judge_name}</td>
                    <td>{record.case_id}</td>
                    <td>{record.case_number}</td>
                    <td>{record.case_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Judges;
