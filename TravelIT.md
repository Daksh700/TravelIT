# TravelIT — AI-Powered Smart Travel Itinerary Planner

## Third Year (TY) Project White Book

**Project Title:** TravelIT — AI-Powered Smart Travel Itinerary Planner  
**Academic Year:** 2025–2026  
**Submitted By:** Daksh Goel  
**Technology Stack:** React Native (Expo), Node.js (Express), MongoDB, Google Gemini AI  

---

# Chapter 1: Introduction

## 1.1 Introduction

The global travel and tourism sector has become one of the largest and the fastest growing sectors in the world economy, with an expenditure of more than 9.9 trillion to the global GDP per year (World Travel & Tourism Council, 2024). In the modern context of the swift digitalization of all industries, travelers now demand personalized, smart, and hassle-free travel planning experiences. Nonetheless, the existing environment of the travel planning tools is still disjointed, manual, and tends to be confusing to the user. The conventional travel planning involves going to numerous websites and applications to book the flights, find hotels, and get sightseeing recommendations, then manually assemble a sensible itinerary. This is time-consuming, and also likely to be incredibly inaccurate in terms of scheduling issues, budget overruns, and failure to make visits to the best attractions.

**TravelIT** is an all-in-one AI-driven mobile application which is entirely changing the travel planning process. TravelIT will be composed of built-in technologies such as the Gemini 2.5 Flash large language model created by Google, React Native with Expo to develop cross-platform mobile applications, Node.js with Express to provide a robust backend API server, and database MongoDB as a basic database, that will provide an end-to-end solution to automate the whole travel planning process.

TravelIT at its most fundamental level involves receiving the travel preferences of its user such as their source city, destination, time of trip, budget, interests, the number of travelers, age category, and safety preferences and then, with the help of artificial intelligence, creating a comprehensive, day-by-day travel itinerary. Any generated itinerary contains time-stamped activities that have realistic cost estimates, automatically obtained hotel bookings through the Booking.com API, real time flights, and every single location that is named within the itinerary is cross-referenced with the Google Places API to verify its existence, current status, and suitability around the time of the year.

In addition to fundamental itinerary generation, TravelIT also proposes a number of novel features, which make it stand out among the current solutions:
- **Real-Time Logic Engine:** The user is able to change his or her itineraries dynamically due to weather alterations (rain adaptation) or some unforeseen delays, where the AI will reschedule the activities.
- **Smart Route Optimization:** This is an optimization algorithm using permutation that takes into account the Google Distance Matrix API to optimize the sequence of activities to take up during each day to reduce travel time and waiting.
- **Trip Tinder (Group Sync):** A Socket.io-based, real-time, multiplayer activity-voting system that enables travel groups to swipe on suggested activities, democratizing the trip-planning process.
- **AI Chat Assistant:** Pro members can communicate with the AI and make custom details to their itinerary with natural language prompts.
- **PDF Export:** The users are able to export their completed itineraries in the form of professionally formatted PDF files.
- **Freemium Monetization:** TravelIT Pro can be purchased by paying a lifetime fee of zero cash, which enables users to get premium features.

## 1.2 Description

TravelIT is a mobile application that is full-stack and comprised of two significant parts:

### Front-End (Mobile Application)
- **Framework:** React Native 0.81.5 using expo SDK 54.
- **Language:** TypeScript
- **Routing:** Expo Router (file-based routing)
- **Style:** NativeWind (React Native TailwindCSS)
- **State Management:** Zustand global state, TanStack React Query server state.
- **Animations:** React Native Reanimated smooth micro-animations
- **Real-time Communication:** Socket.io Customer to Trip Tinder feature.
- **SDK:** Cashfree React Native SDK in-app payment SDK.
- **Notifications:** Expo Notification support push notification.

### Backend (API Server)
- **Run time:** Node.js (v22+) and Express 5.
- **Language:** TypeScript
- **Database:** MongoDB using Mongoose ODM.
- **AI Engine:** Google Gemini 2.5 Flash through genai.genai, SDK.
- **Authentication:** Clerk (JWT based authentication supporting social logins)
- **File Storage:** Image uploading and transformations Cloudinary file storage.
- **Payment Gateway:** Cashfree Payment Gateway (Sandbox/Production)
- **Rate Limiting and Bot Protection:** Arcjet.
- **Input Checking:** Zod schema validation.
- **Real-time Engine:** Socket.io Web Socket based communication.
- **External APIs:** Booking.com RapidAPI (Hotels and flights), Google places API, Google distance matrix API.

### Key Application Screens
| Screen | Description |
|--------|-------------|
| Home | Dashboard with trending destinations, trip statistics, and quick start planning |
| Plan (3-step wizard) | Multi-step form to configure trip parameters including source, destination, dates, budget, travelers, and preferences |
| Result | AI-generated itinerary preview with hotel/flight recommendations and cost breakdown |
| Trips (Vault) | List of all saved trips with status filtering (Draft, Active, Completed) |
| Trip Detail View | Complete itinerary viewer with real-time logic controls, drag-and-drop reordering, AI chat, route optimization, and PDF export |
| Trip Tinder | Swipe-based group activity voting with real-time synchronization |
| Explore | AI-powered location search with Google Grounding for verified, real-time results |
| Profile | User profile management, app settings, bookmarked places, and subscription management |
| Subscription | TravelIT Pro upgrade screen with Cashfree payment integration |
| Auth | Sign-in, sign-up, email verification, forgot password, and SSO callback screens |

## 1.3 Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|----------|
| **End Users (Travelers)** | Primary users of the mobile application | Want quick, personalized, and reliable travel plans without the hassle of manual research across multiple platforms |
| **Group Travelers** | Users traveling in groups of 2+ | Need a collaborative way to decide on activities together; benefit from Trip Tinder's voting mechanism |
| **Budget-Conscious Travelers** | Users with strict financial constraints | Require accurate cost estimates and budget-tier filtering to ensure travel plans stay within their financial limits |
| **Solo Travelers** | Individual travelers concerned about safety | Benefit from the Safety Mode feature that prioritizes well-lit, public, and guided experiences |
| **Project Developer** | Full-stack developer building and maintaining the application | Interested in building a scalable, secure, and feature-rich product using modern technologies |
| **Travel Agencies (Future)** | Potential B2B partners | May use TravelIT's itinerary generation engine as a white-label solution |
| **API Providers** | Google (Places, Distance Matrix), Booking.com, Cashfree, Clerk | Provide the underlying services that power TravelIT's features |

---

# Chapter 2: Literature Survey

## 2.1 Description of Existing System

The existing environment of the solutions of travel planning may be divided into the following types:

### 1. Online Travel Agencies (OTAs) -MakeMyTrip, Booking.com, Expedia.
The main emphasis of these platforms is on the individual flights and hotel reservations. Although they are very efficient in package pricing by having multiple providers and providing competitive prices, they never produce complete itinerary. The people have to research activities, restaurants and sightseeing activities individually. The platforms consider every booking to be a single transaction where it does not have a single trip management.

### 2. Review and Discovery Platforms TripAdvisor, Google Travel.
Such websites combine customer feedback and ratings of hotels, restaurants, and tourism sites. Although very handy in research, they place the burden of planning activities into an effective, time-based itinerary fully on the user. It does not have AI planning, budget tracking throughout the trip and route optimization.

### 3. Essentials Itinerary Builders Wanderlog, TripIt.
These applications enable users to be able to arrange their travel plans into structured itineraries manually. Each of the activities has to be searched and added by the user. Some of them provide map integration to map out the destinations, but not intelligent recommendations, no automation in scheduling or cost estimates, or any other AI assistance. The user is still left with the entire planning burden.

### 4. AI Travel Assistants -Emerging Layla, Roam Around.
A more recent type of tools that use AI (usually ChatGPT or some other LLMs) to create itineraries. Nevertheless, these tools have a number of severe limitations:
- **No Place Check:** AI generated places can be non-existent or possibly closed forever.
- **No live Data:** No live flight/hotel pricing/availability.
- **No Post-Generation Intelligence:** Once itinerary is created, there is no option to adjust the itinerary according to real life conditions such as weather or delays.
- **No Group Collaboration:** There is no process to allow groups to make decisions on activities collectively.
Issues with Hallucination: LLMs give rise to fictional names of restaurants, nonexistent attractions, or incorrect prices on a regular basis.

### 5. Social media Planning Instagram, YouTube, Reddit.
A large number of travelers depend on social media content producers to be inspired to travel. Although such content may be incredibly interesting and inspirational, it is not structured, hard to put into practiceable plans, and is overly sponsored.

### Summary of Existing Systems

| Feature | OTAs | Review Sites | Manual Builders | AI Assistants | TravelIT |
|---------|------|-------------|-----------------|---------------|----------|
| AI-Generated Itinerary | ❌ | ❌ | ❌ | ✅ (Basic) | ✅ (Advanced) |
| Place Verification | ❌ | Partial | ❌ | ❌ | ✅ (Google Places) |
| Real-Time Flight/Hotel | ✅ | ❌ | ❌ | ❌ | ✅ (Booking.com API) |
| Budget Tracking | ❌ | ❌ | Manual | ❌ | ✅ (Automatic) |
| Route Optimization | ❌ | ❌ | ❌ | ❌ | ✅ (Distance Matrix) |
| Weather/Delay Adaptation | ❌ | ❌ | ❌ | ❌ | ✅ (Real-Time Logic) |
| Group Collaboration | ❌ | ❌ | ❌ | ❌ | ✅ (Trip Tinder) |
| AI Chat Editing | ❌ | ❌ | ❌ | ❌ | ✅ |
| Offline Support | ❌ | ❌ | Partial | ❌ | ✅ (AsyncStorage) |
| PDF Export | ❌ | ❌ | ✅ | ❌ | ✅ |

## 2.2 Limitations of Present System.

The drawbacks of the current travel planning ecosystem are:

### 1. Fragmented User Experience
Now to plan a single trip, travelers are expected to use 4-6 possible applications: a flight-comparison application, a hotel reservation application, an activity research application, a map-based route-planning application, a budgeting spreadsheet application, and even a group-coordination application through messaging applications. The result of such fragmentation is the loss of time (average of 10-15 hours per trip), information between platforms, and a poor user experience.

