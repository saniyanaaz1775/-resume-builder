import React, { useMemo } from "react";

function wordCount(text = "") {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

function hasNumberLike(text = "") {
  return /[\d%kK×xX]/.test(text || "");
}

export default function LivePreview({ data, onChange }) {
  const scoreData = useMemo(() => {
    // New ATS scoring rules (deterministic)
    const nameProvided = !!((data.personal || {}).name && (data.personal.name || "").trim());
    const emailProvided = !!((data.personal || {}).email && (data.personal.email || "").trim());
    const phoneProvided = !!((data.personal || {}).phone && (data.personal.phone || "").trim());

    const summaryText = (data.summary || "").trim();
    const summaryLong = summaryText.length > 50;
    const summaryHasVerb = /\b(built|led|designed|improved|implemented|created|developed|engineered|managed|optimized)\b/i.test(summaryText);

    const experienceWithBullets = (data.experience || []).filter(e => (e.bullets || []).filter(Boolean).length > 0).length;
    const educationCount = (data.education || []).filter(ed => (ed.school || ed.degree || ed.year)).length;
    let skillsCount = 0;
    if (!data.skills) skillsCount = 0;
    else if (typeof data.skills === "string") skillsCount = (data.skills || "").split(",").map(s=>s.trim()).filter(Boolean).length;
    else if (typeof data.skills === "object") skillsCount = Object.values(data.skills).flat().filter(Boolean).length;
    const projectsCount = (data.projects || []).filter(p => (p.title || p.name || p.desc)).length;
    const hasLinkedIn = !!((data.links || {}).linkedin);
    const hasGitHub = !!((data.links || {}).github);

    let score = 0;
    if (nameProvided) score += 10;
    if (emailProvided) score += 10;
    if (summaryLong) score += 10;
    if (experienceWithBullets >= 1) score += 15;
    if (educationCount >= 1) score += 10;
    if (skillsCount >= 5) score += 10;
    if (projectsCount >= 1) score += 10;
    if (phoneProvided) score += 5;
    if (hasLinkedIn) score += 5;
    if (hasGitHub) score += 5;
    if (summaryHasVerb) score += 10;

    if (score > 100) score = 100;

    // Build suggestions (show missing items with potential points)
    const suggestions = [];
    if (!nameProvided) suggestions.push({ text: "Add your name", points: 10 });
    if (!emailProvided) suggestions.push({ text: "Add a professional email", points: 10 });
    if (!summaryLong) suggestions.push({ text: "Write a longer professional summary (+10 points)", points: 10 });
    if (experienceWithBullets < 1) suggestions.push({ text: "Add an experience entry with bullets (+15 points)", points: 15 });
    if (educationCount < 1) suggestions.push({ text: "Add an education entry (+10 points)", points: 10 });
    if (skillsCount < 5) suggestions.push({ text: "Add more skills (target 5+) (+10 points)", points: 10 });
    if (projectsCount < 1) suggestions.push({ text: "Add at least one project (+10 points)", points: 10 });
    if (!phoneProvided) suggestions.push({ text: "Add a phone number (+5 points)", points: 5 });
    if (!hasLinkedIn) suggestions.push({ text: "Add a LinkedIn URL (+5 points)", points: 5 });
    if (!hasGitHub) suggestions.push({ text: "Add a GitHub URL (+5 points)", points: 5 });
    if (!summaryHasVerb && summaryText.length > 0) suggestions.push({ text: "Use action verbs in your summary (+10 points)", points: 10 });

    // Sort suggestions by points descending and take top 5
    suggestions.sort((a,b)=>b.points - a.points);
    const topSuggestions = suggestions.slice(0,5);

    return {
      score,
      suggestions: topSuggestions,
      details: { nameProvided, emailProvided, summaryLong, summaryHasVerb, experienceWithBullets, educationCount, skillsCount, projectsCount, phoneProvided, hasLinkedIn, hasGitHub }
    };
  }, [data]);

  const { score, suggestions } = scoreData;

  const showSummary = (data.summary || "").trim().length > 0;
  const showExperience = (data.experience || []).some(e => e.company || e.role || (e.bullets && e.bullets.some(Boolean)));
  const showEducation = (data.education || []).some(ed => ed.school || ed.degree || ed.year);
  const showProjects = (data.projects || []).some(p => p.name || p.desc || (p.bullets && p.bullets.some(Boolean)));
  let showSkills = false;
  let skillsGroups = { technical: [], soft: [], tools: [] };
  if (data.skills) {
    if (typeof data.skills === "string") {
      showSkills = (data.skills || "").trim().length > 0;
      skillsGroups.technical = (data.skills || "").split(",").map(s=>s.trim()).filter(Boolean);
    } else {
      skillsGroups.technical = data.skills.technical || [];
      skillsGroups.soft = data.skills.soft || [];
      skillsGroups.tools = data.skills.tools || [];
      showSkills = skillsGroups.technical.length + skillsGroups.soft.length + skillsGroups.tools.length > 0;
    }
  }
  const showLinks = !!((data.links || {}).github || (data.links || {}).linkedin);

  const templateClass = (data.template || "Classic").toLowerCase();
  const accent = data.color || 'hsl(168,60%,40%)';
  const templates = [
    { id: "Classic", label: "Classic" },
    { id: "Modern", label: "Modern" },
    { id: "Minimal", label: "Minimal" }
  ];
  const colors = [
    { id: "teal", label: "Teal", value: "hsl(168, 60%, 40%)" },
    { id: "navy", label: "Navy", value: "hsl(220, 60%, 35%)" },
    { id: "burgundy", label: "Burgundy", value: "hsl(345, 60%, 35%)" },
    { id: "forest", label: "Forest", value: "hsl(150, 50%, 30%)" },
    { id: "charcoal", label: "Charcoal", value: "hsl(0, 0%, 25%)" }
  ];

  function setTemplate(t) {
    if (onChange) onChange(prev => ({ ...prev, template: t }));
    else {
      // fallback: persist to localStorage
      try {
        const s = localStorage.getItem("resumeBuilderData");
        const obj = s ? JSON.parse(s) : {};
        obj.template = t;
        localStorage.setItem("resumeBuilderData", JSON.stringify(obj));
      } catch {}
    }
  }

  function setColor(v) {
    if (onChange) onChange(prev => ({ ...prev, color: v }));
    else {
      try {
        const s = localStorage.getItem("resumeBuilderData");
        const obj = s ? JSON.parse(s) : {};
        obj.color = v;
        localStorage.setItem("resumeBuilderData", JSON.stringify(obj));
      } catch {}
    }
  }

  return (
    <div className={`preview-card template-${templateClass}`} style={{["--accent"]: accent}}>
      <div className="template-picker">
        <div className="thumbnails">
          {templates.map(t => {
            const active = (data.template || "Classic") === t.id;
            return (
              <button key={t.id} className={`thumbnail ${active ? "active":""}`} onClick={()=>setTemplate(t.id)} aria-pressed={active}>
                <div className="thumb-sketch">
                  {t.id === "Classic" && (
                    <>
                      <div className="sketch-header"></div>
                      <div className="sketch-rule"></div>
                      <div className="sketch-lines">
                        <div></div><div></div><div></div>
                      </div>
                    </>
                  )}
                  {t.id === "Modern" && (
                    <>
                      <div className="sketch-modern">
                        <div className="sketch-sidebar" style={{background: accent}}></div>
                        <div className="sketch-main">
                          <div></div><div></div><div></div>
                        </div>
                      </div>
                    </>
                  )}
                  {t.id === "Minimal" && (
                    <>
                      <div className="sketch-minimal">
                        <div className="sketch-min-title"></div>
                        <div className="sketch-min-lines"><div></div><div></div></div>
                      </div>
                    </>
                  )}
                </div>
                {active && <div className="thumb-check">✓</div>}
                <div className="thumb-label">{t.label}</div>
              </button>
            );
          })}
        </div>
        <div className="color-picker">
          {colors.map(c => {
            const active = (data.color || accent) === c.value;
            return (
              <button key={c.id} className={`color-dot ${active ? "active":""}`} style={{background: c.value}} onClick={()=>setColor(c.value)} aria-label={c.label} />
            );
          })}
        </div>
      </div>
      <div className="score-block circular">
        <div className="score-circle" role="img" aria-label={`ATS score ${score} out of 100`}>
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="36" stroke="#eee" strokeWidth="8" fill="none" />
            <circle
              cx="44"
              cy="44"
              r="36"
              strokeWidth="8"
              strokeLinecap="round"
              stroke={score >= 71 ? "green" : score >= 41 ? "orange" : "red"}
              fill="none"
              strokeDasharray={2 * Math.PI * 36}
              strokeDashoffset={(1 - score / 100) * 2 * Math.PI * 36}
              transform="rotate(-90 44 44)"
            />
            <text x="44" y="48" textAnchor="middle" fontSize="12" fontWeight="700" fill="#111">{score}</text>
          </svg>
        </div>
        <div className="score-meta">
          <div className="score-label">ATS Readiness</div>
          <div className="score-status">{score <= 40 ? "Needs Work" : score <= 70 ? "Getting There" : "Strong Resume"}</div>
        </div>
        {suggestions.length > 0 && (
          <div className="improvements">
            <div style={{fontWeight:700,marginTop:10}}>Improvement suggestions</div>
            <ul className="suggestions">
              {suggestions.map((s, i) => <li key={i}>{s.text} {s.points ? `(+${s.points})` : ""}</li>)}
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
            const title = p.title || p.name;
            const desc = p.desc || p.description || "";
            const tech = p.tech || p.stack || [];
            if (!title && !desc && !(p.bullets && p.bullets.some(Boolean))) return null;
            return (
              <article key={p.id || i} className="project-card">
                <div className="project-head">
                  <strong>{title}</strong>
                  <div className="project-links">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" aria-label="Live link">🔗</a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub link">🐙</a>}
                  </div>
                </div>
                {desc && <div className="muted">{desc}</div>}
                { (tech || []).length > 0 && (
                  <div className="tech-pills">
                    {(tech || []).map((t,ti) => <span key={ti} className="chip">{t}</span>)}
                  </div>
                )}
                <ul>
                  {(p.bullets || []).filter(Boolean).map((b, bi) => <li key={bi}>{b}</li>)}
                </ul>
              </article>
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
          <div className="skill-preview-groups">
            {skillsGroups.technical.length > 0 && (
              <div>
                <strong>Technical Skills</strong>
                <div className="tech-pills">{skillsGroups.technical.map((s,i)=><span key={i} className="chip">{s}</span>)}</div>
              </div>
            )}
            {skillsGroups.soft.length > 0 && (
              <div>
                <strong>Soft Skills</strong>
                <div className="tech-pills">{skillsGroups.soft.map((s,i)=><span key={i} className="chip">{s}</span>)}</div>
              </div>
            )}
            {skillsGroups.tools.length > 0 && (
              <div>
                <strong>Tools & Technologies</strong>
                <div className="tech-pills">{skillsGroups.tools.map((s,i)=><span key={i} className="chip">{s}</span>)}</div>
              </div>
            )}
          </div>
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

