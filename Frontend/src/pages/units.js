import React, { useEffect, useState } from "react";
import { fetchJSON } from "../api";
import { Link } from "react-router-dom";

export default function Units() {
  const [units, setUnits] = useState([]);
  useEffect(() => {
    fetchJSON("/subjects/units/").then(setUnits).catch(console.error);
  }, []);
  return (
    <div>
      <h2>Units</h2>
      <ul>
        {units.map(u => (
          <li key={u.id}>
            <Link to={`/units/${u.id}`}>{u.title}</Link> — {u.code}
          </li>
        ))}
      </ul>
    </div>
  );
}
