import React, { useMemo } from "react";

function wordCount(text = "") {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

function hasNumberLike(text = "") {
  return /[\d%kK×xX]/.test(text || "");
}

export default function LivePreview({ data }) {
  const scoreData = useMemo(() => {
    const summaryWords = wordCount(data.summary);
    const projectsCount = (data.projects || []).filter(p => (p.name || p.desc || (p.bullets && p.bullets.some(Boolean)))).length;
    const experienceCount = (data.experience || []).filter(e => (e.company || e.role || (e.bullets && e.bullets.some(Boolean)))).length;
    const skillsCount = (data.skills || "").split(",").map(s=>s.trim()).filter(Boolean).length;
    const hasLink = !!((data.links || {}).github || (data.links || {}).linkedin);
    const educationComplete = (data.education || []).some(ed => ed.school && ed.degree && ed.year);

    let score = 0;
    if (summaryWords >= 40 && summaryWords <= 120) score += 15;
    if (projectsCount >= 2) score += 10;
    if (experienceCount >= 1) score += 10;
    if (skillsCount >= 8) score += 10;
    if (hasLink) score += 10;

    // any experience/project bullet contains number-like token
    const allBullets = [
      ...(data.experience || []).flatMap(e => e.bullets || []),
      ...(data.projects || []).flatMap(p => p.bullets || [])
    ];
    if (allBullets.some(b => hasNumberLike(b))) score += 15;
    if (educationComplete) score += 10;

    if (score > 100) score = 100;

    // suggestions
    const suggestions = [];
    if (summaryWords < 40 || summaryWords > 120) suggestions.push("Write a stronger summary (40–120 words).");
    if (projectsCount < 2) suggestions.push("Add at least 2 projects.");
    if (experienceCount < 1) suggestions.push("Add at least one experience entry.");
    if (skillsCount < 8) suggestions.push("Add more skills (target 8+).");
    if (!allBullets.some(b => hasNumberLike(b))) suggestions.push("Add measurable impact (numbers) in bullets.");
    if (!hasLink) suggestions.push("Add a GitHub or LinkedIn link.");
    if (!educationComplete && (data.education || []).length > 0) suggestions.push("Complete education fields (school, degree, year).");

    return { score, suggestions: suggestions.slice(0,3), details: { summaryWords, projectsCount, experienceCount, skillsCount, hasLink, educationComplete } };
  }, [data]);

  const { score, suggestions } = scoreData;

  const showSummary = (data.summary || "").trim().length > 0;
  const showExperience = (data.experience || []).some(e => e.company || e.role || (e.bullets && e.bullets.some(Boolean)));
  const showEducation = (data.education || []).some(ed => ed.school || ed.degree || ed.year);
  const showProjects = (data.projects || []).some(p => p.name || p.desc || (p.bullets && p.bullets.some(Boolean)));
  const showSkills = (data.skills || "").trim().length > 0;
  const showLinks = !!((data.links || {}).github || (data.links || {}).linkedin);

  const templateClass = (data.template || "Classic").toLowerCase();

  return (
    <div className={`preview-card template-${templateClass}`}>
      <div className="score-block">
        <label className="score-label">ATS Readiness Score</label>
        <div className="score-meter" aria-hidden>
          <div className="score-fill" style={{width: `${score}%`}} />
        </div>
        <div className="score-value">{score}/100</div>
        {suggestions.length > 0 && (
          <div className="improvements">
            <div style={{fontWeight:700,marginTop:10}}>Top 3 Improvements</div>
            <ul className="suggestions">
              {suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>

      <header className="preview-header">
        <h2>{data.personal.name || "Your Name"}</h2>
        <div className="meta">
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
        </div>
      </header>

      {showSummary && (
        <section className="preview-section">
          <h4>Summary</h4>
          <p>{data.summary}</p>
        </section>
      )}

      {showExperience && (
        <section className="preview-section">
          <h4>Experience</h4>
          {(data.experience || []).map((ex,i) => {
            if (!ex.company && !ex.role && !(ex.bullets && ex.bullets.some(Boolean))) return null;
            return (
              <div key={i} className="preview-item">
                <strong>{ex.role || ex.company}</strong>
                <div className="muted">{ex.company} {ex.years ? `• ${ex.years}` : ""}</div>
                <ul>
                  {(ex.bullets || []).filter(Boolean).map((b, bi) => <li key={bi}>{b}</li>)}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {showProjects && (
        <section className="preview-section">
          <h4>Projects</h4>
          {(data.projects || []).map((p,i) => {
            if (!p.name && !p.desc && !(p.bullets && p.bullets.some(Boolean))) return null;
            return (
              <div key={i} className="preview-item">
                <strong>{p.name}</strong>
                <div className="muted">{p.desc}</div>
                <ul>
                  {(p.bullets || []).filter(Boolean).map((b, bi) => <li key={bi}>{b}</li>)}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {showEducation && (
        <section className="preview-section">
          <h4>Education</h4>
          {(data.education || []).map((ed,i) => {
            if (!ed.school && !ed.degree && !ed.year) return null;
            return (
              <div key={i} className="preview-item">
                <strong>{ed.school}</strong>
                <div className="muted">{ed.degree} {ed.year ? `• ${ed.year}` : ""}</div>
              </div>
            );
          })}
        </section>
      )}

      {showSkills && (
        <section className="preview-section">
          <h4>Skills</h4>
          <p>{(data.skills || "").split(",").map(s=>s.trim()).filter(Boolean).join(", ")}</p>
        </section>
      )}

      {showLinks && (
        <section className="preview-section">
          <h4>Links</h4>
          <div className="links">
            {data.links.github && <div><a href={data.links.github} target="_blank" rel="noreferrer">GitHub</a></div>}
            {data.links.linkedin && <div><a href={data.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>}
          </div>
        </section>
      )}
    </div>
  );
}

