import { getDaysCount, addDays, getFormattedDays, getTimelineDays, isHoliday } from '../frontend/static/js/utility';

describe('getDaysCount', () => {
    test('should return days count', () => {
        expect(getDaysCount(new Date('2020-01-01'), new Date('2020-01-03'))).toBe(3);
    });
});

describe('addDays', () => {
    test('should add 3 days', () => {
        expect(addDays(new Date('2020-01-01'), 3)).toEqual(new Date('2020-01-04'));
    });

    test('should add 0 days', () => {
        expect(addDays(new Date('2020-01-01'), 0)).toEqual(new Date('2020-01-01'));
    });

    test('should return next month date', () => {
        expect(addDays(new Date('2020-01-31'), 1)).toEqual(new Date('2020-02-01'));
    });

    test('should return over next month date', () => {
        expect(addDays(new Date('2020-03-31'), 31)).toEqual(new Date('2020-05-01'));
    });

    test('should return next year date', () => {
        expect(addDays(new Date('2020-11-01'), 90)).toEqual(new Date('2021-01-30'));
    });
});

describe('getFormattedDays', () => {
    test('should return formatted days', () => {
        expect(getFormattedDays(new Date('2020-01-01'), new Date('2020-01-03'))).toEqual(['Jan 1', 'Jan 2', 'Jan 3']);
    });
});

describe('getTimelineDays', () => {
    test('should return timeline days', () => {
        expect(getTimelineDays(new Date('2020-01-01'), new Date('2020-01-03'))).toEqual([new Date('2020-01-01'), new Date('2020-01-02'), new Date('2020-01-03')]);
    });
});

describe('isHoliday', () => {
    test('should return false for Monday', () => {
        expect(isHoliday(new Date('2024-07-01'))).toBe(false);
    });
    test('should return false for Tuesday', () => {
        expect(isHoliday(new Date('2024-07-02'))).toBe(false);
    });
    test('should return false for Wednesday', () => {
        expect(isHoliday(new Date('2024-07-03'))).toBe(false);
    });
    test('should return false for Thursday', () => {
        expect(isHoliday(new Date('2024-07-04'))).toBe(false);
    });
    test('should return false for Friday', () => {
        expect(isHoliday(new Date('2024-07-05'))).toBe(false);
    });
    test('should return true for Saturday', () => {
        expect(isHoliday(new Date('2024-07-06'))).toBe(true);
    });
    test('should return true for Sunday', () => {
        expect(isHoliday(new Date('2024-07-07'))).toBe(true);
    });
});