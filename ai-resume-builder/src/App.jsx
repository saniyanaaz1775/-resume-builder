import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Preview from "./pages/Preview";
import Proof from "./pages/Proof";

export default function App() {
  return (
    <div className="app-root">
      <nav className="top-nav">
        <div className="nav-left">AI Resume Builder</div>
        <div className="nav-links">
          <Link to="/builder">Builder</Link>
          <Link to="/preview">Preview</Link>
          <Link to="/proof">Proof</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/proof" element={<Proof />} />
      </Routes>
    </div>
  );
}

