# 💖 JUST FOR YOU — Master Product Specification

## Project Codename

`Project Forever`

## App Name

**Just For You ❤️**

## Tagline

> "A little world I made, just for you."

---

# 1. PROJECT VISION

Build a highly polished, emotionally engaging, romantic surprise Android application for my wife.

This is NOT a generic love quote app.

This app should feel like a **personal digital love story**, a **private memory book**, a **cinematic experience**, and a **surprise gift** combined into one mobile application.

The primary goal is:

> When my wife opens this app for the first time, she should feel surprised, emotionally touched, curious, loved, and excited to explore what is inside.

The experience should create a strong:

* WOW feeling
* Surprise feeling
* Emotional connection
* Curiosity
* Nostalgia
* Personalization
* "He made this specifically for me" feeling

The app should feel like a premium product rather than a simple developer project.

## Product Identity

To be explicit about what this is NOT, so the wrong instinct never creeps into a phase:

This is NOT:

* A generic love quote app
* A basic CRUD application
* A simple photo gallery
* A Valentine's Day template
* A tutorial project

This IS:

> A private digital love story + a cinematic experience + a memory vault + a surprise gift + a personal world created specifically for my wife.

Every screen, animation, and line of copy should be evaluated against one question:

> "I can't believe you made this for me."

If a feature or screen doesn't move the app closer to that reaction, reconsider it.

See Section 35 for the Bangla + English language strategy that is core to this identity — the language choice is part of the storytelling, not an afterthought.

---

# 2. CORE REQUIREMENTS

## Technology

Use:

* React Native
* Expo
* TypeScript
* Expo Router
* React Native Reanimated
* React Native Gesture Handler where useful
* Expo Haptics
* Expo Audio for local audio
* AsyncStorage only if local persistence is required

Use modern React Native best practices.

---

# 3. BACKEND REQUIREMENT

## NO BACKEND

The application must be completely backend-free.

DO NOT use:

* Firebase
* Supabase
* REST APIs
* GraphQL
* External databases
* Authentication servers
* Cloud storage
* Remote CMS
* External backend services

The app must work completely offline after installation.

All content must be local.

Local content may include:

* Images
* Videos if practical
* Audio
* Love letters
* Memories
* Timeline events
* Surprise messages
* Quiz questions
* Secret messages
* Anniversary dates

Use local JSON/data files for structured content.

Use local assets for media.

---

# 4. DISTRIBUTION

The app will NOT be published to:

* Google Play Store
* Apple App Store

The final application must be installable as an Android APK.

The APK will be manually installed on my wife's Android phone.

The application should work without internet access.

The app should not require an account.

The app should not require login.

The app should not require registration.

---

# 5. TARGET EXPERIENCE

The user is my wife.

The app should feel like it was created personally by her husband.

The experience should be:

* Romantic
* Elegant
* Emotional
* Intimate
* Playful
* Mysterious
* Premium
* Smooth
* Cinematic
* Personal

Avoid:

* Cheap-looking UI
* Excessive pink colors
* Generic Valentine's Day design
* Overuse of hearts everywhere
* Generic stock photos
* Excessive text on every screen
* Cluttered layouts
* Standard CRUD-style screens
* Boring navigation

Use tasteful romantic visual design.

The design should feel modern and sophisticated.

---

# 6. DESIGN DIRECTION

Use a premium visual language.

Suggested design characteristics:

* Deep dark backgrounds
* Warm gradients
* Soft glow
* Subtle glassmorphism
* Elegant typography
* Large emotional typography
* Smooth transitions
* Soft shadows
* Cinematic overlays
* Gentle particle effects
* Floating elements
* Subtle heart animations
* Haptic feedback
* Carefully timed reveals
* High-quality image presentation (proper aspect ratios, no stretching/cropping artifacts, deliberate framing)

Do not over-animate everything.

Do not rely on default/unstyled UI components — every card, button, and screen should be visually customized to match this design language rather than looking like a stock component library.

