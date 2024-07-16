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

<style scoped>
.account-management {
  max-width: var(--wide-width);
}

h2 {
  font-size: 2rem;
  margin-bottom: 3rem;
}

h3 {
  color: var(--secondary-text-color);
  font-size: 1.5rem;
  font-weight: normal;
  padding-left: 1.25rem;
}

.field {
  border-top: 1px solid var(--account-divider-color);
  color: var(--secondary-text-color);
  display: flex;
  padding: 0 1.25rem;

  .action {
    background: none;
    border: 0;
    color: var(--accent-color);
    font-size: 1rem;
    min-width: 3rem;
    padding: 1.25rem 0;
    text-decoration: none;
    text-align: right;
  }

  .action:hover {
    cursor: pointer;
  }

  label {
    font-size: 1rem;
    min-width: 150px;
    padding: 1.25rem 0;
  }

  input {
    background: none;
    border: 0;
    color: var(--secondary-text-color);
    flex: 1;
    padding: 1.25rem 1rem;
  }
}

.password,
.name {
  border-bottom: 1px solid var(--account-divider-color);
}

.name {
  margin-bottom: 2rem;

  input {
    margin: 0.5rem 1.25rem 0.5rem 0;
    padding: 0.75rem 1rem;
  }
}

.name.editing {
  input {
    outline: 1px solid var(--account-divider-color);
  }
}

.secondary-action {
  width: fit-content;
}

.logout {
  margin-bottom: 1.25rem;
}

.delete-account {
  max-width: 320px;
  .secondary-action {
    border-color: var(--warning-color);
    color: var(--warning-color);
  }

  .relogin-password {
    margin-bottom: 1.25rem;
  }
}
</style>

<template>
  <div class="account-management">
    <h2>My Account</h2>
    <h3>ID and Password</h3>
    <div class="email field">
      <label for="email">Email</label>
      <input id="email" type="text" v-model="email" readonly />
      <RouterLink to="update-email" class="action">Edit</RouterLink>
    </div>
    <div class="password field">
      <label for="password">Password</label>
      <input id="password" type="password" placeholder="********" readonly />
      <RouterLink to="reset-password" class="action">Reset</RouterLink>
    </div>
    <h3>Information</h3>
    <div class="error-message" v-if="updateUserNameErrorMessage">
      {{ updateUserNameErrorMessage }}
    </div>
    <form
      class="name field"
      @submit.prevent="updateName"
      :class="{
        editing: editingName,
        'error-state': updateUserNameErrorMessage,
      }"
    >
      <label for="first-name">Name</label>
      <input
        id="first-name"
        type="text"
        placeholder="First Name"
        v-model="firstName"
        :readonly="!editingName"
        required
      />
      <input
        id="last-name"
        type="text"
        placeholder="Last Name"
        v-model="lastName"
        :readonly="!editingName"
        required
      />
      <button type="submit" class="action">
        {{ editingName ? 'Save' : 'Edit' }}
      </button>
    </form>
    <div class="logout">
      <button @click="logout" class="secondary-action">Logout</button>
    </div>
    <form
      class="delete-account"
      @submit.prevent="deleteAccount"
      :class="{ 'error-state': deleteErrorMessage }"
    >
      <div class="error-message" v-if="deleteErrorMessage">
        {{ deleteErrorMessage }}
      </div>
      <div class="relogin-password" v-if="showRelogin">
        <label for="password">Password</label>
        <input
          name="password"
          type="password"
          v-model="reloginPassword"
          placeholder="Re-enter password to confirm deletion"
          required
        />
      </div>
      <button type="submit" class="secondary-action">Delete account</button>
    </form>
  </div>
</template>
