Below is a comprehensive 100‑step implementation plan--from starting with the Next.js template through to deploying on Vercel--covering every phase of your demo's features (real‑time chat, receipt scan with dynamic split, and the travel fund module) plus local (ngrok) and production setups.

# Developer Log

## 2025-02-08

### 11:45 AM - Initial Setup
- Confirmed project is using pnpm as package manager
- Updated package.json:
  - Renamed project to "ephemeral"
  - Added dependencies: pusher, pusher-js, lottie-react, confetti-js
- Successfully ran `pnpm install` to install all dependencies
- Started development server with `pnpm dev`
- Initiated ngrok for public URL access

### 11:48 AM - Environment Setup
- Successfully started development server at http://localhost:3000
- Obtained ngrok URL: https://5a52-175-139-124-225.ngrok-free.app

### 12:04 PM - Development Setup Note
When using ngrok for development, remember to:
1. Update .env file with the new ngrok URL:
   ```
   NEXTAUTH_URL=https://945a-175-139-124-225.ngrok-free.app
   ```
2. Update World dev console with the new callback URL:
   ```
   https://945a-175-139-124-225.ngrok-free.app/api/auth/callback/worldcoin
   ```
3. Restart the Next.js development server

### Next Actions
1. Test the authentication flow:
   - Sign in with World ID
   - Complete verification
   - Access chat room
2. Test real-time chat functionality:
   - Open multiple browser windows
   - Send messages between them
   - Verify Pusher connection

# Progress Tracking

## Completed Steps ✅
1. **Project Initialization & Base Setup**
   - [x] Created project folder
   - [x] Cloned minikit template
   - [x] Installed dependencies
   - [x] Set up initial environment variables
   - [x] Verified dev server starts

2. **Local Development Environment**
   - [x] Set up ngrok for local testing
   - [x] Updated NEXTAUTH_URL with ngrok URL
   - [x] Configured World dev console with ngrok callback

3. **Real-time Infrastructure**
   - [x] Switched from Socket.IO to Pusher
   - [x] Added Pusher dependencies
   - [x] Updated documentation for Pusher integration
   - [x] Created Pusher accounts (dev & prod)
   - [x] Obtained all necessary Pusher credentials
   - [x] Configured Pusher app settings:
     - [x] Enabled Force TLS
     - [x] Enabled Client Events
     - [x] Enabled Subscription Counting
     - [x] Enabled Subscription Count Events

4. **Environment Configuration**
   - [x] Set up development .env file with Pusher credentials
   - [x] Created production .env file
   - [x] Updated .env.example with new variables
   - [x] Added client-side Pusher variables

5. **Chat Implementation**
   - [x] Basic chat UI with messages
   - [x] Real-time message delivery
   - [x] Message persistence in state
   - [x] Auto-scroll to latest messages
   - [x] iOS viewport and keyboard fixes
   - [x] Mobile-responsive design

6. **Username System**
   - [x] Required username setup screen
   - [x] Username persistence in localStorage
   - [x] Edit name functionality
   - [x] Real-time username updates via presence channel
   - [x] Username sync across multiple devices/tabs

7. **Presence Channel**
   - [x] Implemented presence channel auth
   - [x] Real-time user count updates
   - [x] User join/leave events
   - [x] Username propagation in presence data
   - [x] Reconnection handling for name changes

## In Progress 🚧
8. **Receipt Scan Flow**
   - [ ] Camera button UI
   - [ ] Receipt scanning animation
   - [ ] Static receipt display
   - [ ] Split calculation based on user count

9. **Payment Flow**
   - [ ] Implement payment UI
   - [ ] Add confirmation buttons
   - [ ] Handle .1 WLD transactions
   - [ ] Payment status updates

10. **Travel Fund Module**
    - [ ] AI prompt after payment
    - [ ] Fund progress tracking
    - [ ] Success animations

## Technical Debt 🔧
- Add retry logic for failed message delivery
- Add environment variable validation
- Update NEXTAUTH_URL in production env when Vercel URL is available
- Consider enabling authorized connections if stricter security is needed
- Add error handling for subscription count changes
- Add loading states for better UX
- Add error boundaries for component crashes
- Add proper TypeScript types for Pusher events

## Next Up 📋
1. Implement receipt scan flow with camera button
2. Add receipt scanning animation
3. Display static receipt with split calculation
4. Implement payment confirmation UI

