# ClimateIQ Authentication Service

This is the ClimateIQ Authentication Service app.

## Local Dev Server

```bash
npm run dev -- --host
```

## Deploy to Firebase Hosting

Install [firebase-cli](https://firebaseopensource.com/projects/firebase/firebase-tools/#installation), then:

```bash
npm run build
firebase deploy --project climateiq
```

If you run into any errors, try logging into Firebase again:

```bash
firebase login --reauth
```
