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

    // Last day of the week (Saturday)
    const lastDayOfWeek = this.addDaysToDate(referenceDate, (this.SATURDAY - dayOfWeek));

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
}
