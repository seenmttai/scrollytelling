import { describe, it, expect } from 'vitest';
import { getStaggeredTimeline } from './stagger';

describe('getStaggeredTimeline', () => {
  it('should create a simple, non-overlapping timeline', () => {
    const timeline = getStaggeredTimeline({ start: 0, end: 100, chunks: 4 });
    expect(timeline).toEqual([
      { start: 0, end: 25 },
      { start: 25, end: 50 },
      { start: 50, end: 75 },
      { start: 75, end: 100 },
    ]);
  });

  it('should handle a 50% overlap correctly', () => {
    const timeline = getStaggeredTimeline({ start: 0, end: 100, chunks: 2, overlap: 0.5 });
    const firstEnd = timeline[0].end;
    const secondStart = timeline[1].start;
    const secondDuration = timeline[1].end - timeline[1].start;
    expect(firstEnd).toBeCloseTo(secondStart + secondDuration / 2);
  });

  it('should handle a start of 0', () => {
    const timeline = getStaggeredTimeline({ start: 0, end: 50, chunks: 2 });
    expect(timeline).toEqual([
      { start: 0, end: 25 },
      { start: 25, end: 50 },
    ]);
  });

  it('should throw an error for invalid overlap values', () => {
    expect(() => getStaggeredTimeline({ start: 0, end: 100, chunks: 2, overlap: 1.1 })).toThrow();
    expect(() => getStaggeredTimeline({ start: 0, end: 100, chunks: 2, overlap: -0.1 })).toThrow();
  });
});
