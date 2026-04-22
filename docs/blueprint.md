# **App Name**: SmartKisan

## Core Features:

- User Authentication & Profile: Allows farmers to register and securely log in using phone number or Google Sign-In, and manage their personal and farm profile details like location and farm size, leveraging Firebase Authentication and storing user data in Cloud Firestore.
- Farm & Device Dashboard: Provides a comprehensive overview of all owned farms and their associated SIM-based irrigation devices, displaying real-time status (ON/OFF, last active) and allowing for quick access to detailed management from Cloud Firestore.
- Irrigation Control & Scheduling: Enables remote control of irrigation devices (ON/OFF) directly from the app and the creation or modification of automated irrigation schedules. These actions are processed via Firebase Cloud Functions and reflected in Cloud Firestore.
- Crop Advisory & Weather Insights: Delivers personalized crop recommendations based on farm specifics (soil type, season) and displays current alongside forecasted weather conditions. Integrates weather data from an external API via Firebase Cloud Functions and offers irrigation delay recommendations if rain is predicted.
- AI Plant Disease Detection Tool: A generative AI-powered tool that allows users to upload plant images for AI analysis to identify potential diseases and provides detailed treatment advice. The app stores scan history in Cloud Firestore and images in Firebase Storage.
- Market Price Tracker: Displays up-to-date market prices for various crops in specified markets and states, with data efficiently fetched and updated in Cloud Firestore via Firebase Cloud Functions.
- Farmer Community Forum: Facilitates an interactive discussion platform where farmers can browse, create, and comment on discussion posts. This includes support for image uploads via Firebase Storage, all managed seamlessly through Cloud Firestore.

## Style Guidelines:

- Primary color: A vibrant yet earthy green (#1AA15C) chosen to reflect the natural themes of agriculture, growth, and environmental intelligence, providing excellent contrast and a modern aesthetic on lighter backgrounds.
- Background color: A subtly tinted light green (#ECF7F1). This nearly-white shade ensures a clean and airy interface while maintaining a harmonious visual connection to the primary brand color.
- Accent color: A brighter, yellowish-green (#8AC33D). This analogous color provides a lively highlight for interactive elements, calls to action, and important data points, enhancing visual guidance and user engagement.
- Font choice: 'Inter' (sans-serif) will be used for all textual elements. Its contemporary, objective, and highly legible design ensures clear communication for all types of content, from data displays to advisories and community discussions.
- Utilize a consistent set of clean, modern line-art icons. Emphasize iconography that subtly integrates agricultural motifs (e.g., plant leaves, water drops, sun) alongside standard UI symbols to enhance intuitive navigation and brand identity.
- Implement a modular and data-driven dashboard layout, utilizing cards and well-defined sections to organize complex agricultural information effectively. Prioritize a clear visual hierarchy and a responsive design that adapts seamlessly across various device screen sizes.
- Incorporate subtle, performant animations for state changes and user feedback. Examples include smooth transitions when toggling device statuses, indicating data loading, or confirming form submissions, enhancing the application's perceived responsiveness and user experience.