### 2. None of the Intelligent Itinerary Generation.
No current mainstream solution is able to create a full day-to-day program with activities that have realistic time and costs depending on the interests of the user. Current AI applications produce text-based recommendations, which are yet to be curated and sorted by the human hand. They have not taken into consideration the opening hours, seasonal availability, or even the time taken when traveling between destinations.

### 3. Artificial Intelligence Imagination and Unsubstantiated Facts.
The places that are suggested by current AI travel assistants (such as ChatGPT-based products) are often fictional, restaurants that have already closed down, or are only available at a specific time of the year when the user is travelling. No verification exists between the AI output and the consumption of travel plans hence unreliable travel plans.

### 4. Fixed Itineraries which are not adaptable.
After a travel plan is designed (either by humans or AI), there is no system to dynamically modify it using the existing tools. In case of rain during Day 2 of scheduled outdoor adventure, the user has to do the research by hand and replace indoor options. In case the arrival time gets delayed by a flight by 3 hours, automated scheduling of the activities of that day is not done. Travelling in real life is unpredictable in nature and the existing tools assume that plans are fixed documents.

### 5. Nonexistent Group Decision-Making Mechanism.
In the case of traveling with a group (families, friend group, corporate teams), it is usually a controversial and time-consuming process of determining what activities to incorporate, which is usually resolved through endless group chat debates. There is no available tool of travelling that offers a well-organized, democratic, and entertaining system of group voting on suggested activities.

### 6. Suboptimal Route Planning
Customers tend to lose a lot of time and money through ineffective movement between tasks. Going to attractions sequentially (as the list was provided), as opposed to geographically balanced, may cause hours of superfluous travel. The current platforms fail to optimize the route of activities depending on the real distances and time of travels.

### 7. Lack of Budget Intelligence
Budget control throughout a entire trip (flights, hotels, daily activities, meals, etc) is most likely to be managed in individual spreadsheets or not monitored at all. There is no working platform that would have an integrated cost breakdown that automatically considers the options of accommodation, travel, and activities and charge them by the number of travelers.

### 8. No Safety-Aware Planning
Single fliers, women travelers, or any family group that includes children have certain safety needs when they visit unknown locations. Existing systems lack a safety setting which would automatically give preference to well-lit areas, guided tours, busy tourist locations, and activities in the daytime.

### 9. Unhealthy Monetization among Developers.
The majority of the travel planning products charged subscriptions (not accepted by people who do not travel frequently) or were completely free with no viable business concept. We do not have the well-crafted freemium models that provide actual value in the free version and entice with compelling premiums.

### 10. No Offline Access
Travelers are the ones who end up in the areas with limited internet connectivity (airports, remote locations, underground transport). To use most AI-powered travel tools, a person needs an active internet connection, and they do not offer the option of saved itineraries to a person offline.

---

# Chapter 3: Methodology

## 2.3 Gantt Chart (Timeline)

The development of TravelIT followed an Agile methodology with iterative sprints. Below is the project timeline represented as a Gantt chart:

```
Phase                          | Month 1 | Month 2 | Month 3 | Month 4 | Month 5 | Month 6 |
-------------------------------|---------|---------|---------|---------|---------|---------|
Requirement Analysis           | ██████  |         |         |         |         |         |
System Design & Architecture   | ███████ | ████    |         |         |         |         |
Database Schema Design         |         | ██████  |         |         |         |         |
Backend API Development        |         | ███████ | ██████  |         |         |         |
AI Integration (Gemini)        |         |         | ███████ | ████    |         |         |
External API Integration       |         |         | ████    | ██████  |         |         |
Mobile App UI Development      |         |         | ███████ | ███████ | ████    |         |
Authentication & Security      |         |         |         | ██████  |         |         |
Payment Integration            |         |         |         |         | ██████  |         |
Real-Time Features (Socket.io) |         |         |         |         | ███████ |         |
Route Optimization Algorithm   |         |         |         |         | ██████  |         |
Testing & Bug Fixes            |         |         |         |         | ███████ | ██████  |
Documentation & White Book     |         |         |         |         |         | ███████ |
Deployment & Submission        |         |         |         |         |         | ██████  |
```

## 3.1 Technologies Used and Their Description

### Frontend Technologies

| Technology | Version | Description |
|------------|---------|-------------|
| **React Native** | 0.81.5 | An open-source framework developed by Meta for building native mobile applications using JavaScript and React. It enables true native UI rendering (not WebView), providing smooth 60fps animations and access to native device APIs (camera, haptics, notifications). TravelIT uses React Native for both iOS and Android platforms from a single TypeScript codebase. |
| **Expo SDK** | 54 | A managed development platform built on top of React Native that simplifies building, deploying, and iterating on mobile apps. Expo provides pre-built native modules (camera, file system, notifications), over-the-air updates via EAS, and a streamlined development workflow. TravelIT uses Expo Router for file-based routing, Expo Image Picker for photo uploads, Expo Print for PDF generation, and Expo Notifications for push notifications. |
| **TypeScript** | 5.9 | A strongly-typed superset of JavaScript developed by Microsoft. TypeScript adds static type checking, interfaces, generics, and advanced type inference to JavaScript, catching bugs at compile time rather than runtime. All TravelIT frontend and backend code is written in TypeScript for maximum reliability and developer productivity. |
| **NativeWind** | 4.2 | A styling library that brings TailwindCSS utility classes to React Native. Instead of writing verbose StyleSheet objects, developers can apply responsive, consistent styles using familiar CSS class strings like `className="flex-1 p-4 bg-black"`. TravelIT uses NativeWind for all component styling with a custom theme system supporting dark mode. |
| **Zustand** | 5.0 | A lightweight, scalable state management library for React. Unlike Redux, Zustand has zero boilerplate, no providers, no reducers, and no action types. TravelIT uses Zustand for managing global application settings (theme preferences, haptic settings) through a persistent store backed by AsyncStorage. |
| **TanStack React Query** | 5.90 | A powerful server state management library that handles caching, background refetching, stale-while-revalidate, optimistic updates, and pagination. TravelIT uses React Query for all API calls (itinerary CRUD, user profile, bookmarks, explore search), providing automatic cache management and loading/error states. |
| **React Native Reanimated** | 4.1 | A high-performance animation library that runs animations on the native UI thread (not JavaScript thread), enabling smooth 60fps animations even during heavy computation. TravelIT uses Reanimated for the step progress bar animation in the trip planning wizard, fade-in transitions for form steps, and card swipe animations in Trip Tinder. |
| **Socket.io Client** | 4.8 | A real-time, bidirectional, event-driven communication library. TravelIT's mobile app connects to the backend Socket.io server for the Trip Tinder feature, enabling real-time room creation, user joining, activity voting, and result broadcasting. |
| **Cashfree React Native SDK** | 2.2 | Native SDK for integrating Cashfree payment gateway into React Native apps. TravelIT uses the Drop Checkout mode where the SDK handles the complete payment UI (card entry, UPI, net banking) and returns verified payment callbacks. |
| **Lucide React Native** | 0.561 | A collection of over 1,000 beautifully crafted open-source SVG icons optimized for React Native. TravelIT uses Lucide icons throughout the UI for consistent, scalable iconography. |
| **React Native Deck Swiper** | 2.0 | A Tinder-like card swiping component for React Native. TravelIT uses this for the Trip Tinder feature where users swipe right (approve) or left (reject) on proposed activities. |
| **React Native Draggable FlatList** | 4.0 | A drag-and-drop reorderable list component. TravelIT uses this in the trip detail view's Edit Mode, allowing users to drag activities to reorder their day plans. |

### Backend Technologies

| Technology | Version | Description |
|------------|---------|-------------|
| **Node.js** | 22+ | A JavaScript runtime built on Chrome's V8 engine that enables server-side JavaScript execution. TravelIT's backend runs on Node.js with ES module support (`"type": "module"`) for modern import/export syntax. |
| **Express** | 5.2 | The most popular Node.js web framework. Express 5 (the latest major version) provides routing, middleware support, error handling, and HTTP utility methods. TravelIT uses Express for all RESTful API endpoints with middleware chains for authentication, validation, rate limiting, and error handling. |
| **MongoDB** | Cloud (Atlas) | A NoSQL document database that stores data in flexible, JSON-like BSON documents. MongoDB is ideal for TravelIT because itineraries have deeply nested structures (days → activities → coordinates) that map naturally to document model. The schema-less nature allows easy evolution of the data model. |
| **Mongoose** | 9.1 | An ODM (Object Document Mapper) for MongoDB that provides schema validation, type casting, query building, and middleware hooks. TravelIT defines strict Mongoose schemas for User and Itinerary models with TypeScript interfaces for type safety. |
| **Google Gemini AI (@google/genai)** | 1.35 | Google's latest family of multimodal AI models. TravelIT uses **Gemini 2.5 Flash** — Google's fastest and most efficient model — for all AI operations: itinerary generation, location exploration with Google Search grounding, trending destination suggestions, and itinerary modification (weather/delay/AI edit). The `responseMimeType: "application/json"` feature ensures structured JSON output. |
| **Clerk (@clerk/express)** | 1.7 | A complete authentication platform that provides sign-up, sign-in, multi-factor authentication, social login (Google, GitHub), and session management. TravelIT uses Clerk for JWT-based authentication with the `clerkMiddleware()` and `getAuth()` functions to verify user identity on every protected API request. |
| **Cloudinary** | 2.9 | A cloud-based image and video management platform. TravelIT uses Cloudinary for two purposes: (1) uploading user profile avatars to the `travelit_avatars` folder, and (2) uploading trip photos to the `trip_vault` folder. Images are automatically optimized (resized to 1080px width, auto quality, auto format) to minimize storage and bandwidth. |
| **Cashfree PG** | 5.1 | India's leading payment gateway supporting UPI, credit/debit cards, net banking, and wallets. TravelIT integrates Cashfree in Sandbox mode for the Pro subscription payment flow. The backend creates orders (`PGCreateOrder`) and verifies payment status (`PGFetchOrder`) to activate Pro features. |
| **Socket.io** | 4.8 | A library for real-time, bidirectional communication between server and clients using WebSockets with automatic fallback to long-polling. TravelIT's Trip Tinder feature uses Socket.io for room management (create/join rooms), real-time activity voting (swipe events), and broadcasting results (match/discard/complete). |
| **Arcjet** | 1.0-beta | A security-as-code platform for rate limiting, bot detection, and DDoS protection. TravelIT uses Arcjet to protect the AI itinerary generation endpoint from abuse, implementing token bucket rate limiting and automated bot/spoofed request detection. |
| **Zod** | 4.2 | A TypeScript-first schema validation library. TravelIT defines Zod schemas for all API request bodies (generate itinerary, save itinerary, modify itinerary, explore location, optimize route, update user profile) and validates them via a custom middleware that returns structured error messages. |
| **Multer** | 2.0 | A middleware for handling `multipart/form-data` file uploads. TravelIT uses Multer with disk storage for temporary file handling during avatar and trip photo uploads before forwarding to Cloudinary. |

