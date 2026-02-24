import React from "react";

export default function LivePreview({ data }) {
  return (
    <div className="preview-card">
      <header className="preview-header">
        <h2>{data.personal.name || "Your Name"}</h2>
        <div className="meta">
          <span>{data.personal.location}</span>
          <span>{data.personal.email}</span>
          <span>{data.personal.phone}</span>
        </div>
      </header>

      <section className="preview-section">
        <h4>Summary</h4>
        <p>{data.summary || "Summary will appear here."}</p>
      </section>

      <section className="preview-section">
        <h4>Experience</h4>
        {data.experience.length === 0 ? <p className="muted">No experience yet</p> : data.experience.map((ex,i)=>(
          <div key={i} className="preview-item">
            <strong>{ex.role || ex.company || "Role"}</strong>
            <div className="muted">{ex.company}</div>
          </div>
        ))}
      </section>

      <section className="preview-section">
        <h4>Education</h4>
        {data.education.length === 0 ? <p className="muted">No education yet</p> : data.education.map((ed,i)=>(
          <div key={i} className="preview-item">
            <strong>{ed.school || "School"}</strong>
            <div className="muted">{ed.degree}</div>
          </div>
        ))}
      </section>

      <section className="preview-section">
        <h4>Skills</h4>
        <p>{data.skills || "—"}</p>
      </section>
    </div>
  );
}

