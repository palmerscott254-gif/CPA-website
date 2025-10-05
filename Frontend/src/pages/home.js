import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJSON } from "../api";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJSON("/subjects/")
      .then(data => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "400px",
        fontSize: "18px",
        color: "#666"
      }}>
        Loading subjects...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "40px",
        color: "#e74c3c",
        fontSize: "18px"
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ 
          fontSize: "48px", 
          color: "#2c3e50", 
          marginBottom: "20px",
          fontWeight: "300"
        }}>
          Welcome to CPA Academy
        </h1>
        <p style={{ 
          fontSize: "20px", 
          color: "#7f8c8d", 
          maxWidth: "600px", 
          margin: "0 auto",
          lineHeight: "1.6"
        }}>
          Master Certified Public Accountant concepts with our comprehensive 
          learning platform. Access study materials, practice quizzes, and 
          track your progress.
        </p>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ 
          fontSize: "32px", 
          color: "#34495e", 
          marginBottom: "30px",
          textAlign: "center"
        }}>
          Available Subjects
        </h2>
        
        {subjects.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px",
            color: "#7f8c8d",
            fontSize: "18px"
          }}>
            No subjects available yet. Check back later!
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {subjects.map(subject => (
              <div 
                key={subject.id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "25px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-5px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                <h3 style={{ 
                  fontSize: "24px", 
                  color: "#2c3e50", 
                  marginBottom: "15px",
                  fontWeight: "500"
                }}>
                  {subject.name}
                </h3>
                <p style={{ 
                  color: "#7f8c8d", 
                  marginBottom: "20px",
                  lineHeight: "1.5"
                }}>
                  {subject.units?.length || 0} units available
                </p>
                <Link 
                  to={`/subjects/${subject.slug}`}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#3498db",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    transition: "background-color 0.3s",
                    fontSize: "16px"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#2980b9"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#3498db"}
                >
                  View Units →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "40px", 
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <h3 style={{ 
          fontSize: "28px", 
          color: "#2c3e50", 
          marginBottom: "20px"
        }}>
          Ready to Start Learning?
        </h3>
        <p style={{ 
          fontSize: "18px", 
          color: "#7f8c8d", 
          marginBottom: "30px" 
        }}>
          Browse our comprehensive collection of study materials and practice quizzes.
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <Link 
            to="/units"
            style={{
              backgroundColor: "#27ae60",
              color: "white",
              padding: "15px 30px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "18px",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#229954"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
          >
            Browse Units
          </Link>
          <Link 
            to="/materials"
            style={{
              backgroundColor: "#e67e22",
              color: "white",
              padding: "15px 30px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "18px",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#d35400"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#e67e22"}
          >
            Study Materials
          </Link>
        </div>
      </div>
    </div>
  );
}
