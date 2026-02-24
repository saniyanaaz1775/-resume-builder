import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="container centered">
      <h1 className="headline">Build a Resume That Gets Read.</h1>
      <p className="sub">A premium, calm editor to craft resumes that stand out to humans.</p>
      <Link className="cta" to="/builder">Start Building</Link>
    </main>
  );
}

