import axios from 'axios';
import cookie from 'cookie';
import { User, updateProfile } from 'firebase/auth';
import { doc, Firestore, setDoc } from 'firebase/firestore';
import moment from 'moment';

const TOKEN_COOKIE_ID = 'climateiq_access_token';
const EXPIRY_COOKIE_ID = 'climateiq_access_token_expiry';
const TOKEN_API_ENDPOINT_URI = 'https://34.49.55.140.nip.io/oauth/token';
// This authorization code is used for identifying this user authentication app. The
// Apigee /oauth/token endpoint will only return an API access token if a valid JWT
// issued by the authentication app is also present in the request.
const AUTH_CODE =
  'cDF1QXM4T3NGdDI2emlUYWIzQmt2cFdNOUJIbDVyUmNjT25CZHhzVFIya3MwVEZ0OmNTNU1WSFFjTkI4VHJ0UXJLOVZpc09BNDFNUGVRQUtjWHc5ZmRPcTZIWFN4aDBUdU1Va0h5Tk9wZ0ZsYTBpYnI=';

export const REDIRECT_URI_PROP = {
  redirectUri: {
    type: String,
    default: '',
  },
};

export function deleteCookies() {
  document.cookie = cookie.serialize(TOKEN_COOKIE_ID, '', {
    maxAge: -1,
    path: '/',
  });
  document.cookie = cookie.serialize(EXPIRY_COOKIE_ID, '', {
    maxAge: -1,
    path: '/',
  });
}

export async function getApigeeTokenAndSetCookies(
  firebaseToken: string | null,
) {
  const cookies = cookie.parse(document.cookie);
  if (cookies[TOKEN_COOKIE_ID]) {
    if (parseInt(cookies[EXPIRY_COOKIE_ID]) > moment().unix()) {
      return;
    }
  }

  const response = await axios.post(
    TOKEN_API_ENDPOINT_URI,
    {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: firebaseToken,
    },
    {
      headers: {
        Authorization: `Basic ${AUTH_CODE}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  document.cookie = cookie.serialize(
    TOKEN_COOKIE_ID,
    response.data['access_token'],
    { maxAge: response.data['expires_in'], path: '/' },
  );
  document.cookie = cookie.serialize(
    EXPIRY_COOKIE_ID,
    String(moment().unix() + parseInt(response.data['expires_in'])),
    { maxAge: response.data['expires_in'], path: '/' },
  );
}

export async function updateUserName(
  currentUser: User,
  db: Firestore,
  firstName: String,
  lastName: String,
) {
  // First, update the user profile in Firebase Auth. This field is used for the email
  // templates.
  // TODO: Confirm if emails should show full name or first name only.
  await updateProfile(currentUser, {
    displayName: `${firstName} ${lastName}`,
  });
  // Then, also update the Firestore entry for the user. This allows us to store the
  // first and last names separately.
  // TODO: Also store organization and location.
  await setDoc(doc(db, 'users', currentUser.uid), {
    first_name: firstName,
    last_name: lastName,
  });
}
