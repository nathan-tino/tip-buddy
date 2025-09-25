import { DateService } from './date.service';

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

	describe('splitLocalDateTimeIntoComponents', () => {
		it('should split local datetime into separate date and time components', () => {
			// Create a local date: September 16, 2025 at 14:30
			const localDateTime = new Date(2025, 8, 16, 14, 30, 0, 0);
			
			const result = service.splitLocalDateTimeIntoComponents(localDateTime);
			
			// Check that result has the expected properties
			expect(result.localDate).toBeDefined();
			expect(result.localTime).toBeDefined();
			expect(result.localDate).toBeInstanceOf(Date);
			expect(result.localTime).toBeInstanceOf(Date);
			
			// Check date component (should preserve the date, reset time to midnight)
			expect(result.localDate.getFullYear()).toBe(2025);
			expect(result.localDate.getMonth()).toBe(8); // September (0-based)
			expect(result.localDate.getDate()).toBe(16);
			expect(result.localDate.getHours()).toBe(0);
			expect(result.localDate.getMinutes()).toBe(0);
			expect(result.localDate.getSeconds()).toBe(0);
			expect(result.localDate.getMilliseconds()).toBe(0);
			
			// Check time component (should preserve hours and minutes, reset seconds and milliseconds)
			expect(result.localTime.getHours()).toBe(14);
			expect(result.localTime.getMinutes()).toBe(30);
			expect(result.localTime.getSeconds()).toBe(0);
			expect(result.localTime.getMilliseconds()).toBe(0);
		});

		it('should handle midnight datetime', () => {
			// Create a local date: January 1, 2025 at 00:00
			const localDateTime = new Date(2025, 0, 1, 0, 0, 0, 0);
			
			const result = service.splitLocalDateTimeIntoComponents(localDateTime);
			
			// Check date component
			expect(result.localDate.getFullYear()).toBe(2025);
			expect(result.localDate.getMonth()).toBe(0); // January
			expect(result.localDate.getDate()).toBe(1);
			
			// Check time component (should be midnight)
			expect(result.localTime.getHours()).toBe(0);
			expect(result.localTime.getMinutes()).toBe(0);
		});

		it('should handle end of day datetime', () => {
			// Create a local date: December 31, 2025 at 23:59
			const localDateTime = new Date(2025, 11, 31, 23, 59, 0, 0);
			
			const result = service.splitLocalDateTimeIntoComponents(localDateTime);
			
			// Check date component
			expect(result.localDate.getFullYear()).toBe(2025);
			expect(result.localDate.getMonth()).toBe(11); // December
			expect(result.localDate.getDate()).toBe(31);
			
			// Check time component (should be 23:59)
			expect(result.localTime.getHours()).toBe(23);
			expect(result.localTime.getMinutes()).toBe(59);
		});

		it('should handle leap year date', () => {
			// Create a local date: February 29, 2024 (leap year) at 12:15
			const localDateTime = new Date(2024, 1, 29, 12, 15, 0, 0);
			
			const result = service.splitLocalDateTimeIntoComponents(localDateTime);
			
			// Check date component
			expect(result.localDate.getFullYear()).toBe(2024);
			expect(result.localDate.getMonth()).toBe(1); // February
			expect(result.localDate.getDate()).toBe(29);
			
			// Check time component
			expect(result.localTime.getHours()).toBe(12);
			expect(result.localTime.getMinutes()).toBe(15);
		});

		it('should create independent date objects', () => {
			const localDateTime = new Date(2025, 5, 15, 10, 45, 0, 0);
			
			const result = service.splitLocalDateTimeIntoComponents(localDateTime);
			
			// Modify the original local datetime
			localDateTime.setDate(20);
			localDateTime.setHours(20);
			
			// The returned objects should not be affected
			expect(result.localDate.getDate()).toBe(15);
			expect(result.localTime.getHours()).toBe(10);
		});

		it('should reset seconds and milliseconds in time component', () => {
			// Create a local datetime with seconds and milliseconds
			const localDateTime = new Date(2025, 3, 10, 16, 25, 45, 500);
			
			const result = service.splitLocalDateTimeIntoComponents(localDateTime);
			
			// Time component should have seconds and milliseconds reset to 0
			expect(result.localTime.getSeconds()).toBe(0);
			expect(result.localTime.getMilliseconds()).toBe(0);
			
			// But hours and minutes should be preserved
			expect(result.localTime.getHours()).toBe(16);
			expect(result.localTime.getMinutes()).toBe(25);
		});
	});
});
