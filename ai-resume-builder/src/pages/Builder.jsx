import React, { useState } from "react";
import LivePreview from "../partials/LivePreview";

const sample = {
  personal: { name: "Jane Doe", email: "jane@example.com", phone: "555-1234", location: "San Francisco, CA" },
  summary: "Product-focused engineering leader with 8+ years building delightful developer tools.",
  education: [{ school: "State University", degree: "B.S. Computer Science", year: "2016" }],
  experience: [{ company: "Acme Corp", role: "Senior Engineer", years: "2019–2024", bullets: ["Built features", "Led team"] }],
  projects: [{ name: "Project X", desc: "A tool for X" }],
  skills: "React,Node.js,TypeScript,Testing",
  links: { github: "https://github.com/janedoe", linkedin: "https://linkedin.com/in/janedoe" }
};

export default function Builder() {
  const [data, setData] = useState({
    personal: { name: "", email: "", phone: "", location: "" },
    summary: "",
    education: [],
    experience: [],
    projects: [],
    skills: "",
    links: { github: "", linkedin: "" }
  });

  function loadSample() {
    setData(sample);
  }

  function addItem(section) {
    setData(prev => ({ ...prev, [section]: [...prev[section], {}] }));
  }

  return (
    <div className="builder-grid container">
      <section className="left-col">
        <div className="form-section">
          <h3>Personal Info</h3>
          <input placeholder="Name" value={data.personal.name} onChange={e => setData({...data, personal:{...data.personal,name:e.target.value}})} />
          <input placeholder="Email" value={data.personal.email} onChange={e => setData({...data, personal:{...data.personal,email:e.target.value}})} />
          <input placeholder="Phone" value={data.personal.phone} onChange={e => setData({...data, personal:{...data.personal,phone:e.target.value}})} />
          <input placeholder="Location" value={data.personal.location} onChange={e => setData({...data, personal:{...data.personal,location:e.target.value}})} />
        </div>

        <div className="form-section">
          <h3>Summary</h3>
          <textarea value={data.summary} onChange={e=>setData({...data,summary:e.target.value})} />
        </div>

        <div className="form-section">
          <h3>Education</h3>
          {data.education.map((ed, i) => (
            <div key={i} className="mini-row">
              <input placeholder="School" />
              <input placeholder="Degree" />
            </div>
          ))}
          <button onClick={()=>addItem("education")}>Add Education</button>
        </div>

        <div className="form-section">
          <h3>Experience</h3>
          {data.experience.map((ex,i)=>(
            <div key={i} className="mini-row">
              <input placeholder="Company" />
              <input placeholder="Role" />
            </div>
          ))}
          <button onClick={()=>addItem("experience")}>Add Experience</button>
        </div>

        <div className="form-section">
          <h3>Projects</h3>
          {data.projects.map((p,i)=>(
            <div key={i} className="mini-row">
              <input placeholder="Project name" />
            </div>
          ))}
          <button onClick={()=>addItem("projects")}>Add Project</button>
        </div>

        <div className="form-section">
          <h3>Skills</h3>
          <input placeholder="Comma separated skills" value={data.skills} onChange={e=>setData({...data,skills:e.target.value})} />
        </div>

        <div className="form-section">
          <h3>Links</h3>
          <input placeholder="GitHub" value={data.links.github} onChange={e=>setData({...data,links:{...data.links,github:e.target.value}})} />
          <input placeholder="LinkedIn" value={data.links.linkedin} onChange={e=>setData({...data,links:{...data.links,linkedin:e.target.value}})} />
        </div>

        <div className="form-actions">
          <button onClick={loadSample}>Load Sample Data</button>
        </div>
      </section>

      <aside className="right-col">
        <LivePreview data={data} />
      </aside>
    </div>
  );
}

