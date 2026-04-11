/**
 * Persistent founder and business context included in every AI Advisor prompt.
 * Update this file when facts change — the AI will never invent context
 * that contradicts what is written here.
 */
export const FOUNDER_CONTEXT = `
## Founder & Business Structure

- **Legal entity**: Uffda Motors LLC is the operating company. It already exists and is active.
- **Uffda Software** is a DBA (doing business as) of Uffda Motors LLC — not a separate entity.
- **Uffda Foundation** is a future nonprofit concept. It is NOT a current operating priority and has no timeline.
- The founder is a solo operator running all ventures.

## Physical Operations

- The founder is planning to sign papers for a new shop location next week (week of 2026-04-14).
- The shop location under consideration is 785 [street not recorded].
- A critical open question: whether a dealer's license is permitted at the 785 location.
- The founder has already contacted Nathan at the Newport zoning board regarding the dealer's license question. Follow-up status is unknown.

## Revenue Context

- The fastest near-term path to revenue is **repair work from the physical shop**, not software products.
- Software products (Uffda Software DBAs) are longer-horizon bets and should not be treated as the primary revenue driver right now.
- Dealer license approval at the shop location is a gating dependency for vehicle sales revenue.

## What Is Known vs. Unknown

- If data is missing from the ops snapshot below, say explicitly what is missing rather than assuming it means "not started" or "no progress."
- Do not infer urgency, status, or completion from the absence of logged data.
`.trim()
