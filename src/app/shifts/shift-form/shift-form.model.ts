export interface ShiftFormModel {
    // date object from the date input
    date: Date;

    // time object from the time input
    time?: Date | undefined;

    // monetary and numeric fields
    creditTips?: number;
    cashTips?: number;
    tipout?: number;

    // optional numeric hours worked
    hoursWorked?: number;
}