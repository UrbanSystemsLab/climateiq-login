<script setup lang="ts">
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { onBeforeUnmount, nextTick, ref } from 'vue';

import {
  cookiesSet,
  getSamlSignedResponse,
  REDIRECT_URI_PROP,
} from '../common';
import CommonDisclaimer from './CommonDisclaimer.vue';
import { router } from '../router';

const auth = getAuth();
const props = defineProps({
  ...REDIRECT_URI_PROP,
  ...{
    apigeeSamlIdpSessionId: {
      type: String,
      default: '',
    },
  },
});

// Fields
const email = ref();
const password = ref();
const errorMessage = ref();

// Apigee Saml Idp login fields
const acsUrl = ref();
const samlForm = ref<HTMLFormElement>();
const samlResponse = ref();

// Toggles
const loggedIn = ref(false);

async function signIn() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
  } catch (error) {
    // TODO: Clean up error message.
    errorMessage.value = (error as Error).message;
    return;
  }
  // Clear the error if this sign in attempt does not throw an error.
  errorMessage.value = null;
}

// Listening for auth state changes.
const unsubscribeAuthListener = onAuthStateChanged(auth, async (user) => {
  if (user) {
    loggedIn.value = true;
    await cookiesSet;
    // If the SAML session ID was passed in the query params, get SAML token.
    if (props.apigeeSamlIdpSessionId) {
      const firebaseToken = await user.getIdToken();
      const response = await getSamlSignedResponse(
        firebaseToken,
        props.apigeeSamlIdpSessionId,
      );
      acsUrl.value = response['acs_url'];
      samlResponse.value = response['saml_response'];
      // Wait until form element is updated.
      nextTick(() => samlForm.value!.submit());
    } else if (props.redirectUri) {
      window.location.href = props.redirectUri;
    } else {
      router.push({ path: '/account-management' });
    }
  }
});

onBeforeUnmount(unsubscribeAuthListener);
</script>

<template>
  <div class="logged-out" v-show="!loggedIn">
    <h2>Login</h2>
    <form @submit.prevent :class="{ 'error-state': errorMessage }">
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="email">
        <label for="email">Email</label>
        <input type="email" v-model="email" />
      </div>

      <div class="password">
        <label for="password">Password</label>
        <input type="password" v-model="password" />
      </div>

      <div class="reset-password">
        <RouterLink to="reset-password">Reset Password</RouterLink>
      </div>

      <button @click="signIn" type="submit">Continue</button>

      <CommonDisclaimer />
    </form>
    <div class="no-account-sign-up">
      <p>Don't have an account?</p>
      <RouterLink to="/sign-up">Create account</RouterLink>
    </div>
  </div>
  <div class="logged-in" v-show="loggedIn">
    <h2>Logging in...</h2>
  </div>
  <!-- Because this action results in a 302 redirect, must run request in the foreground
   by submitting through a form. -->
  <div class="saml-idp" v-show="false">
    <form method="post" :action="acsUrl" ref="samlForm">
      <input type="hidden" name="SAMLResponse" v-model="samlResponse" />
    </form>
  </div>
</template>
