// api/lookup.js
// This runs on Vercel's servers — your API key is never exposed to the browser.

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { zip } = req.body;

  // Validate ZIP code
  if (!zip || !/^\d{5}$/.test(zip)) {
    return res.status(400).json({ error: "Invalid ZIP code" });
  }

  // API key lives only in Vercel environment variables — never in frontend code
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `For ZIP code ${zip}, return ONLY a JSON object (no markdown, no explanation) with exactly these keys:
{
  "city": "City name and state abbreviation, e.g. 'Austin, TX'",
  "funFact": "One genuinely interesting, specific fun fact about this ZIP code or its city/neighborhood. Make it surprising and local.",
  "population": "Approximate population of this ZIP code area, formatted with commas and a note on recency, e.g. '32,400 residents (est. 2023)'",
  "medianAge": "Approximate median age of residents in this ZIP code, e.g. '34.2 years'",
  "medianHomePrice": "Approximate current median home price in this ZIP code, formatted as a dollar figure with context, e.g. '$485,000 (as of 2024)'",
  "medianSalary": "Approximate median household income for this ZIP code, formatted as a dollar figure, e.g. '$72,400/year'",
  "topNewsStory": "The single most significant or memorable news story originating from or closely tied to this ZIP code or city over the last 25 years (2000-2025). Be specific: include year and a 2-sentence summary."
}
If the ZIP code doesn't exist or you're unsure, still return the JSON with your best estimate and note uncertainty in the relevant fields. Never return anything outside the JSON object.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: "Upstream API error", detail: err });
    }

    const data = await response.json();
    const raw = data.content?.map((b) => b.text || "").join("") || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Lookup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
