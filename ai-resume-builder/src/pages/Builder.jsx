import React, { useEffect, useState } from "react";
import LivePreview from "../partials/LivePreview";

const sample = {
  personal: { name: "Jane Doe", email: "jane@example.com", phone: "555-1234", location: "San Francisco, CA" },
  summary: "Product-focused engineering leader with 8+ years building delightful developer tools.",
  education: [{ school: "State University", degree: "B.S. Computer Science", year: "2016" }],
  experience: [{ company: "Acme Corp", role: "Senior Engineer", years: "2019–2024", bullets: ["Built features", "Led team"] }],
  projects: [
    { id: Date.now()+1, title: "Project X", desc: "A tool for X", tech: ["React","Node.js"], liveUrl: "", githubUrl: "", collapsed: false },
    { id: Date.now()+2, title: "Project Y", desc: "Another project", tech: ["GraphQL"], liveUrl: "", githubUrl: "", collapsed: false }
  ],
  skills: { technical: ["React","TypeScript"], soft: ["Team Leadership"], tools: ["Git","Docker"] },
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
      skills: { technical: [], soft: [], tools: [] },
    links: { github: "", linkedin: "" },
      template: "Classic"
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

  // local inputs for tag fields
  const [skillInput, setSkillInput] = React.useState({ technical: "", soft: "", tools: "" });
  const [suggestLoading, setSuggestLoading] = React.useState(false);

  function addSkill(category, skill) {
    if (!skill || !category) return;
    setData(prev => {
      const copy = { ...prev };
      copy.skills = { ...copy.skills };
      const list = Array.isArray(copy.skills[category]) ? copy.skills[category] : [];
      if (!list.includes(skill)) copy.skills[category] = [...list, skill];
      return copy;
    });
    setSkillInput(prev => ({ ...prev, [category]: "" }));
  }

  function removeSkill(category, index) {
    setData(prev => {
      const copy = { ...prev };
      copy.skills = { ...copy.skills };
      copy.skills[category] = (copy.skills[category] || []).filter((_, i) => i !== index);
      return copy;
    });
  }

  function suggestSkills() {
    setSuggestLoading(true);
    setTimeout(() => {
      setData(prev => {
        const copy = { ...prev };
        copy.skills = {
          technical: Array.from(new Set([...(copy.skills.technical || []), "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])),
          soft: Array.from(new Set([...(copy.skills.soft || []), "Team Leadership", "Problem Solving"])),
          tools: Array.from(new Set([...(copy.skills.tools || []), "Git", "Docker", "AWS"]))
        };
        return copy;
      });
      setSuggestLoading(false);
    }, 1000);
  }

  // template helper
  function setTemplate(t) {
    setData(prev => ({ ...prev, template: t }));
  }

  function loadSample() {
    setData(sample);
  }

  function addItem(section) {
    if (section === "projects") {
      const newProj = { id: Date.now(), title: "New Project", desc: "", tech: [], liveUrl: "", githubUrl: "", collapsed: false };
      setData(prev => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
      return;
    }
    const defaults = {
      education: { school: "", degree: "", year: "" },
      experience: { company: "", role: "", years: "", bullets: [""] }
    };
    setData(prev => ({ ...prev, [section]: [...prev[section], defaults[section]] }));
  }

  function updateProjectField(index, field, value) {
    setData(prev => {
      const copy = { ...prev };
      copy.projects = (copy.projects || []).map((p,i) => i === index ? { ...p, [field]: value } : p);
      return copy;
    });
  }

  function addProjectTech(index, tech) {
    if (!tech) return;
    setData(prev => {
      const copy = { ...prev };
      copy.projects = (copy.projects || []).map((p,i) => {
        if (i !== index) return p;
        const list = Array.isArray(p.tech) ? p.tech : [];
        return { ...p, tech: list.includes(tech) ? list : [...list, tech] };
      });
      return copy;
    });
  }

  function removeProjectTech(index, techIndex) {
    setData(prev => {
      const copy = { ...prev };
      copy.projects = (copy.projects || []).map((p,i) => {
        if (i !== index) return p;
        const list = (p.tech || []).filter((_,ti) => ti !== techIndex);
        return { ...p, tech: list };
      });
      return copy;
    });
  }

  function toggleProjectCollapse(index) {
    setData(prev => {
      const copy = { ...prev };
      copy.projects = (copy.projects || []).map((p,i) => i === index ? { ...p, collapsed: !p.collapsed } : p);
      return copy;
    });
  }

  function deleteProject(index) {
    setData(prev => ({ ...prev, projects: (prev.projects || []).filter((_,i) => i !== index) }));
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

  // small tag input component for tech stack
  function TechTagInput({ value = [], onAdd, onRemove }) {
    const [input, setInput] = React.useState("");
    return (
      <div>
        <div className="chips">
          {(value || []).map((t, i) => (
            <span key={i} className="chip">{t} <button onClick={()=>onRemove(i)} aria-label="remove">x</button></span>
          ))}
        </div>
        <input placeholder="Type & Enter to add" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if (e.key === "Enter") { e.preventDefault(); const v = input.trim(); if (v) { onAdd(v); setInput(""); } } }} />
      </div>
    );
  }

  return (
    <div className="builder-grid container">
      <div className="template-tabs" style={{gridColumn: "1 / -1", marginBottom: 12}}>
        <label className="tabs-label">Template:</label>
        {["Classic","Modern","Minimal"].map(t => (
          <button
            key={t}
            className={`tab ${data.template === t ? "active":""}`}
            onClick={()=>setTemplate(t)}
            style={{marginLeft:8}}
          >
            {t}
          </button>
        ))}
      </div>
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
                {(ex.bullets || []).map((b, bi) => {
                  const startsWithVerb = /^[\s]*((Built|Developed|Designed|Implemented|Led|Improved|Created|Optimized|Automated|Managed|Reduced|Increased|Delivered|Engineered)\b)/i.test(b || "");
                  const hasNumber = /[\d%kK×xX]/.test(b || "");
                  return (
                    <div key={bi} className="bullet-row">
                      <input placeholder="Bullet" value={b} onChange={e=>updateBullet("experience", i, bi, e.target.value)} />
                      <div className="hint">
                        {!startsWithVerb && (b || "").trim() !== "" && <span className="warn">Start with a strong action verb. </span>}
                        {!hasNumber && (b || "").trim() !== "" && <span className="info">Add measurable impact (numbers).</span>}
                      </div>
                    </div>
                  );
                })}
                <button onClick={()=>addBullet("experience", i)}>Add bullet</button>
              </div>
            </div>
          ))}
          <button onClick={()=>addItem("experience")}>Add Experience</button>
        </div>

        <div className="form-section">
          <h3>Projects</h3>
          <div className="projects-accordion">
            <button onClick={()=>addItem("projects")} className="tab">Add Project</button>
            {(data.projects || []).map((p,i)=> {
              const title = p.title || p.name || `Project ${i+1}`;
              const collapsed = !!p.collapsed;
              return (
                <div key={p.id || i} className="project-entry">
                  <div className="project-header" onClick={()=>toggleProjectCollapse(i)}>
                    <strong>{title}</strong>
                    <div>
                      <button className="tab" onClick={(e)=>{ e.stopPropagation(); deleteProject(i); }}>Delete</button>
                    </div>
                  </div>
                  {!collapsed && (
                    <div className="project-body">
                      <input placeholder="Project Title" value={p.title || p.name || ""} onChange={e=>updateProjectField(i, "title", e.target.value)} />
                      <textarea maxLength={200} placeholder="Description (max 200 chars)" value={p.desc || p.description || ""} onChange={e=>updateProjectField(i, "desc", e.target.value)} />
                      <div className="char-count">{(p.desc||p.description||"").length}/200</div>
                      <div className="form-section">
                        <label>Tech Stack</label>
                        <TechTagInput value={p.tech || p.stack || []} onAdd={(tech)=>addProjectTech(i, tech)} onRemove={(ti)=>removeProjectTech(i, ti)} />
                      </div>
                      <input placeholder="Live URL (optional)" value={p.liveUrl || p.live_url || ""} onChange={e=>updateProjectField(i, "liveUrl", e.target.value)} />
                      <input placeholder="GitHub URL (optional)" value={p.githubUrl || p.github_url || ""} onChange={e=>updateProjectField(i, "githubUrl", e.target.value)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="form-section">
          <h3>Skills</h3>
          <div className="skill-groups">
            {[
              {key:"technical", label:"Technical Skills"},
              {key:"soft", label:"Soft Skills"},
              {key:"tools", label:"Tools & Technologies"}
            ].map(group => (
              <div key={group.key} className="skill-group">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <strong>{group.label} ({(data.skills && data.skills[group.key] ? data.skills[group.key].length : 0)})</strong>
                </div>
                <div className="chips">
                  {(data.skills && data.skills[group.key] || []).map((s,si)=>(
                    <span key={si} className="chip">{s} <button onClick={()=>removeSkill(group.key, si)} aria-label="remove">x</button></span>
                  ))}
                </div>
                <input placeholder={`Add ${group.label}`} value={skillInput[group.key] || ""} onChange={e=>setSkillInput(prev=>({...prev,[group.key]:e.target.value}))}
                  onKeyDown={e=>{ if (e.key === "Enter") { e.preventDefault(); addSkill(group.key, (skillInput[group.key]||"").trim()); } }} />
              </div>
            ))}
            <div style={{marginTop:8}}>
              <button className="tab" onClick={suggestSkills} disabled={suggestLoading}>{suggestLoading ? "Suggesting..." : "✨ Suggest Skills"}</button>
            </div>
          </div>
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

