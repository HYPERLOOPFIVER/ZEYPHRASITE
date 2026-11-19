import { useEffect, useRef, useState } from 'react';
import './business.css';

const businessTypeOptions = ['wholesaler', 'distributor', 'manufacturer', 'trader', 'other'];

function whatsappUrl(message) {
  const phone = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
  const query = encodeURIComponent(message);
  return phone ? `https://wa.me/${phone}?text=${query}` : `https://wa.me/?text=${query}`;
}

function TrialLink({ children = 'Try for ₹49/week', className = '' }) {
  return <a className={`biz-button biz-button-green ${className}`} href={whatsappUrl('Hi, I want to try Ello for Business. Please help me get started.')} target="_blank" rel="noreferrer">{children}<span aria-hidden="true">↗</span></a>;
}

function BusinessHeader({ onDemo }) {
  return <header className="biz-header">
    <div className="biz-header-inner">
      <a className="biz-brand" href="/business.html" aria-label="Ello for Business by Zeyphra home"><span>ello</span><small>for business · by zeyphra</small></a>
      <nav className="biz-nav" aria-label="Main navigation">
        <a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a>
      </nav>
      <div className="biz-header-actions"><TrialLink className="biz-header-trial" /><button className="biz-button biz-button-quiet" type="button" onClick={onDemo}>Book a free demo</button></div>
    </div>
  </header>;
}

function DemoDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [fallbackLink, setFallbackLink] = useState(whatsappUrl('Hi, I’d like to book a free Ello for Business demo.'));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setStatus('idle');
      setError('');
      dialog.showModal();
    } else if (!open && dialog.open) dialog.close();
  }, [open]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lead = {
      name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      businessType: String(data.get('businessType') || ''),
      debtorAccounts: Number(data.get('debtorAccounts')),
    };
    const website = String(data.get('companyWebsite') || '').trim();
    const message = `Hi, I’d like to book a free Ello for Business demo. Name: ${lead.name}. Phone: ${lead.phone}. Business type: ${lead.businessType}. Debtor accounts: ${lead.debtorAccounts}.`;
    const completeFallbackLink = whatsappUrl(message);
    setFallbackLink(completeFallbackLink);

    const endpoint = import.meta.env.VITE_DEMO_ENDPOINT;
    if (!endpoint) {
      setStatus('redirecting');
      window.location.assign(completeFallbackLink);
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, website }),
      });
      if (!response.ok) throw new Error('Your request could not be saved. Please try WhatsApp instead.');
      setStatus('success');
    } catch {
      setError('We couldn’t send that just now. You can send the same details on WhatsApp instead.');
      setStatus('error');
    }
  }

  return <dialog ref={dialogRef} className="biz-dialog" aria-labelledby="demo-title" onClose={onClose} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}>
    <button className="biz-dialog-close" type="button" aria-label="Close demo form" onClick={() => dialogRef.current?.close()}>×</button>
    {status === 'success' ? <div className="biz-dialog-success" role="status" tabIndex="-1"><span className="biz-success-mark" aria-hidden="true">✓</span><p className="biz-eyebrow">REQUEST RECEIVED</p><h2 id="demo-title">We’ll be in touch.</h2><p>Your demo request has been saved.</p><button type="button" className="biz-text-button" onClick={() => dialogRef.current?.close()}>Back to Ello</button></div> : <>
      <p className="biz-eyebrow">BOOK A FREE DEMO</p><h2 id="demo-title">Let’s talk about your debtors.</h2><p className="biz-dialog-intro">Share a few details. We’ll show you how Ello can fit your business.</p>
      <form className="biz-form" onSubmit={handleSubmit}>
        <label htmlFor="demo-name">Your name</label><input id="demo-name" name="name" autoComplete="name" required maxLength="100" />
        <label htmlFor="demo-phone">Phone number</label><input id="demo-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength="32" />
        <label htmlFor="demo-business-type">Business type</label><select id="demo-business-type" name="businessType" required defaultValue=""><option value="" disabled>Select one</option>{businessTypeOptions.map((option) => <option key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>)}</select>
        <label htmlFor="demo-debtors">Number of debtor accounts</label><input id="demo-debtors" name="debtorAccounts" type="number" inputMode="numeric" min="1" step="1" required />
        <div className="biz-honeypot" aria-hidden="true"><label htmlFor="demo-website">Leave this blank</label><input id="demo-website" name="companyWebsite" tabIndex="-1" autoComplete="off" /></div>
        <label className="biz-consent"><input type="checkbox" name="consent" required /><span>I agree to be contacted about this demo request. If no form endpoint is configured, my details will be prefilled in WhatsApp for me to send.</span></label>
        {error && <p className="biz-form-error" role="alert">{error} <a href={fallbackLink} target="_blank" rel="noreferrer">Open WhatsApp with your details</a>.</p>}
        {status === 'redirecting' ? <p className="biz-form-note" role="status">Opening WhatsApp with your details…</p> : <button className="biz-button biz-button-green biz-form-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Request my demo'}<span aria-hidden="true">↗</span></button>}
        <p className="biz-form-note">Your details are used to respond to this request.</p>
      </form>
    </>}
  </dialog>;
}

