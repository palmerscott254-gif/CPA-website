import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJSON } from "../api";

export default function Quizzes() {
  const [questionSets, setQuestionSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Note: You'll need to create an endpoint to list all question sets
    // For now, we'll show a placeholder
    setLoading(false);
    setQuestionSets([]);
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
        Loading quizzes...
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
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ 
          fontSize: "36px", 
          color: "#2c3e50", 
          marginBottom: "20px",
          textAlign: "center"
        }}>
          Practice Quizzes
        </h1>
        
        <p style={{ 
          fontSize: "18px", 
          color: "#7f8c8d", 
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto 30px"
        }}>
          Test your knowledge with our comprehensive quiz collection. 
          Practice questions cover all CPA exam topics.
        </p>
      </div>

      {questionSets.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 40px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>📝</div>
          <h3 style={{ 
            fontSize: "24px", 
            color: "#2c3e50", 
            marginBottom: "15px"
          }}>
            No Quizzes Available Yet
          </h3>
          <p style={{ 
            fontSize: "16px", 
            color: "#7f8c8d",
            marginBottom: "30px"
          }}>
            We're working on adding practice quizzes. Check back soon!
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            <Link 
              to="/units"
              style={{
                backgroundColor: "#3498db",
                color: "white",
                padding: "12px 24px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "16px",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#2980b9"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#3498db"}
            >
              Browse Units
            </Link>
            <Link 
              to="/materials"
              style={{
                backgroundColor: "#27ae60",
                color: "white",
                padding: "12px 24px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "16px",
                transition: "background-color 0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#229954"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
            >
              Study Materials
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
          gap: "20px" 
        }}>
          {questionSets.map(questionSet => (
            <div 
              key={questionSet.id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "25px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s"
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
                fontSize: "22px", 
                color: "#2c3e50", 
                marginBottom: "15px",
                fontWeight: "500"
              }}>
                {questionSet.title}
              </h3>
              
              {questionSet.description && (
                <p style={{ 
                  color: "#7f8c8d", 
                  marginBottom: "20px",
                  lineHeight: "1.5",
                  fontSize: "15px"
                }}>
                  {questionSet.description}
                </p>
              )}

              <div style={{ 
                marginBottom: "20px",
                fontSize: "14px",
                color: "#34495e"
              }}>
                <strong>Questions:</strong> {questionSet.questions?.length || 0}
              </div>

              <Link 
                to={`/quizzes/${questionSet.id}`}
                style={{
                  display: "block",
                  backgroundColor: "#e67e22",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  textAlign: "center",
                  fontSize: "16px",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#d35400"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#e67e22"}
              >
                Start Quiz →
              </Link>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: "40px",
        backgroundColor: "#e8f4fd",
        padding: "30px",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <h3 style={{ 
          fontSize: "24px", 
          color: "#2c3e50", 
          marginBottom: "15px"
        }}>
          Quiz Tips
        </h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "20px",
          textAlign: "left"
        }}>
          <div>
            <h4 style={{ color: "#2c3e50", marginBottom: "10px" }}>📚 Study First</h4>
            <p style={{ color: "#7f8c8d", fontSize: "14px", margin: "0" }}>
              Review the study materials before attempting quizzes for better results.
            </p>
          </div>
          <div>
            <h4 style={{ color: "#2c3e50", marginBottom: "10px" }}>⏱️ Time Management</h4>
            <p style={{ color: "#7f8c8d", fontSize: "14px", margin: "0" }}>
              Practice under timed conditions to simulate the real exam experience.
            </p>
          </div>
          <div>
            <h4 style={{ color: "#2c3e50", marginBottom: "10px" }}>🔄 Review Mistakes</h4>
            <p style={{ color: "#7f8c8d", fontSize: "14px", margin: "0" }}>
              Always review incorrect answers to understand the concepts better.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

