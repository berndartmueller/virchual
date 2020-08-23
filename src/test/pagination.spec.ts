import { mapActiveIndex } from '../pagination';

describe('Pagination', () => {
  describe('Active bullet', () => {
    it('return active bullet index (center: 1, total: 3)', () => {
      const tests = [
        { input: 0, result: 0 },
        { input: 1, result: 1 },
        { input: 2, result: 2 },
      ];

      tests.map(test => {
        const index = mapActiveIndex(test.input, 1, 3);

        expect(index).toBe(test.result);
      });
    });

    it('return active bullet index (center: 2, total: 5)', () => {
      const tests = [
        { input: 0, result: 0 },
        { input: 1, result: 1 },
        { input: 2, result: 2 },
        { input: 3, result: 3 },
        { input: 4, result: 4 },
      ];

      tests.map(test => {
        const index = mapActiveIndex(test.input, 2, 5);

        expect(index).toBe(test.result);
      });
    });

    it('return active bullet index (center: 2, total: 8)', () => {
      const tests = [
        { input: 0, result: 0 },
        { input: 1, result: 1 },
        { input: 2, result: 2 },
        { input: 3, result: 2 },
        { input: 4, result: 2 },
        { input: 5, result: 2 },
        { input: 6, result: 3 },
        { input: 7, result: 4 },
      ];

      tests.map(test => {
        const index = mapActiveIndex(test.input, 2, 8);

        expect(index).toBe(test.result);
      });
    });

    it('return active bullet index (center: 2, total: 10)', () => {
      const tests = [
        { input: 0, result: 0 },
        { input: 1, result: 1 },
        { input: 2, result: 2 },
        { input: 3, result: 2 },
        { input: 4, result: 2 },
        { input: 5, result: 2 },
        { input: 6, result: 2 },
        { input: 7, result: 2 },
        { input: 8, result: 3 },
        { input: 9, result: 4 },
      ];

      tests.map(test => {
        const index = mapActiveIndex(test.input, 2, 10);

        expect(index).toBe(test.result);
      });
    });
  });
});
