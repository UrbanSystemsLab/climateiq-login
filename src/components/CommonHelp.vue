<style lang="scss" scoped>
@import 'carbon-components/scss/globals/scss/theme-tokens.scss';

.common-help {
  border-top: 1px solid $decorative-01;
  padding-top: 1rem;

  a {
    font-size: inherit;
  }

  p {
    font-size: 0.75rem;
  }
}
</style>

<template>
  <div class="common-help">
    <p>
      Need help? Contact us at
      <CvLink href="mailto:support@climateiq.org">support@climateiq.org</CvLink
      >.
    </p>
  </div>
</template>
