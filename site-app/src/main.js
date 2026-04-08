import { createApp, provide, h, markRaw, defineAsyncComponent } from "vue";
import App from "./App.vue";
import router from "./router";
import { apolloClient } from "./vue-apollo";
import { provideApolloClient } from "@vue/apollo-composable";
import reka from "./reka";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});
pinia.use(piniaPluginPersistedstate);
const app = createApp({
  setup() {
    provideApolloClient(apolloClient);
  },
  render: () => h(App),
});
app.use(pinia);
app.use(router);
app.provide("reka", reka);
app.mount("#app");