### External APIs

| API | Provider | Description |
|-----|----------|-------------|
| **Google Places API** | Google Cloud | Used for place verification (Text Search + Place Details), fetching coordinates, opening hours, ratings, photos, price levels, and formatted addresses for every activity in the itinerary. |
| **Google Distance Matrix API** | Google Cloud | Calculates real driving/transit times between all pairs of activities in a day, providing the distance matrix needed for route optimization. |
| **Booking.com Hotels API** | RapidAPI | Searches for hotels at the destination, filtered by check-in/check-out dates, number of travelers, and budget. Returns hotel details including pricing, ratings, reviews, and photos. |
| **Booking.com Flights API** | RapidAPI | Searches for flights between source and destination cities, returning pricing, airline details, departure/arrival times, duration, and number of stops. |
| **Expo Push Notification Service** | Expo | Sends push notifications to users' devices when trips are saved or Pro subscriptions are activated. |

## 3.2 Event Table

The following event table describes the major events/triggers in the TravelIT system, their sources, and resulting actions:

| Event ID | Event Name | Source/Trigger | Response/Action | Data Involved |
|----------|-----------|----------------|----------------|---------------|
| E01 | User SignUp | User taps "Create Account" | Clerk creates user → Backend syncs user to MongoDB | Email, password, firstName, lastName |
| E02 | User SignIn | User enters credentials | Clerk authenticates → JWT token issued → User synced | Email, password, clerkId |
| E03 | Social Login (Google/GitHub) | User taps social login button | Clerk OAuth flow → SSO callback → User synced | OAuth token, profile data |
| E04 | Generate Itinerary | User submits trip form (Step 3) | Backend validates input → Gemini AI generates itinerary → Places verified → Hotels/Flights fetched → Response sent | source, destination, duration, budget, interests, dates |
| E05 | Save Itinerary | User taps "Save to Vault" on result screen | Backend re-verifies places → Creates Itinerary document → Push notification sent | Full itinerary data, hotel, flight, costs |
| E06 | View Trip | User taps a trip card in Vault | Mobile fetches trip details from cache/API → Renders detailed view | itineraryId, tripDetails, hotel, flight |
| E07 | Edit Trip Order | User enables Edit Mode and drags activities | DraggableFlatList reorders → PATCH request updates backend | itineraryId, reordered tripDetails |
| E08 | Delete Activity | User taps trash icon in Edit Mode | Activity removed from local state → PATCH request updates backend | itineraryId, activityUniqueId |
| E09 | Weather Adaptation | User taps "Adapt for Rain" | Gemini AI modifies selected day → Outdoor activities replaced with indoor → Places re-verified | itineraryId, dayNumber |
| E10 | Delay Handling | User taps "Handle Delay" | Gemini AI shifts timing of selected day → Activities rescheduled → Places re-verified | itineraryId, dayNumber, delayHours |
| E11 | AI Chat Edit | User sends natural language prompt | Gemini AI interprets prompt → Modifies itinerary accordingly → Places re-verified | itineraryId, userPrompt |
| E12 | Route Optimization | User taps "Optimize" on a day | Activities sent to backend → Distance Matrix fetched → Permutation optimizer finds best route → Updated order returned | activities[], dayStartTime |
| E13 | Create Tinder Room | Host taps "Group Sync" | Socket.io creates room → Room ID generated → Activities formatted → Host joins room | userId, activities[], targetUsersCount |
| E14 | Join Tinder Room | Guest enters Room ID | Socket.io validates room → Guest added → Current activity sent | roomId, userId |
| E15 | Swipe Activity | User swipes right/left | Vote recorded → If all users voted: activity matched or discarded → Next activity sent | roomId, activityId, direction |
| E16 | Swiping Completed | All activities voted | Confirmed itinerary broadcast to all room users → Room marked completed | confirmedItinerary[] |
| E17 | Explore Location | User types query and taps search | Gemini AI with Google Search grounding → Recommendations generated → Places verified with photos/ratings | query string |
| E18 | Toggle Bookmark | User taps bookmark icon on explore result | Backend toggles place in user's savedPlaces array | place object (name, address, image, rating) |
| E19 | Upgrade to Pro | User taps "Pay ₹499" | Backend creates Cashfree order → Mobile opens payment UI → On success: payment verified → isPro set to true → Push notification sent | orderId, payment session |
| E20 | Upload Trip Photo | User picks image from gallery | Image uploaded via FormData → Cloudinary processes → URL saved to itinerary.userPhotos | tripId, photo file |
| E21 | Export PDF | User taps PDF button | expo-print generates PDF from trip data → expo-sharing shares PDF | trip object |
| E22 | Update Trip Status | User changes status (Draft→Active→Completed) | PATCH request updates status in backend | itineraryId, status |
| E23 | Fetch Trending | Home screen loads | Backend checks cache → If stale: Gemini AI generates trending destinations → Places API enriches with photos | 3 trending destinations |
| E24 | Push Token Save | App launches / notifications enabled | Expo generates push token → Sent to backend → Saved in user document | pushToken string |

## 3.3 Use Case Diagram and Basic Scenarios & Use Case Description

### Use Case Diagram

```
                              ┌─────────────────────────────────────────────────┐
                              │              TravelIT System                    │
                              │                                                 │
                              │  ┌──────────────┐    ┌───────────────────┐      │
                              │  │  Sign Up /    │    │  Generate         │      │
                  ┌───┐       │  │  Sign In      │    │  AI Itinerary     │      │
                  │   │───────┤──│              │    │                   │      │
                  │   │       │  └──────────────┘    └───────────────────┘      │
                  │   │       │                                                 │
                  │ U │       │  ┌──────────────┐    ┌───────────────────┐      │
                  │ S │───────┤──│  Save Trip    │    │  View/Manage      │      │
                  │ E │       │  │  to Vault     │    │  Trips (Vault)    │      │
                  │ R │       │  └──────────────┘    └───────────────────┘      │
                  │   │       │                                                 │
                  │   │       │  ┌──────────────┐    ┌───────────────────┐      │       ┌──────────┐
                  │   │───────┤──│  Explore      │    │  Modify Trip      │──────┤───────│ Gemini   │
                  │   │       │  │  Locations    │    │  (Weather/Delay)  │      │       │ AI       │
                  └───┘       │  └──────────────┘    └───────────────────┘      │       └──────────┘
                              │                                                 │
                  ┌───┐       │  ┌──────────────┐    ┌───────────────────┐      │       ┌──────────┐
                  │ P │───────┤──│  Upgrade to   │    │  AI Chat          │──────┤───────│ Cashfree │
                  │ R │       │  │  Pro          │    │  Edit Trip        │      │       │ Payment  │
                  │ O │       │  └──────────────┘    └───────────────────┘      │       └──────────┘
                  │   │       │                                                 │
                  │ U │       │  ┌──────────────┐    ┌───────────────────┐      │       ┌──────────┐
                  │ S │───────┤──│  Trip Tinder  │    │  Route            │──────┤───────│ Google   │
                  │ E │       │  │  (Grp Sync)   │    │  Optimization     │      │       │ APIs     │
                  │ R │       │  └──────────────┘    └───────────────────┘      │       └──────────┘
                  │   │       │                                                 │
                  │   │       │  ┌──────────────┐    ┌───────────────────┐      │       ┌──────────┐
                  │   │───────┤──│  Export PDF   │    │  Upload Photos    │──────┤───────│Cloudinary│
                  └───┘       │  └──────────────┘    └───────────────────┘      │       │Booking   │
                              │                                                 │       └──────────┘
                              └─────────────────────────────────────────────────┘
```

### Use Case Descriptions

**UC-01: Generate AI Itinerary**
| Field | Description |
|-------|-------------|
| **Actor** | Registered User |
| **Precondition** | User is authenticated and on the Plan screen |
| **Flow** | 1. User fills Step 1 (source, destination, days, budget, currency, budget tier) → 2. User fills Step 2 (trip dates, hotel dates, travelers, age group) → 3. User fills Step 3 (safety mode, interests) → 4. User taps "Generate Trip" → 5. System validates all inputs via Zod → 6. System checks rate limit via Arcjet → 7. Gemini AI generates day-by-day itinerary → 8. Each place verified via Google Places API → 9. Hotels fetched from Booking.com → 10. Flights fetched from Booking.com → 11. Complete result returned to mobile |
| **Postcondition** | User sees AI-generated itinerary on Result screen |
| **Alternate Flow** | If rate limited → user sees "Too many requests" error; If AI returns invalid JSON → user sees retry error |

**UC-02: Trip Tinder (Group Sync)**
| Field | Description |
|-------|-------------|
| **Actor** | Host User, Guest User(s) |
| **Precondition** | Itinerary saved, travelers > 1, trip is in "draft" status |
| **Flow** | 1. Host taps "Group Sync" on trip detail → 2. Socket.io creates room with unique ID (TRIP-XXXX) → 3. Host shares Room ID with guests → 4. Guest enters Room ID and joins → 5. First activity card displayed to all users → 6. Each user swipes right (approve) or left (reject) → 7. When all users vote: majority wins → activity matched or discarded → 8. Next activity displayed → 9. After all activities: confirmed itinerary shown to all users |
| **Postcondition** | Group has collectively decided on their shared itinerary |

**UC-03: Real-Time Weather Adaptation**
| Field | Description |
|-------|-------------|
| **Actor** | Pro User |
| **Precondition** | User has a saved itinerary and is a Pro subscriber |
| **Flow** | 1. User taps "Adapt for Rain" → 2. Selects affected day → 3. Gemini AI identifies outdoor activities → 4. Replaces with nearby indoor alternatives → 5. New activities verified via Google Places → 6. Updated itinerary saved |
| **Postcondition** | Selected day's outdoor activities replaced with weather-appropriate indoor alternatives |

