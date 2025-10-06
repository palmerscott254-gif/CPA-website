import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchJSON } from "../api";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: ""
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

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await fetchJSON("/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
          first_name: formData.first_name,
          last_name: formData.last_name
        })
      });

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      if (err.data) {
        // Handle validation errors
        const errors = Object.values(err.data).flat();
        setError(errors.join(", "));
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "500px", 
      margin: "30px auto", 
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
          Join CPA Academy
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "16px" }}>
          Create your account to access study materials and quizzes
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#2c3e50",
              fontWeight: "500"
            }}>
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
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
          <div>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              color: "#2c3e50",
              fontWeight: "500"
            }}>
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
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
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#2c3e50",
            fontWeight: "500"
          }}>
            Username *
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

        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#2c3e50",
            fontWeight: "500"
          }}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
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

        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#2c3e50",
            fontWeight: "500"
          }}>
            Password *
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

        <div style={{ marginBottom: "30px" }}>
          <label style={{ 
            display: "block", 
            marginBottom: "8px", 
            color: "#2c3e50",
            fontWeight: "500"
          }}>
            Confirm Password *
          </label>
          <input
            type="password"
            name="password2"
            value={formData.password2}
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
            backgroundColor: loading ? "#bdc3c7" : "#27ae60",
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
            if (!loading) e.target.style.backgroundColor = "#229954";
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = "#27ae60";
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div style={{ 
        textAlign: "center", 
        marginTop: "30px",
        paddingTop: "20px",
        borderTop: "1px solid #e0e0e0"
      }}>
        <p style={{ color: "#7f8c8d", fontSize: "14px", margin: "0" }}>
          Already have an account?{" "}
          <Link 
            to="/login" 
            style={{ 
              color: "#3498db", 
              textDecoration: "none",
              fontWeight: "500"
            }}
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

