import { useEffect, useRef, useState } from 'react';
import Magnet from './components/Magnet.jsx';
import elloAnimation from '../waving hi ello.mp4';
import taskAnimation from '../ELLO X GMAIL AND CONNECTIONS.mp4';

function Brand() {
  return <a className="brand" href="/" aria-label="ZEYPHRA home">ZEYPHRA</a>;
}

function Header({ business, onBeta }) {
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef(null);
  const productsTriggerRef = useRef(null);

  useEffect(() => {
    if (!productsOpen) return undefined;
    const closeOnOutside = (event) => {
      if (!productsRef.current?.contains(event.target)) setProductsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setProductsOpen(false);
        productsTriggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOnOutside);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [productsOpen]);

  return <header className="topbar">
    <div className="topbar-inner">
      <Brand />
      <nav className="main-nav" aria-label="Main navigation">
        <a className={`nav-pill ${!business ? 'active' : ''}`} href="/#main" aria-current={!business ? 'page' : undefined}>ELLO</a>
        <a className={`nav-pill ${business ? 'active' : ''}`} href="/business.html" aria-current={business ? 'page' : undefined}>BUSINESS</a>
        <div className="nav-products" ref={productsRef}>
          <button ref={productsTriggerRef} className={`nav-pill products-trigger ${productsOpen ? 'active' : ''}`} type="button" aria-expanded={productsOpen} aria-controls="products-menu" onClick={() => setProductsOpen((isOpen) => !isOpen)}>
            PRODUCTS <svg aria-hidden="true" viewBox="0 0 12 12"><path d="m2.5 4.5 3.5 3 3.5-3" /></svg>
          </button>
          <div className="products-menu" id="products-menu" role="group" aria-label="Products" hidden={!productsOpen}>
            <a href="/#task-showcase-title" onClick={() => setProductsOpen(false)}>Goal-based help <span>↗</span></a>
            <a href="/#capabilities" onClick={() => setProductsOpen(false)}>Capabilities <span>↗</span></a>
          </div>
        </div>
      </nav>
      {business
        ? <a className="nav-cta" href="mailto:hello@zeyphra.com?subject=ZEYPHRA%20business%20inquiry">GET ELLO FOR BUSINESS <span aria-hidden="true">↗</span></a>
        : <button className="nav-cta" onClick={onBeta}>Join the beta <span aria-hidden="true">↗</span></button>}
    </div>
  </header>;
}

function ButtonLink({ children, onClick, href, light = false }) {
  const button = <span className={`button-link ${light ? 'button-light' : ''}`}>{children}<span aria-hidden="true">↗</span></span>;
  return <Magnet className="button-magnet">{href ? <a href={href}>{button}</a> : <button onClick={onClick}>{button}</button>}</Magnet>;
}

function BetaDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const successRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setSubmitted(false);
      dialog.showModal();
      requestAnimationFrame(() => nameRef.current?.focus());
    } else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (submitted) requestAnimationFrame(() => successRef.current?.focus());
  }, [submitted]);

  return <dialog ref={dialogRef} className="beta-dialog" aria-labelledby="dialog-title" onClose={onClose} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}>
    <button className="dialog-x" type="button" aria-label="Close" onClick={() => dialogRef.current?.close()}>×</button>
    {!submitted ? <>
      <p className="eyebrow">EARLY ACCESS · ELLO</p>
      <h2 id="dialog-title">Make room<br />in your day.</h2>
      <p className="dialog-intro">Leave your details and we’ll keep you in the loop as Ello gets ready.</p>
      <form className="beta-form" onSubmit={(event) => { event.preventDefault(); if (event.currentTarget.reportValidity()) setSubmitted(true); }}>
        <label htmlFor="signup-name">Your name</label>
        <input ref={nameRef} id="signup-name" name="name" autoComplete="name" placeholder="Alex Morgan" required />
        <label htmlFor="signup-email">Email address</label>
        <input id="signup-email" name="email" type="email" autoComplete="email" placeholder="alex@example.com" required />
        <button type="submit" className="button-link submit-link">Join the beta <span aria-hidden="true">↗</span></button>
        <p className="form-fineprint">Prototype only. Your details won’t be sent or saved.</p>
      </form>
    </> : <div ref={successRef} className="success-state" role="status" tabIndex="-1">
      <span className="success-check" aria-hidden="true">✓</span><p className="eyebrow">THANK YOU</p>
      <h2 id="dialog-title">You’re on<br />our radar.</h2><p className="dialog-intro">We appreciate your interest in Ello.</p>
      <button type="button" className="text-button" onClick={() => dialogRef.current?.close()}>Back to ZEYPHRA <span aria-hidden="true">→</span></button>
    </div>}
  </dialog>;
}

