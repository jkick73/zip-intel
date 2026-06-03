// api/lookup.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { zip } = req.body;

  if (!zip || !/^\d{5}$/.test(zip)) {
    return res.status(400).json({ error: "Invalid ZIP code" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  console.log("Key present:", !!apiKey);
  console.log("Key length:", apiKey.length);
  console.log("Key prefix:", apiKey.substring(0, 14));

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey.trim(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `For ZIP code ${zip}, return ONLY a JSON object (no markdown, no explanation) with exactly these keys:
{
  "city": "City name and state abbreviation, e.g. 'Austin, TX'",
  "funFact": "One genuinely interesting, specific fun fact about this ZIP code or its city/neighborhood.",
  "population": "Approximate population of this ZIP code area, e.g. '32,400 residents (est. 2023)'",
  "medianAge": "Approximate median age of residents, e.g. '34.2 years'",
  "medianHomePrice": "Approximate current median home price, e.g. '$485,000 (as of 2024)'",
  "medianSalary": "Approximate median household income, e.g. '$72,400/year'",
  "topNewsStory": "The most significant news story tied to this ZIP or city in the last 25 years. Include year and 2-sentence summary."
}
Never return anything outside the JSON object.`,
          },
        ],
      }),
    });

    console.log("Anthropic status:", response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.log("Anthropic error body:", errText);
      return res.status(502).json({
        error: "Upstream API error",
        status: response.status,
        detail: errText,
      });
    }

    const data = await response.json();
    const raw = data.content?.map((b) => b.text || "").join("") || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Lookup error:", err.message);
    return res.status(500).json({ error: "Internal server error", detail: err.message });
  }
}