import React, { useEffect, useState } from "react";
import LivePreview from "../partials/LivePreview";

const sample = {
  personal: { name: "Jane Doe", email: "jane@example.com", phone: "555-1234", location: "San Francisco, CA" },
  summary: "Product-focused engineering leader with 8+ years building delightful developer tools.",
  education: [{ school: "State University", degree: "B.S. Computer Science", year: "2016" }],
  experience: [{ company: "Acme Corp", role: "Senior Engineer", years: "2019–2024", bullets: ["Built features", "Led team"] }],
  projects: [{ name: "Project X", desc: "A tool for X", bullets: ["Achieved 2x growth"] }],
  skills: "React,Node.js,TypeScript,Testing",
  links: { github: "https://github.com/janedoe", linkedin: "https://linkedin.com/in/janedoe" }
};

export default function Builder() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("resumeBuilderData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore parse error
      }
    }
    return {
      personal: { name: "", email: "", phone: "", location: "" },
      summary: "",
      education: [],
      experience: [],
      projects: [],
      skills: "",
      links: { github: "", linkedin: "" }
    };
  });

  // autosave on every change
  useEffect(() => {
    try {
      localStorage.setItem("resumeBuilderData", JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  }, [data]);

  function loadSample() {
    setData(sample);
  }

  function addItem(section) {
    const defaults = {
      education: { school: "", degree: "", year: "" },
      experience: { company: "", role: "", years: "", bullets: [""] },
      projects: { name: "", desc: "", bullets: [""] }
    };
    setData(prev => ({ ...prev, [section]: [...prev[section], defaults[section]] }));
  }

  function updateArrayItem(section, index, field, value) {
    setData(prev => {
      const copy = { ...prev };
      copy[section] = copy[section].map((it, i) => i === index ? { ...it, [field]: value } : it);
      return copy;
    });
  }

  function updateBullet(section, index, bulletIndex, value) {
    setData(prev => {
      const copy = { ...prev };
      const item = { ...copy[section][index] };
      item.bullets = [...(item.bullets || [])];
      item.bullets[bulletIndex] = value;
      copy[section] = copy[section].map((it, i) => i === index ? item : it);
      return copy;
    });
  }

  function addBullet(section, index) {
    setData(prev => {
      const copy = { ...prev };
      const item = { ...copy[section][index] };
      item.bullets = [...(item.bullets || []), ""];
      copy[section] = copy[section].map((it, i) => i === index ? item : it);
      return copy;
    });
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
            <div key={i} className="edu-row">
              <input placeholder="School" value={ed.school || ""} onChange={e=>updateArrayItem("education", i, "school", e.target.value)} />
              <input placeholder="Degree" value={ed.degree || ""} onChange={e=>updateArrayItem("education", i, "degree", e.target.value)} />
              <input placeholder="Year" value={ed.year || ""} onChange={e=>updateArrayItem("education", i, "year", e.target.value)} />
            </div>
          ))}
          <button onClick={()=>addItem("education")}>Add Education</button>
        </div>

        <div className="form-section">
          <h3>Experience</h3>
          {data.experience.map((ex,i)=>(
            <div key={i} className="exp-row">
              <input placeholder="Company" value={ex.company || ""} onChange={e=>updateArrayItem("experience", i, "company", e.target.value)} />
              <input placeholder="Role" value={ex.role || ""} onChange={e=>updateArrayItem("experience", i, "role", e.target.value)} />
              <input placeholder="Years" value={ex.years || ""} onChange={e=>updateArrayItem("experience", i, "years", e.target.value)} />
              <div className="bullets">
                {(ex.bullets || []).map((b, bi) => (
                  <div key={bi} className="bullet-row">
                    <input placeholder="Bullet" value={b} onChange={e=>updateBullet("experience", i, bi, e.target.value)} />
                  </div>
                ))}
                <button onClick={()=>addBullet("experience", i)}>Add bullet</button>
              </div>
            </div>
          ))}
          <button onClick={()=>addItem("experience")}>Add Experience</button>
        </div>

        <div className="form-section">
          <h3>Projects</h3>
          {data.projects.map((p,i)=>(
            <div key={i} className="proj-row">
              <input placeholder="Project name" value={p.name || ""} onChange={e=>updateArrayItem("projects", i, "name", e.target.value)} />
              <input placeholder="Short description" value={p.desc || ""} onChange={e=>updateArrayItem("projects", i, "desc", e.target.value)} />
              <div className="bullets">
                {(p.bullets || []).map((b, bi) => (
                  <div key={bi} className="bullet-row">
                    <input placeholder="Bullet" value={b} onChange={e=>updateBullet("projects", i, bi, e.target.value)} />
                  </div>
                ))}
                <button onClick={()=>addBullet("projects", i)}>Add bullet</button>
              </div>
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