function PaymentStory() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.22 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`biz-chat ${visible ? 'biz-chat-visible' : ''}`} aria-label="Illustrative follow-up conversation showing a payment promise, another reminder, and payment received">
    <div className="biz-chat-head"><span className="biz-chat-avatar">e</span><span><b>Ello</b><small>Invoice follow-up · Example</small></span><i aria-hidden="true" /></div>
    <div className="biz-chat-body" aria-hidden="true">
      <p className="biz-chat-day">MONDAY</p>
      <div className="biz-bubble biz-bubble-agent">Hello. Just checking in on the invoice due. When can we expect payment?</div>
      <div className="biz-bubble biz-bubble-debtor">I’ll pay Friday.</div>
      <p className="biz-chat-day">FRIDAY · PROMISE MISSED</p>
      <div className="biz-bubble biz-bubble-agent">You said Friday. Can you share an update on the payment?</div>
      <div className="biz-bubble biz-bubble-paid"><span aria-hidden="true">✓</span> ₹ received</div>
    </div>
    <p className="biz-chat-caption">An illustrative example. Every debtor and outcome is different.</p>
  </div>;
}

function BusinessFooter() {
  const wa = whatsappUrl('Hi, I’d like to know more about Ello for Business.');
  return <footer className="biz-footer">
    <div className="biz-footer-main"><a className="biz-brand biz-footer-brand" href="/business.html"><span>ello</span><small>for business · by zeyphra</small></a><div className="biz-footer-links"><a href="mailto:hello@zeyphra.com">hello@zeyphra.com</a><a href={wa} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a><a href="#top">Back to top ↑</a></div></div>
    <p className="biz-legal">Follow-ups and notices handled through registered partner advocates. We never harass, threaten or misrepresent.</p>
    <div className="biz-footer-bottom"><span>© {new Date().getFullYear()} Zeyphra</span><a href="https://odr.msme.gov.in/" target="_blank" rel="noreferrer">MSME ODR portal ↗</a></div>
  </footer>;
}

const faqItems = [
  { question: 'Is this legal?', answer: 'Yes. Ello does polite, persistent follow-ups, and formal action goes only through licensed advocates. No threats, no harassment, ever.' },
  { question: 'Which channels does it use?', answer: 'WhatsApp, phone calls and email, from numbers and templates registered for business use.' },
  { question: 'Will it work for my business?', answer: 'If you sell on credit to other businesses—wholesale, distribution, manufacturing or trading—yes. MSME legal escalation is available only where the supplier and claim meet the applicable eligibility requirements.' },
  { question: 'What do I need to start?', answer: 'Your invoice list and debtor phone numbers. That’s it.' },
  { question: 'How is this different from just hiring a recovery agent?', answer: 'A human follows up when they remember. Ello follows up every day, never forgets a promise, and costs less than one person’s monthly salary.' },
];

