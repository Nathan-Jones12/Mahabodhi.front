import { defineStore } from 'pinia';
import { api, type User } from '../api';

interface AuthState {
  token: string | null;
  user: User | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthed: (s) => !!s.token,
  },
  actions: {
    hydrate() {
      const t = localStorage.getItem('mb_token');
      const u = localStorage.getItem('mb_user');
      if (t) this.token = t;
      if (u) {
        try { this.user = JSON.parse(u); } catch { /* ignore */ }
      }
    },
    setAuth(token: string, user: User) {
      this.token = token;
      this.user = user;
      localStorage.setItem('mb_token', token);
      localStorage.setItem('mb_user', JSON.stringify(user));
    },
    async login(email: string, password: string) {
      const { data } = await api.post('/api/auth/login', { email, password });
      this.setAuth(data.token, data.user);
    },
    async register(username: string, email: string, password: string, display_name?: string) {
      const { data } = await api.post('/api/auth/register', {
        username, email, password, display_name,
      });
      this.setAuth(data.token, data.user);
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('mb_token');
      localStorage.removeItem('mb_user');
    },
  },
});
