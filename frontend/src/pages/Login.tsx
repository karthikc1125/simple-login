/**
 * User and admin login page.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters and include a special character"
      );
      return;
    }

    setError("");
    console.log("Login Data:", { email, password });
  };

  return (
  <>
    <Navbar />

    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.card}>

          <h2 style={styles.title}>Login</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <label>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={styles.showBtn}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              type="submit"
              style={{
                ...styles.button,
                backgroundColor: isHover ? "#1d4ed8" : "#2563eb",
                transform: isHover ? "translateY(-2px)" : "translateY(0)",
                boxShadow: isHover
                  ? "0 8px 20px rgba(37, 99, 235, 0.4)"
                  : "0 4px 10px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              Login
            </button>
          </form>

          <p style={styles.link}>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>

        </div>
      </div>
    </div>
  </>
);

};

const NAVBAR_HEIGHT = "56px";

const styles = {
  page: {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  paddingTop: NAVBAR_HEIGHT, // NAVBAR HEIGHT
},

wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "40px", // space below navbar
  },

card: {
    background: "#fff",
    padding: "28px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },

  header: {
    textAlign: "center" as const,
    marginBottom: "16px",
  },

  headline: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1f2937",
  },

  subtext: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
  },

  title: {
    textAlign: "center" as const,
    marginBottom: "14px",
    fontSize: "18px",
  },

  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },

  passwordWrapper: {
    position: "relative" as const,
  },

  showBtn: {
    position: "absolute" as const,
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: 600,
  },

  button: {
  marginTop: "10px",
  padding: "10px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600,
  transition: "all 0.25s ease",
},


  error: {
    color: "red",
    fontSize: "13px",
    textAlign: "center" as const,
  },

  link: {
    textAlign: "center" as const,
    marginTop: "12px",
    fontSize: "14px",
  },
};



export default Login;