* * *

1. **Project Setup:**  
1. Create a new folder named "ephemeral-demo".  
2. Open your terminal and navigate to "ephemeral-demo".  
3. Run:  
`git clone https://github.com/worldcoin/minikit-next-template.git .`  
4. (Optional) Rename the repository if needed.  
5. Open the project folder in your IDE (e.g. VS Code).  
6. Run:  
`pnpm install`  
7. Confirm that all dependencies install correctly.  
8. Copy the `.env.example` file to a new file named `.env`.  
9. Review the default env settings in `.env`.  
10. Temporarily set `NEXTAUTH_URL=http://localhost:3000` (we'll change this later).

2. **Verify Base Functionality:**  
11. Start the dev server:  
`pnpm dev`  
12. Open [http://localhost:3000](http://localhost:3000) in your browser and confirm the base template loads.  
13. Test the World wallet login (NextAuth) provided by the template.  
14. Verify that authentication works using the sample setup.

3. **Configure Local Authentication for Public Testing:**  
15. Install ngrok (if not already installed).  
16. In a separate terminal, run:  
`ngrok http 3000`  
17. Copy the ngrok public URL provided (e.g. `https://abc123.ngrok.io`).  
18. Update `.env`:  
`NEXTAUTH_URL=https://abc123.ngrok.io`  
19. Restart your dev server.  
20. Test login via the ngrok URL in your browser.  
21. Log into the World dev console and register the ngrok URL so "Login with World" works locally.

4. **Set Up Pusher Account & Credentials:**  
22. Sign up for a Pusher account at [pusher.com](https://pusher.com).  
23. Create a new Channels app in your Pusher dashboard.  
24. Note your Pusher credentials: appId, key, secret, and cluster.  
25. Add to your `.env` file:  
```
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
```
26. Install Pusher server SDK:  
`pnpm add pusher`  
27. Install Pusher client SDK:  
`pnpm add pusher-js`  
28. Verify that both packages install successfully.  
29. Review Pusher docs for event triggers and client subscription.  
30. Ensure your environment variables load correctly in development.

5. **Integrate Real‑Time Chat (Pusher -- Server):**  
31. Create a new file at `pages/api/pusher-trigger.js`.  
32. Import Pusher:  
`import Pusher from "pusher";`  
33. Initialize Pusher with your credentials:  
```js
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});
```
34. Export a handler function to handle POST requests.  
35. In the handler, read the message payload from the request body.  
36. Use `pusher.trigger("chat-channel", "message", { msg: payload })` to broadcast.  
37. Return a JSON response confirming success.  
38. Save the file.  
39. Test the API route using Postman or curl with a sample payload.  
40. Confirm that the Pusher dashboard shows events being triggered.

6. **Integrate Real‑Time Chat (Pusher -- Client):**  
41. Create a chat component file (e.g. `components/Chat.jsx`).  
42. Import React hooks and PusherJS:  
```js
import { useState, useEffect } from "react";
import Pusher from "pusher-js";
```
43. Declare a state variable for messages using `useState([])`.  
44. Declare a state variable for the input message text.  
45. In a `useEffect`, initialize Pusher on the client side:  
```js
const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});
```
46. Subscribe to the "chat-channel":  
`const channel = pusherClient.subscribe("chat-channel");`  
47. Bind to the "message" event:  
```js
channel.bind("message", (data) => {
  setMessages((prev) => [...prev, data.msg]);
});
```
48. Clean up the subscription on component unmount.  
49. Render the chat messages list and an input field with a "Send" button.  
50. Implement a `sendMessage` function that calls your API route:  
```js
fetch("/api/pusher-trigger", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ msg: inputValue }),
});
```
51. Clear the input after sending.  
52. Test the chat component by opening multiple browser windows.

7. **Implement Deep‑Linking & Webview Compliance:**  
53. Create a utility function (e.g. `utils/generateDeepLink.js`) that constructs a deep‑link URL:  
`https://worldcoin.org/mini-app?app_id={APP_ID}&path=/chat`  
54. Replace `{APP_ID}` with your env variable (set later in production).  
55. Call this function on the chat page to display a shareable link.  
56. Verify that the deep‑link URL appears correctly.  
57. Review World's mini‑app webview spec and adjust CSS/Tailwind settings to match.  
58. Test the UI in various mobile simulators to ensure it meets the design spec.

8. **Implement Receipt Scan Flow (UI & Animation):**  
59. On the chat page, add a "Scan Receipt" button.  
60. Create a new component (e.g. `components/ReceiptScan.jsx`) for the receipt scan flow.  
61. Add an animated sequence using CSS animations or Lottie for a scanning effect.  
62. Once the animation completes, display a static receipt with details (e.g. RM188.50 total, list of Malaysian dishes, service charge, tax).  
63. Hardcode dummy receipt data for now.  
64. Create a state variable to track when the scan is complete.  
65. Wire up the "Scan Receipt" button to trigger the animation and then reveal the receipt. 66. Test the receipt scan animation locally.

9. **Automate Payment Split Calculation:**  
67. In your chat or receipt component, add logic to count connected users via the Socket.IO connection.  
68. Create a function that retrieves the current user count (from the socket server's connections if possible).  
69. Calculate the split amount:  
`splitAmount = totalReceipt / numberOfUsers`  
70. Auto‑populate a message string (e.g. "/pay 188.50 split {N}") using this calculation.  
71. Display the auto‑calculated split command on the UI.  
72. Ensure that the calculation updates dynamically if users join/leave. 73. Test with simulated multiple users.

10. **Implement Payment Flow -- API Endpoints:**  
74. Create a new API route at `pages/api/initiate-payment.js` for initiating the payment (for the initiator).  
75. In this endpoint, simulate processing a transaction of .1 WLD (using dummy logic for now).  
76. Log the transaction details for debugging.  
77. Return a success JSON response.  
78. Create another API route at `pages/api/confirm-payment.js` for non‑initiator confirmations.  
79. In the confirm endpoint, simulate a .1 WLD transaction (again, dummy logic).  
80. Ensure that these endpoints check and log relevant parameters (e.g. user ID, receipt details).  
81. Test these endpoints using Postman or curl.

11. **Integrate Payment Flow into the UI:**  
82. In your receipt component, add a "Confirm Payment" button for non‑initiators.  
83. Wire up the button to call `/api/confirm-payment` via fetch/AJAX.  
84. For the initiator, trigger `/api/initiate-payment` automatically when the receipt scan completes.  
85. Show loading indicators while the API call is in progress.  
86. Upon success, display a confirmation message.  
87. Log any errors and show an error message if the API call fails.  
88. Test the full payment flow end-to-end locally.

12. **Implement Travel Fund Module:**  
89. Create a new component (e.g. `components/TravelFund.jsx`) for the travel fund prompt.  
90. Design the prompt UI to display a message (e.g. "That meal was epic--contribute to your $3000 travel fund for Bali/Tokyo?").  
91. Display the current progress (e.g., "$1556/$3000").  
92. Add a "Contribute" button to confirm contribution.  
93. Wire up the button to simulate a contribution (dummy API call if needed).  
94. On confirmation, trigger a celebratory animation (e.g. confetti).  
95. Integrate this component so that it appears after the payment flow completes.  
96. Test the travel fund module locally.

13. **Code Cleanup & Testing:**  
97. Review all components and API endpoints for code quality.  
98. Add error logging where necessary.  
99. Write basic unit tests for key functions (e.g. split calculation).  
100. Write integration tests to simulate a full chat and payment flow.  
101. Manually test each component in various browsers and mobile simulators.

14. **Prepare for Production Deployment:**  
102. Update your environment variables for production in a new file (e.g. `.env.production`).  
103. Set:  
```
APP_ID="INSERT_APPID"
DEV_PORTAL_API_KEY="APIKEY"
WLD_CLIENT_ID=...
WLD_CLIENT_SECRET=...
NEXTAUTH_URL=your_vercel_url
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster
```
104. Ensure all sensitive keys are kept secure.  
105. Double-check that deep‑link URLs now use the production `APP_ID`.

15. **Deploy to Vercel:**  
106. Push your code to a GitHub repository.  
107. Create a new Vercel project and import your repository.  
108. Set the production environment variables in Vercel as per step 103.  
109. Deploy the application on Vercel.  
110. Verify that the production instance loads correctly, that World wallet login works, and all flows (chat, receipt, payment, travel fund) perform as expected.

* * *

These 100 steps should guide you through the entire implementation--from local development (with ngrok for public URL testing) to production deployment on Vercel--ensuring your demo meets all specifications and flows seamlessly. Let me know if you need further clarifications on any step!