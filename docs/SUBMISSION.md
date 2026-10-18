# Devpost submission draft: Tuma

## Project description
Tuma lets people abroad send money to family by chat or voice, in English, Swahili, French or Nigerian Pidgin.
Say "Tuma $50 kwa mama" and an AI agent finds the recipient, shows a quote (fee, total, indicative local value) and
waits for explicit confirmation. The sender pays through PayPal checkout, the money is sent on to the recipient's
PayPal account with the PayPal Payouts API, and the sender watches a live status timeline and gets a receipt in their own language.

Why it matters: cross-border family support is a huge use case in Africa, and the flow is confusing in a second language.
Tuma puts the whole PayPal flow behind a conversation people already know how to have.

### Features
- Multilingual chat agent with function calling (find/save recipient, prepare quote, check transfer status).
- Voice input: mic recording is converted to WAV in the browser and transcribed by Gemini, which also detects the language; replies can be spoken back.
- The agent can only prepare a transfer. Money moves only after the user confirms the quote card and pays in PayPal.
- Fees, totals and rates are computed server-side; the model never produces money amounts.
- PayPal Orders (create/capture) with idempotency keys, verified and de-duplicated webhooks, and a transfer state machine with an audit trail.
- PayPal Payouts to the recipient's PayPal account; if the payout cannot complete, the captured payment is refunded and the transfer is marked failed.
- Localized receipts (delivered or failed), generated from facts only and cached.
- Model fallback (main model, then a lighter one) to stay within free-tier limits.

## Tools used
- PayPal developer platform (sandbox): Orders v2, Payouts, Webhooks, JS SDK buttons.
- Google Gemini API (free tier): function-calling agent, audio transcription with language detection, receipt writing.
- Next.js (App Router, TypeScript), PostgreSQL, Tailwind CSS, Render (hosting).

## Real vs simulated
| Part | Status |
|---|---|
| Checkout, capture, webhooks | Real, PayPal sandbox |
| Payout to recipient's PayPal account | Real, PayPal sandbox |
| Local currency (KES) figure | Indicative only, fixed demo rate |
| Recipient withdrawing PayPal funds to a Kenyan bank | Outside the app, not demonstrated |
| Live-mode availability of Payouts for Kenya | Not verified; sandbox demo only |

## Demo video (under 3 minutes)
1. 0:00 One sentence on the problem; show the app.
2. 0:15 Type "Tuma $30 kwa mama" and show the quote card.
3. 0:40 Confirm and pay with the sandbox buyer account.
4. 1:10 Timeline moves paid, payout pending, delivered. Show the "mama" sandbox account receiving the money.
5. 1:40 Speak a French request with the mic; show the transcription, spoken reply and the French receipt.
6. 2:15 Show the failure path briefly (payout fails, refund, apology receipt) if reliable, otherwise skip.
7. 2:35 Real-vs-simulated slide and the GitHub link. Post publicly on YouTube.

## Multilingual test phrases (run before recording)
| Language | Phrase | Expect |
|---|---|---|
| English | Send $50 to mama for rent | Quote card |
| Swahili | Tuma $30 kwa mama | Quote card, Swahili reply |
| French | Envoie 40 dollars à maman | Asks for PayPal email if "maman" is unknown |
| Pidgin | Abeg send $20 give mama | Quote card, Pidgin reply |
| Any | Where is my money? | Status of the latest transfer |
| Any | Send $5000 to mama | Polite refusal (limit is $1,000) |

## Pre-submission checklist
- [ ] Repo public, MIT license present, README setup works from a clean clone
- [ ] Hosted demo URL works with sandbox credentials shown in the README
- [ ] Webhook URL in the PayPal sandbox app points at the hosted URL (capture and payout events)
- [ ] Demo video public, under 3 minutes
- [ ] Description, tools and real-vs-simulated sections pasted into Devpost
- [ ] Submitted by Nov 11 (deadline Nov 12, 2:00 PM PT, which is 1:00 AM Nov 13 in Nairobi)
