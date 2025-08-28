import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    service = new DateService();
  });

  describe('getFirstAndLastDayOfWeek', () => {
    it('should return Sunday and Saturday for a Wednesday date', () => {
      const refDate = new Date('2024-07-17T12:00:00'); // Wednesday
      const { firstDayOfWeek, lastDayOfWeek } = service.getFirstAndLastDayOfWeek(refDate);

      expect(firstDayOfWeek.getDay()).toBe(0); // Sunday
      expect(firstDayOfWeek.getHours()).toBe(0);
      expect(firstDayOfWeek.getMinutes()).toBe(0);

      expect(lastDayOfWeek.getDay()).toBe(6); // Saturday
      expect(lastDayOfWeek.getHours()).toBe(23);
      expect(lastDayOfWeek.getMinutes()).toBe(59);
    });

    it('should return same date for Sunday as first day', () => {
      const refDate = new Date('2024-07-14T10:00:00'); // Sunday
      const { firstDayOfWeek, lastDayOfWeek } = service.getFirstAndLastDayOfWeek(refDate);

      expect(firstDayOfWeek.toDateString()).toBe(new Date(2024, 6, 14).toDateString());
      expect(lastDayOfWeek.toDateString()).toBe(new Date(2024, 6, 20).toDateString());
    });
  });

  describe('addDaysToDate', () => {
    it('should add days correctly', () => {
      const date = new Date('2024-01-01');
      const newDate = service.addDaysToDate(date, 5);

      expect(newDate.toDateString()).toBe(new Date('2024-01-06').toDateString());
    });

    it('should subtract days correctly', () => {
      const date = new Date('2024-01-10');
      const newDate = service.addDaysToDate(date, -3);

      expect(newDate.toDateString()).toBe(new Date('2024-01-07').toDateString());
    });
  });

  describe('convertUtcToLocalDate', () => {
    it('should convert UTC to local time', () => {
      const utcDate = new Date(Date.UTC(2024, 0, 1, 12, 0, 0)); // Noon UTC
      const localDate = service.convertUtcToLocalDate(utcDate);

      // Difference should equal timezone offset in minutes
      const offset = utcDate.getTimezoneOffset() * 60000;
      expect(localDate.getTime()).toBe(utcDate.getTime() + offset);
    });
  });

  describe('convertStringToUtcDate', () => {
    it('should convert valid full datetime string to UTC date', () => {
      const dateStr = '2024-07-29T15:30:00';
      const utcDate = service.convertStringToUtcDate(dateStr);

      expect(utcDate).toBeInstanceOf(Date);
      expect(utcDate.toISOString()).toBe('2024-07-29T15:30:00.000Z');
    });

    it('should convert date string and time string to UTC date', () => {
      const dateStr = '2024-07-29';
      const timeStr = '09:45:00';
      const utcDate = service.convertStringToUtcDate(dateStr, timeStr);

      expect(utcDate).toBeInstanceOf(Date);
      expect(utcDate.toISOString()).toBe('2024-07-29T09:45:00.000Z');
    });

    it('should use default time if timeString is null', () => {
      const dateStr = '2024-07-29';
      const utcDate = service.convertStringToUtcDate(dateStr, null);

      expect(utcDate).toBeInstanceOf(Date);
      expect(utcDate.toISOString()).toBe('2024-07-29T08:00:00.000Z');
    });

    it('should use default time if timeString is undefined', () => {
      const dateStr = '2024-07-29';
      const utcDate = service.convertStringToUtcDate(dateStr);

      expect(utcDate).toBeInstanceOf(Date);
      expect(utcDate.toISOString()).toBe('2024-07-29T08:00:00.000Z');
    });

    it('should throw for invalid full datetime string', () => {
      expect(() => service.convertStringToUtcDate('invalid-dateT99:99:99')).toThrowError('Invalid date string: invalid-dateT99:99:99');
    });

    it('should throw for invalid date string with time', () => {
      expect(() => service.convertStringToUtcDate('invalid-date', '12:00:00')).toThrowError('Invalid date string: invalid-dateT12:00:00');
    });

    it('should throw for completely invalid date string', () => {
      expect(() => service.convertStringToUtcDate('invalid-date')).toThrowError('Invalid date string: invalid-dateT08:00');
    });
  });
});
