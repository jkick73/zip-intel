import { useState } from "react";

const CARD_CONFIG = [
  { key: "funFact", label: "Fun Fact", icon: "✦", color: "#F4C542" },
  { key: "population", label: "Population", icon: "◉", color: "#34D399" },
  { key: "medianAge", label: "Median Age", icon: "◷", color: "#FB923C" },
  { key: "medianHomePrice", label: "Median Home Price", icon: "⌂", color: "#4ECDC4" },
  { key: "medianSalary", label: "Median Salary", icon: "◈", color: "#FF6B6B" },
  { key: "topNewsStory", label: "Top News Story (Last 25 Years)", icon: "◎", color: "#A78BFA" },
];

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "60px 0" }}>
      <div style={{ width: "48px", height: "48px", border: "3px solid #333", borderTop: "3px solid #F4C542", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#888", fontFamily: "'DM Mono', monospace", fontSize: "13px", letterSpacing: "0.1em" }}>FETCHING DATA...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Card({ config, value, index, visible }) {
  return (
    <div style={{
      background: "#111", border: "1px solid #222", borderRadius: "2px",
      padding: "28px 32px", position: "relative", overflow: "hidden",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: config.color }} />
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <span style={{ fontSize: "18px", color: config.color, fontFamily: "'DM Mono', monospace" }}>{config.icon}</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em", color: "#555", textTransform: "uppercase" }}>{config.label}</span>
      </div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", lineHeight: "1.7", color: "#e8e8e8", margin: 0 }}>
        {value || "—"}
      </p>
    </div>
  );
}

export default function App() {
  const [zip, setZip] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");

  async function handleLookup() {
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    setError("");
    setData(null);
    setVisible(false);
    setLoading(true);

    try {
      // Calls our own serverless function — API key stays secret on the server
      const response = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Request failed");
      }

      const parsed = await response.json();
      setData(parsed);
      setLocationLabel(parsed.city || zip);
      setTimeout(() => setVisible(true), 50);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", fontFamily: "'DM Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus { outline: none; }
        ::selection { background: #F4C542; color: #000; }
        button:hover:not(:disabled) { background: #e6b800 !important; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1e1e", padding: "24px 40px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "8px", height: "8px", background: "#F4C542", borderRadius: "50%" }} />
        <span style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#555", textTransform: "uppercase" }}>ZIP · INTEL</span>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Title */}
        <div style={{ marginBottom: "56px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 16px", color: "#f0f0f0" }}>
            What's in your<br />
            <span style={{ color: "#F4C542", fontStyle: "italic" }}>ZIP code?</span>
          </h1>
          <p style={{ fontSize: "13px", color: "#555", letterSpacing: "0.08em", margin: 0, lineHeight: 1.8 }}>
            Enter any US ZIP code to instantly surface home prices,<br />
            income, population, local news history & a fun fact.
          </p>
        </div>

        {/* Input */}
        <div style={{ display: "flex", marginBottom: "48px", border: "1px solid #2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
          <input
            type="text"
            maxLength={5}
            placeholder="e.g. 10001"
            value={zip}
            onChange={e => setZip(e.target.value.replace(/\D/g, ""))}
            onKeyDown={e => e.key === "Enter" && handleLookup()}
            style={{ flex: 1, background: "#111", border: "none", padding: "18px 24px", fontSize: "22px", fontFamily: "'DM Mono', monospace", color: "#f0f0f0", letterSpacing: "0.15em" }}
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            style={{ background: loading ? "#222" : "#F4C542", color: loading ? "#555" : "#000", border: "none", padding: "18px 32px", fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s", whiteSpace: "nowrap", fontWeight: 500 }}
          >
            {loading ? "..." : "Look up →"}
          </button>
        </div>

        {error && <p style={{ color: "#FF6B6B", fontSize: "12px", letterSpacing: "0.1em", marginTop: "-36px", marginBottom: "32px" }}>{error}</p>}
        {loading && <Spinner />}

        {data && !loading && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
              <div style={{ height: "1px", flex: 1, background: "#1e1e1e" }} />
              <span style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#444", textTransform: "uppercase" }}>{locationLabel} · {zip}</span>
              <div style={{ height: "1px", flex: 1, background: "#1e1e1e" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {CARD_CONFIG.map((config, i) => (
                <Card key={config.key} config={config} value={data[config.key]} index={i} visible={visible} />
              ))}
            </div>

            <p style={{ fontSize: "10px", color: "#333", letterSpacing: "0.1em", textAlign: "center", marginTop: "40px", opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.6s" }}>
              DATA IS AI-ESTIMATED · FOR REFERENCE ONLY · NOT FINANCIAL ADVICE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
