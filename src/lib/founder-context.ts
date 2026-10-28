/**
 * Persistent founder and business context included in every AI Advisor prompt.
 * Update this file when facts change — the AI will never invent context
 * that contradicts what is written here.
 */
export const FOUNDER_CONTEXT = `
## Founder & Business Structure

- **Legal entity**: Uffda Motors LLC is the operating company. It already exists and is active.
- **Uffda Software** is a DBA (doing business as) of Uffda Motors LLC, not a separate entity.
- **Z's Auto Sales and Repair** is also owned by Uffda Motors LLC. The dealer license is issued under that name; renaming it to Uffda Motors is paperwork only (pending with MN DVS). Lot cars are titled to Z's as held for resale.
- **Uffda Foundation** is a future nonprofit. It is paused until the shop covers owner pay for 3 straight months; no grant work before then.
- The founder (Troy) runs the business with Jackie, who handles detailing and VIN/title paperwork. No employees.

## Physical Operations (updated 2026-10-26)

- The shop has been open since June 1, 2026 at 1980 Quasar Ave S, Lakeland, MN 55043 (lease signed; this is settled, not a blocker).
- Dealer license, $50K surety bond, dealer garage insurance (Federated) and 2 dealer plates are all in place.
- Repair: about $8,000/month, ~12 tickets/month, ~$685 average ticket, ~10 billed hours/week. Shop rate $90/hr, 30% parts markup target.
- Lot sales started: first retail sale (2018 Ford Escape) scheduled 2026-10-29; 2013 Honda CR-V listed at $9,900. Planning figure ~$2,500 gross per car. Brokering alone (~$500/deal) is not worth it unless recon work comes with it.
- Fleet: Turo/rental operators are ~14% of repair revenue. Fleet retainer leads: Craftmasters Remodeling (16 trucks) and Bluefin Rentals.

## Year 1 Plan (Nov 2026 to Oct 2027)

- Cash is tight, so near-term cash matters most: collecting money already owed to the shop (~$14K in receivables and unsent invoices), then lot sales, fleet retainers and repair volume.
- Year 1 target by May 2027: about 2 lot sales/month at ~$2,500 gross plus ~$11K/month repair revenue, enough for the shop to cover owner pay.
- Focus is repair, lot sales and fleet retainers. Software (SMS, Fleet) gets no new feature work until the shop covers owner pay for 3 months; keep it running for the shop.
- First hire only after 30+ billed hours/week for 6 straight weeks.

## Software Context

- Uffda SMS runs the shop (pilot customer). No paying outside shops yet.
- Uffda Fleet is waiting on the CarFax integration (needs service history); CarFax requires 250 completed repair orders (163 as of 2026-10-26).

## What Is Known vs. Unknown

- If data is missing from the ops snapshot below, say explicitly what is missing rather than assuming it means "not started" or "no progress."
- Do not infer urgency, status, or completion from the absence of logged data.
- Facts here can go stale; the dated ops snapshot and activity log below win when they conflict.
`.trim()
