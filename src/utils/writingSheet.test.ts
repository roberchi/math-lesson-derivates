import { describe, expect, it } from 'vitest';
import { shouldExtendWritingSheet } from './writingSheet';

describe('shouldExtendWritingSheet', () => {
  it('extends when the reader reaches the final portion of the sheet', () => {
    expect(shouldExtendWritingSheet(580, 600, 1400)).toBe(true);
  });

  it('does not extend while there is still enough unused space below', () => {
    expect(shouldExtendWritingSheet(300, 600, 1400)).toBe(false);
  });
});