## 3.4 Entity-Relationship Diagram

```
┌─────────────────────────────────────┐         ┌──────────────────────────────────────────────┐
│              USER                    │         │              ITINERARY                        │
├─────────────────────────────────────┤         ├──────────────────────────────────────────────┤
│ _id (ObjectId) [PK]                 │         │ _id (ObjectId) [PK]                           │
│ clerkId (String) [Unique, Index]    │         │ userId (ObjectId) [FK → User._id]             │
│ email (String) [Unique]             │         │ source (String)                               │
│ firstName (String)                  │         │ destination (String)                           │
│ lastName (String)                   │    1    │ sourceMeta { city, autoDetected }              │
│ username (String)                   │─────────│ duration (Number)                              │
│ avatar (String)                     │ creates │ tripStartDate (Date)                           │
│ savedPlaces [{                      │  many   │ tripEndDate (Date)                             │
│   name, address, description,       │         │ budgetTier (Enum: low/medium/high)             │
│   image, rating                     │         │ budget (Number)                                │
│ }]                                  │         │ currency (String)                              │
│ isPro (Boolean)                     │         │ interests [String]                             │
│ razorpayOrderId (String)            │         │ travelers (Number)                             │
│ razorpayPaymentId (String)          │         │ ageGroup (Enum: family/young/adults/seniors)   │
│ proActivatedAt (Date)               │         │ safeMode (Boolean)                             │
│ pushToken (String)                  │         │ tripTitle (String)                             │
│ generationsCount (Number)           │         │ tripDescription (String)                       │
│ createdAt (Date)                    │         │ tripDetails [DayPlan]                          │
│ updatedAt (Date)                    │         │ hotel (HotelSnapshot)                          │
└─────────────────────────────────────┘         │ flight (FlightSnapshot)                        │
                                                │ estimatedCosts { accommodation, flight,        │
                                                │                  activities, total }           │
                                                │ userPhotos [String]                            │
                                                │ status (Enum: draft/active/completed)          │
                                                │ createdAt (Date)                               │
                                                │ updatedAt (Date)                               │
                                                └──────────────────────────────────────────────┘
                                                         │ contains many
                                                         ▼
                                                ┌──────────────────────────┐
                                                │       DAY_PLAN           │
                                                ├──────────────────────────┤
                                                │ day (Number)             │
                                                │ theme (String)           │
                                                │ activities [Activity]    │
                                                └──────────────────────────┘
                                                         │ contains many
                                                         ▼
                                                ┌──────────────────────────────────────┐
                                                │            ACTIVITY                   │
                                                ├──────────────────────────────────────┤
                                                │ time (String)                         │
                                                │ activity (String)                     │
                                                │ location (String)                     │
                                                │ description (String)                  │
                                                │ estimatedCost (Number)                │
                                                │ coordinates { lat, lng }              │
                                                │ verified (Boolean)                    │
                                                │ reason (String)                       │
                                                │ openingHours (String)                 │
                                                │ closedToday (Boolean)                 │
                                                │ seasonalWarning (String)              │
                                                │ rating (Number)                       │
                                                │ priceLevel (Number)                   │
                                                │ website (String)                      │
                                                │ formattedAddress (String)             │
                                                └──────────────────────────────────────┘
```

## 3.5 Flow Diagram

### Main Application Flow

```
                                    ┌─────────┐
                                    │  START  │
                                    └────┬────┘
                                         │
                                    ┌────▼────┐
                                    │  Is User │
                                    │  Logged  │──── No ──→ ┌───────────┐
                                    │  In?     │            │  Auth     │
                                    └────┬────┘            │  Screen   │
                                         │ Yes              └─────┬─────┘
                                         │                        │
                                         │      ┌────────────────┘
                                         ▼      ▼
                                    ┌───────────────┐
                                    │  HOME SCREEN  │
                                    │  (Dashboard)  │
                                    └───┬───┬───┬───┘
                            ┌───────────┘   │   └──────────┐
                            ▼               ▼              ▼
                    ┌──────────────┐ ┌──────────┐  ┌──────────────┐
                    │   PLAN TAB   │ │TRIPS TAB │  │ EXPLORE TAB  │
                    │  (3-step     │ │ (Vault)  │  │ (AI Search)  │
                    │   wizard)    │ └────┬─────┘  └──────┬───────┘
                    └──────┬───────┘      │               │
                           │              ▼               ▼
                    ┌──────▼───────┐ ┌──────────┐  ┌──────────────┐
                    │   GENERATE   │ │ TRIP      │  │ Search       │
                    │   (AI Call)  │ │ DETAIL    │  │ Results with │
                    └──────┬───────┘ │ VIEW      │  │ Bookmarks    │
                           │         └──┬──┬──┬──┘  └──────────────┘
                    ┌──────▼───────┐    │  │  │
                    │   RESULT     │    │  │  └── Route Optimize
                    │   SCREEN     │    │  └───── Weather/Delay
                    │  (Preview)   │    └──────── AI Chat / PDF
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  SAVE TO     │
                    │  VAULT       │
                    └──────────────┘
```

### AI Itinerary Generation Flow

```
User Input ──→ Zod Validation ──→ Rate Limit Check (Arcjet)
                                          │
                                    ┌─────▼──────┐
                                    │  Construct  │
                                    │  AI Prompt  │
                                    │  (Budget,   │
                                    │  Age, Safety│
                                    │  Rules)     │
                                    └─────┬──────┘
                                          │
                                    ┌─────▼──────┐
                                    │  Gemini 2.5 │
                                    │  Flash      │
                                    │  Generate   │
                                    └─────┬──────┘
                                          │
                                    ┌─────▼──────┐
                                    │  Parse JSON │
                                    │  Response   │
                                    └─────┬──────┘
                                          │
                              ┌───────────┼───────────┐
                              ▼           ▼           ▼
                        ┌──────────┐ ┌──────────┐ ┌──────────┐
                        │  Verify  │ │  Fetch   │ │  Fetch   │
                        │  Places  │ │  Hotels  │ │  Flights │
                        │  (Google │ │(Booking) │ │(Booking) │
                        │  Places) │ │          │ │          │
                        └────┬─────┘ └────┬─────┘ └────┬─────┘
                              │           │            │
                              └───────────┼────────────┘
                                          │
                                    ┌─────▼──────┐
                                    │  Combined  │
                                    │  Response  │
                                    │  → Client  │
                                    └────────────┘
```

## 3.6 Class Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Express Application                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │                   Middleware Chain                  │   │
│  │  cors → json → urlencoded → clerkMiddleware       │   │
│  └──────────────────────────────────────────────────┘   │
│            │                │                │           │
│     ┌──────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐  │
│     │ userRoutes  │  │itinerary   │  │ payment     │  │
│     │             │  │Routes      │  │ Routes      │  │
│     └──────┬──────┘  └─────┬──────┘  └──────┬──────┘  │
│            │               │                │          │
│  ┌─────────▼─────────┐ ┌──▼──────────────┐ ┌▼────────┐│
│  │  UserController   │ │ AiController    │ │Payment  ││
│  │  ─────────────────│ │ ItinController  │ │Control  ││
│  │ +syncUser()       │ │ ────────────────│ │─────────││
│  │ +getCurrentUser() │ │ +generateItin() │ │+create  ││
│  │ +updateProfile()  │ │ +createItin()   │ │ Order() ││
│  │ +toggleBookmark() │ │ +getUserItins() │ │+verify  ││
│  │ +getBookmarks()   │ │ +updateStatus() │ │Payment()││
│  │ +savePushToken()  │ │ +deleteTrip()   │ └─────────┘│
│  └─────────┬─────────┘ │ +modifyItin()   │            │
│            │            │ +optimizeRoute()│            │
│            │            │ +uploadPhoto()  │            │
│            │            │ +exploreLocation│            │
│            │            │ +getTrending()  │            │
│            │            └──┬──────────────┘            │
│  ┌─────────▼──────────────▼───────────────┐            │
│  │              Models                      │            │
│  │  ┌────────────┐   ┌───────────────┐     │            │
│  │  │   User     │   │   Itinerary   │     │            │
│  │  │ (Mongoose) │   │  (Mongoose)   │     │            │
│  │  └────────────┘   └───────────────┘     │            │
│  └──────────────────────────────────────────┘            │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Services                          │  │
│  │  ┌────────────┐ ┌──────────┐ ┌─────────────────┐ │  │
│  │  │placeVerify │ │hotelSvc  │ │routeOptimizer   │ │  │
│  │  │ +verify()  │ │+getHotels│ │+optimizeItin()  │ │  │
│  │  └────────────┘ └──────────┘ │+fetchDistMatrix()│ │  │
│  │  ┌────────────┐              │+evaluateRoute() │ │  │
│  │  │flightSvc   │              │+generatePerm()  │ │  │
│  │  │+getFlights │              └─────────────────┘ │  │
│  │  │+getFlightLo│                                   │  │
│  │  └────────────┘                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │          Sockets (Socket.io)                       │  │
│  │  ┌─────────────────────────┐                      │  │
│  │  │  tripTinderSocket       │                      │  │
│  │  │  +create_room           │                      │  │
│  │  │  +join_room             │                      │  │
│  │  │  +swipe                 │                      │  │
│  │  │  +disconnect            │                      │  │
│  │  └─────────────────────────┘                      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 3.7 Sequence Diagram

### Itinerary Generation Sequence

```
User          Mobile App       Backend API       Gemini AI      Google Places    Booking.com
 │                │                │                │                │               │
 │  Fill Form     │                │                │                │               │
 │───────────────>│                │                │                │               │
 │                │  POST /generate│                │                │               │
 │                │───────────────>│                │                │               │
 │                │                │  Validate (Zod)│                │               │
 │                │                │──────┐         │                │               │
 │                │                │<─────┘         │                │               │
 │                │                │  Rate Limit    │                │               │
 │                │                │  (Arcjet)      │                │               │
 │                │                │──────┐         │                │               │
 │                │                │<─────┘         │                │               │
 │                │                │  Send Prompt   │                │               │
 │                │                │───────────────>│                │               │
 │                │                │  JSON Response │                │               │
 │                │                │<───────────────│                │               │
 │                │                │                │                │               │
 │                │                │  For each activity:             │               │
 │                │                │  verifyPlace() │                │               │
 │                │                │────────────────────────────────>│               │
 │                │                │  Place Details + Coords         │               │
 │                │                │<────────────────────────────────│               │
 │                │                │                │                │               │
 │                │                │  getHotels()   │                │               │
 │                │                │───────────────────────────────────────────────>│
 │                │                │  Best Hotel    │                │               │
 │                │                │<──────────────────────────────────────────────│
 │                │                │  getFlights()  │                │               │
 │                │                │───────────────────────────────────────────────>│
 │                │                │  Best Flight   │                │               │
 │                │                │<──────────────────────────────────────────────│
 │                │                │                │                │               │
 │                │  Combined JSON │                │                │               │
 │                │<───────────────│                │                │               │
 │  Show Result   │                │                │                │               │
 │<───────────────│                │                │                │               │
```

