import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
  // State pentru gestionarea datelor introduse de utilizator
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State pentru afișarea mesajelor de succes/eroare
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Pentru redirecționare după login

  // Gestionarea modificărilor din formular
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestionarea trimiterii formularului
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Resetăm mesajul

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        // Redirecționăm utilizatorul către pagina principală (sau alta)
        navigate("/"); // Înlocuiește cu ruta dorită
      } else {
        setMessage(data.message); // Afișăm mesajul de eroare
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("A apărut o eroare. Încearcă din nou.");
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Case Management System</h1>
          <p>Introdu datele pentru a te loga si a vedea cele mai noi modificari.</p>
          <span>Apasă aici pentru a-ți crea un cont</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
          {message && <p>{message}</p>} {/* Afișăm mesajul */}
        </div>
      </div>
    </div>
  );
};

export default Login;
