import CarbonVue3 from '@carbon/vue';
import { createApp } from 'vue';
import './carbon-styles.scss';
import './style.scss';
import App from './App.vue';
import { router } from './router.ts';

const app = createApp(App);
app.use(CarbonVue3);
app.use(router);
app.mount('#app');