function Footer({ business, onBeta }) {
  return <footer className="footer">
    <div className="footer-top"><Brand /><p>Thoughtful agents.<br />A little more room for life.</p>
      <div className="footer-links"><a href="/">For you</a><a href="/business.html">For business</a><a href="mailto:hello@zeyphra.com">Contact</a>{!business && <button onClick={onBeta}>Join the beta</button>}</div>
    </div>
    <div className="footer-bottom"><span>© 2026 ZEYPHRA</span><span>Designed for people, with care.</span></div>
  </footer>;
}

function HeroAnimation() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      if (motionPreference.matches) {
        video.pause();
        return;
      }
      video.play().catch(() => {});
    };
    syncPlayback();
    motionPreference.addEventListener('change', syncPlayback);
    return () => {
      motionPreference.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, []);

  return <div className="hero-video-frame">
    <video ref={videoRef} className="hero-video" src={elloAnimation} muted loop playsInline preload="metadata" aria-hidden="true" />
  </div>;
}

function TaskAnimation() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      if (motionPreference.matches) {
        video.pause();
        return;
      }
      video.play().catch(() => {});
    };
    syncPlayback();
    motionPreference.addEventListener('change', syncPlayback);
    return () => {
      motionPreference.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, []);

  return <video ref={videoRef} className="task-showcase-video" src={taskAnimation} muted loop playsInline preload="metadata" aria-hidden="true" />;
}

function HomePage({ onBeta }) {
  return <>
    <Header onBeta={onBeta} />
    <main id="main">
      <section className="home-hero page-shell">
        <h1 className="hero-headline">A little helper who listens to you,<br className="headline-break" /> remembers what you like,<br className="headline-break" /> and gets things done for you.</h1>
        <div className="hero-visual"><HeroAnimation /></div>
      </section>

      <section className="task-showcase section-shell" aria-labelledby="task-showcase-title">
        <div className="task-showcase-media"><TaskAnimation /></div>
        <div className="task-showcase-copy">
          <p className="eyebrow">FROM A GOAL TO DONE</p>
          <h2 id="task-showcase-title">I can.</h2>
          <p>Give me a goal, and I’ll work through the steps to help get it done. I can book flights, plan trips, send emails, and take care of other tasks online.</p>
        </div>
      </section>

      <section className="capabilities-section" id="capabilities" aria-labelledby="capabilities-title">
        <div className="section-shell capabilities-layout">
          <div className="capabilities-intro"><p className="eyebrow">YOUR HELPER, READY</p><h2 id="capabilities-title">Give me a goal.<br /><em>I’ll give it a go.</em></h2><p className="capabilities-promise">Big job or little job, I’ll take it one step at a time. If it gets tricky, I’ll keep trying and ask you when I need a hand.</p></div>
          <div className="capabilities-list">
            <article><span>01</span><div><h3>Shop for you</h3><p>Tell me what you need. I can look around and help find it.</p></div></article>
            <article><span>02</span><div><h3>Plan a trip</h3><p>I can help plan your getaway, from the first idea to booking.</p></div></article>
            <article><span>03</span><div><h3>Make movie night easy</h3><p>I can find a movie and help book your tickets.</p></div></article>
            <article><span>04</span><div><h3>Keep an eye on prices</h3><p>I can watch for a price change and let you know.</p></div></article>
            <article><span>05</span><div><h3>Handle the boring bits</h3><p>Forms, hotel calls, customer service—I can help take those on, too.</p></div></article>
          </div>
        </div>
      </section>
    </main>
    <Footer onBeta={onBeta} />
  </>;
}

