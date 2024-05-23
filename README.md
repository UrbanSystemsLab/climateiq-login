# ClimateIQ Authentication Service

This is the ClimateIQ Authentication Service app.

## Local Dev Server

```bash
npm run dev -- --host
```

## Deploy to Firebase Hosting

Generally, you need Editor or Owner permissions to ClimateIQ GCP to deploy to Firebase
Hosting. See [here](https://firebase.corp.google.com/project/climateiq/settings/iam) for
a list of users with permissions. GCP Owners can also set up
[more granular roles](https://firebase.google.com/docs/projects/iam/overview#roles).

Install
[firebase-cli](https://firebaseopensource.com/projects/firebase/firebase-tools/#installation),
then:

```bash
npm run build
firebase deploy --project climateiq
```

If you run into any errors, try logging into Firebase again:

```bash
firebase login --reauth
```
