# ClimateIQ Authentication Service

This is the ClimateIQ Authentication Service app.

## Local Dev Server

```bash
npm run dev -- --host
```

## Deploy to Firebase Hosting<a name="deploy"></a>

Generally, you need Editor or Owner permissions to ClimateIQ GCP to deploy to Firebase
Hosting. See [here](https://firebase.corp.google.com/project/climateiq/settings/iam) for
a list of users with permissions. GCP Owners can also set up
[more granular roles](https://firebase.google.com/docs/projects/iam/overview#roles).

Install
[firebase-cli](https://firebaseopensource.com/projects/firebase/firebase-tools/#installation),
then:

```bash
firebase login
npm run build
firebase deploy --project climateiq
```

If you run into any errors, try logging into Firebase again:

```bash
firebase login --reauth
```

## Update Password Configuration

The password configuration controls the limits on user password values (e.g., minimum
length).

To update the rules, edit `password-config.json`, which is a JSON file describing an
object with [these properties](https://firebase.google.com/docs/reference/admin/node/firebase-admin.auth.customstrengthoptionsconfig.md#customstrengthoptionsconfig_interface).

Then, run:

```bash
firebase login
npm run updatePasswordConfig
```

> **_NOTE:_** Running this command will force any users whose passwords do not meet the
> new requirements to update their password on next sign in.

If you have deploy permissions, then you will have update password configuration
permissions. For more detail on permissions, see the [section on deploying](#deploy).

If you run into any errors, try logging into Firebase again:

```bash
firebase login --reauth
```

For posterity, please also check in any changes to `password-config.json`.