### Trip Tinder Sequence

```
Host           Guest          Backend Socket.io
 │                │                │
 │  create_room   │                │
 │───────────────────────────────>│
 │  room_created (TRIP-XXXX)      │
 │<───────────────────────────────│
 │                │                │
 │  Share Room ID │                │
 │───────────────>│                │
 │                │  join_room     │
 │                │───────────────>│
 │  user_joined   │  room_joined  │
 │<───────────────│<──────────────│
 │                │                │
 │  swipe (right) │                │
 │───────────────────────────────>│
 │                │  swipe (left)  │
 │                │───────────────>│
 │                │                │
 │  activity_matched / discarded  │
 │<───────────────────────────────│
 │                │<──────────────│
 │                │                │
 │  next_activity │  next_activity│
 │<───────────────│<──────────────│
 │                │                │
 │  (repeat until all activities) │
 │                │                │
 │  swiping_completed             │
 │<───────────────────────────────│
 │                │<──────────────│
```

## 3.8 State Diagram

### Itinerary Status State Diagram

```
                    ┌──────────────┐
          ┌────────>│              │
          │         │    DRAFT     │
          │         │              │
          │         └──────┬───────┘
          │                │
          │         User activates trip
          │                │
          │         ┌──────▼───────┐
          │         │              │
          │         │    ACTIVE    │
          │         │              │
          │         └──────┬───────┘
          │                │
          │         User completes trip
          │                │
          │         ┌──────▼───────┐
          │         │              │
          └─────────│  COMPLETED   │
           (Reset)  │              │
                    └──────────────┘
```

### User Subscription State Diagram

```
     ┌──────────────┐      Payment Success      ┌──────────────┐
     │              │ ───────────────────────────>│              │
     │  FREE USER   │                            │   PRO USER   │
     │  (Default)   │                            │  (Lifetime)  │
     │              │                            │              │
     └──────────────┘                            └──────────────┘
     Features:                                    Features:
     - 3 AI generations                           - Unlimited AI generations
     - Save trips                                 - AI Chat editing
     - Basic explore                              - Route optimization
     - View trips                                 - Weather/Delay logic
                                                  - PDF export
                                                  - Trip Tinder (Group Sync)
```

## 3.9 Menu Tree

```
TravelIT App
├── 🔐 Auth Stack (Unauthenticated)
│   ├── Sign In
│   │   ├── Email Sign In
│   │   └── Social Login (Google / GitHub)
│   ├── Sign Up
│   │   ├── Email Registration
│   │   └── Email Verification (OTP)
│   ├── Forgot Password
│   │   ├── Send Reset Code
│   │   └── Verify & Reset Password
│   └── SSO Callback
│
├── 🏠 Home Tab
│   ├── Trending Destinations (AI-powered, refreshed daily)
│   ├── Trip Statistics (Planned / Completed counts)
│   └── "Start Planning" CTA Button
│
├── ✈️ Plan Tab
│   ├── Step 1: Trip Basics
│   │   ├── Source City
│   │   ├── Destination
│   │   ├── Number of Days
│   │   ├── Maximum Budget
│   │   ├── Currency Selection (USD/EUR/INR/GBP)
│   │   └── Budget Tier (Low/Medium/High)
│   ├── Step 2: Dates & Travelers
│   │   ├── Trip Start Date (Date Picker)
│   │   ├── Trip End Date (Auto-calculated)
│   │   ├── Hotel Check-in Date
│   │   ├── Hotel Check-out Date (Auto)
│   │   ├── Number of Travelers
│   │   └── Age Category (Young/Adults/Family/Seniors)
│   ├── Step 3: Preferences
│   │   ├── Safety Mode Toggle
│   │   └── Interests (Comma-separated)
│   └── Result Screen
│       ├── Trip Title & Description
│       ├── Day-by-Day Activities
│       ├── Hotel Recommendation Card
│       ├── Flight Recommendation Card
│       ├── Cost Breakdown
│       └── "Save to Vault" Button
│
├── 📋 Trips Tab (Vault)
│   ├── All Trips List
│   │   ├── Filter: All / Draft / Active / Completed
│   │   ├── Trip Cards (title, destination, duration, status)
│   │   └── Delete Trip (Swipe/Button)
│   ├── Trip Detail View
│   │   ├── Trip Header (title, destination, days, status badge)
│   │   ├── Meta Cards (Travelers / Age Group / Safety)
│   │   ├── Action Bar
│   │   │   ├── Edit Order (Drag-and-Drop Mode)
│   │   │   ├── Chat with AI (Pro)
│   │   │   └── Export PDF (Pro)
│   │   ├── Trip Description
│   │   ├── Cost Breakdown Panel
│   │   ├── Real-Time Logic Panel
│   │   │   ├── Adapt for Rain (Pro)
│   │   │   └── Handle Delay (Pro)
│   │   ├── Flight Card
│   │   ├── Hotel Card → Hotel Details Modal
│   │   ├── Group Sync (Trip Tinder) Button
│   │   ├── Day-by-Day Timeline
│   │   │   ├── Day Header (number + theme)
│   │   │   ├── Optimize Route Button (Pro)
│   │   │   └── Activity Cards
│   │   │       ├── Verification Badge
│   │   │       ├── Time Slot
│   │   │       ├── Activity Name & Location
│   │   │       ├── Description
│   │   │       └── Estimated Cost
│   │   └── Status Update Buttons
│   └── Trip Tinder Screen
│       ├── Room Creation / Join
│       ├── Activity Swipe Cards
│       └── Results Summary
│
├── 🔍 Explore Tab
│   ├── Search Bar (AI-powered)
│   ├── Suggestion Chips ("Best coffee in Seattle", etc.)
│   ├── AI Summary Text
│   ├── Place Cards (photo, name, rating, address, description)
│   │   └── Bookmark Toggle Button
│   ├── Source Links (Google Grounding)
│   └── Clear Search Button
│
└── 👤 Profile Tab
    ├── Profile Card (Avatar, Name, Email, Pro Badge)
    ├── Edit Profile
    │   ├── Avatar Upload (Camera/Gallery → Cloudinary)
    │   ├── First Name / Last Name
    │   └── Username
    ├── Saved Preferences (Bookmarked Places)
    ├── App Settings
    │   ├── Theme (System/Light/Dark)
    │   └── Haptic Feedback Toggle
    ├── Subscription
    │   ├── Current Plan Display
    │   ├── Pro Plan Features List
    │   └── "Upgrade Now — Pay ₹499" Button
    ├── Help & FAQ
    │   ├── FAQ Accordion Items
    │   └── Contact / Support Info
    └── Sign Out
```

---

# Chapter 4: Implementation

## 4.1 List of Tables with Attributes and Constraints

### Table 1: Users Collection

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| _id | ObjectId | PK, Auto-generated | Unique identifier for the user |
| clerkId | String | Required, Unique, Indexed | ID from Clerk authentication provider |
| email | String | Required, Unique | User's email address |
| firstName | String | Default: "" | User's first name |
| lastName | String | Default: "" | User's last name |
| username | String | Default: "" | Display username |
| avatar | String | Default: "" | Cloudinary URL for profile picture |
| savedPlaces | Array of Objects | Default: [] | Bookmarked places from Explore |
| savedPlaces[].name | String | Required | Place name |
| savedPlaces[].address | String | Optional | Place formatted address |
| savedPlaces[].description | String | Optional | Short description of the place |
| savedPlaces[].image | String | Optional | Google Places photo URL |
| savedPlaces[].rating | Number | Optional | Place rating (1-5) |
| isPro | Boolean | Default: false | Whether user has Pro subscription |
| razorpayOrderId | String | Optional | Cashfree order ID for payment tracking |
| razorpayPaymentId | String | Optional | Cashfree payment ID for verification |
| proActivatedAt | Date | Optional | When Pro was activated |
| pushToken | String | Optional | Expo push notification token |
| generationsCount | Number | Default: 0 | Number of AI itineraries generated |
| createdAt | Date | Auto (timestamps) | Document creation time |
| updatedAt | Date | Auto (timestamps) | Document last update time |

### Table 2: Itineraries Collection

| Attribute | Data Type | Constraints | Description |
|-----------|-----------|-------------|-------------|
| _id | ObjectId | PK, Auto-generated | Unique itinerary identifier |
| userId | ObjectId | Required, FK → Users._id, Indexed | Owner of this itinerary |
| source | String | Required | Source city/location |
| destination | String | Required | Destination city/location |
| sourceMeta.city | String | Optional | Detected source city name |
| sourceMeta.autoDetected | Boolean | Optional | Whether source was auto-detected |
| duration | Number | Required, Min: 1, Max: 15 | Trip duration in days |
| tripStartDate | Date | Required | Trip start date |
| tripEndDate | Date | Required | Trip end date |
| budgetTier | String | Enum: "low", "medium", "high" | Budget category |
| budget | Number | Required, Min: 100 | Maximum budget amount |
| currency | String | Default: "USD" | Budget currency code |
| interests | Array of Strings | Optional | User's travel interests |
| travelers | Number | Required, Min: 1 | Number of travelers |
| ageGroup | String | Enum: "family", "young", "adults", "seniors" | Age category |
| safeMode | Boolean | Default: false | Safety-prioritized planning |
| tripTitle | String | Required | AI-generated trip title |
| tripDescription | String | Required | AI-generated trip summary |
| tripDetails | Array of DayPlan | Required | Day-by-day itinerary |
| tripDetails[].day | Number | Required | Day number (1-indexed) |
| tripDetails[].theme | String | Optional | Day's theme |
| tripDetails[].activities | Array of Activity | Required | Activities for the day |
| hotel | Mixed (Object) | Optional | Hotel recommendation snapshot |
| hotel.name | String | - | Hotel name |
| hotel.totalPrice | Number | - | Total accommodation cost |
| hotel.rating | Number | - | Hotel rating out of 10 |
| hotel.reviewCount | Number | - | Number of reviews |
| hotel.photos | Array of Strings | - | Hotel photo URLs |
| flight | Mixed (Object) | Optional | Flight recommendation snapshot |
| flight.airline | String | - | Airline name |
| flight.price | Number | - | One-way flight price |
| flight.duration | String | - | Flight duration |
| estimatedCosts | Object | Optional | Cost breakdown |
| estimatedCosts.accommodation | Number | - | Total hotel cost |
| estimatedCosts.flight | Number | - | Total flight cost (round trip × travelers) |
| estimatedCosts.activities | Number | - | Total activities cost |
| estimatedCosts.total | Number | - | Grand total estimated cost |
| userPhotos | Array of Strings | Default: [] | Cloudinary URLs of user-uploaded trip photos |
| status | String | Enum: "draft", "active", "completed" | Trip lifecycle status |
| createdAt | Date | Auto (timestamps) | Document creation time |
| updatedAt | Date | Auto (timestamps) | Document last update time |

