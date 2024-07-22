<script setup lang="ts">
import { getApp } from 'firebase/app';
import {
  deleteUser,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, deleteDoc, getDoc, getFirestore } from 'firebase/firestore';
import { onBeforeUnmount, ref } from 'vue';

import { router } from '../router';
import { deleteUserOnClimasens, updateUserName } from '../user-utils';

const auth = getAuth();
const db = getFirestore(getApp());

// Fields
const email = ref();
const firstName = ref();
const lastName = ref();
const reloginPassword = ref();

// Toggles
const editingName = ref(false);
const showRelogin = ref(false);

// Error messages
const deleteErrorMessage = ref();
const updateUserNameErrorMessage = ref();

async function getUserInfo(user: User) {
  email.value = user.email;
  const docSnap = await getDoc(doc(db, 'users', user.uid));
  if (docSnap.exists()) {
    firstName.value = docSnap.data().first_name;
    lastName.value = docSnap.data().last_name;
  }
}

async function deleteAccount() {
  // If the password hasn't been entered, show the re-login form.
  if (!reloginPassword.value) {
    showRelogin.value = true;
    return;
  }
  // If the password has been entered, log in then delete.
  try {
    await signInWithEmailAndPassword(auth, email.value, reloginPassword.value);
  } catch (error) {
    // TODO: Clean up error message.
    deleteErrorMessage.value = (error as Error).message;
    return;
  }
  try {
    await deleteUserOnClimasens();
    await deleteDoc(doc(db, 'users', auth.currentUser!.uid));
    await deleteUser(auth.currentUser!);
  } catch (error) {
    // TODO: Clean up error message.
    deleteErrorMessage.value = (error as Error).message;
    return;
  }
  deleteErrorMessage.value = null;
}

async function updateName() {
  if (!editingName.value) {
    editingName.value = true;
    return;
  }
  try {
    await updateUserName(
      auth.currentUser!,
      db,
      firstName.value,
      lastName.value,
    );
  } catch (error) {
    // TODO: Clean up error message.
    updateUserNameErrorMessage.value = (error as Error).message;
    return;
  }
  updateUserNameErrorMessage.value = null;
  editingName.value = false;
}

function logout() {
  signOut(auth);
}

// This listener is triggered in two cases:
// * When the user lands on this page.
// * When the user deletes their account.
const unsubscribeAuthListener = onAuthStateChanged(auth, (user) => {
  if (user) {
    getUserInfo(user);
  } else {
    router.push({ path: '/' });
  }
});

onBeforeUnmount(() => {
  unsubscribeAuthListener();
});
</script>

<style lang="scss">
@import 'carbon-components/scss/globals/scss/theme-tokens.scss';
.account-management {
  h2 {
    font-size: 2rem;
    margin-bottom: 5rem;
  }

  h3,
  .delete-account,
  .logout {
    margin-bottom: 1rem;
  }

  .bx--structured-list {
    margin-bottom: 4rem;
  }

  .delete-account {
    max-width: var(--narrow-width);
  }

  .cv-structured-list-data {
    vertical-align: middle;
  }

  .cv-structured-list-data:nth-of-type(3n - 2) {
    width: 10rem;
  }

  .cv-structured-list-data:nth-of-type(3n) {
    text-align: right;
  }

  // In order for these rules to apply, this css can't be scoped.
  .name-data {
    display: flex;

    .cv-text-input {
      // This removes extra space around the field.
      flex-direction: row;
    }

    .cv-text-input:first-of-type {
      margin-right: 1em;
    }

    input:disabled {
      background: none;
      -webkit-text-fill-color: $text-02;
    }
  }

  // Override main style
  .delete-account .cv-button {
    min-width: 0;
  }
}
</style>

<template>
  <div class="account-management wide-view">
    <h2>My Account</h2>
    <h3>ID and Password</h3>
    <CvStructuredList condensed>
      <template v-slot:items>
        <CvStructuredListItem>
          <CvStructuredListData>Email</CvStructuredListData>
          <CvStructuredListData>{{ email }}</CvStructuredListData>
          <CvStructuredListData
            ><RouterLink to="update-email"
              ><CvButton kind="ghost" size="small">Edit</CvButton></RouterLink
            ></CvStructuredListData
          >
        </CvStructuredListItem>
        <CvStructuredListItem value="test1">
          <CvStructuredListData>Password</CvStructuredListData>
          <CvStructuredListData>********</CvStructuredListData>
          <CvStructuredListData
            ><RouterLink to="reset-password"
              ><CvButton kind="ghost" size="small">Reset</CvButton></RouterLink
            ></CvStructuredListData
          >
        </CvStructuredListItem>
      </template>
    </CvStructuredList>

    <h3>Information</h3>
    <CvInlineNotification
      v-if="updateUserNameErrorMessage"
      :subTitle="updateUserNameErrorMessage"
      kind="error"
      lowContrast
      hideCloseButton
    ></CvInlineNotification>
    <CvStructuredList condensed>
      <template v-slot:items>
        <CvStructuredListItem>
          <CvStructuredListData>Name</CvStructuredListData>
          <CvStructuredListData class="name-data">
            <CvTextInput
              v-model="firstName"
              :disabled="!editingName"
              :data-invalid="updateUserNameErrorMessage"
              placeholder="First / Preferred Name"
            />
            <CvTextInput
              v-model="lastName"
              :disabled="!editingName"
              :data-invalid="updateUserNameErrorMessage"
              placeholder="Last Name"
            />
          </CvStructuredListData>
          <CvStructuredListData
            ><CvButton @click="updateName" kind="ghost" size="small">{{
              editingName ? 'Save' : 'Edit'
            }}</CvButton></CvStructuredListData
          >
        </CvStructuredListItem>
      </template>
    </CvStructuredList>
    <div class="logout">
      <CvButton @click="logout" kind="tertiary">Logout</CvButton>
    </div>
    <div class="delete-account narrow-view">
      <CvInlineNotification
        v-if="deleteErrorMessage"
        :subTitle="deleteErrorMessage"
        kind="error"
        lowContrast
        hideCloseButton
      ></CvInlineNotification>
      <CvForm @submit.prevent="deleteAccount">
        <div class="relogin-password" v-if="showRelogin">
          <CvTextInput
            v-model="reloginPassword"
            :data-invalid="deleteErrorMessage"
            type="password"
            label="Password"
            placeholder="Re-enter password to confirm deletion"
            required
          />
        </div>
        <CvButton kind="danger--tertiary">Delete account</CvButton>
      </CvForm>
    </div>
  </div>
</template>
