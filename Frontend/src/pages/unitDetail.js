import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJSON, downloadFile } from "../api";

export default function UnitDetail() {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    // fetch unit detail (we'll use /subjects/units/ endpoint for listing)
    fetchJSON(`/subjects/units/?id=${id}`).then(data => {
      // If API doesn't return single item, instead fetch units list and pick
      if (Array.isArray(data) && data.length) {
        setUnit(data.find(u => u.id === Number(id)) || data[0]);
      } else {
        setUnit(data);
      }
    }).catch(() => {});
    fetchJSON(`/materials/?unit=${id}`).then(setMaterials).catch(console.error);
  }, [id]);

  const handleDownload = (mat) => {
    const token = localStorage.getItem("access_token");
    downloadFile(`/materials/${mat.id}/download/`, token).catch(err => alert("Download failed"));
  };

  if (!unit) return <div>Loading...</div>;
  return (
    <div>
      <h2>{unit.title}</h2>
      <p>{unit.description}</p>
      <h3>Materials</h3>
      <ul>
        {materials.map(m => (
          <li key={m.id}>
            <strong>{m.title}</strong> — downloads: {m.download_count} —{" "}
            <button onClick={() => handleDownload(m)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
