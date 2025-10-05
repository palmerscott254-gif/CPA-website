import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetchJSON("/auth/login/", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      // Store tokens
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);
      
      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError(err.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "50px auto", 
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ 
          fontSize: "28px", 
          color: "#2c3e50", 
          marginBottom: "10px"
        }}>
          Welcome Back
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "16px" }}>
          Sign in to your CPA Academy account
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "12px",
          borderRadius: "4px",
          marginBottom: "20px",
          fontSize: "14px"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#2c3e50",
            fontWeight: "500"
          }}>
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e0e0e0",
              borderRadius: "4px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.3s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3498db"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#2c3e50",
            fontWeight: "500"
          }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e0e0e0",
              borderRadius: "4px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.3s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3498db"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: loading ? "#bdc3c7" : "#3498db",
            color: "white",
            padding: "14px",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = "#2980b9";
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = "#3498db";
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div style={{ 
        textAlign: "center", 
        marginTop: "30px",
        paddingTop: "20px",
        borderTop: "1px solid #e0e0e0"
      }}>
        <p style={{ color: "#7f8c8d", fontSize: "14px", margin: "0" }}>
          Don't have an account?{" "}
          <Link 
            to="/register" 
            style={{ 
              color: "#3498db", 
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
