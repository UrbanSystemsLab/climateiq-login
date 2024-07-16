<style scoped>
.common-disclaimer {
  border-bottom: 1px solid var(--divider-color);
  font-size: 0.8rem;
  margin: 1.5rem 0;
}

a {
  text-decoration: none;
}
</style>

<template>
  <div class="common-disclaimer">
    <p>
      By continuing, you acknowledge that you understand and agree to the
      <RouterLink to="/terms-of-service">Terms of Service</RouterLink>,
      <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>, and
      <RouterLink to="/cookie-statement">Cookie Statement</RouterLink>.
    </p>
  </div>
</template>
