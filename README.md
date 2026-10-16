# FINX

FINX is an Expo application for explainable, rule-based review of suspicious messages, URLs, and call transcripts. Scans and safety guidance work without an account. Submitted content is analyzed only after the user asks for a scan. By default, history stores scan metadata locally, not submitted message content.

## Run locally

```sh
npm install
npx expo start
npx expo start --web
```

Web export and validation:

```sh
npx expo export --platform web
npx expo-doctor
npm run typecheck
npm test
```

## Firebase email authentication (optional)

Create a Firebase project, register a Web app, enable **Email/Password** in Authentication, and copy the web app configuration to the `EXPO_PUBLIC_FIREBASE_*` entries in `.env` (start from `.env.example`). These values identify a Firebase client app and are public; never use a Firebase Admin/service-account key in the app. The app uses Firebase Auth's email/password account creation, sign-in, password reset, auth-state observer, and sign-out. Native sessions use AsyncStorage persistence; web uses the Firebase web persistence default. Auth remains optional and does not gate local scans or safety guidance.

Firebase Console authorized domains must include the deployed web host. The project must also have email/password sign-in enabled for these actions to succeed. Without configuration, the account screen explains that setup is missing.

## Rules-based scans

FINX checks messages, URLs, and call transcripts on the device using explainable warning patterns. Submitted scan content is not sent to a hosted analysis service. The result score is heuristic, not a guarantee that content is safe or fraudulent. Result narration uses the device's installed text-to-speech voice for the selected language.

## Privacy and logo

Submitted content is checked on the device and is not written to local history or sent to an analysis service. History stores scan metadata locally. History deletion removes those local records. No analytics or cloud history sync are configured.

The original F-in-shield artwork is in `assets/finx-mark.svg`; the app icon, Android adaptive icon, and splash screen are local PNG files generated from original geometric artwork. The SVG is the editable source.

## Languages, audio, and appearance

The interface supports English, Telugu, Hindi, Tamil, and Kannada, with localized scan guidance and safety tips. Some setup and authentication error details may fall back to English. Result narration uses the device's installed text-to-speech voice for the selected language. FINX does not upload speech audio. The Profile screen lets users choose a profile picture from their photo library; the selected image reference is stored locally on the device and is not uploaded or synchronized to Firebase. Users can change or remove the picture at any time. Appearance preference is also stored locally.

On iOS and Android, the Scan screen can take a photo or choose one from the library and extract text on-device with Apple Vision / Google ML Kit. The image is not uploaded or added to scan history. Extracted text is shown for review and checked on-device only if the user taps Analyze. OCR works best with clear, printed Latin text; other script recognition depends on the platform/device. The web build does not provide photo OCR. A native EAS build is required; this feature is not available in Expo Go.

## Android builds with EAS

```sh
npm install --global eas-cli
eas login
eas build:configure
# Installable internal-test APK
eas build --platform android --profile preview
# Google Play uploadable Android App Bundle
eas build --platform android --profile production
```

The development profile produces an installable development-client APK with the native modules needed for photo OCR. Install that APK on the phone, then run `npm run start:dev-client` on the development computer and open the project from the development client. Do not open FINX with Expo Go: Expo Go does not include these project's custom native modules. The preview profile produces an installable standalone APK; the production profile produces a Play Store App Bundle (AAB). Android launchers use the configured FINX legacy icon and padded adaptive icon; icon changes appear only after rebuilding and reinstalling the APK, not through a Metro refresh. A build is produced only after the EAS build completes successfully.

For an EAS cloud development build, add the non-secret `EXPO_PUBLIC_FIREBASE_*` client configuration to the EAS build environment; the local `.env.local` is git-ignored and is not uploaded.

Before publishing on Google Play, the release owner still needs to verify the signing and Play Console account, prepare store screenshots and listing copy, complete the content rating and Data safety forms, provide a publicly accessible privacy-policy URL, and meet the current testing and target-API requirements. Because account creation is enabled, implement and verify account deletion both in-app and through a public web deletion resource before submitting. Review any data sent to Firebase when completing disclosures. Resolve the current dependency audit advisories and complete a security review before public launch. These items cannot be completed by a local code change alone; FINX has not been submitted to Google Play.

## Vercel web deployment

This repository is configured to deploy the static Expo web app from its root. In Vercel, import `https://github.com/Saivignesh142/finx-5876`, select the `finx-expo-mobile` branch, and use the **Other** framework preset with the project root set to `./`. The checked-in `vercel.json` exports the web app to `dist/`. No backend environment variables are required.

## Update/install the Android APK

Build a fresh APK with `npx eas-cli build --platform android --profile preview`. When EAS reports the build as complete, open its build page on the phone and install the APK. The spoken explanation uses the device's installed voice for the chosen language; install or enable that language's speech voice in the phone's text-to-speech settings if it is unavailable.
