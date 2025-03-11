import { useNavigate } from "react-router-dom";
import "./home.scss";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <header className="home-header">
        <div className="auth-buttons">
          <button className="btn btn-login" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-register" onClick={() => navigate('/register')}>Register</button>
        </div>
        <h1>Tribunal Case Management</h1>
        <p>Manage legal cases efficiently and stay updated with judicial processes.</p>
      </header>

      <main className="home-content">
        <section className="info-section">
          <h2>📜 Legal Dashboard</h2>
          <p>Access your cases, track hearings, and manage judicial processes in one place.</p>
        </section>

        <section className="feature-section">
          <div className="feature" onClick={() => {
            console.log("Navigating to /cases");
            navigate('/cases');
          }}>
            <h3>📂 Cases</h3>
            <p>View and manage all court cases efficiently.</p>
          </div>
          
          <div className="feature" onClick={() => navigate('/judges')}>
            <h3>⚖️ Judges</h3>
            <p>Review assigned judges and their schedules.</p>
          </div>

          <div className="feature" onClick={() => navigate('/decisions')}>  {/* 🔹 Schimbat ruta */}
          <h3>📜 Decisions</h3>  {/* 🔹 Schimbat titlul */}
          <p>Review court decisions and final verdicts.</p>
          </div>

          <div className="feature feature-defendants" onClick={() => navigate('/defendants')}>
            <h3>🔍 Defendants & Accused</h3>
            <p>Track individuals involved in active cases.</p>
          </div>

          <div className="feature feature-statistics" onClick={() => navigate('/statistics')}>
            <h3>📊 Statistics</h3>
            <p>Analyze key legal statistics and insights.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
