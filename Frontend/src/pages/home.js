import React, { useEffect, useState } from "react";
import { fetchJSON } from "../api";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    fetchJSON("/subjects/").then(setSubjects).catch(console.error);
  }, []);
  return (
    <div>
      <h1>Welcome to CPA Academy</h1>
      <h2>Subjects</h2>
      <ul>
        {subjects.map(s => <li key={s.id}>{s.name}</li>)}
      </ul>
    </div>
  );
}
