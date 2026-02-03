/**
 * Home page. Entry point with links to main features.
 */

import cityImage from "../assets/city.jpg";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.heading}>Welcome to City Information Portal</h1>

          <p style={styles.subText}>
            Discover cities, blogs, restaurants, and amazing places
          </p>

          {!user && (
            <div style={styles.buttonGroup}>
              <button
                style={styles.loginBtn}
                onClick={() => navigate("/login")}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
              >
                Login
              </button>
              <button
                style={styles.registerBtn}
                onClick={() => navigate("/register")}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;


const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: `url(${cityImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "60px", // avoids navbar overlap
  },

  card: {
    background: "rgba(255, 255, 255, 0.85)",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center" as const,
    maxWidth: "420px",
    width: "90%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },

  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "10px",
  },

  subText: {
    fontSize: "15px",
    color: "#4b5563",
    marginBottom: "30px",
  },

  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px", // ✅ SPACE BETWEEN LOGIN & REGISTER
  },

  loginBtn: {
    padding: "12px 28px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  registerBtn: {
    padding: "12px 28px",
    backgroundColor: "transparent",
    color: "#2563eb",
    border: "2px solid #2563eb",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};
