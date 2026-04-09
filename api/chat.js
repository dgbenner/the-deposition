const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Load shared preamble and subject profiles
const promptDir = path.join(__dirname, 'prompts');
const subjectsDir = path.join(__dirname, '..', 'subjects');
const PREAMBLE = fs.existsSync(path.join(promptDir, 'preamble.txt'))
  ? fs.readFileSync(path.join(promptDir, 'preamble.txt'), 'utf8')
  : '';

// Legacy per-subject prompts (Trump has a custom one)
const CUSTOM_PROMPTS = {};
['trump'].forEach(name => {
  const file = path.join(promptDir, name + '.txt');
  if (fs.existsSync(file)) CUSTOM_PROMPTS[name] = fs.readFileSync(file, 'utf8');
});

// Build prompt: custom if available, otherwise preamble + .md profile
function getPrompt(subject) {
  if (CUSTOM_PROMPTS[subject]) return CUSTOM_PROMPTS[subject];
  const mdFile = path.join(subjectsDir, subject + '.md');
  if (fs.existsSync(mdFile)) {
    return PREAMBLE + fs.readFileSync(mdFile, 'utf8');
  }
  return CUSTOM_PROMPTS['trump'] || PREAMBLE;
}


module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, mode, password, largeText, profile, subject } = req.body;
  const SYSTEM_PROMPT = getPrompt(subject || 'trump');
  const input = (password || '').trim().toLowerCase();
  const active = (process.env.DEPOSITION_PASSWORD || 'deposition').split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
  const disabled = (process.env.DEPOSITION_DISABLED || '').split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
  if (disabled.includes(input)) return res.status(403).json({ error: 'Daily limit reached' });
  if (!active.includes(input)) return res.status(401).json({ error: 'Unauthorized' });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const brevity = largeText ? ' Respond very briefly — two to three sentences maximum.' : '';

  const processed = messages.map((m, i) =>
    i === messages.length - 1 && m.role === 'user'
      ? { ...m, content: m.content + brevity }
      : m
  );

  const models = [
    'claude-sonnet-4-6',
    'claude-haiku-4-5-20251001',
  ];

  let text = '';
  let usedModel = '';

  for (const model of models) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: processed,
      });

      text = response.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n')
        .trim();

      usedModel = model;
      var inputTokens = response.usage?.input_tokens || 0;
      var outputTokens = response.usage?.output_tokens || 0;
      break;
    } catch (err) {
      console.error(`${model} failed:`, err.message);
      if (model === models[models.length - 1]) {
        return res.status(500).json({ error: 'All models unavailable' });
      }
    }
  }

  // Log to Google Sheet (awaited so serverless doesn't terminate the request)
  const sheetUrl = process.env.SHEET_LOG_URL;
  if (sheetUrl) {
    const rawMsg = messages[messages.length - 1]?.content || '';
    const cleanQuestion = rawMsg.replace(/^\[PSYCHOLOGICAL PROFILE:.*?\][\s\S]*?\n\n/, '');
    try {
      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, question: cleanQuestion, response: text, largeText, model: usedModel, inputTokens, outputTokens, password: input, profile: profile || 'UNDISCLOSED', subject: subject || 'trump' }),
        redirect: 'follow',
      });
    } catch (logErr) {
      console.error('Sheet log failed:', logErr.message);
    }
  }

  res.status(200).json({ response: text });
};