Animation should support the emotional experience.

Every animation should have a purpose.

---

# 7. COLOR DIRECTION

Use a sophisticated romantic palette.

Primary direction:

* Deep black
* Midnight tones
* Burgundy
* Deep red
* Warm cream
* Soft gold
* Subtle pink accents

Do not make the entire application bright pink.

The visual style should feel like:

> "Luxury romantic cinematic experience."

---

# 8. TYPOGRAPHY

Use a combination of:

* Elegant serif font for emotional headings
* Clean modern sans-serif for body text
* Script/cursive font only for special moments

Do not use decorative fonts excessively.

Typography must remain readable.

---

# 9. APP ENTRY EXPERIENCE

The first launch is extremely important.

The first launch should feel like a surprise.

Do NOT immediately show a standard Home Screen.

Create a cinematic onboarding experience.

## Scene 1

Dark screen.

Almost completely black.

A subtle ambient animation begins.

Display:

> "I made something for you..."

Wait for a moment.

Then:

> "Something I couldn't buy..."

Then:

> "Something I had to create..."

Then:

> "Just for you."

Use fade-in and fade-out animations.

Do not show all text simultaneously.

---

## Scene 2

Display wife's name.

Example:

> "Nabila..."

Then:

> "Welcome to a little world..."

Then:

> "...that belongs only to us."

---

## Scene 3

Show the couple's first meaningful photo.

Use a slow cinematic reveal.

Add subtle particles or light.

Display:

> "Our story."

Then transition to the main experience.

---

# 10. HOME EXPERIENCE

The Home screen should NOT feel like a dashboard.

It should feel like the entrance to a private world.

Top section:

* Wife's name
* Personal greeting
* Current date
* Subtle animated background

Example:

> "Good evening, Nabila ❤️"

Below:

> "There are still so many things I want to tell you."

Show a featured memory.

Example:

> "Today's Memory"

Then a large photo card.

Below it:

> "Do you remember this day?"

Allow tapping to reveal the memory story.

---

# 11. MAIN NAVIGATION

Use a simple navigation structure.

Suggested sections:

* Home
* Our Story
* Memories
* Letters
* More

Do not expose every feature on the first screen.

Some features should be discovered naturally.

The app should encourage exploration.

---

# 12. OUR STORY

Create an interactive relationship timeline.

Possible events:

* The day we met
* Our first conversation
* Our first special moment
* Our first date
* The day we became closer
* Our engagement
* Our wedding
* Our first trip
* Important memories
* Today

Each timeline item supports:

* Date
* Title
* Photo
* Description
* Optional audio
* Optional secret content

Use scroll-based animations.

As the user scrolls:

* Images reveal gradually
* Timeline line animates
* Cards fade in
* Photos move subtly
* Haptic feedback may occur at important moments

The timeline should feel like traveling through time.

---

# 13. MEMORY VAULT

Create a private memory gallery.

Do not make it look like a standard photo grid.

Use different presentation styles:

* Polaroid cards
* Full-screen photo stories
* Horizontal memory carousel
* Cinematic photo reveal

Each memory may include:

* Photo
* Date
* Location
* Title
* Personal caption

Example:

> "I don't remember everything about that day."

Then after a delay:

> "But I remember how happy I was because you were there."

Use progressive text reveal.

---

# 14. LOVE LETTERS

Create an "Open When..." experience.

Cards:

* Open when you miss me
* Open when you are sad
* Open when you are angry with me
* Open when you need a hug
* Open when you can't sleep
* Open when you feel alone
* Open when you want to know how much I love you

The letters should not open instantly.

Use a small interaction.

Example:

1. Tap card.
2. Card flips.
3. Envelope appears.
4. User taps envelope.
5. Letter opens.
6. Text appears line-by-line.

Optional:

* Haptic feedback
* Soft background music
* Ambient animation

---

# 15. SECRET LETTER

Create a hidden secret section.

