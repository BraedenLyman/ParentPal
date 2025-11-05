import { title, subtitle } from '../../components/primitives';

describe('Primitives Utilities', () => {
  describe('title variant', () => {
    test('exports title function', () => {
      expect(title).toBeDefined();
      expect(typeof title).toBe('function');
    });

    test('returns base classes when called with no options', () => {
      const result = title();
      expect(result).toContain('tracking-tight');
      expect(result).toContain('inline');
      expect(result).toContain('font-semibold');
    });

    test('applies default size variant (md)', () => {
      const result = title();
      expect(result).toContain('text-[2.3rem]');
      expect(result).toContain('lg:text-5xl');
    });

    test('applies sm size variant', () => {
      const result = title({ size: 'sm' });
      expect(result).toContain('text-3xl');
      expect(result).toContain('lg:text-4xl');
    });

    test('applies md size variant', () => {
      const result = title({ size: 'md' });
      expect(result).toContain('text-[2.3rem]');
      expect(result).toContain('lg:text-5xl');
    });

    test('applies lg size variant', () => {
      const result = title({ size: 'lg' });
      expect(result).toContain('text-4xl');
      expect(result).toContain('lg:text-6xl');
    });

    test('applies violet color variant', () => {
      const result = title({ color: 'violet' });
      expect(result).toContain('from-[#FF1CF7]');
      expect(result).toContain('to-[#b249f8]');
      expect(result).toContain('bg-clip-text');
      expect(result).toContain('text-transparent');
      expect(result).toContain('bg-gradient-to-b');
    });

    test('applies yellow color variant', () => {
      const result = title({ color: 'yellow' });
      expect(result).toContain('from-[#FF705B]');
      expect(result).toContain('to-[#FFB457]');
    });

    test('applies blue color variant', () => {
      const result = title({ color: 'blue' });
      expect(result).toContain('from-[#5EA2EF]');
      expect(result).toContain('to-[#0072F5]');
    });

    test('applies cyan color variant', () => {
      const result = title({ color: 'cyan' });
      expect(result).toContain('from-[#00b7fa]');
      expect(result).toContain('to-[#01cfea]');
    });

    test('applies green color variant', () => {
      const result = title({ color: 'green' });
      expect(result).toContain('from-[#6FEE8D]');
      expect(result).toContain('to-[#17c964]');
    });

    test('applies pink color variant', () => {
      const result = title({ color: 'pink' });
      expect(result).toContain('from-[#FF72E1]');
      expect(result).toContain('to-[#F54C7A]');
    });

    test('applies foreground color variant', () => {
      const result = title({ color: 'foreground' });
      expect(result).toContain('dark:from-[#FFFFFF]');
      expect(result).toContain('dark:to-[#4B4B4B]');
    });

    test('applies fullWidth variant', () => {
      const result = title({ fullWidth: true });
      expect(result).toContain('w-full');
      expect(result).toContain('block');
    });

    test('applies compound variants with color', () => {
      const result = title({ color: 'violet' });
      expect(result).toContain('bg-clip-text');
      expect(result).toContain('text-transparent');
      expect(result).toContain('bg-gradient-to-b');
    });

    test('combines multiple variants', () => {
      const result = title({ color: 'blue', size: 'lg', fullWidth: true });
      expect(result).toContain('text-4xl');
      expect(result).toContain('lg:text-6xl');
      expect(result).toContain('from-[#5EA2EF]');
      expect(result).toContain('to-[#0072F5]');
      expect(result).toContain('w-full');
      expect(result).toContain('block');
    });
  });

  describe('subtitle variant', () => {
    test('exports subtitle function', () => {
      expect(subtitle).toBeDefined();
      expect(typeof subtitle).toBe('function');
    });

    test('returns base classes when called with no options', () => {
      const result = subtitle();
      expect(result).toContain('w-full');
      expect(result).toContain('md:w-1/2');
      expect(result).toContain('my-2');
      expect(result).toContain('text-lg');
      expect(result).toContain('lg:text-xl');
      expect(result).toContain('text-default-600');
      expect(result).toContain('block');
      expect(result).toContain('max-w-full');
    });

    test('applies default fullWidth variant (true)', () => {
      const result = subtitle();
      expect(result).toContain('!w-full');
    });

    test('applies fullWidth: true explicitly', () => {
      const result = subtitle({ fullWidth: true });
      expect(result).toContain('!w-full');
    });

    test('does not apply fullWidth override when false', () => {
      const result = subtitle({ fullWidth: false });
      expect(result).toContain('w-full');
      expect(result).toContain('md:w-1/2');
      expect(result).not.toContain('!w-full');
    });

    test('contains responsive width classes', () => {
      const result = subtitle({ fullWidth: false });
      expect(result).toContain('w-full');
      expect(result).toContain('md:w-1/2');
    });

    test('contains text size classes', () => {
      const result = subtitle();
      expect(result).toContain('text-lg');
      expect(result).toContain('lg:text-xl');
    });

    test('contains text color class', () => {
      const result = subtitle();
      expect(result).toContain('text-default-600');
    });

    test('contains display and spacing classes', () => {
      const result = subtitle();
      expect(result).toContain('block');
      expect(result).toContain('my-2');
      expect(result).toContain('max-w-full');
    });
  });

  describe('Edge Cases and Type Safety', () => {
    test('title handles undefined options gracefully', () => {
      expect(() => title(undefined)).not.toThrow();
      const result = title(undefined);
      expect(result).toContain('tracking-tight');
    });

    test('subtitle handles undefined options gracefully', () => {
      expect(() => subtitle(undefined)).not.toThrow();
      const result = subtitle(undefined);
      expect(result).toContain('w-full');
    });

    test('title handles empty object', () => {
      const result = title({});
      expect(result).toContain('tracking-tight');
      expect(result).toContain('text-[2.3rem]'); // default size
    });

    test('subtitle handles empty object', () => {
      const result = subtitle({});
      expect(result).toContain('w-full');
      expect(result).toContain('!w-full'); // default fullWidth
    });

    test('title returns string type', () => {
      const result = title();
      expect(typeof result).toBe('string');
    });

    test('subtitle returns string type', () => {
      const result = subtitle();
      expect(typeof result).toBe('string');
    });
  });
});
