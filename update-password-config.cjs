// Update the password policy with the settings in password-config.json.
// Make sure you're logged in before running this - run `firebase login`.
// After logging in, we expect a file to be automatically created in
// ~/.config/configstore/firebase-tools.json.
const os = require('os');

const auth = require('firebase-admin/auth');
const app = require('firebase-admin/app');
const firebaseConfig = require('./firebase-config.json');
const passwordConfig = require('./password-config.json');
const firebaseTools = require(
  os.homedir() + '/.config/configstore/firebase-tools.json',
);

// This is an object following the credential.Credential interface. See:
// https://firebase.google.com/docs/reference/admin/node/firebase-admin.credential_n.md#credentialcredential
const accessToken = {
  getAccessToken: () => {
    return new Promise((resolve) => {
      resolve({
        access_token: firebaseTools['tokens']['access_token'],
        expires_in: firebaseTools['tokens']['expires_in'],
      });
    });
  },
};

app.initializeApp({ ...firebaseConfig, ...{ credential: accessToken } });

auth
  .getAuth()
  .projectConfigManager()
  .updateProjectConfig({
    passwordPolicyConfig: {
      enforcementState: 'ENFORCE',
      forceUpgradeOnSignin: true,
      constraints: passwordConfig,
    },
  });
