import React from "react";

export default function Preview() {
  return (
    <main className="container preview-clean">
      <article className="resume-print">
        <header>
          <h1>Your Name</h1>
          <p className="muted">Title • Location • Contact</p>
        </header>
        <section>
          <h3>Summary</h3>
          <p>Clean, typographic resume preview. No colors—black & white.</p>
        </section>
        <section>
          <h3>Experience</h3>
          <div className="resume-item">
            <strong>Company — Role</strong>
            <p className="muted">Dates</p>
            <ul>
              <li>Accomplishment 1</li>
            </ul>
          </div>
        </section>
      </article>
    </main>
  );
}

