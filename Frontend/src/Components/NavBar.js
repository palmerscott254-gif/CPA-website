import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Try to get user info (you might need to create this endpoint)
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  return (
    <nav style={{ 
      padding: "15px 20px", 
      borderBottom: "2px solid #e0e0e0",
      backgroundColor: "#f8f9fa",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link 
          to="/" 
          style={{ 
            marginRight: "30px", 
            fontSize: "24px",
            fontWeight: "bold",
            color: "#2c3e50",
            textDecoration: "none"
          }}
        >
          📚 CPA Academy
        </Link>
        <Link 
          to="/units" 
          style={{ 
            marginRight: "20px", 
            color: "#34495e",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#e9ecef"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
        >
          Units
        </Link>
        <Link 
          to="/materials" 
          style={{ 
            marginRight: "20px", 
            color: "#34495e",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#e9ecef"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
        >
          Materials
        </Link>
        <Link 
          to="/quizzes" 
          style={{ 
            marginRight: "20px", 
            color: "#34495e",
            textDecoration: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#e9ecef"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
        >
          Quizzes
        </Link>
      </div>
      
      <div style={{ display: "flex", alignItems: "center" }}>
        {isLoggedIn ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "15px", color: "#2c3e50" }}>
              Welcome, {user?.username || "User"}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#c0392b"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#e74c3c"}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link 
              to="/login" 
              style={{ 
                marginRight: "10px", 
                color: "#3498db",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "1px solid #3498db",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#3498db";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#3498db";
              }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{ 
                color: "white",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                backgroundColor: "#3498db",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#2980b9"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#3498db"}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
