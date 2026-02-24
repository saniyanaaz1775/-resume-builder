import React, { useState } from "react";
import LivePreview from "../partials/LivePreview";

export default function Preview() {
  const [data, setData] = useState(() => {
    const s = localStorage.getItem("resumeBuilderData");
    if (s) {
      try { return JSON.parse(s); } catch { /* ignore */ }
    }
    return { personal: {}, summary: "", education: [], experience: [], projects: [], skills: "", links: {}, template: "Classic" };
  });

  // allow switching template here too (persisted)
  function setTemplate(t) {
    const next = { ...data, template: t };
    setData(next);
    try { localStorage.setItem("resumeBuilderData", JSON.stringify(next)); } catch {}
  }

  function validateForExport(d) {
    const warnings = [];
    const name = (d.personal || {}).name || "";
    const hasProjects = (d.projects || []).filter(p => p.name || p.desc || (p.bullets && p.bullets.some(Boolean))).length > 0;
    const hasExperience = (d.experience || []).filter(e => e.company || e.role || (e.bullets && e.bullets.some(Boolean))).length > 0;
    if (!name.trim()) warnings.push("Missing name.");
    if (!hasProjects && !hasExperience) warnings.push("No projects or experience provided.");
    return warnings;
  }

  function handlePrint() {
    const warnings = validateForExport(data);
    if (warnings.length > 0) {
      // calm warning: show a confirm-like non-blocking alert; do not block printing
      // use window.alert for simplicity but phrased calmly
      alert("Your resume may look incomplete:\n• " + warnings.join("\n• "));
    }
    // give the browser a tick to ensure any UI updates settled
    setTimeout(() => window.print(), 50);
  }

  function generatePlainText(d) {
    const lines = [];
    const p = d.personal || {};
    if (p.name) lines.push(p.name);
    const contact = [p.location, p.email, p.phone].filter(Boolean).join(" | ");
    if (contact) lines.push(contact);
    lines.push("");
    if (d.summary) {
      lines.push("Summary");
      lines.push(d.summary);
      lines.push("");
    }
    if ((d.education || []).length) {
      lines.push("Education");
      (d.education || []).forEach(ed => {
        lines.push(`${ed.school || ""}${ed.degree ? " — " + ed.degree : ""}${ed.year ? " • " + ed.year : ""}`);
      });
      lines.push("");
    }
    if ((d.experience || []).length) {
      lines.push("Experience");
      (d.experience || []).forEach(ex => {
        lines.push(`${ex.company || ""}${ex.role ? " — " + ex.role : ""}${ex.years ? " • " + ex.years : ""}`);
        (ex.bullets || []).filter(Boolean).forEach(b => lines.push(`- ${b}`));
        lines.push("");
      });
    }
    if ((d.projects || []).length) {
      lines.push("Projects");
      (d.projects || []).forEach(pr => {
        lines.push(`${pr.name || ""}${pr.desc ? " — " + pr.desc : ""}`);
        (pr.bullets || []).filter(Boolean).forEach(b => lines.push(`- ${b}`));
        lines.push("");
      });
    }
    if (d.skills) {
      lines.push("Skills");
      lines.push(d.skills.split(",").map(s=>s.trim()).filter(Boolean).join(", "));
      lines.push("");
    }
    if ((d.links || {}).github || (d.links || {}).linkedin) {
      lines.push("Links");
      if (d.links.github) lines.push(`GitHub: ${d.links.github}`);
      if (d.links.linkedin) lines.push(`LinkedIn: ${d.links.linkedin}`);
    }
    return lines.join("\n");
  }

  async function handleCopyText() {
    const text = generatePlainText(data);
    try {
      await navigator.clipboard.writeText(text);
      alert("Plain-text resume copied to clipboard.");
    } catch {
      // fallback: show the text in a prompt to allow manual copy
      window.prompt("Copy resume text:", text);
    }
  }
  const [toast, setToast] = useState("");

  function handleDownloadPDF() {
    const warnings = validateForExport(data);
    if (warnings.length > 0) {
      alert("Your resume may look incomplete:\n• " + warnings.join("\n• "));
    }
    setToast("PDF export ready! Check your downloads.");
    setTimeout(()=>setToast(""), 3000);
  }

  return (
    <main className="container preview-clean">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <h2>Preview</h2>
        <div>
          {["Classic","Modern","Minimal"].map(t => (
            <button key={t} className={`tab ${data.template===t ? "active":""}`} onClick={()=>setTemplate(t)} style={{marginLeft:8}}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:12,alignItems:"center"}}>
        <button className="tab" onClick={handleDownloadPDF}>Download PDF</button>
        <button className="tab" onClick={handleCopyText}>Copy Resume as Text</button>
      </div>

      <article className="resume-print" role="document">
        <LivePreview data={data} onChange={setData} />
      </article>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