### Activity Sub-Document Structure

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| time | String | Time range (e.g., "10:00 AM - 12:00 PM") |
| activity | String | Activity name |
| location | String | Place name or address |
| description | String | Activity description |
| estimatedCost | Number | Cost per person in trip currency |
| coordinates.lat | Number | Latitude (from Google Places) |
| coordinates.lng | Number | Longitude (from Google Places) |
| verified | Boolean | Whether place was verified via Google Places |
| reason | String | Reason if verification failed |
| openingHours | String | Opening hours from Google Places |
| closedToday | Boolean | Whether place is closed on visit day |
| seasonalWarning | String | Seasonal availability warning |
| rating | Number | Google Places rating |
| priceLevel | Number | Google Places price level (0-4) |
| website | String | Place website URL |
| formattedAddress | String | Full formatted address from Google |

## 4.2 System Coding

### 4.2.1 Backend Entry Point (index.ts)

The main server file initializes Express, Socket.io, connects to MongoDB, and mounts all route handlers with middleware chains:

```typescript
// backend/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/userRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { setupTripTinderSocket } from "./sockets/tripTinderSocket.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/payment", paymentRoutes);

// Socket.io Setup
setupTripTinderSocket(io);

// Error handling
app.use(errorHandler);

// Start server
connectDB().then(() => {
    server.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
});
```

### 4.2.2 User Model (User.ts)

The User model stores authentication data synced from Clerk, user profiles, bookmarked places, and subscription information:

```typescript
// backend/src/models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true, index: true },
    email:   { type: String, required: true, unique: true },
    firstName: { type: String, default: "" },
    lastName:  { type: String, default: "" },
    username:  { type: String, default: "" },
    avatar:    { type: String, default: "" },
    savedPlaces: [{
        name: String,
        address: String,
        description: String,
        image: String,
        rating: Number,
    }],
    isPro: { type: Boolean, default: false },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    proActivatedAt: Date,
    pushToken: String,
    generationsCount: { type: Number, default: 0 },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
```

### 4.2.3 Itinerary Model (Itinerary.ts)

The Itinerary model stores the complete trip data with deeply nested structures for day plans, activities, hotel snapshots, and flight snapshots:

```typescript
// backend/src/models/Itinerary.ts (Key excerpts)
const activitySchema = new mongoose.Schema({
    time: { type: String, required: true },
    activity: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    estimatedCost: { type: Number, required: true },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
    verified: Boolean,
    reason: String,
    openingHours: String,
    closedToday: Boolean,
    seasonalWarning: String,
    rating: Number,
    priceLevel: Number,
    website: String,
    formattedAddress: String,
}, { _id: false });

const dayPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    theme: { type: String },
    activities: [activitySchema],
}, { _id: false });

const itinerarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: Number, required: true },
    tripStartDate: { type: Date, required: true },
    tripEndDate: { type: Date, required: true },
    budgetTier: { type: String, enum: ["low", "medium", "high"], required: true },
    budget: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    travelers: { type: Number, required: true },
    ageGroup: { type: String, enum: ["family", "young", "adults", "seniors"] },
    safeMode: { type: Boolean, default: false },
    tripTitle: { type: String, required: true },
    tripDescription: { type: String, required: true },
    tripDetails: [dayPlanSchema],
    hotel: { type: mongoose.Schema.Types.Mixed },
    flight: { type: mongoose.Schema.Types.Mixed },
    estimatedCosts: {
        accommodation: Number, flight: Number,
        activities: Number, total: Number,
    },
    userPhotos: [{ type: String }],
    status: { type: String, enum: ["draft", "active", "completed"], default: "draft" },
}, { timestamps: true });
```

### 4.2.4 AI Itinerary Generation Controller (aiController.ts)

The core AI logic that constructs prompts with budget rules, safety guidelines, and age-group preferences, then calls Gemini 2.5 Flash:

```typescript
// backend/src/controllers/aiController.ts (Core generation logic)
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const generateItinerary = asyncHandler(async (req, res) => {
    const { source, destination, budgetTier, budget, currency, duration,
            interests, travelers, ageGroup, safeMode, tripStartDate,
            tripEndDate, checkInDate, checkOutDate } = req.body;

    // Construct the detailed AI prompt with strict rules
    const prompt = `You are an expert travel planner AI. Generate a trip from
    ${source} to ${destination} for ${duration} days.
    Budget: ${currency} ${budget} (${budgetTier} tier) for ${travelers} travelers.
    Age group: ${ageGroup}. Safety mode: ${safeMode ? "ON" : "OFF"}.
    ${interests?.length ? `Interests: ${interests.join(", ")}` : ""}

    RULES:
    - estimatedCost must be a NUMBER (not string)
    - All costs in ${currency}
    - ${budgetTier === "low" ? "Focus on free/cheap activities, street food"
        : budgetTier === "high" ? "Include premium restaurants, VIP experiences"
        : "Mix of paid and free activities"}
    ${safeMode ? "- SAFETY: Only well-lit, guided, popular tourist areas" : ""}
    ${ageGroup === "family" ? "- Include family-friendly, kid-safe activities" : ""}

    Return JSON: { tripTitle, tripDescription, tripDetails: [{ day, theme,
    activities: [{ time, activity, location, description, estimatedCost }] }] }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    const itinerary = JSON.parse(response.text!);

    // Verify all AI-generated places via Google Places API
    for (const day of itinerary.tripDetails) {
        for (const activity of day.activities) {
            const placeData = await verifyPlace(
                `${activity.location}, ${destination}`
            );
            if (placeData) {
                activity.coordinates = placeData.coordinates;
                activity.verified = true;
                activity.rating = placeData.rating;
                activity.formattedAddress = placeData.formattedAddress;
                activity.openingHours = placeData.openingHours;
            } else {
                activity.verified = false;
            }
        }
    }

    // Fetch hotel and flight recommendations in parallel
    const [hotels, flights] = await Promise.all([
        getHotels(destination, checkInDate, checkOutDate, travelers, budget, currency),
        getFlights(source, destination, tripStartDate, tripEndDate),
    ]);

    res.status(200).json(new ApiResponse(200, "Itinerary generated", {
        ...itinerary, hotel: hotels, flight: flights
    }));
});
```

### 4.2.5 Place Verification Service (placeVerifier.ts)

Verifies that AI-generated places actually exist by querying the Google Places API:

```typescript
// backend/src/services/placeVerifier.ts
export const verifyPlace = async (placeName: string) => {
    try {
        // Step 1: Text Search to find the place
        const searchResponse = await fetch(
            `https://places.googleapis.com/v1/places:searchText`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
                    "X-Goog-FieldMask": "places.id,places.displayName,..."
                },
                body: JSON.stringify({ textQuery: placeName })
            }
        );
        const data = await searchResponse.json();
        if (!data.places?.length) return null;

        const place = data.places[0];

        // Step 2: Fetch detailed information
        return {
            coordinates: {
                lat: place.location.latitude,
                lng: place.location.longitude,
            },
            formattedAddress: place.formattedAddress,
            rating: place.rating,
            openingHours: place.currentOpeningHours?.weekdayDescriptions?.join(", "),
            closedToday: !place.currentOpeningHours?.openNow,
            seasonalWarning: place.businessStatus !== "OPERATIONAL"
                ? "Place may not be operational" : null,
            website: place.websiteUri,
            priceLevel: place.priceLevel,
            photos: place.photos?.slice(0, 3).map((p: any) =>
                `https://places.googleapis.com/v1/${p.name}/media?key=${key}&maxWidthPx=800`
            ),
        };
    } catch (error) {
        return null;
    }
};
```

### 4.2.6 Route Optimization Service (routeOptimizerService.ts)

Optimizes the order of activities within a day using permutation-based analysis and real travel times from Google Distance Matrix:

```typescript
// backend/src/services/routeOptimizerService.ts (Core algorithm)

// Generates all permutations of activities to find optimal order
function* generatePermutations<T>(arr: T[]): Generator<T[]> {
    if (arr.length <= 1) { yield [...arr]; return; }
    for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        for (const perm of generatePermutations(rest)) {
            yield [arr[i], ...perm];
        }
    }
}

// Evaluates a specific route order considering travel time + waiting
function evaluateRoute(order: Activity[], distMatrix: number[][]): RouteScore {
    let totalTravelMinutes = 0;
    let totalWaitingMinutes = 0;
    let currentTime = parseTimeToMinutes(order[0].time.split(" - ")[0]);

    for (let i = 0; i < order.length - 1; i++) {
        const travelTime = distMatrix[indexOf(order[i])][indexOf(order[i+1])];
        totalTravelMinutes += travelTime;
        currentTime += activityDuration(order[i]) + travelTime;

        const nextStart = parseTimeToMinutes(order[i+1].time.split(" - ")[0]);
        if (currentTime < nextStart) {
            totalWaitingMinutes += (nextStart - currentTime);
        }
    }
    return { totalTravelMinutes, totalWaitingMinutes,
             score: totalTravelMinutes + totalWaitingMinutes * 0.5 };
}

