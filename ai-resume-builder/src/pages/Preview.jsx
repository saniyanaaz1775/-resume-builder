import React, { useEffect, useState } from "react";
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
      <article className="resume-print">
        <LivePreview data={data} />
      </article>
    </main>
  );
}

