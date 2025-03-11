import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./statistics.scss";

const Statistics = () => {
  const [topJudgesComplex, setTopJudgesComplex] = useState([]);
  const [highestFeeClaimants, setHighestFeeClaimants] = useState([]);
  const [topLawyersFees, setTopLawyersFees] = useState([]);
  const [completedProcessesDecisions, setCompletedProcessesDecisions] = useState([]); // Noua interogare
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopJudgesComplex();
    fetchHighestFeeClaimants();
    fetchTopLawyersFees();
    fetchCompletedProcessesDecisions(); // Noua funcție
  }, []);

  const fetchTopJudgesComplex = async () => {
    try {
      console.log("📌 Fetching top judges with complex criteria...");
      const response = await fetch("http://localhost:3000/statistics/top-judges-complex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTopJudgesComplex(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching top judges:", error);
      setError("Failed to load top judges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHighestFeeClaimants = async () => {
    try {
      console.log("📌 Fetching claimants with highest lawyer fees...");
      const response = await fetch("http://localhost:3000/statistics/highest-fee-claimants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setHighestFeeClaimants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching highest fee claimants:", error);
      setError("Failed to load claimants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopLawyersFees = async () => {
    try {
      console.log("📌 Fetching top lawyers by fees...");
      const response = await fetch("http://localhost:3000/statistics/top-lawyers-fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTopLawyersFees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching top lawyers fees:", error);
      setError("Failed to load top lawyers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedProcessesDecisions = async () => {
    try {
      console.log("📌 Fetching completed processes with most decisions...");
      const response = await fetch("http://localhost:3000/statistics/completed-processes-most-decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCompletedProcessesDecisions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching completed processes:", error);
      setError("Failed to load processes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="statistics">
      <div className="statistics-header">
        <button className="home-button" onClick={() => navigate("/")}>🏠 Home</button>
        <h1>Statistics</h1>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {/* Top Judges Complex Criteria */}
          <h2>Top Judges with Complex Criteria</h2>
          {topJudgesComplex.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Judge Name</th>
                  <th>Judge Surname</th>
                  <th>Criminal Cases Count</th>
                </tr>
              </thead>
              <tbody>
                {topJudgesComplex.map((judge, index) => (
                  <tr key={index}>
                    <td>{judge.judge_name}</td>
                    <td>{judge.judge_surname}</td>
                    <td>{judge.criminal_cases_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>⚠️ No data available for judges.</p>
          )}

          {/* Highest Fee Claimants */}
          <h2>Claimants with Highest Lawyer Fees</h2>
          {highestFeeClaimants.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Case Number</th>
                  <th>Claimant Name</th>
                  <th>Claimant Surname</th>
                  <th>Highest Fee</th>
                  <th>Judge Name</th>
                  <th>Judge Surname</th>
                </tr>
              </thead>
              <tbody>
                {highestFeeClaimants.map((claimant, index) => (
                  <tr key={index}>
                    <td>{claimant.case_number}</td>
                    <td>{claimant.claimant_name}</td>
                    <td>{claimant.claimant_surname}</td>
                    <td>{claimant.highest_fee}</td>
                    <td>{claimant.judge_name}</td>
                    <td>{claimant.judge_surname}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>⚠️ No data available for claimants.</p>
          )}

          {/* Top Lawyers by Fees */}
          <h2>Top Lawyers by Total Fees</h2>
          {topLawyersFees.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Lawyer Name</th>
                  <th>Lawyer Surname</th>
                  <th>Total Fees</th>
                </tr>
              </thead>
              <tbody>
                {topLawyersFees.map((lawyer, index) => (
                  <tr key={index}>
                    <td>{lawyer.lawyer_name}</td>
                    <td>{lawyer.lawyer_surname}</td>
                    <td>{lawyer.total_fees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>⚠️ No data available for lawyers.</p>
          )}

          {/* Completed Processes with Most Decisions */}
          <h2>Completed Processes with Most Decisions</h2>
          {completedProcessesDecisions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Case Number</th>
                  <th>Judge Name</th>
                  <th>Judge Surname</th>
                  <th>Decisions Count</th>
                </tr>
              </thead>
              <tbody>
                {completedProcessesDecisions.map((process, index) => (
                  <tr key={index}>
                    <td>{process.case_number}</td>
                    <td>{process.judge_name}</td>
                    <td>{process.judge_surname}</td>
                    <td>{process.decisions_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>⚠️ No data available for processes.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Statistics;
