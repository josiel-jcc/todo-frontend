import axios, { type AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { navigateTo } from '@/lib/navigation';
import { getAuthToken, removeAuthToken } from './storage';

// Mock dependencies
vi.mock('./storage', () => ({
  getAuthToken: vi.fn(),
  setAuthToken: vi.fn(),
  removeAuthToken: vi.fn(),
  getStoredUser: vi.fn(),
  setStoredUser: vi.fn(),
}));

vi.mock('@/lib/navigation', () => ({
  navigateTo: vi.fn(),
}));

// We need to import apiClient after mocks are set up
// So we'll create it dynamically in tests

describe('apiClient', () => {
  let mockAxiosInstance: any;
  let requestInterceptor: any;
  let responseInterceptor: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    // Mock axios.create
    mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn((onFulfilled, onRejected) => {
            requestInterceptor = { onFulfilled, onRejected };
          }),
        },
        response: {
          use: vi.fn((onFulfilled, onRejected) => {
            responseInterceptor = { onFulfilled, onRejected };
          }),
        },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    vi.spyOn(axios, 'create').mockReturnValue(mockAxiosInstance as any);

    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        href: 'http://localhost:3000/',
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create client with correct base URL', async () => {
    // Dynamic import to get fresh instance
    await import('./apiClient');
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.stringContaining('/api/v1'),
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
        withCredentials: true,
      })
    );
  });

  it('should add authorization token to request headers', async () => {
    vi.mocked(getAuthToken).mockReturnValue('test-token');

    await import('./apiClient');

    const mockConfig = {
      headers: {},
    };

    const result = requestInterceptor.onFulfilled(mockConfig);

    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('should not add authorization token when token does not exist', async () => {
    vi.mocked(getAuthToken).mockReturnValue(null);

    await import('./apiClient');

    const mockConfig = {
      headers: {},
    };

    const result = requestInterceptor.onFulfilled(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should handle request interceptor error', async () => {
    await import('./apiClient');

    const mockError = new Error('Request error');
    const result = requestInterceptor.onRejected(mockError);

    await expect(result).rejects.toThrow('Request error');
  });

  it('should pass through successful responses', async () => {
    await import('./apiClient');

    const mockResponse = { data: { success: true } };
    const result = responseInterceptor.onFulfilled(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('should handle 401 Unauthorized and redirect to login', async () => {
    vi.mocked(removeAuthToken).mockImplementation(() => {});

    await import('./apiClient');

    const mockError = {
      response: {
        status: 401,
      },
    } as AxiosError;

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/tasks',
        href: 'http://localhost:3000/tasks',
      },
      writable: true,
    });

    try {
      await responseInterceptor.onRejected(mockError);
    } catch (_error) {
      // Expected to reject
    }

    expect(removeAuthToken).toHaveBeenCalled();
    expect(navigateTo).toHaveBeenCalledWith('/login');
  });

  it('should not redirect to login if already on login page (401)', async () => {
    vi.mocked(removeAuthToken).mockImplementation(() => {});

    await import('./apiClient');

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/login',
        href: 'http://localhost:3000/login',
      },
      writable: true,
    });

    const mockError = {
      response: {
        status: 401,
      },
    } as AxiosError;

    try {
      await responseInterceptor.onRejected(mockError);
    } catch (_error) {
      // Expected to reject
    }

    expect(removeAuthToken).toHaveBeenCalled();
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('should handle 403 Forbidden', async () => {
    await import('./apiClient');

    const mockError = {
      response: {
        status: 403,
      },
    } as AxiosError;

    try {
      await responseInterceptor.onRejected(mockError);
    } catch (_error) {
      // Expected to reject
    }

    // Should not redirect, just reject
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('should reject other errors', async () => {
    await import('./apiClient');

    const mockError = {
      response: {
        status: 500,
      },
    } as AxiosError;

    try {
      await responseInterceptor.onRejected(mockError);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });

  it('should handle errors without response', async () => {
    await import('./apiClient');

    const mockError = {
      message: 'Network error',
    } as AxiosError;

    try {
      await responseInterceptor.onRejected(mockError);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });
});