Do not make it immediately obvious.

The user should discover it.

Possible implementation:

A subtle "..." or hidden interactive element.

When discovered:

> "You found something..."

Then require a special date or password.

After unlocking:

Dark screen.

Display:

> "This is something I wanted you to know."

Then reveal a deeply personal letter.

The final line should have a special animation.

Example:

> "No matter where life takes us..."

Pause.

> "I will always choose you."

Then:

> "Again."

---

# 16. DAILY SURPRISE

Create a local daily surprise system.

Every day, show a different message.

Examples:

* Romantic messages
* Memories
* Photos
* Compliments
* Small jokes
* Relationship memories

All content must be stored locally.

No backend.

The app determines the current date locally.

Example:

> "Today's little reminder ❤️"

Then reveal:

> "You are still my favourite notification."

The message should appear with animation.

---

# 17. ANNIVERSARY COUNTDOWN

Create a beautiful countdown.

Display:

* Days
* Hours
* Minutes
* Seconds

Example:

> "Until our next special day..."

Use elegant animated numbers.

On anniversary day:

Do not show the countdown.

Show a special full-screen experience.

Example:

> "Today is our day."

Then trigger:

* Confetti
* Hearts
* Music
* Special message
* Memory slideshow

---

# 18. MEMORY MAP

Create a "Places That Hold Our Memories" section.

Show places we have visited.

Each place can include:

* Location name
* Photo
* Date
* Story

The first version may use a stylized visual map instead of a real online map.

This avoids requiring internet.

Example:

> Cox's Bazar

Tap:

> "That place became special because I was there with you."

---

# 19. OUR SONGS

Create a local music section.

Use local audio files bundled with the app.

Each song includes:

* Title
* Artist
* Personal reason

Example:

> "This song reminds me of you because..."

The player should be beautiful and minimal.

Use animated album artwork.

Audio should work offline.

---

# 20. INTERACTIVE QUIZ

Create:

> "How Well Do You Know Us?"

Questions should be personal.

Examples:

* Where did we first meet?
* What was our first trip?
* What food do I love?
* What is one thing I always say?
* What is my favourite memory with you?

After each answer:

Correct:

> "You know us too well. ❤️"

Wrong:

> "Hmm... I think we need another date."

At the end:

> "You scored..."

Then show a personalized message.

---

# 21. SURPRISE DISCOVERY SYSTEM

The app should have hidden surprises.

Examples:

* Long press on a photo
* Tap a specific heart
* Swipe a memory in a special direction
* Tap the date multiple times
* Shake device if practical
* Hidden secret card

Each discovery can unlock:

* Secret message
* Extra photo
* Voice message
* Special animation
* Hidden letter

Do not make all secrets obvious.

The user should feel:

> "Wait... there is more?"

The hidden features must stay discoverable, not frustrating or impossible to find. A secret nobody ever finds provides no delight — favor clues that reward attentiveness (a lingering glow, a slightly-too-long tap target, a repeated motif) over pure randomness. The experience should feel playful and rewarding at every discovery, never like a puzzle designed to withhold content.

---

# 22. FINAL SURPRISE

The Final Surprise is the **emotional climax of the entire application** — not just another screen in the list. Everything before it exists to build toward this moment.

The intended user journey through the whole app is:

> Cinematic Intro → Curiosity → Our Story → Memories → Love Letters → Hidden Secrets → Interactive Experiences (Quiz, Songs, Places) → More Discovery → **Final Surprise** → Emotional Ending

The user should gradually discover the app — do not expose every feature immediately (see Section 21). By the time she reaches the Final Surprise, it should land as the emotional reward for everything she has already explored, not a cold open.

The Final Surprise should be:

* Deeply personal
* Emotional
* Cinematic
* Memorable
* Unexpected
* Beautiful

The application should have a final emotional destination.

After the user explores enough content, show:

> "Before you go..."

Then a cinematic sequence.

Display:

> "I made this app..."

