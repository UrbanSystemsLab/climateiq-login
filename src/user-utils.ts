import axios from 'axios';
import { User, updateProfile } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';

import { cookiesSet } from './common';

const CLIMASENS_USER_API_ENDPOINT_URI =
  'https://api.climateiq.org/user/management/';

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

export async function createUserOnClimasens() {
  await cookiesSet;
  await axios.post(
    CLIMASENS_USER_API_ENDPOINT_URI,
    {},
    {
      withCredentials: true,
    },
  );
}

export async function deleteUserOnClimasens() {
  await cookiesSet;
  await axios.delete(CLIMASENS_USER_API_ENDPOINT_URI, {
    withCredentials: true,
  });
}
