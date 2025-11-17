import { getDelayClass, getStaggeredDelayClass } from './animation-utils';

describe('animation-utils', () => {
  describe('getDelayClass', () => {
    it('should clamp values below 100 to delay-100', () => {
      expect(getDelayClass(50)).toBe('delay-100');
      expect(getDelayClass(0)).toBe('delay-100');
      expect(getDelayClass(-50)).toBe('delay-100');
    });

    it('should clamp values above 500 to delay-500', () => {
      expect(getDelayClass(600)).toBe('delay-500');
      expect(getDelayClass(1000)).toBe('delay-500');
      expect(getDelayClass(99999)).toBe('delay-500');
    });

    it('should round to nearest 100', () => {
      expect(getDelayClass(150)).toBe('delay-200');
      expect(getDelayClass(149)).toBe('delay-100');
      expect(getDelayClass(250)).toBe('delay-300');
      expect(getDelayClass(251)).toBe('delay-300');
    });

    it('should handle exact values correctly', () => {
      expect(getDelayClass(100)).toBe('delay-100');
      expect(getDelayClass(200)).toBe('delay-200');
      expect(getDelayClass(300)).toBe('delay-300');
      expect(getDelayClass(400)).toBe('delay-400');
      expect(getDelayClass(500)).toBe('delay-500');
    });
  });

  describe('getStaggeredDelayClass', () => {
    it('should generate correct delays for sequential indices', () => {
      expect(getStaggeredDelayClass(0)).toBe('delay-100');
      expect(getStaggeredDelayClass(1)).toBe('delay-200');
      expect(getStaggeredDelayClass(2)).toBe('delay-300');
      expect(getStaggeredDelayClass(3)).toBe('delay-400');
      expect(getStaggeredDelayClass(4)).toBe('delay-500');
    });

    it('should clamp delays beyond 500', () => {
      expect(getStaggeredDelayClass(5)).toBe('delay-500');
      expect(getStaggeredDelayClass(10)).toBe('delay-500');
      expect(getStaggeredDelayClass(100)).toBe('delay-500');
    });

    it('should respect custom base delay', () => {
      expect(getStaggeredDelayClass(0, 50)).toBe('delay-100');
      expect(getStaggeredDelayClass(1, 50)).toBe('delay-100');
      expect(getStaggeredDelayClass(2, 50)).toBe('delay-200');
    });

    it('should cycle with modulo', () => {
      // With modulo 6, indices should cycle 0-5
      expect(getStaggeredDelayClass(0, 100, 6)).toBe('delay-100');
      expect(getStaggeredDelayClass(5, 100, 6)).toBe('delay-500');
      expect(getStaggeredDelayClass(6, 100, 6)).toBe('delay-100'); // Cycles back
      expect(getStaggeredDelayClass(7, 100, 6)).toBe('delay-200');
      expect(getStaggeredDelayClass(11, 100, 6)).toBe('delay-500');
      expect(getStaggeredDelayClass(12, 100, 6)).toBe('delay-100'); // Cycles back again
    });

    it('should never produce undefined classes', () => {
      // Test a large range of indices
      for (let i = 0; i < 100; i++) {
        const result = getStaggeredDelayClass(i);
        expect(result).toMatch(/^delay-(100|200|300|400|500)$/);
      }
    });

    it('should never produce undefined classes with modulo', () => {
      // Test with modulo
      for (let i = 0; i < 100; i++) {
        const result = getStaggeredDelayClass(i, 100, 6);
        expect(result).toMatch(/^delay-(100|200|300|400|500)$/);
      }
    });
  });
});