Pause.

> "because sometimes words are not enough."

Pause.

> "So I built you a little world."

Pause.

> "A world full of our memories."

Pause.

> "And if I had to choose one thing..."

Pause.

> "I would choose you."

Final screen:

> "Always."

Then:

> "I love you. ❤️"

Allow the user to replay this experience.

The wording above is placeholder structure, not final content — treat it as a pacing template, not a script. The final sequence should combine Bangla + English naturally per the language strategy in Section 35.9 (for example, an English cinematic line followed by a Bangla emotional line), and should ultimately be replaced with the real, personally-written words rather than shipped as-is.

---

# 23. PERSONALIZATION

Create a centralized configuration file.

Example:

```ts
export const APP_CONFIG = {
  wifeName: "Nabila",
  husbandName: "Sakib",
  relationshipStartDate: "YYYY-MM-DD",
  anniversaryDate: "YYYY-MM-DD",
};
```

The app should be easy to personalize.

All personal content should be separated from UI code.

Use:

```text
data/
  appConfig.ts
  story.ts
  memories.ts
  letters.ts
  surprises.ts
  quiz.ts
  songs.ts
  places.ts
```

---

# 24. LOCAL ASSET STRUCTURE

Use:

```text
assets/
  images/
    memories/
    story/
    places/
    ui/

  audio/
    songs/
    voice-messages/

  animations/
```

All important app content should work offline.

---

# 25. PROJECT STRUCTURE

Use a clean architecture similar to:

```text
app/
  _layout.tsx
  index.tsx

  (main)/
    home.tsx
    story.tsx
    memories.tsx
    letters.tsx
    more.tsx

  memories/
    [id].tsx

  letters/
    [id].tsx

  story/
    [id].tsx

  secret.tsx
  quiz.tsx
  songs.tsx
  places.tsx
  final-surprise.tsx

components/
  AnimatedText.tsx
  CinematicIntro.tsx
  MemoryCard.tsx
  MemoryViewer.tsx
  LetterCard.tsx
  LetterViewer.tsx
  Timeline.tsx
  TimelineItem.tsx
  Countdown.tsx
  MusicPlayer.tsx
  SecretReveal.tsx
  FloatingParticles.tsx
  HeartAnimation.tsx

data/
  appConfig.ts
  story.ts
  memories.ts
  letters.ts
  surprises.ts
  quiz.ts
  songs.ts
  places.ts

hooks/
  useCountdown.ts
  useDailySurprise.ts

utils/
  dateUtils.ts
  storage.ts

assets/
  images/
  audio/
  animations/

constants/
  colors.ts
  typography.ts
  spacing.ts

types/
  index.ts
```

Adjust the structure if a better architecture is required.

Do not over-engineer.

---

# 26. PERFORMANCE REQUIREMENTS

The app must be smooth.

Target:

* 60 FPS animations where possible
* Fast startup
* Optimized images
* Lazy rendering for large memory collections
* Avoid unnecessary re-renders
* Use memoization where useful
* Avoid memory leaks
* Avoid excessive animations simultaneously

The app must run well on a normal Android phone.

---

# 27. ACCESSIBILITY

Support:

* Readable text
* Good contrast
* Touch-friendly buttons
* Accessible labels
* Reduced motion consideration where practical

---

# 28. ERROR HANDLING

The app should not crash if:

* A local image is missing
* Audio cannot play
* A memory entry is incomplete
* A date is invalid

Use graceful fallbacks.

---

# 29. NO INTERNET DEPENDENCY

After installation, the app must be fully usable with:

* Wi-Fi OFF
* Mobile data OFF
* Airplane mode ON

Do not depend on remote images.

Do not depend on remote APIs.

Do not depend on online fonts if avoidable.

Do not depend on online maps.

Do not depend on online authentication.

---

# 30. DEVELOPMENT PROCESS

IMPORTANT:

DO NOT attempt to build the entire application in one step.

Work strictly in phases.