function WorkflowVisual() {
  return <div className="business-visual" role="img" aria-label="A workflow illustration: the team sets the process, an agent handles repeatable steps, and people make the final call.">
    <div className="biz-visual-top"><span>ONE WORKFLOW, THREE PARTS</span><span>ZEYPHRA / 01</span></div>
    <div className="workflow-track">
      <div className="workflow-item"><span className="workflow-count">01</span><span className="workflow-symbol human">P</span><div><b>Your team sets the context</b><small>People know the work best.</small></div><span className="workflow-role">PEOPLE</span></div>
      <span className="workflow-connector" />
      <div className="workflow-item agent"><span className="workflow-count">02</span><span className="workflow-symbol">e</span><div><b>An agent handles repeatable steps</b><small>Designed around your process.</small></div><span className="workflow-role">AGENT</span></div>
      <span className="workflow-connector" />
      <div className="workflow-item"><span className="workflow-count">03</span><span className="workflow-symbol review">✓</span><div><b>A person reviews what matters</b><small>Your team decides what’s next.</small></div><span className="workflow-role">REVIEW</span></div>
    </div>
    <div className="biz-visual-bottom"><span>SHAPED AROUND YOUR TEAM</span><span>HUMAN JUDGMENT INCLUDED</span></div>
  </div>;
}

function BusinessPage() {
  return <>
    <Header business />
    <main id="main">
      <section className="business-hero page-shell">
        <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot" /> ZEYPHRA FOR BUSINESS</p><h1>Good work<br />shouldn’t get<br /><span className="serif-line">lost in <em>busywork.</em></span></h1><p className="hero-description">ZEYPHRA builds custom AI agents around your company’s workflows, helping teams spend less time on repeatable steps and more time on the work that needs them.</p><div className="hero-cta-row"><ButtonLink href="mailto:hello@zeyphra.com?subject=ZEYPHRA%20business%20inquiry">Talk to ZEYPHRA</ButtonLink><a className="quiet-link" href="#approach">Our approach <span aria-hidden="true">↓</span></a></div><p className="quiet-proof"><span aria-hidden="true">✳</span> Grounded in the way your team already works.</p></div>
        <div className="hero-visual business-hero-visual"><WorkflowVisual /></div>
        <div className="hero-baseline"><span>CUSTOM AGENTS FOR COMPANY WORKFLOWS</span><span>SCROLL TO EXPLORE&nbsp; ↓</span></div>
      </section>
      <section className="business-statement"><div className="section-shell statement-grid"><div><p className="eyebrow">START WITH THE WORK</p><h2>Every team has a task<br />that keeps <em>coming back.</em></h2></div><div><p>It might be a handoff, a recurring request, or a chain of steps that interrupts deeper work. The right place to begin is with the people who know that process.</p><a className="quiet-link" href="#approach">See how we work together <span aria-hidden="true">↓</span></a></div></div></section>
      <section className="approach-section" id="approach"><div className="section-shell"><div className="approach-heading"><div><p className="eyebrow">A PRACTICAL, HUMAN APPROACH</p><h2>Designed with<br /><em>your team.</em></h2></div><p>We start by understanding the workflow, then shape an agent to support it—with people in the right places throughout.</p></div><div className="approach-list"><article><span>01</span><div><h3>Understand the work</h3><p>Talk with your team about the recurring process, handoffs, and decisions.</p></div><span className="approach-end">LISTEN</span></article><article><span>02</span><div><h3>Shape a useful agent</h3><p>Design a custom agent around the process and where human judgment belongs.</p></div><span className="approach-end">DESIGN</span></article><article><span>03</span><div><h3>Learn and refine</h3><p>Review how it fits your work and adjust the approach with your team.</p></div><span className="approach-end">REFINE</span></article></div></div></section>
      <section className="business-cta"><div className="section-shell business-cta-inner"><p className="eyebrow">A GOOD PLACE TO BEGIN</p><h2>What keeps coming<br />back to your team?</h2><p>Tell us a little about a workflow you’d like to make easier.</p><ButtonLink href="mailto:hello@zeyphra.com?subject=ZEYPHRA%20business%20inquiry" light>Start a conversation</ButtonLink></div></section>
    </main>
    <Footer business />
  </>;
}

export default function App() {
  const business = window.location.pathname.endsWith('business.html');
  const [betaOpen, setBetaOpen] = useState(false);
  return <><a className="skip-link" href="#main">Skip to content</a>{business ? <BusinessPage /> : <HomePage onBeta={() => setBetaOpen(true)} />}<BetaDialog open={betaOpen} onClose={() => setBetaOpen(false)} /></>;
}
