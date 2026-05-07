import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('mb_token');
      localStorage.removeItem('mb_user');
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string | null;
}

export type Stage = 'vitarka' | 'vicara' | 'ananda' | 'asmita';
export type JhanaDepth = 'first' | 'second' | 'third' | 'fourth';

export interface JournalEntry {
  id: number;
  title: string | null;
  body: string;
  concept_tag: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForumPostSummary {
  id: number;
  title: string;
  body: string;
  concept_tag: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  username: string;
  display_name: string | null;
  user_stage: Stage | null;
  like_count: number;
  reply_count: number;
}

export interface ForumReply {
  id: number;
  body: string;
  created_at: string;
  user_id: number;
  username: string;
  display_name: string | null;
  user_stage: Stage | null;
}

export interface SessionRecord {
  id: number;
  concept: string | null;
  duration_seconds: number;
  jhana_depth: JhanaDepth | null;
  started_at: string;
}

export interface StageRecord {
  id: number;
  stage: Stage;
  marked_at: string;
  notes: string | null;
}
