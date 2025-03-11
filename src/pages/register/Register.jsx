import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";

const Register = () => {
  // State pentru a gestiona datele de intrare din formular
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // State pentru mesaje de succes sau eroare
  const [message, setMessage] = useState("");

  // Gestionarea modificărilor din formular
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Trimiterea datelor către API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Resetăm mesajul

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // Afișăm mesajul de succes
      } else {
        const errorData = await response.json();
        setMessage(errorData.message); // Afișăm mesajul de eroare
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("A apărut o eroare la înregistrare.");
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Case Management System</h1>
          <p>Acceseaza toate procesele disponibile printr-o simpla inregistrare.</p>
          <span>Dacă ai deja un cont, apasă aici</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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
            <button type="submit">Register</button>
          </form>
          {message && <p>{message}</p>} {/* Mesaj de succes/eroare */}
        </div>
      </div>
    </div>
  );
};

export default Register;
