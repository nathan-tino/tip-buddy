export interface ShiftFormModel {
    // date string from the date input (YYYY-MM-DD)
    date: string;

    // time string from the time input (HH:MM)
    time?: string | undefined;

    // monetary and numeric fields
    creditTips: number;
    cashTips: number;
    tipout: number;

    // optional numeric hours worked
    hoursWorked?: number;
}