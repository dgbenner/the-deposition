const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;
  const input = (password || '').trim().toLowerCase();
  const active = (process.env.DEPOSITION_PASSWORD || 'deposition').split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
  const disabled = (process.env.DEPOSITION_DISABLED || '').split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
  if (disabled.includes(input)) return res.status(403).json({ error: 'Daily limit reached' });
  if (!active.includes(input)) return res.status(401).json({ error: 'Unauthorized' });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Search for 5 major US political news stories from the past 7 days about the Trump administration. Return ONLY a JSON array: [{"label":"Short Title","prompt":"Question about motivations"}]. No other text.`
      }],
    });

    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim();

    // Extract JSON array from response
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      res.status(200).json({ topics: JSON.parse(match[0]) });
    } else {
      res.status(200).json({ topics: [] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ topics: [] });
  }
};
