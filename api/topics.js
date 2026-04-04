const Anthropic = require('@anthropic-ai/sdk');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;
  const correct = process.env.DEPOSITION_PASSWORD || 'deposition';
  if (password !== correct) return res.status(401).json({ error: 'Unauthorized' });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Search for the most significant US political news from the past 7 days involving the Trump administration, executive actions, congressional activity, or major policy decisions. Return exactly 5 topics as a JSON array of objects with "label" (short button text, 3-6 words) and "prompt" (a detailed question about this event phrased as if asking Trump directly about his motivations and strategy, 1-2 sentences). Only return the JSON array, no other text. Example format: [{"label":"F-15 Shoot Down Over Yemen","prompt":"Walk me through the decision to shoot down the Houthi fighters. What does projecting force in the Strait of Hormuz actually give you right now?"}]`
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