After completing each phase:

1. Check the implementation.
2. Run the application.
3. Fix TypeScript errors.
4. Fix ESLint errors.
5. Fix runtime errors.
6. Verify navigation.
7. Verify animations.
8. Verify the UI visually — run the app on an Android Emulator (or connected device) and actually look at the screens, not just confirm they render without errors. Visual polish is a core requirement of this app, not a nice-to-have, and cannot be verified by types or logs alone.
9. Verify offline behavior.
10. Summarize what was built and confirm with me before moving on to the next major phase (see Section 32, Rule 4/5).
11. Only then move to the next phase.

Do not skip phases.

---

# 31. PHASE PLAN

## PHASE 0 — PROJECT INITIALIZATION

Tasks:

* Create Expo React Native TypeScript project.
* Configure Expo Router.
* Configure ESLint.
* Configure Prettier.
* Create folder structure.
* Create theme constants.
* Create centralized app configuration.
* Verify the project runs successfully.

Deliverable:

A clean working Expo application.

---

## PHASE 1 — DESIGN SYSTEM

Implement:

* Color system
* Typography
* Spacing
* Shadows
* Border radius
* Animation constants
* Reusable buttons
* Reusable cards
* Screen container

Deliverable:

A reusable premium design system.

---

## PHASE 2 — CINEMATIC INTRO

Implement the complete first-launch experience.

Include:

* Dark intro
* Animated text
* Wife's name
* Personal messages
* Photo reveal
* Smooth transition to Home

The intro should feel cinematic.

Deliverable:

A WOW first-launch experience.

---

## PHASE 3 — HOME

Implement:

* Personal greeting
* Featured memory
* Daily surprise preview
* Navigation
* Animated background

Deliverable:

A premium Home experience.

---

## PHASE 4 — OUR STORY

Implement:

* Timeline
* Scroll animations
* Photos
* Personal stories
* Timeline details

Deliverable:

An emotional interactive relationship timeline.

---

## PHASE 5 — MEMORY VAULT

Implement:

* Memory gallery
* Memory cards
* Full-screen viewer
* Captions
* Animations

Deliverable:

A beautiful memory experience.

---

## PHASE 6 — LOVE LETTERS

Implement:

* Open When cards
* Envelope animation
* Letter opening animation
* Animated text
* Haptic feedback

Deliverable:

A deeply personal letter experience.

---

## PHASE 7 — DAILY SURPRISE

Implement:

* Local date detection
* Daily message system
* Daily memory
* Daily photo
* Daily surprise animation

Deliverable:

A new surprise every day.

---

## PHASE 8 — SECRET DISCOVERY

Implement:

* Hidden interactions
* Secret section
* Password/date unlock
* Secret letter
* Special animations

Deliverable:

A discoverable secret layer.

---

## PHASE 9 — QUIZ

Implement:

* Personal questions
* Answer selection
* Feedback animations
* Score
* Final result

Deliverable:

A fun interactive experience.

---

## PHASE 10 — SONGS & AUDIO

Implement:

* Local audio
* Play/pause
* Progress
* Animated artwork
* Personal descriptions

Deliverable:

Offline music experience.

---

## PHASE 11 — ANNIVERSARY

Implement:

* Countdown
* Anniversary detection
* Special anniversary experience
* Confetti
* Special message

Deliverable:

A special annual experience.

---

## PHASE 12 — FINAL SURPRISE

Implement the final cinematic emotional sequence.

This must feel like the emotional climax of the application.

Deliverable:

The most memorable screen in the app.

---

## PHASE 13 — POLISH

Review the entire application.

Improve:

* Animations
* Transitions
* Haptic feedback
* Typography
* Spacing
* Loading states
* Empty states
* Error handling
* Performance
* Accessibility

Remove:

* Unnecessary UI
* Duplicate components
* Unused code
* Debug logs
* Placeholder content where possible

Deliverable:

Production-quality polished application.

---

