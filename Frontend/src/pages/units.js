import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJSON } from "../api";

export default function Units() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJSON("/subjects/units/")
      .then(data => {
        setUnits(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching units:", err);
        setError("Failed to load units");
        setLoading(false);
      });
  }, []);

  const filteredUnits = units.filter(unit =>
    unit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (unit.description && unit.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        Loading units...
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
          CPA Study Units
        </h1>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: "30px" 
        }}>
          <input
            type="text"
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              border: "2px solid #e0e0e0",
              borderRadius: "25px",
              width: "400px",
              outline: "none",
              transition: "border-color 0.3s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3498db"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />
        </div>
      </div>

      {filteredUnits.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          color: "#7f8c8d",
          fontSize: "18px"
        }}>
          {searchTerm ? "No units found matching your search." : "No units available yet."}
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
          gap: "20px" 
        }}>
          {filteredUnits.map(unit => (
            <div 
              key={unit.id}
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
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start",
                marginBottom: "15px"
              }}>
                <h3 style={{ 
                  fontSize: "22px", 
                  color: "#2c3e50", 
                  margin: "0",
                  fontWeight: "500",
                  flex: "1"
                }}>
                  {unit.title}
                </h3>
                {unit.code && (
                  <span style={{
                    backgroundColor: "#3498db",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginLeft: "15px"
                  }}>
                    {unit.code}
                  </span>
                )}
              </div>
              
              {unit.description && (
                <p style={{ 
                  color: "#7f8c8d", 
                  marginBottom: "20px",
                  lineHeight: "1.5",
                  fontSize: "15px"
                }}>
                  {unit.description}
                </p>
              )}

              <div style={{ 
                display: "flex", 
                gap: "10px",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Link 
                  to={`/units/${unit.id}`}
                  style={{
                    backgroundColor: "#27ae60",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    transition: "background-color 0.3s",
                    fontSize: "14px",
                    flex: "1",
                    textAlign: "center"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#229954"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
                >
                  View Details
                </Link>
                <Link 
                  to={`/materials?unit=${unit.id}`}
                  style={{
                    backgroundColor: "#e67e22",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    transition: "background-color 0.3s",
                    fontSize: "14px",
                    flex: "1",
                    textAlign: "center"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#d35400"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#e67e22"}
                >
                  Materials
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: "40px",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px"
      }}>
        <p style={{ 
          color: "#7f8c8d", 
          fontSize: "16px",
          margin: "0"
        }}>
          Showing {filteredUnits.length} of {units.length} units
        </p>
      </div>
    </div>
  );
}
