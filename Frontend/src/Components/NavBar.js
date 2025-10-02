import React from "react";
import { Link } from "react-router-dom";
export default function NavBar() {
  return (
    <nav style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
      <Link to="/" style={{ marginRight: 10 }}>CPA Academy</Link>
      <Link to="/units">Units</Link>
    </nav>
  );
}
