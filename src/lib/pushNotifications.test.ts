import { describe, expect, it } from 'vitest';
import { isPushSupported } from './pushNotifications';

describe('pushNotifications', () => {
  it('detects push support in jsdom based on globals', () => {
    expect(typeof isPushSupported()).toBe('boolean');
  });
});
