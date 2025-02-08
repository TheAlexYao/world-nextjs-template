Below is a comprehensive 100‑step implementation plan--from starting with the Next.js template through to deploying on Vercel--covering every phase of your demo's features (real‑time chat, receipt scan with dynamic split, and the travel fund module) plus local (ngrok) and production setups.

# Developer Log

## 2025-02-08

### 11:45 AM - Initial Setup
- Confirmed project is using pnpm as package manager
- Updated package.json:
  - Renamed project to "ephemeral"
  - Added dependencies: socket.io, socket.io-client, lottie-react, confetti-js
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
   - Verify Socket.IO connection

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

4. **Integrate Real‑Time Chat (Socket.IO -- Server):**  
22. Create a new file at `pages/api/socket.js`.  
23. In `pages/api/socket.js`, import Socket.IO's Server:  
`import { Server } from "socket.io";`  
24. Define a handler function that checks if `res.socket.server.io` exists.  
25. If not, create a new instance of Socket.IO using:  
`const io = new Server(res.socket.server);`  
26. Attach an event listener for "connection":  
`io.on("connection", (socket) => { … });`  
27. Within the connection event, log that a client has connected.  
28. Inside the connection event, add a listener for "message" events.  
29. In the "message" handler, broadcast the message to all clients using:  
`io.emit("message", msg);`  
30. Save the file.  
31. Test by visiting the API route URL (even if it returns an empty response) to trigger initialization.

5. **Integrate Real‑Time Chat (Socket.IO -- Client):**  
32. Open or create a chat component file (e.g. `components/Chat.jsx`).  
33. Import `io` from "socket.io-client":  
`import io from "socket.io-client";`  
34. In the component, declare a state variable for messages using `useState([])`.  
35. Also, declare a state variable for the input message text.  
36. In a `useEffect`, initialize the socket connection:  
`const socket = io();`  
37. Set up a "connect" event listener on the socket to log connection success.  
38. Set up a "message" event listener to update your messages state.  
39. Clean up the socket connection on component unmount.  
40. Render the chat messages list and an input field with a "Send" button.  
41. Implement a `sendMessage` function that emits the "message" event with the current input value.  
42. Test the chat component by opening it in the browser; open multiple tabs to simulate multiple users.

6. **Implement Deep‑Linking & Webview Compliance:**  
43. Create a utility function (e.g. `utils/generateDeepLink.js`) that constructs a deep‑link URL:  
`https://worldcoin.org/mini-app?app_id={APP_ID}&path=/chat`  
44. Replace `{APP_ID}` with your env variable (set later in production).  
45. Call this function on the chat page to display a shareable link.  
46. Verify that the deep‑link URL appears correctly.  
47. Review World's mini‑app webview spec and adjust CSS/Tailwind settings to match.  
48. Test the UI in various mobile simulators to ensure it meets the design spec.

7. **Implement Receipt Scan Flow (UI & Animation):**  
49. On the chat page, add a "Scan Receipt" button.  
50. Create a new component (e.g. `components/ReceiptScan.jsx`) for the receipt scan flow.  
51. Add an animated sequence using CSS animations or Lottie for a scanning effect.  
52. Once the animation completes, display a static receipt with details (e.g. RM188.50 total, list of Malaysian dishes, service charge, tax).  
53. Hardcode dummy receipt data for now.  
54. Create a state variable to track when the scan is complete.  
55. Wire up the "Scan Receipt" button to trigger the animation and then reveal the receipt. 56. Test the receipt scan animation locally.

8. **Automate Payment Split Calculation:**  
57. In your chat or receipt component, add logic to count connected users via the Socket.IO connection.  
58. Create a function that retrieves the current user count (from the socket server's connections if possible).  
59. Calculate the split amount:  
`splitAmount = totalReceipt / numberOfUsers`  
60. Auto‑populate a message string (e.g. "/pay 188.50 split {N}") using this calculation.  
61. Display the auto‑calculated split command on the UI.  
62. Ensure that the calculation updates dynamically if users join/leave. 63. Test with simulated multiple users.

9. **Implement Payment Flow -- API Endpoints:**  
64. Create a new API route at `pages/api/initiate-payment.js` for initiating the payment (for the initiator).  
65. In this endpoint, simulate processing a transaction of .1 WLD (using dummy logic for now).  
66. Log the transaction details for debugging.  
67. Return a success JSON response.  
68. Create another API route at `pages/api/confirm-payment.js` for non‑initiator confirmations.  
69. In the confirm endpoint, simulate a .1 WLD transaction (again, dummy logic).  
70. Ensure that these endpoints check and log relevant parameters (e.g. user ID, receipt details).  
71. Test these endpoints using Postman or curl.

10. **Integrate Payment Flow into the UI:**  
72. In your receipt component, add a "Confirm Payment" button for non‑initiators.  
73. Wire up the button to call `/api/confirm-payment` via fetch/AJAX.  
74. For the initiator, trigger `/api/initiate-payment` automatically when the receipt scan completes.  
75. Show loading indicators while the API call is in progress.  
76. Upon success, display a confirmation message.  
77. Log any errors and show an error message if the API call fails.  
78. Test the full payment flow end-to-end locally.

11. **Implement Travel Fund Module:**  
79. Create a new component (e.g. `components/TravelFund.jsx`) for the travel fund prompt.  
80. Design the prompt UI to display a message (e.g. "That meal was epic--contribute to your $3000 travel fund for Bali/Tokyo?").  
81. Display the current progress (e.g., "$1556/$3000").  
82. Add a "Contribute" button to confirm contribution.  
83. Wire up the button to simulate a contribution (dummy API call if needed).  
84. On confirmation, trigger a celebratory animation (e.g. confetti).  
85. Integrate this component so that it appears after the payment flow completes.  
86. Test the travel fund module locally.

12. **Code Cleanup & Testing:**  
87. Review all components and API endpoints for code quality.  
88. Add error logging where necessary.  
89. Write basic unit tests for key functions (e.g. split calculation).  
90. Write integration tests to simulate a full chat and payment flow.  
91. Manually test each component in various browsers and mobile simulators.

13. **Prepare for Production Deployment:**  
92. Update your environment variables for production in a new file (e.g. `.env.production`).  
93. Set:  
`APP_ID="INSERT_APPID"`  
`DEV_PORTAL_API_KEY="APIKEY"`  
`WLD_CLIENT_ID=...`  
`WLD_CLIENT_SECRET=...`  
`NEXTAUTH_URL` to your production Vercel URL  
94. Ensure all sensitive keys are kept secure.  
95. Double-check that deep‑link URLs now use the production `APP_ID`.

14. **Deploy to Vercel:**  
96. Push your code to a GitHub repository.  
97. Create a new Vercel project and import your repository.  
98. Set the production environment variables in Vercel as per step 93.  
99. Deploy the application on Vercel.  
100. Verify that the production instance loads correctly, that World wallet login works, and all flows (chat, receipt, payment, travel fund) perform as expected.

* * *

These 100 steps should guide you through the entire implementation--from local development (with ngrok for public URL testing) to production deployment on Vercel--ensuring your demo meets all specifications and flows seamlessly. Let me know if you need further clarifications on any step!