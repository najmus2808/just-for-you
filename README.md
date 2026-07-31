# Just For You ❤️

> "A little world I made, just for you."

A private, offline, cinematic digital love story — built with Expo, React
Native, and TypeScript. No backend, no accounts, no internet required. See
`SPEC.md` for the full product specification.

---

## Personalizing it

All personal content lives in `data/`, separate from the UI. Nothing here
requires touching component code.

| File                   | What to fill in                                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `data/appConfig.ts`    | Names and `relationshipStartDate` / `anniversaryDate` (replace the `TODO_` placeholders, format `YYYY-MM-DD`)                                |
| `data/story.ts`        | Our Story timeline — date/description per milestone                                                                                          |
| `data/memories.ts`     | The starter "demo" memory shown before you add real ones                                                                                     |
| `data/letters.ts`      | The body of each "Open When..." letter                                                                                                       |
| `data/secret.ts`       | The Secret Letter's real message                                                                                                             |
| `data/quiz.ts`         | Quiz options — remember to update `correctIndex` for each question                                                                           |
| `data/songs.ts`        | Song title/artist/reason; add the audio file under `assets/audio/songs/` and set `audioAsset: require('@/assets/audio/songs/your-file.mp3')` |
| `data/finalMessage.ts` | The Final Surprise closing message                                                                                                           |

**Real photos are never bundled into the app.** They're added on the phone
itself: Memory Vault → **+** → pick photos from the system picker → fill in
the details. See SPEC.md Section 36 for why.

The Secret Letter unlocks with the relationship start date (any digit
format — `12-05-2020`, `12/05/2020`, etc. all work) once that date is filled
in above. Until then, any non-empty input unlocks it, so the feature stays
testable.

---

## Running it during development

```bash
npm install
npm start
```

Scan the QR code with **Expo Go** on an Android phone — this is the fastest
way to see changes live, faster than an emulator. Useful checks:

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
```

---

## Building the Android APK

This project builds via **EAS Build** (Expo's cloud build service) rather
than a local Android SDK install — the app itself is fully offline at
runtime; only the _build step_ touches the network.

1. **One-time setup:**

   ```bash
   npx eas-cli login
   ```

   (Creates/uses a free Expo account — needed only to trigger builds, not
   used by the app itself.)

2. **Build the APK:**

   ```bash
   npx eas-cli build --platform android --profile apk
   ```

   This uploads the project, builds it in Expo's cloud, and gives you a
   download link when done (also visible at expo.dev under your account).

3. **Download the APK** from that link onto the phone, or to a computer and
   transfer it over (USB, or share it to the phone via any app).

---

## Installing on the Android device

1. Open the downloaded `.apk` file on the phone (via Files app, or however
   it was transferred).
2. Android will prompt to allow installing from this source the first time
   — allow it (Settings → this app/browser → "Install unknown apps").
3. Tap **Install**. Once done, open **Just For You** like any other app.
4. No Wi-Fi, mobile data, or Expo Go is needed to run it — everything is
   local.

---

## Updating the APK later

1. Make your changes (content edits, new photos in data, code changes).
2. Bump `android.versionCode` in `app.json` (e.g. `1` → `2`) — Android
   requires a higher version code to allow installing over the existing
   app while keeping its data (the memories she's already added stay put).
3. Rebuild: `npx eas-cli build --platform android --profile apk`
4. Install the new APK the same way — it upgrades in place.

If you ever want a completely fresh start instead, uninstall the app first;
that clears its local data (Section 36).

---

## Offline

The entire app was audited for network dependencies during development —
no `fetch`, no remote URLs, no analytics or backend SDKs anywhere in the
codebase. Everything (fonts, images, audio, data) is either bundled at
build time or stored on-device. Before giving it as a gift, it's worth
personally confirming on the real device with Wi-Fi and mobile data both
off: every screen should open, every letter/photo/song should work, exactly
as with data on.
