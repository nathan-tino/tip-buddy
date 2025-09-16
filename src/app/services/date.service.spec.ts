

describe('DateService', () => {
	let service: DateService;

	beforeEach(() => {
		service = new DateService();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('convertDateObjectsToUtcDate', () => {
		it('should convert date and time objects to UTC date', () => {
			const date = new Date(2025, 8, 16); // September 16, 2025 (month is 0-based)
			const time = new Date(2025, 8, 16, 15, 30); // 15:30
			const result = service.convertDateObjectsToUtcDate(date, time);
			expect(result.getUTCFullYear()).toBe(2025);
			expect(result.getUTCMonth()).toBe(8);
			expect(result.getUTCDate()).toBe(16);
			expect(result.getUTCHours()).toBe(15);
			expect(result.getUTCMinutes()).toBe(30);
			expect(result.getUTCSeconds()).toBe(0);
		});

		it('should use default time if timeObject is not provided', () => {
			const date = new Date(2025, 8, 16);
			const result = service.convertDateObjectsToUtcDate(date);
			expect(result.getUTCHours()).toBe(8);
			expect(result.getUTCMinutes()).toBe(0);
		});
	});

	describe('getFirstAndLastDayOfWeek', () => {
		it('should return correct first and last day of week', () => {
			const date = new Date('2025-09-17T12:00:00Z'); // Wednesday
			const { firstDayOfWeek, lastDayOfWeek } = service.getFirstAndLastDayOfWeek(date);
			expect(firstDayOfWeek.getDay()).toBe(0); // Sunday
			expect(lastDayOfWeek.getDay()).toBe(6); // Saturday
		});
	});

	describe('addDaysToDate', () => {
		it('should add days to date', () => {
			const date = new Date(2025, 8, 16);
			const result = service.addDaysToDate(date, 5);
			expect(result.getDate()).toBe(21);
		});
		it('should subtract days from date', () => {
			const date = new Date(2025, 8, 16);
			const result = service.addDaysToDate(date, -5);
			expect(result.getDate()).toBe(11);
		});
	});

	describe('convertUtcToLocalDate', () => {
		it('should convert UTC date to local date', () => {
			const utcDate = new Date(Date.UTC(2025, 8, 16, 12, 0, 0));
			const localDate = service.convertUtcToLocalDate(utcDate);
			expect(localDate.getFullYear()).toBe(2025);
			expect(localDate.getMonth()).toBe(8);
			expect(localDate.getDate()).toBe(16);
		});
	});

	describe('convertStringToUtcDate', () => {
		it('should convert date string to UTC date with default time', () => {
			const result = service.convertStringToUtcDate('2025-09-16');
			expect(result.getUTCFullYear()).toBe(2025);
			expect(result.getUTCMonth()).toBe(8);
			expect(result.getUTCDate()).toBe(16);
			expect(result.getUTCHours()).toBe(8);
			expect(result.getUTCMinutes()).toBe(0);
		});
		it('should convert date and time string to UTC date', () => {
			const result = service.convertStringToUtcDate('2025-09-16', '15:45');
			expect(result.getUTCHours()).toBe(15);
			expect(result.getUTCMinutes()).toBe(45);
		});
		it('should throw error for invalid date string', () => {
			expect(() => service.convertStringToUtcDate('invalid-date')).toThrowError();
		});
		it('should handle ISO datetime string', () => {
			const result = service.convertStringToUtcDate('2025-09-16T10:30');
			expect(result.getUTCFullYear()).toBe(2025);
			expect(result.getUTCMonth()).toBe(8);
			expect(result.getUTCDate()).toBe(16);
			expect(result.getUTCHours()).toBe(10);
			expect(result.getUTCMinutes()).toBe(30);
		});
	});
});
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