export default function BusinessLanding() {
  const [demoOpen, setDemoOpen] = useState(false);
  const wa = whatsappUrl('Hi, I’d like to know if Ello can help with my overdue invoices.');
  return <div className="biz-site" id="top">
    <BusinessHeader onDemo={() => setDemoOpen(true)} />
    <main>
      <section className="biz-hero">
        <div className="biz-wrap biz-hero-grid">
          <div className="biz-hero-copy">
            <p className="biz-eyebrow"><span /> ELLO FOR BUSINESS · BY ZEYPHRA</p>
            <h1>You sell.<br /><em>Ello collects.</em></h1>
            <p className="biz-hero-subline">Your 24/7 AI agent that chases every unpaid invoice on WhatsApp, calls and email, so your team stops chasing money and starts making it.</p>
            <div className="biz-hero-actions"><TrialLink /><button className="biz-button biz-button-outline" type="button" onClick={() => setDemoOpen(true)}>Book a free demo <span aria-hidden="true">↗</span></button></div>
            <p className="biz-pain-line"><b>₹20 crore stuck across 200 retailers for two years.</b> Margins too thin for lawyers. Staff wasting hours on fake promises. Defaulters blocking your number. Sound familiar?</p>
            <p className="biz-example-note">A business scenario, not a customer result.</p>
          </div>
          <div className="biz-hero-visual" role="img" aria-label="Illustrative debtor ledger, showing an example of follow-ups, tracked promises and advocate escalation">
            <div className="biz-ledger-top"><span>YOUR DEBTORS DESK</span><span className="biz-live-dot">ALWAYS ON</span></div>
            <div className="biz-ledger-total"><span>ILLUSTRATIVE OUTSTANDING</span><strong>₹20<span>cr</span></strong><small>across 200 retailer accounts</small></div>
            <div className="biz-ledger-row"><span className="biz-ledger-mark">↗</span><div><b>Follow-ups</b><small>WhatsApp · calls · email</small></div><strong>Every day</strong></div>
            <div className="biz-ledger-row"><span className="biz-ledger-mark">↻</span><div><b>Promises</b><small>Logged and checked again</small></div><strong>Never lost</strong></div>
            <div className="biz-ledger-row"><span className="biz-ledger-mark">§</span><div><b>Escalation</b><small>Reviewed with partner advocates</small></div><strong>When needed</strong></div>
            <div className="biz-ledger-foot"><span>UDHAAR YAAD RAHEGA</span><span>ELLO / BUSINESS</span></div>
          </div>
        </div>
      </section>

      <section className="biz-problem biz-section">
        <div className="biz-wrap">
          <p className="biz-eyebrow">THE COST OF CHASING</p>
          <h2>Your best people are spending<br className="biz-desktop-only" /> their day chasing your worst payers.</h2>
          <div className="biz-pain-grid">
            <article><span>01</span><h3>30+ debtors, one of you.</h3><p>No human can follow up every day, remember every promise, and stay polite doing it.</p></article>
            <article><span>02</span><h3>Fake promises compound.</h3><p>“Next week” never arrives, and no one re-opens it.</p></article>
            <article><span>03</span><h3>Legal help costs more than the margin.</h3><p>So chronic defaulters stay unchased.</p></article>
          </div>
        </div>
      </section>

      <section className="biz-how biz-section" id="how">
        <div className="biz-wrap">
          <div className="biz-section-heading"><div><p className="biz-eyebrow">FROM INVOICE TO FOLLOW-UP</p><h2>Simple to start.<br /><em>Hard to forget.</em></h2></div><p>Udhaar yaad rahega. Every invoice gets a next step, and every promise gets remembered.</p></div>
          <div className="biz-how-grid">
            <ol className="biz-steps">
              <li><span>01</span><div><h3>Connect</h3><p>Share your debtor accounts and invoice list. Five minutes, no software to install.</p></div></li>
              <li><span>02</span><div><h3>Follow up</h3><p>Ello follows up every single day on WhatsApp, calls and email. Every invoice, one day old or a thousand days old.</p></div></li>
              <li><span>03</span><div><h3>Track promises</h3><p>Every “I’ll pay Friday” is logged. If Friday passes, Ello opens the file again automatically.</p></div></li>
              <li><span>04</span><div><h3>Escalate</h3><p>A chronic defaulter can go to partner advocates for a formal legal notice and, where eligible, an MSME ODR filing.</p></div></li>
            </ol>
            <PaymentStory />
          </div>
          <div className="biz-law-note"><strong className="biz-law-number">45<small>days</small></strong><p><strong>For eligible micro and small suppliers:</strong> agreed payment terms are capped by law at 45 days. Delayed payments may attract compound interest with monthly rests at three times the RBI bank rate. MSME ODR filings depend on eligibility and review by partner advocates.</p></div>
        </div>
      </section>

      <section className="biz-pricing biz-section" id="pricing">
        <div className="biz-wrap">
          <p className="biz-eyebrow">ONE DEBTORS DESK · ALL YOUR INVOICES</p><h2>Start at <span>₹49.</span><br />Recover lakhs.</h2>
          <p className="biz-pricing-intro">A recurring monthly subscription to manage all your debtors—not a one-time collection service.</p>
          <div className="biz-price-ladder">
            <article className="biz-price-step biz-price-trial"><span className="biz-price-index">STEP 1 · TRY IT</span><p>Week 1</p><strong>₹49<small>/week</small></strong><span className="biz-price-caption">Try it. See the replies come in.</span><TrialLink className="biz-price-link">Try for ₹49/week</TrialLink></article>
            <article className="biz-price-step biz-price-month"><span className="biz-price-index">STEP 2 · GO SERIOUS</span><p>First month</p><strong>₹999</strong><span className="biz-price-caption">Go serious for one month.</span><button type="button" className="biz-price-link biz-price-link-muted" onClick={() => setDemoOpen(true)}>Book a free demo ↗</button></article>
            <article className="biz-price-step biz-price-ongoing"><span className="biz-price-index">STEP 3 · KEEP GOING</span><p>After that</p><strong>₹3,799<small>/month</small></strong><span className="biz-price-caption">Your debtors desk, managed forever.</span><button type="button" className="biz-price-link biz-price-link-muted" onClick={() => setDemoOpen(true)}>Talk to us ↗</button></article>
          </div>
          <p className="biz-price-footnote">Manage invoices old and new under one monthly subscription.</p>
        </div>
      </section>

      <section className="biz-retention biz-section">
        <div className="biz-wrap biz-retention-grid"><p className="biz-eyebrow">WHY BUSINESSES STAY</p><div><h2>Your debtor memory<br /><em>lives here.</em></h2><p>Every promise, every follow-up, every reply log, every payment note sits in your Ello account. Switching means starting your debtor history from zero. Nobody does.</p></div><div className="biz-memory-strip"><span>Promise noted</span><i>→</i><span>Follow-up sent</span><i>→</i><span>Payment logged</span></div></div>
      </section>

      <section className="biz-faq biz-section" id="faq">
        <div className="biz-wrap biz-faq-grid"><div><p className="biz-eyebrow">STRAIGHT ANSWERS</p><h2>Good questions.<br /><em>Clear answers.</em></h2></div><div className="biz-faq-list">{faqItems.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div>
      </section>

      <section className="biz-final-cta"><div className="biz-wrap biz-final-inner"><p className="biz-eyebrow">YOU MADE THE SALE. LET ELLO HANDLE THE FOLLOW-UP.</p><h2>Your ₹20 crore is waiting.<br /><em>Start for ₹49.</em></h2><TrialLink /></div></section>
    </main>
    <BusinessFooter />
    <DemoDialog open={demoOpen} onClose={() => setDemoOpen(false)} />
  </div>;
}