## PHASE 14 — OFFLINE TESTING

Test the application with:

* Wi-Fi disabled
* Mobile data disabled
* Airplane mode enabled

Verify:

* All screens open
* All navigation works
* Images load
* Audio works
* Letters open
* Quiz works
* Countdown works
* Secret section works
* Daily surprise works

No network dependency should exist.

---

## PHASE 15 — ANDROID APK

Configure the project for Android.

Generate a standalone APK.

Verify:

* APK installs successfully
* App launches successfully
* App works offline
* No development server is required
* No Expo Go is required for the final APK
* No backend is required

Provide clear instructions for:

1. Building the APK.
2. Installing the APK on an Android device.
3. Updating the APK later.

---

# 32. CLAUDE CODE WORKING RULES

You are the lead developer for this project.

Follow these rules strictly.

### Rule 1

Read the entire `SPEC.md` before starting.

### Rule 2

Do not build everything at once.

### Rule 3

Work phase-by-phase.

### Rule 4

Before starting each phase, explain:

* What you will build.
* Which files you will create/change.
* Why the implementation is designed this way.

### Rule 5

After each phase:

* Run checks.
* Fix errors.
* Verify functionality.
* Verify the UI visually using the Android Emulator (or a connected device) — confirm it looks right, not only that it runs.
* Report a concise summary of what was built and wait for confirmation before starting the next major phase (e.g. before moving between the numbered phases in Section 31). Small fixes within an already-approved phase don't need a fresh confirmation.

### Rule 6

Do not move to the next phase if the current phase is broken.

### Rule 7

If a requirement is ambiguous, make the most reasonable product decision while preserving the core vision.

### Rule 8

Prioritize user experience over technical complexity.

### Rule 9

Do not introduce a backend.

### Rule 10

Do not add unnecessary dependencies.

### Rule 11

Prefer reusable components.

### Rule 12

Keep personal content separate from UI components.

### Rule 13

Use TypeScript properly.

Avoid unnecessary `any`.

### Rule 14

Do not leave TODO comments for core functionality.

### Rule 15

Do not stop after generating a plan.

Actually implement each phase.

### Rule 16

Never replace a working feature with a simpler implementation just to finish faster.

### Rule 17

The final application should feel like a premium surprise gift, not a tutorial project.

---

# 33. FINAL QUALITY STANDARD

Before declaring the project complete, ask:

> "If someone I love opened this app for the first time, would they genuinely feel surprised?"

If the answer is no:

* Improve the animations.
* Improve the storytelling.
* Improve the transitions.
* Improve the emotional pacing.
* Improve the personalization.
* Improve the visual design.

The final product should create this feeling:

> "I can't believe you made this for me."

The app should feel personal.

The app should feel intentional.

The app should feel memorable.

The app should feel like a gift.

---

# 34. FINAL DELIVERABLE

At the end, provide:

1. Complete React Native Expo project.
2. Clean TypeScript code.
3. Offline-first implementation.
4. All screens implemented.
5. All animations implemented.
6. All navigation working.
7. Local content architecture.
8. README.md.
9. Android APK build instructions.
10. Personalization guide.
11. Final offline testing checklist.

The final application must be ready to build into a standalone Android APK and install directly on my wife's phone.

## MOST IMPORTANT PRINCIPLE

Do not optimize for "how quickly can we finish the app?"

Optimize for:

> **"How can we make this the most beautiful and memorable digital gift she has ever received?"**

Build the experience with love, attention to detail, emotional storytelling, and surprise.

---

# 35. LANGUAGE & CONTENT STRATEGY

## IMPORTANT LANGUAGE REQUIREMENT

The app should use a carefully designed **Bangla + English mixed language strategy**.

The language choice should depend on the purpose of the content.

The goal is to combine:

* English for a premium, modern, cinematic UI experience.
* Bangla for emotional, personal, intimate, and deeply meaningful content.

Do NOT translate everything into English.

Do NOT translate everything into Bangla.

