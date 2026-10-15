# FINX

FINX is an Expo application for explainable, rule-based review of suspicious messages, URLs, and call transcripts. Scan content is only analyzed when explicitly submitted. Scan history stores metadata locally, not the submitted content.

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
```

## Optional hosted analysis API

The app analyzes locally by default. To use the Vercel serverless endpoint, set `EXPO_PUBLIC_FINX_API_URL` to its full URL (for example, `https://your-deployment.vercel.app/api/analyze`) before building. The endpoint runs the same rule-based detector; it does not use an external AI service or fetch submitted URLs. Never put private API keys in `EXPO_PUBLIC_` variables.

## Android APK with EAS

```sh
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

The preview profile in `eas.json` is configured for an installable APK. A build is produced only after the EAS build completes successfully.
