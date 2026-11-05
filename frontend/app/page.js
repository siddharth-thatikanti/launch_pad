"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to send your message.");
      setStatus({ ok: true, text: "Thanks! Your message has been received." });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({ ok: false, text: error.message || "Could not connect to the API." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#"><b>L</b> LaunchPad</a>
        <div><a href="#features">Features</a><a href="#about">About</a><a className="pill" href="#contact">Contact us ↗</a></div>
      </nav>

      <section className="hero shell">
        <div>
          <small className="eyebrow">✳ SIMPLE. CLEAR. EFFECTIVE.</small>
          <h1>Turn your next<br/><em>big idea</em> into reality.</h1>
          <p className="lead">A simple starting point for teams and people building useful things. Share your idea with us and let's make it happen.</p>
          <a className="button" href="#contact">Get in touch ↗</a>
          <a className="plain" href="#features">Explore features ↓</a>
          <p className="trust">● Built for people who move ideas forward.</p>
        </div>
        <div className="art"><div className="orbit"></div><div className="mock">
          <small>YOUR NEXT MOVE　✳</small><h2>Make it<br/><em>meaningful.</em></h2>
          <hr/><small>IDEA → ACTION　　01 / 03</small>
        </div><span className="float">✦ Keep moving forward</span></div>
      </section>

      <section id="features" className="features"><div className="shell">
        <small className="eyebrow">WHAT WE VALUE</small><h2>Less noise. <em>More progress.</em></h2>
        <div className="cards">
          <article><i>✳</i><h3>Clarity first</h3><p>Simple communication and a clear direction turn complex ideas into achievable steps.</p></article>
          <article><i>↗</i><h3>Move with purpose</h3><p>Focus on meaningful outcomes, make thoughtful decisions, and keep making progress.</p></article>
          <article><i>◈</i><h3>Built together</h3><p>Great results come from listening, sharing context, and working toward a common goal.</p></article>
        </div>
      </div></section>

      <section id="about" className="about shell">
        <small className="eyebrow">A NOTE FROM US</small>
        <div><h2>Big things begin with a <em>conversation.</em></h2><p>Tell us what you're working on, what you need, or where you'd like to go next. We'll take it from there.</p></div>
        <a className="circle" href="#contact">↘</a>
      </section>

      <section id="contact" className="contact"><div className="shell contact-grid">
        <div><small className="eyebrow">LET'S CONNECT</small><h2>Have something<br/>in <em>mind?</em></h2><p>Send us a message. Fill in the form and we'll get back to you.</p><p>✉　hello@example.com</p></div>
        <form onSubmit={submit}>
          <label>Your name<input name="name" value={form.name} onChange={update} required minLength="2" maxLength="100" placeholder="Jane Smith"/></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={update} required maxLength="254" placeholder="jane@company.com"/></label>
          <label>How can we help?<textarea name="message" value={form.message} onChange={update} required minLength="5" maxLength="2000" rows="4" placeholder="Tell us about your idea..."/></label>
          <button className="button" disabled={busy}>{busy ? "Sending..." : "Send message ↗"}</button>
          {status && <p className={status.ok ? "success" : "error"} role="status">{status.text}</p>}
        </form>
      </div></section>

      <footer className="shell footer"><a className="brand" href="#"><b>L</b> LaunchPad</a><span>© {new Date().getFullYear()} LaunchPad. All rights reserved.</span><a href="#">Back to top ↑</a></footer>
    </main>
  );
}
