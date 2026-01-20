import axios from 'axios';
import type { Note } from '../../types/note';
import { api } from './api';
import { User } from '@/types/user';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
  });

  return data;
};

export interface CreateParams {
  title: string;
  content: string;
  tag: string;
}

export const createNote = async (newNote: CreateParams): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

// lib/api/clientApi.ts — для функцій, які викликаються у клієнтських компонентах:

// fetchNotes
// fetchNoteById
// createNote
// deleteNote

// register +
// login +
// logout+
// checkSession+
// getMe+
// updateMe

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<User>('/auth/login', data);
  return res.data;
};

export interface CheckSessionRequest {
  success: boolean;
}

export const checkSession = async (): Promise<boolean> => {
  const { data } = await api.get<CheckSessionRequest>('/auth/session');

  return data.success;
};

export const getMe = async () => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export type UpdateUserRequest = {
  username?: string;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await api.patch<User>('/users/me', payload);
  return res.data;
};
