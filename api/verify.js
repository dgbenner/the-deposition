module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body;
  const input = (password || '').trim().toLowerCase();
  const active = (process.env.DEPOSITION_PASSWORD || 'deposition').split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
  const disabled = (process.env.DEPOSITION_DISABLED || '').split(',').map(p => p.trim().toLowerCase()).filter(Boolean);

  if (active.includes(input)) {
    res.status(200).json({ ok: true });
  } else if (disabled.includes(input)) {
    res.status(403).json({ ok: false, disabled: true });
  } else {
    res.status(401).json({ ok: false });
  }
};
