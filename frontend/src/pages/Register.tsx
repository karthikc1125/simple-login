/**
 * User registration page with full validation
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isHover, setIsHover] = useState(false);

  // Regex validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

  // Mock existing users (replace with API later)
  const existingUsers = [
    { email: "test@gmail.com", phone: "9876543210" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (name.length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters and include a special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userExists = existingUsers.some(
      (user) => user.email === email || user.phone === phone
    );

    if (userExists) {
      setError("You already have an account. Please login.");
      return;
    }

    setError("");
    console.log("Registered User:", { name, email, phone, password });
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.wrapper}>
          <div style={styles.card}>
            <h2 style={styles.title}>Register</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />

              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />

              <label>Phone Number</label>
              <input
                type="text"
                placeholder="10 digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
              />

              <label>Create Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
              </div>

              <label>Re-enter Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                }}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
              >
                Register
              </button>
            </form>

            <p style={styles.link}>
              Already have an account? <Link to="/login">Login</Link>
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
    paddingTop: NAVBAR_HEIGHT,
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "40px",
  },
  card: {
    background: "#fff",
    padding: "28px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
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

export default Register;
