**Title:**  
Ephemeral -- Group Chat with Automated Receipt Scan, Payment Split & AI Travel Fund

**Overview:**  
Starting from the [minikit-next-template](https://github.com/worldcoin/minikit-next-template), we'll build a World mini‑app that lets users join a real‑time group chat (via Pusher) where receipt scanning automatically splits a payment based on the number of active users. The initiator pays (with others confirming via a button) and funds are directed to the initiator's wallet. The app adheres to the World mini‑app webview spec for proper mobile display and is deployed both locally (via ngrok) and in production on Vercel.

**Objectives:**  
• Build on the template and integrate with a production World mini‑app instance.  
• Implement real‑time chat that auto‑determines user count for splitting the receipt amount.  
• Automate the receipt scan flow: display an animated scan, show a static receipt, auto‑calculate the "/pay {total} split {N}" command, and let non‑initiators confirm payment (.1 WLD each) to the initiator.  
• Display an AI travel fund prompt after payment confirmation.  
• Ensure local testing (using ngrok and proper NEXTAUTH_URL) and production deployment (with env vars for APP_ID, DEV_PORTAL_API_KEY, WLD_CLIENT_ID, WLD_CLIENT_SECRET, NEXTAUTH_URL, and Pusher credentials).

**Key Features & User Stories:**

1. **Authentication & Environment:**  
-- Users log in via World wallet auth (NextAuth built into the template).  
-- Local dev uses ngrok (set NEXTAUTH_URL to the ngrok URL and register it in the World dev console).  
-- Production uses Vercel with env vars:  
`APP_ID="INSERT_APPID"`,  
`DEV_PORTAL_API_KEY="APIKEY"`,  
`WLD_CLIENT_ID=...`,  
`WLD_CLIENT_SECRET=...`,  
`NEXTAUTH_URL` set to the Vercel URL,  
`PUSHER_APP_ID=...`,  
`PUSHER_KEY=...`,  
`PUSHER_SECRET=...`,  
`PUSHER_CLUSTER=...`

2. **Real‑Time Group Chat:**  
-- Users join a group chat via a deep‑link (formatted as per World mini‑app webview spec).  
-- Pusher ensures persistent, low‑latency messaging in a serverless environment.

3. **Receipt Scan & Automated Payment Split:**  
-- The "Scan Receipt" button triggers an animation then displays a static receipt (e.g. RM188.50 total ≈ $40 USD).  
-- The app auto‑calculates the split by dividing the total by the actual number of connected users.  
-- The initiating user is set to pay; non‑initiators only confirm with a button, triggering a .1 WLD payment each to the initiator via API routes (`/api/initiate-payment` and `/api/confirm-payment`).

4. **Travel Fund Module:**  
-- After the payment flow, an AI prompt (e.g., "That meal was epic--contribute to your $3000 travel fund for Bali/Tokyo?") appears.  
-- User confirmation shows a success/confetti animation and tracks progress toward the travel fund goal.

**Functional Requirements:**  
• **Base Template:**  
- Start with [minikit-next-template].  
- Confirm NextAuth + World wallet auth are operational.  
• **Real‑Time Chat:**  
- Integrate Pusher in an API route (e.g. `/api/pusher-trigger`) to manage live messaging.  
- Update the chat component to use Pusher for real-time updates.  
• **Deep‑Linking & Webview Compliance:**  
- Generate deep‑links using `https://worldcoin.org/mini-app?app_id={APP_ID}&path=/chat` so the app renders properly in the World app's mobile webview.  
• **Receipt & Payment Flow:**  
- "Scan Receipt" triggers an animated sequence, then shows a static receipt.  
- Determine connected user count via Pusher presence channels and auto‑calculate each share.  
- Auto‑populate the split command string ("/pay 188.50 split {N}").  
- Non‑initiators confirm payment with a button; payments processed via API routes (.1 WLD each, sent to the initiator).  
• **Local Dev Setup:**  
- Use ngrok to expose your local server and update `NEXTAUTH_URL` to the ngrok URL.  
- Add the ngrok URL to the World dev console for "Login with World" to work.  
• **Production Setup:**  
- Configure env vars on Vercel as listed above.

**Tech Stack:**  
• **Package Manager:** pnpm for fast, disk-efficient package management  
• **Frontend:** Next.js (App Router), React, Tailwind CSS  
• **Real‑Time:** Pusher (server and client)  
• **Auth:** NextAuth with World wallet integration  
• **Payments:** API endpoints processing minimal (.1 WLD) transactions  
• **Deeplinking & UI:** World mini‑app webview spec compliance

**Implementation Steps:**

1. **Initialize from Template:**  
- Clone and set up the [minikit-next-template].  
- Update local env vars and set `NEXTAUTH_URL` to your ngrok URL for local testing.  
- Verify login works via World wallet auth.
2. **Integrate Pusher:**  
- Create `/api/pusher-trigger` to handle real-time message broadcasting.  
- Update your chat component to subscribe to Pusher channels.
3. **Implement Deep‑Linking & Webview Compliance:**  
- Generate a deep‑link URL in the format required by World.  
- Test UI appearance in mobile webview.
4. **Build Receipt & Payment Flow:**  
- Add a "Scan Receipt" button that triggers the receipt scan animation and then displays the receipt.  
- Automatically calculate the payment split based on the number of connected users.  
- Implement API routes (`/api/initiate-payment` and `/api/confirm-payment`) to process real transactions (.1 WLD each) with funds going to the initiator.  
- Set up the UI so non‑initiators only see a confirmation button.
5. **Implement Travel Fund Module:**  
- After payment confirmation, display an AI prompt for travel fund contribution.  
- Track progress (e.g., $1556/$3000) and trigger a confetti/success animation upon confirmation.
6. **Environment Setup:**  
- **Local:** Use ngrok to get a public URL, update `NEXTAUTH_URL`, and register it with World's dev console.  
- **Production:** Set the provided environment variables on Vercel.
7. **Testing & Deployment:**  
- Test all flows using the ngrok URL locally.  
- Once validated, deploy to Vercel and verify production deep‑linking and UI in World app webview.

**Implementation Status:**

1. **Authentication & Environment:** ✅
   - World wallet auth working
   - Local dev with ngrok configured
   - Environment variables set up

2. **Real-Time Group Chat:** ✅
   - Pusher integration complete
   - Presence channel implemented
   - Real-time messaging working

3. **Receipt Scan & Payment Flow:** 🚧
   - Receipt scanning UI implemented ✅
   - Static receipt display working ✅
   - Payment flow implemented with test wallet ✅
   - Fixed payment amount (0.1 WLD) ✅
   - Multi-user testing pending

4. **Current Implementation Details:**
   - Using Pusher presence channel for user tracking
   - Receipt scanning shows static receipt in chat
   - Payment flow sends 0.1 WLD to test wallet
   - Join/Pay UI updates based on user status
   - Success callbacks update payment status

5. **Testing Status:**
   - Single user flow verified
   - Multi-user testing in progress
   - Presence channel functionality ready for testing
   - Payment flow verified with test wallet

**Updated Success Metrics:**
• Chat latency under 200ms via Pusher ✅
• Receipt scanning and display working ✅
• Payment flow with test wallet verified ✅
• Multi-user testing pending 🚧

**Risks & Mitigations:**  
• **Real‑Time Performance:** Pusher ensures low latency and serverless compatibility; ensure proper error handling.  
• **UI in Mobile Webview:** Validate design thoroughly with ngrok and real device testing.  
• **Payment Flow Robustness:** Although no network fallback is needed, basic error logging should be in place.