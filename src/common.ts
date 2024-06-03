import { User, updateProfile } from 'firebase/auth';
import { doc, Firestore, setDoc } from 'firebase/firestore';

export const REDIRECT_URI_PROP = {
  redirectUri: {
    type: String,
    default: '',
  },
};

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