Choose the language intentionally based on the emotional context.

---

## 35.1 UI LANGUAGE — ENGLISH

The main application UI should primarily use English.

Use English for:

* Navigation labels
* Tab names
* Button labels
* Feature names
* Section headings
* Settings
* Actions
* General UI elements

Examples:

* Home
* Our Story
* Memories
* Love Letters
* Secret
* Our Songs
* Daily Surprise
* Discover Memory
* Open Letter
* Read Our Story
* Unlock Secret
* Play Our Song
* Replay

The UI should feel clean, modern, premium, and internationally designed.

---

## 35.2 CINEMATIC INTRO — MIXED LANGUAGE

The cinematic intro should use a combination of English and Bangla.

Use English for short cinematic phrases that create a premium emotional atmosphere.

Example:

> "I made something for you..."

Then:

> "Something I couldn't buy..."

Then:

> "Something I had to create..."

Then:

> "শুধু তোমার জন্য। ❤️"

Then display her name:

> "Nabila..."

Then:

> "Welcome to a little world..."

Then:

> "...that belongs only to us."

The exact wording may be improved by the developer if a more cinematic and emotionally powerful sequence can be created.

IMPORTANT:

Do not show too much text at once.

Use:

* Fade-in
* Fade-out
* Typewriter effects
* Carefully timed pauses
* Cinematic transitions

The language transitions should feel natural.

---

## 35.3 PERSONAL AND EMOTIONAL CONTENT — BANGLA

The most personal content should primarily be written in Bangla.

Use Bangla for:

* Love letters
* Secret letters
* Personal memories
* Emotional messages
* Daily romantic messages
* Relationship stories
* Personal captions
* Deeply emotional moments
* Voice message descriptions
* Final emotional message

The goal is to make these sections feel like they were genuinely written by her husband.

Avoid generic romantic quotes.

Avoid AI-sounding language.

Avoid overly formal Bangla.

Use natural, conversational Bangla.

The writing should feel like:

> A husband talking directly to his wife.

For example:

> "তুমি যখন এই চিঠিটা পড়ছো, হয়তো আমি তোমার পাশেই আছি। তারপরও কিছু কথা আছে, যেগুলো মুখে বলতে পারি না..."

The actual personal content should be stored separately in local data files so that I can easily replace it with my own writing.

---

## 35.4 MEMORIES — BANGLA WITH OPTIONAL ENGLISH TITLES

Memory titles may use English for a premium visual style.

Example:

> "Our First Trip"

Then the personal story/caption should be in Bangla.

Example:

> "এই trip-টার সবকিছু হয়তো আজও মনে নেই, কিন্তু তোমার সাথে কাটানো সময়টা এখনো আমার কাছে অনেক special।"

Use this pattern where appropriate:

English:

* Short title
* Date
* Location

Bangla:

* Personal story
* Emotional caption
* Memory description

---

## 35.5 LOVE LETTERS — PRIMARILY BANGLA

Love letters must be written primarily in natural Bangla.

The letter card title can be English:

> Open When You Miss Me

Inside the letter:

> "যেদিন আমাকে খুব বেশি miss করবে, সেদিন এই চিঠিটা খুলবে..."

Use English only when it creates a special emotional or cinematic effect.

The main emotional message should remain Bangla.

---

## 35.6 SECRET LETTER — BANGLA

The Secret Letter should be deeply personal and primarily in Bangla.

The experience may begin with English cinematic text:

> "You found something..."

Then transition into Bangla:

> "তোমাকে একটা কথা বলতে চাই..."

The final emotional reveal may use a combination of Bangla and English.

Example:

> "জীবনে যত কিছুই বদলে যাক, একটা জিনিস যেন কখনো না বদলায়—তুমি আর আমি।"

Then:

> "I will always choose you."

Then:

> "Again."

Use this style only when it feels emotionally natural.

---

## 35.7 DAILY SURPRISE — BANGLA

