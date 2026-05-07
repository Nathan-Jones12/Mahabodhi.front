import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import { router } from './router';
import { useAuthStore } from './store';

const app = createApp(App);
app.use(createPinia());
app.use(router);

const auth = useAuthStore();
auth.hydrate();

app.mount('#app');
