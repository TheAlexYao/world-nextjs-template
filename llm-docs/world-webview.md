https://docs.world.org/mini-apps/design/app-guidelines 

Design Standards

# Guidelines

These guidelines are meant to help you succeed as a mini app developer. Please follow them to ensure your app is approved.

## [MiniKit Integration](https://docs.world.org/mini-apps/design/app-guidelines#mini-kit-integration)

Integrate MiniKit to supercharge your web app with exclusive features like World ID and Wallet access, making your mini app more engaging and valuable to users.

To get your mini app approved, it's essential to use the MiniKit SDK commands effectively to enhance the user experience. We're looking for meaningful integrations, whether through _World ID_ and _Wallet access_ , or other creative uses that add real value.

## [Mobile First](https://docs.world.org/mini-apps/design/app-guidelines#mobile-first)

Mini apps are inherently accessed via mobile, so your application UI should look and feel like a mobile app.

### [Key considerations for a mobile-first experience:](https://docs.world.org/mini-apps/design/app-guidelines#key-considerations-for-a-mobile-first-experience)

- Use tab navigation to simplify movement within the app.
- Implement snap-to text boxes for easy user input.
- Avoid footers, sidebars, and excessive scrolling.
- Provide clear and direct navigation without hamburger menus.
- Ensure smooth transitions between different screens or sections.
- Use consistent background colors for a cohesive visual experience.
- Provide clear navigation cues to help users understand where they are and how to proceed.
- Ensure all UI elements are responsive and adapt well to different screen sizes.
- Use fonts that are optimized for readability on mobile devices.
- Include a splash page for sign-in if needed.

❌ Bad Example  
Footer and long scrolling

✅ Good Example  
Bottom tab navigation and anchored buttons

## [Scroll Bounce on IOS.](https://docs.world.org/mini-apps/design/app-guidelines#scroll-bounce-on-ios)

We recommend you avoid scroll bounce error on iOS devices. Try disabling autoscroll & maybe fixed position elements or using 100dvh instead of 100vh.

If you are not using a bottom navigation bar, you can use the following CSS to disable the scroll bounce error:
    
    
    html,
    body {
    	width: 100vw;
    	height: 100vh;
    	overscroll-behavior: none;
    	overflow: hidden;
    }
    

CopyCopied!

## [App Icon](https://docs.world.org/mini-apps/design/app-guidelines#app-icon)

Your app icon should be a **square** image with a non white background.

## [Load times](https://docs.world.org/mini-apps/design/app-guidelines#load-times)

For mini apps, 2-3 seconds max for initial load and under 1 second for subsequent actions should be your target. However, always test for real-world scenarios and provide visual feedback during loading to maintain user trust.

## [Chance based](https://docs.world.org/mini-apps/design/app-guidelines#chance-based)

We recommend developers to avoid building chance based games, as these games have a very low likelihood of being approved.

**Chance based** = prize awarded based on chance, not skill. This means you are using a RNG to determine a winner. You can still have prizes but they need to be awarded based on skill. Not randomness. So winning a game where I get a prize is skill based.

## [Localisation](https://docs.world.org/mini-apps/design/app-guidelines#localisation)

Many of our users are located around the world. Apps that are localised for each region will perform significantly better. You can recognize the user's locale by using the [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) header

These languages are particularly important given our users:

1. English
2. Spanish
3. Japanese
4. Korean

## [Usernames](https://docs.world.org/mini-apps/design/app-guidelines#usernames)

You should never display the user's wallet address, always use their username. If you use Sign in with World ID you should not be doing any transactions with the user's wallet address, instead you should be using the username. Sign in with World ID and Verify offer the same World ID guarantees, but Verify is more reliable.

## [Using the Address Book](https://docs.world.org/mini-apps/design/app-guidelines#using-the-address-book)

World ID inherently allows anonymity between applications. We generally encourage developers to use their own Verify Command and verify the proof. However, we also offer a World ID address book. This contract stores a mapping `addressVerifiedUntil` you can query to see if a World App address is World ID Orb verified.

## [Design Patterns](https://docs.world.org/mini-apps/design/app-guidelines#design-patterns)

Here are some design patterns that we recommend you follow:

1. When a user is authenticated through their wallet, always show their username instead of the wallet address
2. Use the "Verify" command to confirm important actions or identity verification.
3. When dealing with wallet addresses, use an address book to link them to recognizable usernames or other identifiers

## [Inspiration](https://docs.world.org/mini-apps/design/app-guidelines#inspiration)

Looking for inspiration? Check out the approved mini apps to see what successful integrations look like and learn from their best practices. Seeing how others have effectively used MiniKit can provide you with ideas for creating an engaging and valuable experience for your users. Join our developer network to connect with fellow developers, share insights, and get support:

[World Developers Telegram](https://t.me/worldcoindevelopers)

If your inspiration is still off, here are some concepts that you can follow to build your mini app. Always keep in mind adding value to users through the minikit commands.

- **Limited Edition Art Distribution**: Build an app that allows artists to distribute limited editions of their work, ensuring that each human can claim only a certain number of pieces.
- **Sybil-Resistant Airdrop Platform**: Build a platform for distributing tokens to verified humans, ensuring that airdrops reach genuine users.
- **Community Engagement Airdrops**: Create an app that rewards users for participating in community activities, verified through proof of personhood.
- **Bot-Free Social Network**: Build a social platform that integrates World ID to limit bot activity, enhancing content quality and user engagement.
- **Human-AI Interaction Platform**: Develop an app where AI agents can interact with verified humans for tasks like customer support or data collection.
- **Decentralized Credit Marketplace**: Build a platform that connects borrowers and lenders, using proof of personhood and zero-knowledge attributes to assess creditworthiness.
- **Merchant Payment Solutions**: Develop a platform for local businesses to accept payments in cryptocurrencies, leveraging the World ecosystem for seamless transactions.

https://docs.world.org/mini-apps/more/webview-spec

Further Reading

# Webview Specifications

The widget is opened within the World App via a WebView. This means providers can tailor their solutions by considering the specific features and restrictions of these platforms.

### [**Capabilities:**](https://docs.world.org/mini-apps/more/webview-spec#capabilities)

- **WebView Engine:**
    - **Android:** Uses Android's native WebView implementation.
    - **iOS:** Uses **WKWebView**, the recommended web rendering engine on iOS, offering enhanced security and performance.
- **File System and Camera Access:**
    - Access to the camera and file system (e.g., for file uploads) is possible if the user grants permission.
- **Cookies and DOM Storage:**
    - Supported on both platforms with explicit activation for Android and default behavior for iOS.

### 

[**Restrictions:**](https://docs.world.org/mini-apps/more/webview-spec#restrictions)

- **Geolocation and Other Extra Permissions:**
    - By default, neither platform enables geolocation or additional permissions. Each new type of permission must be discussed and implemented separately if required.
- **New Windows:**
    - Opening new browser windows is prohibited. All navigation remains within the current WebView instance.
- **Zooming:**
    - **Android:** Not restricted by default.
    - **iOS:** Disabled.