Daily Surprise content should primarily be in Bangla.

Examples:

> "আজকের ছোট্ট reminder ❤️"

Then:

> "তুমি জানো, প্রতিদিন তোমাকে নতুন করে ভালো লাগার কোনো না কোনো কারণ আমি খুঁজে পাই।"

Some short playful messages may use English.

Example:

> "Today's little reminder ❤️"

Then:

> "তুমি এখনো আমার favourite notification।"

Mixing Bangla and English naturally is encouraged when it sounds like real everyday conversation.

---

## 35.8 QUIZ — BANGLA + ENGLISH UI

The quiz interface should use English for UI elements:

* Question
* Next
* Score
* Correct
* Try Again
* Final Result

But personal questions should primarily be in Bangla.

Example:

> "আমাদের প্রথম দেখা কোথায় হয়েছিল?"

Correct answer:

> "You know us too well. ❤️"

Wrong answer:

> "আবার চেষ্টা করো, বউ! 😄"

The language should feel playful and natural.

---

## 35.9 FINAL SURPRISE — MIXED LANGUAGE

The Final Surprise should use a carefully crafted combination of English and Bangla.

The sequence should start cinematic:

> "Before you go..."

Then:

> "I made this app..."

Then:

> "কারণ কিছু অনুভূতি শুধু মুখে বলা যায় না।"

Then:

> "So I built you a little world."

Then:

> "আমাদের গল্প, আমাদের স্মৃতি, আর তোমাকে নিয়ে আমার ছোট্ট একটা পৃথিবী।"

Then:

> "And if I had to choose one thing..."

Pause.

> "আমি তোমাকেই আবার বেছে নেব।"

Pause.

> "Always."

Finally:

> "ভালোবাসি তোমাকে। ❤️"

The exact wording can be improved to make the emotional climax stronger.

IMPORTANT:

The final sequence must feel deeply personal.

Avoid generic quotes.

Avoid overly dramatic or artificial writing.

It should sound like something I would genuinely say to my wife.

---

## 35.10 CONTENT ARCHITECTURE

Keep all personal content separate from UI code.

Use local data files:

```text
data/
  appConfig.ts
  story.ts
  memories.ts
  letters.ts
  surprises.ts
  quiz.ts
  songs.ts
  places.ts
  finalMessage.ts
```

Example:

```ts
export const APP_CONFIG = {
  wifeName: "Nabila",
  husbandName: "Sakib",
  relationshipStartDate: "YYYY-MM-DD",
  anniversaryDate: "YYYY-MM-DD",
};
```

All personal Bangla content should be easy to edit.

I should be able to replace:

* Wife's name
* My name
* Relationship dates
* Memories
* Personal stories
* Love letters
* Secret message
* Daily surprises
* Quiz questions
* Song descriptions
* Final message

without changing the UI components.

---

## 35.11 LANGUAGE QUALITY RULES

For Bangla content:

* Use natural Bangla.
* Prefer conversational Bangla.
* Avoid overly formal literary Bangla.
* Avoid awkward machine-translated Bangla.
* Avoid unnecessary English words.
* Use English words naturally when they are commonly used in everyday Bangla conversation.
* Keep spelling consistent.
* Use Bangla punctuation where appropriate.
* Maintain emotional authenticity.

For English content:

* Keep sentences short.
* Use elegant and cinematic wording.
* Avoid clichés.
* Avoid generic AI-generated romantic quotes.
* Use minimal text.
* Prioritize emotional impact over quantity.

---

## 35.12 IMPORTANT PRODUCT PRINCIPLE

Language should be part of the storytelling.

English should create:

> Premium + Modern + Cinematic + Mysterious

Bangla should create:

> Personal + Emotional + Intimate + Real

The transition between English and Bangla should feel intentional and beautiful.

The final experience should feel like:

> "This app was designed specifically for me by someone who truly knows me."

Never make the language strategy feel random.

Every sentence should have a reason to exist.
