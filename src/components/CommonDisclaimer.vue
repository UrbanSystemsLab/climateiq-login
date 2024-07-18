<style lang="scss">
@import 'carbon-components/scss/globals/scss/theme-tokens.scss';

.common-disclaimer {
  border-bottom: 1px solid $decorative-01;
  margin-bottom: 1rem;
  padding-bottom: 1rem;

  a {
    font-size: inherit;
  }

  p {
    font-size: 0.75rem;
  }
}
</style>

<template>
  <div class="common-disclaimer">
    <p>
      By continuing, you acknowledge that you understand and agree to the
      <CvLink to="/terms-of-service">Terms of Service</CvLink>,
      <CvLink to="/privacy-policy">Privacy Policy</CvLink>, and
      <CvLink to="/cookie-statement">Cookie Statement</CvLink>.
    </p>
  </div>
</template>
