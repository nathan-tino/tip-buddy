import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private readonly SUNDAY = 0;
  private readonly SATURDAY = 6;
  private readonly DAYS_IN_A_WEEK = 7;

  constructor() { }

  /**
   * Calculates the first and last day of the week for the given date.
   * @param referenceDate - The date to calculate the week from.
   * @returns An object containing the first and last day of the week.
   */
  getFirstAndLastDayOfWeek(referenceDate: Date) : {firstDayOfWeek: Date, lastDayOfWeek: Date} {
    const dayOfWeek = referenceDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // First day of the week (Sunday)
    const firstDayOfWeek = this.addDaysToDate(referenceDate, -1 * dayOfWeek);
    firstDayOfWeek.setHours(0, 0, 0, 0); // Reset time to midnight

    // Last day of the week (Saturday)
    const lastDayOfWeek = this.addDaysToDate(referenceDate, (this.SATURDAY - dayOfWeek));
    lastDayOfWeek.setHours(23, 59, 59, 999); // Set time to end of the day

    return { firstDayOfWeek, lastDayOfWeek };
  }

  /**
   * Adds a specified number of days to a date and returns a new Date object.
   * @param date - The original date.
   * @param days - The number of days to add (can be negative).
   * @returns A new Date object with the added days.
   */
  addDaysToDate(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  /**
   * Converts a UTC date string to a local Date object.
   * @param utcDate - The UTC date from the backend.
   * @returns A local Date object.
   */
  convertUtcToLocalDate(utcDate: Date): Date {
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  }

  /**
   * Converts a date string to a UTC Date object.
   * Overload signatures below allow callers to pass either just a date string
   * or a date + time string. There's a single implementation that handles both.
   */
  convertStringToUtcDate(dateString: string): Date;
  convertStringToUtcDate(dateString: string, timeString: string | null): Date;
  convertStringToUtcDate(dateString: string, timeString: string | undefined): Date;
  convertStringToUtcDate(dateString: string, timeString?: string | null): Date {
    let combined: string;

    if (dateString.includes('T')) {
      // dateString is already a full datetime string
      combined = dateString;
    } else {
      // dateString is just a date, append time
      const time = timeString ?? '08:00';
      combined = `${dateString}T${time}`;
    }

    const date = new Date(combined);

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${combined}`);
    }

    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ));
  }

  /**
   * Converts Date objects to a UTC Date object for backend submission.
   * This method treats the input values as they should appear in UTC,
   * avoiding timezone double-conversion issues.
   * @param dateObject - The Date object from the date picker.
   * @param timeObject - Optional Date object from the time picker.
   * @returns A UTC Date object.
   */
  convertDateObjectsToUtcDate(dateObject: Date, timeObject?: Date): Date {
    // Extract date components from the date object
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
    const day = dateObject.getDate();
    
    // Extract time components from the time object, or use default
    let hours = 8; // default hour
    let minutes = 0; // default minutes
    
    if (timeObject) {
      hours = timeObject.getHours();
      minutes = timeObject.getMinutes();
    }
    
    // Create UTC date directly without local date intermediate step
    // This avoids timezone conversion issues
    return new Date(Date.UTC(year, month, day, hours, minutes, 0, 0));
  }

  /**
   * Converts a UTC date to separate local date and time components for display.
   * @param utcDate - The UTC date to convert.
   * @returns An object containing separate date and time Date objects.
   */
  convertUtcDateToLocalComponents(utcDate: Date): { localDate: Date, localTime: Date } {
    // Convert UTC date to local date for display (date part only)
    const localDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());

    // Create a time object using UTC time components from the shift
    const localTime = new Date();
    localTime.setHours(utcDate.getUTCHours(), utcDate.getUTCMinutes(), 0, 0);

    return { localDate, localTime };
  }
}
