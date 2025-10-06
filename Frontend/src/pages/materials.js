import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchJSON, downloadFile } from "../api";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("downloads");
  const [searchParams] = useSearchParams();
  const unitFilter = searchParams.get("unit");

  useEffect(() => {
    let url = "/materials/";
    const params = new URLSearchParams();
    
    if (unitFilter) params.append("unit", unitFilter);
    if (searchTerm) params.append("search", searchTerm);
    if (sortBy) params.append("sort", sortBy);
    
    if (params.toString()) url += "?" + params.toString();

    fetchJSON(url)
      .then(data => {
        setMaterials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching materials:", err);
        setError("Failed to load materials");
        setLoading(false);
      });
  }, [unitFilter, searchTerm, sortBy]);

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
        Loading materials...
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
          Study Materials
        </h1>
        
        {unitFilter && (
          <div style={{ 
            textAlign: "center", 
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#e8f4fd",
            borderRadius: "4px",
            color: "#2c3e50"
          }}>
            Filtered by Unit ID: {unitFilter}
          </div>
        )}

        <div style={{ 
          display: "flex", 
          gap: "20px",
          justifyContent: "center", 
          marginBottom: "30px",
          flexWrap: "wrap"
        }}>
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              border: "2px solid #e0e0e0",
              borderRadius: "25px",
              width: "300px",
              outline: "none",
              transition: "border-color 0.3s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3498db"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              border: "2px solid #e0e0e0",
              borderRadius: "4px",
              outline: "none",
              backgroundColor: "white"
            }}
          >
            <option value="downloads">Sort by Downloads</option>
            <option value="title">Sort by Title</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
      </div>

      {materials.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          color: "#7f8c8d",
          fontSize: "18px"
        }}>
          {searchTerm ? "No materials found matching your search." : "No materials available yet."}
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
          gap: "20px" 
        }}>
          {materials.map(material => (
            <div 
              key={material.id}
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
                  fontSize: "20px", 
                  color: "#2c3e50", 
                  margin: "0",
                  fontWeight: "500",
                  flex: "1"
                }}>
                  {material.title}
                </h3>
                <span style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "500",
                  marginLeft: "15px"
                }}>
                  PDF
                </span>
              </div>
              
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

              {material.unit && (
                <div style={{ 
                  marginBottom: "15px",
                  fontSize: "14px",
                  color: "#34495e"
                }}>
                  <strong>Unit:</strong> {material.unit.title}
                  {material.unit.code && ` (${material.unit.code})`}
                </div>
              )}

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <div style={{ fontSize: "14px", color: "#7f8c8d" }}>
                  <span>📥 {material.download_count} downloads</span>
                </div>
                <div style={{ fontSize: "14px", color: "#7f8c8d" }}>
                  {new Date(material.upload_date).toLocaleDateString()}
                </div>
              </div>

              <button 
                onClick={() => handleDownload(material)}
                style={{
                  width: "100%",
                  backgroundColor: "#27ae60",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#229954"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}
              >
                📥 Download Material
              </button>
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
          Showing {materials.length} materials
        </p>
      </div>
    </div>
  );
}


