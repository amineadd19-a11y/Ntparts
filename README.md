# NTParts

Global truck parts catalogue and OEM intelligence platform.

## Global Parts Intelligence

NTParts now includes a server-side AI research layer that combines:

- the internal NTParts catalogue
- Google Search grounding through Gemini
- official manufacturer and technical sources
- professional parts catalogues and distributors
- source ranking, provenance and confidence scoring
- OEM identification and cross-reference research
- truck application and fitment analysis
- part-to-part comparison

The AI is designed to prefer verified evidence and explicitly report `NOT VERIFIED` or `SOURCE CONFLICT` instead of inventing part data.

### Configuration

Set these server-side environment variables:

```text
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

Never expose `GEMINI_API_KEY` through a `NEXT_PUBLIC_*` variable.

### AI endpoints

`POST /api/ai`

```json
{ "question": "K059965K50" }
```

The response contains the grounded answer, confidence, internal catalogue matches, source evidence and conflict status.

### Quality gate

```bash
npm run type-check
npm run lint
npm test -- --runInBand
npm run validate:catalog
npm run build
```

Or run the complete gate with:

```bash
npm run quality-gate
```
