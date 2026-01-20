// lib/api/serverApi.ts — для функцій, які викликаються у серверних компонентах (до params потрібно додавати cookeis у headers):
// fetchNotes
// fetchNoteById
// getMe
// checkSession.

import { api } from './api';
import { cookies } from 'next/headers';
import { FetchNotesParams, FetchNotesResponse, User } from './clientApi';
import { Note } from '@/types/note';

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookie = await cookies();

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookie.toString(),
    },
  });

  return data;
};

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const cookie = await cookies();

  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: {
      Cookie: cookie.toString(),
    },
  });

  return data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();
  const res = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