// Main optimization: tries all permutations, returns best route
export async function optimizeItinerary(activities: Activity[]) {
    const distMatrix = await fetchDistanceMatrix(activities);

    let bestRoute = null;
    let bestScore = Infinity;

    for (const perm of generatePermutations(activities)) {
        const score = evaluateRoute(perm, distMatrix);
        if (score.score < bestScore) {
            bestScore = score.score;
            bestRoute = perm;
        }
    }
    return recalculateTimings(bestRoute!, distMatrix);
}
```

### 4.2.7 Trip Tinder Socket Implementation (tripTinderSocket.ts)

Real-time multiplayer activity voting system using Socket.io:

```typescript
// backend/src/sockets/tripTinderSocket.ts
export const setupTripTinderSocket = (io: Server) => {
    const rooms = new Map<string, TinderRoom>();

    io.on("connection", (socket) => {
        // Host creates a new room with their trip's activities
        socket.on("create_room", ({ userId, activities, targetUsers }) => {
            const roomId = `TRIP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            rooms.set(roomId, {
                users: [{ id: socket.id, clerkId: userId }],
                activities: activities.map((a: any) => ({
                    ...a, votes: {}
                })),
                currentIndex: 0,
                targetUsers,
                confirmed: [],
                completed: false,
            });
            socket.join(roomId);
            socket.emit("room_created", { roomId });
        });

        // Guest joins an existing room by Room ID
        socket.on("join_room", ({ roomId, userId }) => {
            const room = rooms.get(roomId);
            if (!room) return socket.emit("error_msg", "Room not found");
            if (room.completed) return socket.emit("error_msg", "Room completed");

            room.users.push({ id: socket.id, clerkId: userId });
            socket.join(roomId);

            io.to(roomId).emit("user_joined",
                { userId, userCount: room.users.length });
            socket.emit("room_joined", { roomId,
                currentActivity: room.activities[room.currentIndex] });
        });

        // User swipes right (approve) or left (reject) on current activity
        socket.on("swipe", ({ roomId, activityIndex, direction }) => {
            const room = rooms.get(roomId);
            if (!room) return;

            const activity = room.activities[activityIndex];
            activity.votes[socket.id] = direction;

            // Check if all users have voted
            if (Object.keys(activity.votes).length === room.users.length) {
                const approvals = Object.values(activity.votes)
                    .filter(v => v === "right").length;

                if (approvals > room.users.length / 2) {
                    room.confirmed.push(activity);
                    io.to(roomId).emit("activity_matched", { activity });
                } else {
                    io.to(roomId).emit("activity_discarded", { activity });
                }

                room.currentIndex++;
                if (room.currentIndex < room.activities.length) {
                    io.to(roomId).emit("next_activity",
                        { activity: room.activities[room.currentIndex] });
                } else {
                    room.completed = true;
                    io.to(roomId).emit("swiping_completed",
                        { confirmedItinerary: room.confirmed });
                }
            }
        });
    });
};
```

### 4.2.8 Payment Controller (paymentController.ts)

Integrates with Cashfree for one-time lifetime Pro subscription payments:

```typescript
// backend/src/controllers/paymentController.ts
import { Cashfree } from "cashfree-pg";

Cashfree.XClientId = process.env.CASHFREE_APP_ID!;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export const createOrder = asyncHandler(async (req, res) => {
    const user = req.user;
    const orderId = `order_${Date.now()}_${user._id}`;

    const orderRequest = {
        order_amount: 499,
        order_currency: "INR",
        order_id: orderId,
        customer_details: {
            customer_id: user._id.toString(),
            customer_email: user.email,
            customer_phone: "9999999999",
        },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", orderRequest);
    user.razorpayOrderId = orderId;
    await user.save();

    res.status(200).json(new ApiResponse(200, "Order created", {
        order_id: orderId,
        payment_session_id: response.data.payment_session_id,
    }));
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    const response = await Cashfree.PGFetchOrder("2023-08-01", orderId);

    if (response.data.order_status === "PAID") {
        const user = req.user;
        user.isPro = true;
        user.razorpayPaymentId = response.data.cf_order_id;
        user.proActivatedAt = new Date();
        await user.save();

        // Send congratulatory push notification
        if (user.pushToken) {
            await sendNotification(user.pushToken,
                "Welcome to Pro! 🎉",
                "You now have unlimited AI generations and all premium features.");
        }
        res.status(200).json(new ApiResponse(200, "Payment verified; Pro activated"));
    } else {
        throw new ApiError(400, "Payment not completed");
    }
});
```

### 4.2.9 Authentication Middleware (authMiddleware.ts)

Protects all API routes using Clerk JWT verification and auto-creates users in MongoDB:

```typescript
// backend/src/middlewares/authMiddleware.ts
export const protectRoute = asyncHandler(async (req, res, next) => {
    const { userId } = getAuth(req);
    if (!userId) throw new ApiError(401, "Unauthorized: No token provided");

    const user = await User.findOne({ clerkId: userId });
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!user) {
        // Auto-create user in MongoDB on first API call
        const newUser = await User.create({
            clerkId: userId,
            email: email,
            firstName: clerkUser.firstName || "",
            lastName: clerkUser.lastName || "",
            username: clerkUser.username || email.split("@")[0],
            avatar: clerkUser.imageUrl || "",
        });
        req.user = newUser;
    } else {
        req.user = user;
    }
    next();
});
```

### 4.2.10 Rate Limiting Middleware (ratelimitMiddleware.ts)

Protects API endpoints from abuse using Arcjet's intelligent rate limiting and bot detection:

```typescript
// backend/src/middlewares/ratelimitMiddleware.ts
export const rateLimiter = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return next(new ApiError(429, "Too many requests! Calm down, traveler."));
            } else if (decision.reason.isBot()) {
                return next(new ApiError(403, "Automated requests are not allowed"));
            } else {
                return next(new ApiError(403, "Access denied by security policy"));
            }
        }

        if (decision.results.some((r) => r.reason.isBot() && r.reason.isSpoofed())) {
            return next(new ApiError(403, "Malicious bot activity detected"));
        }
        next();
    } catch (error) {
        console.error("Arcjet Middleware Error:", error);
        next(); // Fail open to avoid blocking legitimate requests
    }
};
```

### 4.2.11 Mobile App — Itinerary Service (itinerary.ts)

The frontend service layer that communicates with the backend API:

```typescript
// mobile/services/itinerary.ts (Key functions)
export const generateItinerary = async (
    token: string, source: string, destination: string,
    budgetTier: string, budget: number, currency: string,
    duration: number, travelers: number, ageGroup: string,
    safeMode: boolean, tripStartDate: string, tripEndDate: string,
    checkInDate: string, checkOutDate: string, interests?: string[]
) => {
    const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/itinerary/generate`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                source, destination, budgetTier, budget, currency,
                duration, travelers, ageGroup, safeMode,
                tripStartDate, tripEndDate, checkInDate, checkOutDate, interests
            })
        }
    );
    const data = await response.json();
    return data.data;
};

