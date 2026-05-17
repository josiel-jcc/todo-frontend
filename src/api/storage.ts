import { z } from 'zod';
import type { components } from './types';

type User = components['schemas']['models.User'];

/**
 * Schema for validating stored user data
 */
const storedUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  notifications_enabled: z.boolean().optional(),
  telegram_chat_id: z.string().nullable().optional(),
});

/**
 * Storage keys for authentication
 */
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

/**
 * Get stored user data with validation
 * @returns Validated user data or null if invalid/not found
 */
export const getStoredUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) {
      return null;
    }

    const parsed = JSON.parse(userJson);
    const validated = storedUserSchema.parse(parsed);
    return validated as User;
  } catch (error) {
    // Invalid data in localStorage, clear it
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    return null;
  }
};

/**
 * Set user data in localStorage
 */
export const setStoredUser = (user: User): void => {
  try {
    const normalized = normalizeStoredUser(user);
    storedUserSchema.parse(normalized);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalized));
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid user data format');
    }
    throw error;
  }
};

/**
 * Merge partial user fields into stored user data
 */
export const mergeStoredUser = (patch: Partial<User>): User | null => {
  const current = getStoredUser();
  if (!current) {
    return null;
  }

  const updated = normalizeStoredUser({ ...current, ...patch });
  setStoredUser(updated);
  return updated;
};

const normalizeStoredUser = (user: User): User => ({
  ...user,
  telegram_chat_id: user.telegram_chat_id ?? '',
});

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Set authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Remove authentication token and user data from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};
