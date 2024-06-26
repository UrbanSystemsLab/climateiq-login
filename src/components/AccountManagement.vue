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

<template>
  <h2>Account Management</h2>
  <h3>Email and Password</h3>
  <div class="email">
    <label for="email">Email</label>
    <input name="email" type="text" v-model="email" readonly />
    <RouterLink to="update-email">Edit</RouterLink>
  </div>
  <div class="password">
    <label for="password">Password</label>
    <input name="password" type="password" readonly />
    <RouterLink to="reset-password">Reset</RouterLink>
  </div>
  <h3>Personal Information</h3>
  <form
    class="name"
    @submit.prevent
    :class="{ 'error-state': updateUserNameErrorMessage }"
  >
    <div class="error-message" v-if="updateUserNameErrorMessage">
      {{ updateUserNameErrorMessage }}
    </div>
    <label for="first-name">Name</label>
    <input
      name="first-name"
      type="text"
      v-model="firstName"
      :readonly="!editingName"
    />
    <input
      name="last-name"
      type="text"
      v-model="lastName"
      :readonly="!editingName"
    />
    <button @click="updateName" type="submit">
      {{ editingName ? 'Save' : 'Edit' }}
    </button>
  </form>
  <div class="logout">
    <button @click="logout">Logout</button>
  </div>
  <form
    class="delete-account"
    @submit.prevent
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
        required
      />
    </div>
    <button @click="deleteAccount" type="submit">Delete account</button>
  </form>
</template>
