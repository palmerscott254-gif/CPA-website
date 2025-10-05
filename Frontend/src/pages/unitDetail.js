import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJSON, downloadFile } from "../api";

export default function UnitDetail() {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch unit details and materials
    Promise.all([
      fetchJSON(`/subjects/units/`).then(data => {
        const foundUnit = data.find(u => u.id === Number(id));
        if (!foundUnit) throw new Error("Unit not found");
        return foundUnit;
      }),
      fetchJSON(`/materials/?unit=${id}`)
    ])
    .then(([unitData, materialsData]) => {
      setUnit(unitData);
      setMaterials(materialsData);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching data:", err);
      setError("Failed to load unit details");
      setLoading(false);
    });
  }, [id]);

  const handleDownload = (material) => {
    const token = localStorage.getItem("access_token");
    downloadFile(`/materials/${material.id}/download/`, token)
      .catch(err => {
        alert("Download failed. Please make sure you're logged in.");
        console.error("Download error:", err);
      });
  };

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
        Loading unit details...
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "40px",
        color: "#e74c3c",
        fontSize: "18px"
      }}>
        {error || "Unit not found"}
        <div style={{ marginTop: "20px" }}>
          <Link 
            to="/units" 
            style={{
              backgroundColor: "#3498db",
              color: "white",
              padding: "10px 20px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "16px"
            }}
          >
            Back to Units
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "20px" }}>
        <Link 
          to="/units" 
          style={{ 
            color: "#3498db", 
            textDecoration: "none",
            fontSize: "14px"
          }}
        >
          ← Back to Units
        </Link>
      </div>

      {/* Unit Header */}
      <div style={{ 
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          marginBottom: "20px"
        }}>
          <div style={{ flex: "1" }}>
            <h1 style={{ 
              fontSize: "32px", 
              color: "#2c3e50", 
              marginBottom: "10px",
              fontWeight: "500"
            }}>
              {unit.title}
            </h1>
            {unit.code && (
              <span style={{
                backgroundColor: "#3498db",
                color: "white",
                padding: "6px 16px",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "500"
              }}>
                {unit.code}
              </span>
            )}
          </div>
        </div>
        
        {unit.description && (
          <p style={{ 
            color: "#7f8c8d", 
            fontSize: "18px",
            lineHeight: "1.6",
            margin: "0"
          }}>
            {unit.description}
          </p>
        )}
      </div>

      {/* Materials Section */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ 
          fontSize: "24px", 
          color: "#2c3e50", 
          marginBottom: "20px"
        }}>
          Study Materials ({materials.length})
        </h2>
        
        {materials.length === 0 ? (
          <div style={{ 
            backgroundColor: "#f8f9fa",
            padding: "40px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>📄</div>
            <h3 style={{ 
              fontSize: "20px", 
              color: "#2c3e50", 
              marginBottom: "10px"
            }}>
              No Materials Available
            </h3>
            <p style={{ color: "#7f8c8d", fontSize: "16px" }}>
              Study materials for this unit will be added soon.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "20px" 
          }}>
            {materials.map(material => (
              <div 
                key={material.id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                <h3 style={{ 
                  fontSize: "18px", 
                  color: "#2c3e50", 
                  marginBottom: "10px",
                  fontWeight: "500"
                }}>
                  {material.title}
                </h3>
                
                {material.description && (
                  <p style={{ 
                    color: "#7f8c8d", 
                    marginBottom: "15px",
                    lineHeight: "1.5",
                    fontSize: "14px"
                  }}>
                    {material.description}
                  </p>
                )}

                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  fontSize: "14px",
                  color: "#7f8c8d"
                }}>
                  <span>📥 {material.download_count} downloads</span>
                  <span>{new Date(material.upload_date).toLocaleDateString()}</span>
                </div>

                <button 
                  onClick={() => handleDownload(material)}
                  style={{
                    width: "100%",
                    backgroundColor: "#27ae60",
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: "4px",
                    border: "none",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "background-color 0.3s"
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#229954"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
                >
                  📥 Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: "flex", 
        gap: "20px",
        justifyContent: "center",
        marginTop: "40px"
      }}>
        <Link 
          to="/materials"
          style={{
            backgroundColor: "#e67e22",
            color: "white",
            padding: "12px 24px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "16px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#d35400"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#e67e22"}
        >
          Browse All Materials
        </Link>
        <Link 
          to="/quizzes"
          style={{
            backgroundColor: "#9b59b6",
            color: "white",
            padding: "12px 24px",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "16px",
            transition: "background-color 0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#8e44ad"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#9b59b6"}
        >
          Practice Quizzes
        </Link>
      </div>
    </div>
  );
}
