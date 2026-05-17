import { beforeEach, describe, expect, it } from 'vitest';
import { clearLocalStorage } from '@/test/utils';
import {
  getAuthToken,
  getStoredUser,
  removeAuthToken,
  setAuthToken,
  setStoredUser,
} from './storage';

describe('storage', () => {
  beforeEach(() => {
    clearLocalStorage();
  });

  describe('getAuthToken', () => {
    it('should return token when exists', () => {
      setAuthToken('test-token-123');
      expect(getAuthToken()).toBe('test-token-123');
    });

    it('should return null when token does not exist', () => {
      expect(getAuthToken()).toBeNull();
    });
  });

  describe('setAuthToken', () => {
    it('should set token in localStorage', () => {
      setAuthToken('new-token');
      expect(getAuthToken()).toBe('new-token');
    });

    it('should overwrite existing token', () => {
      setAuthToken('old-token');
      setAuthToken('new-token');
      expect(getAuthToken()).toBe('new-token');
    });
  });

  describe('removeAuthToken', () => {
    it('should remove token from localStorage', () => {
      setAuthToken('test-token');
      removeAuthToken();
      expect(getAuthToken()).toBeNull();
    });

    it('should remove user data from localStorage', () => {
      const user = {
        id: 1,
        username: 'test',
        email: 'test@example.com',
      };
      setStoredUser(user);
      removeAuthToken();
      expect(getStoredUser()).toBeNull();
    });

    it('should not throw when token does not exist', () => {
      expect(() => removeAuthToken()).not.toThrow();
    });
  });

  describe('getStoredUser', () => {
    it('should return user when valid data exists', () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      setStoredUser(user);
      expect(getStoredUser()).toEqual({ ...user, telegram_chat_id: '' });
    });

    it('should return null when user does not exist', () => {
      expect(getStoredUser()).toBeNull();
    });

    it('should return null and clear invalid data', () => {
      // Set invalid JSON
      localStorage.setItem('auth_user', 'invalid-json');
      expect(getStoredUser()).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('should return null and clear data with invalid schema', () => {
      // Set data missing required fields
      localStorage.setItem('auth_user', JSON.stringify({ id: 1 }));
      expect(getStoredUser()).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('should return null and clear data with invalid email', () => {
      // Set data with invalid email
      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          id: 1,
          username: 'test',
          email: 'invalid-email',
        })
      );
      expect(getStoredUser()).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('should handle optional fields', () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };
      setStoredUser(user);
      expect(getStoredUser()).toEqual({ ...user, telegram_chat_id: '' });
    });

    it('should preserve notifications_enabled', () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        notifications_enabled: true,
        telegram_chat_id: '12345',
      };
      setStoredUser(user);
      expect(getStoredUser()).toEqual(user);
    });
  });

  describe('setStoredUser', () => {
    it('should set user in localStorage', () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      setStoredUser(user);
      expect(getStoredUser()).toEqual({ ...user, telegram_chat_id: '' });
    });

    it('should overwrite existing user', () => {
      const user1 = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
      };
      const user2 = {
        id: 2,
        username: 'user2',
        email: 'user2@example.com',
      };
      setStoredUser(user1);
      setStoredUser(user2);
      expect(getStoredUser()).toEqual({ ...user2, telegram_chat_id: '' });
    });

    it('should throw error for invalid user data', () => {
      const invalidUser = {
        id: 1,
        // Missing required fields
      } as unknown as Parameters<typeof setStoredUser>[0];

      expect(() => setStoredUser(invalidUser)).toThrow('Invalid user data format');
    });

    it('should throw error for invalid email', () => {
      const invalidUser = {
        id: 1,
        username: 'test',
        email: 'invalid-email',
      };

      expect(() => setStoredUser(invalidUser)).toThrow('Invalid user data format');
    });
  });
});
