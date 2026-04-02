# The Desposition of Record
### The unguarded version of himself he has never been.

A fictional analytical construct for understanding political psychology. Not a real person or real record.

---

## Deploy to Vercel

### 1. Create a GitHub repo
Create a new repo called `the-deposition` and push these files to it.

### 2. Connect to Vercel
- Go to vercel.com
- New Project → Import your GitHub repo
- Vercel will detect the config automatically

### 3. Set environment variables
In the Vercel dashboard under Settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `DEPOSITION_PASSWORD` | Whatever password you want to use |

### 4. Deploy
Vercel deploys automatically on every push to main.

---

## Modes

**SCENARIO** — Present a current event, policy decision, or political action. The construct processes it through its actual logic.

**FIRESIDE** — Give a topic or theme. The construct traces it autobiographically from formation through to present action.

---

## Notes

- Powered by Claude Opus (`claude-opus-4-6`)
- Web search enabled — the construct can pull current news and process it through the psychological model
- The default password if `DEPOSITION_PASSWORD` is not set is `deposition`
- All API calls are server-side — your API key is never exposed in the browser
