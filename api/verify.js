module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body;
  const correct = process.env.DEPOSITION_PASSWORD || 'deposition';
  if (password === correct) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }
};
