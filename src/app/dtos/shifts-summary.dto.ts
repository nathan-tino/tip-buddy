import { GetShiftDto } from "./get-shift.dto";

export interface ShiftsSummaryDto {
  totalTips: number;
  averageTipsPerShift: number;
  cashTipsTotal: number;
  creditTipsTotal: number;
  cashTipsPercentage: number;
  creditTipsPercentage: number;
  tipsPerHour: number;
  totalShifts: number;
  totalHoursWorked: number;
  shifts: Array<GetShiftDto>;
}