// Offline support: caches trips to AsyncStorage
export const getUserItineraries = async (token: string) => {
    try {
        const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/itinerary/history`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        // Cache for offline access
        await AsyncStorage.setItem("@offline_trips", JSON.stringify(data.data));
        return data.data;
    } catch (error) {
        // Fallback to offline cache
        const offlineData = await AsyncStorage.getItem("@offline_trips");
        if (offlineData) return JSON.parse(offlineData);
        return null;
    }
};
```

### 4.2.12 Mobile App — Subscription Screen (subscription.tsx)

The Pro upgrade screen with Cashfree payment integration:

```typescript
// mobile/app/(tabs)/profile/subscription.tsx (Payment flow)
const handleUpgrade = async () => {
    handleImpact("medium"); // Haptic feedback
    const orderData = await createOrder();

    const session = new CFSession(
        orderData.payment_session_id,
        orderData.order_id,
        CFEnvironment.SANDBOX
    );

    const theme = new CFThemeBuilder()
        .setNavigationBarBackgroundColor(colors.background)
        .setButtonBackgroundColor(colors.primary)
        .setButtonTextColor("#FFFFFF")
        .build();

    const dropPayment = new CFDropCheckoutPayment(session, null, theme);
    CFPaymentGatewayService.doPayment(dropPayment);
};

// Cashfree callback handling
useEffect(() => {
    CFPaymentGatewayService.setCallback({
        onVerify: async (orderID: string) => {
            await verifyPayment(orderID);
            Alert.alert("Success! 🎉", "Welcome to TravelIt Pro!");
            router.back();
        },
        onError: (error: any) => {
            Alert.alert("Payment Cancelled", error?.message);
        }
    });
}, []);
```

## 4.3 Screen layouts and Report layouts.

### Screen 1: Home Screen
The dashboard of the application is the home screen. It features a welcome message with the first name of the user, a carousel of trending places suggested by the AI (that scrolls horizontally), a destination-focused card with a high quality photo offered by the Google places, the name of the place and country, and a featured tag line, and a statistics section, which displays the number of planned and completed trips made by the user. There is a stand out call-to-action button in the bottom, which is Plan a Trip that invites users to begin the planning wizard.

### Screen 2: Plan Screen (3-Step Wizard).
The plan screen is presented in a multi-step form with an animated progress bar in the top:
- **Step 1 (Trip Basics):** Entries of source city (automatically detected), destination, number of days (1-15 picker), maximum budget (numeric), currency (USD/EUR/INR/GBP) dropdown, and a budget tier (low/medium/high) switch.
- **Step 2 (Dates and Travelers):** Trip start date and hotel check-in date (end dates will be automatically determined), number of travelers picker, age group picker.
- **Step 3 (Preferences):** Safety mode switch + right-text, interests text-input (comma-separated), and the last button (generation of the trip). Fade-in effects are used in every step with the help of React Native Reanimated to provide a smooth transition.

### Screen 3: Result Screen
Shows the AI-generated itinerary in a scroll-able format with: an editable trip title and description on the top, a day-by-day itinerary of activities (each activity card has the time slot, the name of the activity, the place with a pin icon, a description, a price and a verification badge), and a hotel recommendation card with the name, rating, price, and photo of the hotel, a flight recommendation card with the name of the airline, the price, and the duration, and a detailed cost breakdown panel. The itinerary is continued by the button at the bottom that is entitled Save to Vault.

### Screen 4: Trips Vault
Shows all the saved trips in a vertical scrollable list that includes filter tabs (All / Draft / Active / Completed). In every trip card, there is the trip title and destination with map pin icon, duration, number of people traveling, dates, and a status badge. On long-pressing of a trip, a delete option appears. By tapping a card opens the Trip View.

### Screen 6: Trip Tinder
A Tinder-like interface of card-swiping in full-screen. The cards with activities are laid over one another, and they display the name of the activities, the location, time, description, and cost. The swiping is to approve or reject. There is a live counter which displays the number of priori who have voted. Once all the processing in the activities is done a confirmation screen is displayed which gives the group approved itinerary.

### Screen 8: Profile Screen
Shows the profile card (avatar, full name, email, Pro badge when available) of the user, after which there are sections of Edit Profile (upload an avatar, edit name/username), Saved Preferences (bookmarked places in Explore), App Settings (theme picker with System/Light/Dark options, haptic feedback on/off), Subscription status, Help and FAQ (accordion items), and Sign out button.

### Report Layout: PDF Export
The PDF that is exported will have a structured header containing the title of the trip and its destination, a summary of the trip in a paragraph, and then the activities per day in a tabular format (Time   Activity   Location   Estimated Cost) and hotel and flights summaries followed by the final cost breakdown.

---

# Chapter 5: Analysis, Related Work Done

## 5.1 Performance Analysis

TravelIT's architecture was designed with performance as a primary concern. The following analyses were conducted:

### Response Time Analysis
| Operation | Average Response Time | Optimization Applied |
|-----------|-----------------------|---------------------|
| AI Itinerary Generation | 8-15 seconds | Gemini 2.5 Flash (fastest model), parallel place verification |
| Place Verification (per place) | 200-400ms | Concurrent Promise.all for batch verification |
| Hotel Search | 2-3 seconds | Booking.com RapidAPI with caching |
| Flight Search | 2-3 seconds | Booking.com RapidAPI with caching |
| Route Optimization (5 activities) | 1-2 seconds | Permutation-based with early termination |
| Explore Location Search | 3-5 seconds | Google Search grounding + parallel place enrichment |
| Trip Tinder Swipe | <100ms | Socket.io WebSocket (no HTTP overhead) |
| Save/Fetch Itinerary | <500ms | MongoDB indexed queries on userId |
| PDF Export | 1-2 seconds | Client-side generation via expo-print |

### Scalability Considerations
- **Database Indexing:** The `userId` field on the Itineraries collection is indexed for fast query performance.
- **Rate Limiting:** Arcjet's token bucket algorithm prevents individual users from overwhelming the AI generation endpoint.
- **Stateless API:** The Express backend is stateless (authentication via Clerk JWT), allowing horizontal scaling.
- **CDN for Assets:** Cloudinary handles image delivery with automatic CDN, resizing, and format optimization.
- **Offline Caching:** AsyncStorage caching reduces server load by serving cached trips when offline.

## 5.2 Security Analysis

| Security Layer | Implementation | Purpose |
|----------------|----------------|---------|
| Authentication | Clerk JWT verification on every request | Ensures only authenticated users access protected endpoints |
| Authorization | `protectRoute` middleware auto-creates/verifies users | Prevents unauthorized access to user-specific data |
| Rate Limiting | Arcjet token bucket (configurable limits) | Prevents API abuse and DDoS attacks |
| Bot Detection | Arcjet bot detection + spoofed request filtering | Blocks automated scraping and abuse |
| Input Validation | Zod schemas on all endpoints | Prevents injection attacks and malformed data |
| File Upload Security | Multer with file type/size restrictions | Prevents malicious file uploads |
| CORS | Configured per-origin access control | Prevents unauthorized cross-origin requests |
| Environment Variables | `.env` files for all secrets | Keeps API keys and credentials out of source code |
| Payment Security | Cashfree server-side verification | Prevents payment fraud by verifying on backend |

## 5.3 Comparison with Related Work

| Feature | TravelIT | Wanderlog | TripIt | Layla AI | Google Travel |
|---------|----------|-----------|--------|----------|---------------|
| AI Generation | Gemini 2.5 Flash | None | None | GPT-based | None |
| Place Verification | Google Places API | None | None | None | Built-in |
| Live Pricing | Booking.com API | None | None | Limited | None |
| Route Optimization | Distance Matrix + Permutation | Basic map | None | None | Directions |
| Group Collaboration | Trip Tinder (Real-time) | Shared lists | Email sharing | None | None |
| Offline Support | AsyncStorage cache | Limited | Email sync | None | Partial |
| Dynamic Modification | Weather/Delay/AI Chat | Manual only | Manual only | Text only | None |
| Payment Integration | Cashfree (INR) | Subscription | Free | Subscription | Free |

---

# Chapter 6: Conclusion and Future Work.

## 6.1 Conclusion

TravelIT manages to show how modern AI (Google Gemini 2.5 Flash +) together with a strong full-stack mobile architecture (React Native + Node.js + MongoDB) can be used to address the actual problem of disjointed and painful travel planning. The application considers all 10 of the most important limitations that are found in the literature survey:

1. **One App:** One application to do all travel planning (planning, booking research, itinerary management, group coordination and trip documentation).
2. **Smart Generation:** Gemini AI generates entire itineraries with real-time timing and a cost-conscious choice of activities on a day-by-day basis.
3. **Verified Data:** All AI generated places are verified by Google Places API which removes the hallucination issue that has been a bane of other AI travel applications.
4. **Active Flexibility:** The Real-Time Logic engine facilitates real-time adjustments to weather variations, delays, and hand-written AI adjustments.
5. **Group Decision-Making:** Trip Tinder offers a real-time, democratic and fun solution to groups making decisions together on what to do.
6. **Best Routing:** The route optimizer that is using permutation with Google Distance Matrix provides the shortest travel time and waiting time between activities.
7. **Budget Intelligence:** Reduced automatic cost breakdown tracking in accommodation, flights, and activities based on the quantity of travelers.
8. **Safety-Conscious Planning:** The Safety Mode option implies the AI that produces plans with an emphasis on bright and guided as well as popular surroundings.
9. **Sustainable Monetization:** The freemium model where the one-time upgrade of 499 lifetime Pro is a sincere value changer at both levels.
10. **Offline Access:** AsyncStorage caching gives the user an opportunity to view saved itineraries even when internet is not available.

The project has been able to use 5 external APIs ( Google Places, Google Distance Matrix, Booking.com Hotels, Booking.com Flights, Cashfree ), real-time WebSocket communication (Socket.io), and advanced AI prompt engineering to create a production-ready travel planning experience.

## 6.2 Future Work

Future versions of TravelIT are going to be improved as following:

1. **Multi-Language Support:** Multi-language (i18n) should be added so that Hindi, Spanish, French, Japanese and other languages are available to everyone in the world.
2. **AR Navigation:** Add AR capabilities to show real-time directional overlays once the users are at their destinations to navigate between activities.
3. **Real-Time Weather Integration:** Have real time weather API (OpenWeatherMap) which can automatically enable weather adaptation suggestions to be generated based on actual weather forecasts and not on manual input.
4. **Social Sharing / Trip Feed:** This will also allow users to share their completed trips as shareable cards on social media and establish a community feed of public itineraries to get inspiration.
5. **Multi-City Itineraries:** Echelon multi-destination trips (e.g., Paris - Amsterdam - Berlin) using inter-city travel logistics.
6. **Direct Booking Integration:** Users should be able to make hotel and flight reservations in the app directly through the affiliate or booking API of Booking.com, and make commission revenue.
7. **Collaborative Editing:** Give people the option to collaboratively edit itineraries in real time (not just voting), so that multiple users can concurrently edit trip plans with live cursors.
8. **Machine Learning Personalization:** Develop recommendation models that improve their itinerary recommendations on the basis of past trips and interests, as users interact with the system.
9. **Apple Watch / Wear OS Companion:** Build lightweight smartwatch companion apps to display the upcoming activity, turn-by-turn instructions and budget remaining.
10. **Carbon Footprint Tracking:** Compare and show the estimated carbon footprint of every trip option, promote sustainable travelling choices.
11. **Voice Assistant Integration:** Add Siri and Google Assistant shortcuts to ask Siri and Google Assistant where to go next without having to touch the screen (i.e., Hey Siri, what is my next activity?).
12. **Advanced Analytics Dashboard:** Show the user insights on their travel trends, their expenditure patterns and the type of destination they visit most.

## 6.3 References

1. World Travel & Tourism Council (2024). "Economic Impact Research." Available at: https://wttc.org/research/economic-impact
2. Google. "Gemini API Documentation." Available at: https://ai.google.dev/docs
3. Google. "Places API (New) Documentation." Available at: https://developers.google.com/maps/documentation/places/web-service
4. Google. "Distance Matrix API Documentation." Available at: https://developers.google.com/maps/documentation/distance-matrix
5. Clerk Inc. "Clerk Documentation." Available at: https://clerk.com/docs
6. Cashfree Payments. "Cashfree PG API Documentation." Available at: https://docs.cashfree.com/docs/payment-gateway
7. Booking Holdings. "Booking.com API via RapidAPI." Available at: https://rapidapi.com/tipsters/api/booking-com
8. Meta Platforms Inc. "React Native Documentation." Available at: https://reactnative.dev/docs/getting-started
9. Expo Inc. "Expo Documentation." Available at: https://docs.expo.dev
10. MongoDB Inc. "MongoDB Documentation." Available at: https://docs.mongodb.com
11. Automattic Inc. "Mongoose ODM Documentation." Available at: https://mongoosejs.com/docs
12. Socket.io. "Socket.io Documentation." Available at: https://socket.io/docs/v4
13. Cloudinary. "Cloudinary Node.js SDK Documentation." Available at: https://cloudinary.com/documentation/node_integration
14. Arcjet. "Arcjet Node.js SDK Documentation." Available at: https://docs.arcjet.com
15. Colin McDonnell. "Zod Documentation." Available at: https://zod.dev
16. NativeWind. "NativeWind v4 Documentation." Available at: https://www.nativewind.dev
17. TanStack. "React Query Documentation." Available at: https://tanstack.com/query/latest
18. Zustand. "Zustand Documentation." Available at: https://zustand-demo.pmnd.rs

---

**END OF WHITE BOOK**

---