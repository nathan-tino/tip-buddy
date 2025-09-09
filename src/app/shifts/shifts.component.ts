import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShiftService } from '../services/shift.service';
import { GetShiftDto } from '../dtos/get-shift.dto';
import { ShiftsSummaryDto } from '../dtos/shifts-summary.dto';
import { DateService } from '../services/date.service';
import { WeekComponent } from "./week/week.component";
import { AddShiftComponent } from './add-shift/add-shift.component';
import { EditShiftComponent } from './edit-shift/edit-shift.component';

import { ChartTypeRegistry } from 'chart.js';

// Extend Chart.js types to include custom doughnutCenterText plugin
declare module 'chart.js' {
  interface PluginOptionsByType<TType extends keyof ChartTypeRegistry> {
    doughnutCenterText?: {
      display: boolean;
      text: string;
      color: string;
      font: { size: number; weight: string };
    };
  }
}

// NOTE: The doughnut center-text plugin is registered in
// `src/app/charts/doughnut-plugin.ts` and imported for its side-effect from
// `src/app/app.config.ts`. That keeps plugin registration centralized and
// prevents duplicate registrations during hot module reloads (HMR) or
// repeated imports.

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [AddShiftComponent, BaseChartDirective, EditShiftComponent, DatePipe, CurrencyPipe, WeekComponent],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit, OnDestroy {
    isAddingShift = false;
    isEditingShift = false;
    shifts: GetShiftDto[] = [];
    activeShift: GetShiftDto | null = null;
    firstDayOfInterval: Date | undefined;
    lastDayOfInterval: Date | undefined;
    dateToAddShift: Date | undefined;
    summaryData: Omit<ShiftsSummaryDto, 'shifts'> | null = null;

    doughnutChartData = {
      labels: ['Cash Tips', 'Credit Tips'],
      datasets: [
        { data: [0, 0], backgroundColor: ['#4caf50', '#2196f3'] }
      ]
    };

    doughnutChartOptions = {
        responsive: false,
        plugins: {
          legend: {
            position: 'bottom' as 'bottom'
          },
          title: {
            display: true,
            text: 'Tips Breakdown'
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed;
                let percent = '';
                if (this.summaryData) {
                  if (label === 'Cash Tips') {
                    percent = ` (${this.summaryData.cashTipsPercentage.toFixed(1)}%)`;
                  } else if (label === 'Credit Tips') {
                    percent = ` (${this.summaryData.creditTipsPercentage.toFixed(1)}%)`;
                  }
                }
                return `${label}: $${value.toLocaleString()}${percent}`;
              }
            }
          },
          // Custom plugin for center text
          doughnutCenterText: {
            display: true,
            text: `$${this.summaryData?.totalTips?.toLocaleString() || '0'}`,
            color: '#222',
            font: { size: 22, weight: 'bold' }
          }
        }
      };

    private destroy$ = new Subject<void>();

  constructor(private shiftService: ShiftService, private dateService: DateService) { }

  ngOnInit(): void {
    this.loadShiftsForDate();
  }

  loadShifts(): void {
    this.shiftService.getShiftsSummary(this.firstDayOfInterval!, this.lastDayOfInterval!)
      .pipe(takeUntil(this.destroy$))
      .subscribe((summary: ShiftsSummaryDto) => {
        this.shifts = Array.isArray(summary.shifts)
          ? summary.shifts.sort(this.shiftService.sortByDateAscending)
          : [];

        this.summaryData = summary;
        this.updateChart(summary);
      });
  }

  private updateChart(summary: ShiftsSummaryDto) {
    this.doughnutChartData = {
      labels: [
        `Cash Tips (${summary.cashTipsPercentage.toFixed(1)}%)`,
        `Credit Tips (${summary.creditTipsPercentage.toFixed(1)}%)`
      ],
      datasets: [
        {
          data: [summary.cashTipsTotal, summary.creditTipsTotal],
          backgroundColor: ['#4caf50', '#2196f3']
        }
      ]
    };

    if (this.doughnutChartOptions && this.doughnutChartOptions.plugins && this.doughnutChartOptions.plugins.doughnutCenterText) {
      this.doughnutChartOptions.plugins.doughnutCenterText.text = `$${summary.totalTips?.toLocaleString() || '0'}`;
    }
  }

  onAddShift(date: Date | undefined) {
    this.dateToAddShift = date;
    this.isAddingShift = true;
  }

  onFinishAddShift(shift: GetShiftDto | undefined) {
    if (shift) {
      // Not pushing "shifts.push(shift)" the new shift to the array because we don't
      // want to edit the array in place.
      // Use "spread syntax" here to copy the old array to the new array along w/ new shift
      this.shifts = [...this.shifts, shift].sort(this.shiftService.sortByDateAscending);
    }

    this.isAddingShift = false;
  }

  onEditShift(shift: GetShiftDto) {
    this.activeShift = shift;
    this.isEditingShift = true;
  }

  onFinishEditShift(updatedShift: GetShiftDto | undefined) {
    if (updatedShift) {
      // Similar thing done here as in onFinishAddShift: assigning new array to this.shifts
      this.shifts = this.shifts.map(shift =>
        shift.id === updatedShift.id ? {
          id: updatedShift.id,
          creditTips: updatedShift.creditTips,
          cashTips: updatedShift.cashTips,
          tipout: updatedShift.tipout,
          date: updatedShift.date,
          hoursWorked: updatedShift.hoursWorked
        } : shift
      ).sort(this.shiftService.sortByDateAscending);
    }
    this.isEditingShift = false;
  }

  onDeleteShift(id: number) {
    this.shiftService.deleteShift(id).subscribe({
      next: () => {
        console.log('Shift deleted successfully');
        // TODO: show a dialog on success
        // Use immutable update to avoid accidental in-place mutations
        this.shifts = this.shifts.filter(shift => shift.id !== id);
        this.updateShiftsSignal();
        // Refresh summary/chart to keep UI consistent with backend
        this.loadShifts();
      },
      error: (err) => {
        console.error('Error deleting shift', err);
        // TODO: Handle error scenario, like showing an error message
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNextInterval() {
    this.updateInterval(7);
    this.loadShifts();
  }

  onPreviousInterval() {
    this.updateInterval(-7);
    this.loadShifts();
  }

  updateInterval(days: number) {
    if (this.firstDayOfInterval && this.lastDayOfInterval) {
      this.firstDayOfInterval = this.dateService.addDaysToDate(this.firstDayOfInterval, days);
      this.lastDayOfInterval = this.dateService.addDaysToDate(this.lastDayOfInterval, days);
    }
  }

  loadShiftsForDate(date: Date | null = null) {
    if (!date) {
      date = new Date(new Date().setHours(0, 0, 0, 0));
    }

    const { firstDayOfWeek, lastDayOfWeek } = this.dateService.getFirstAndLastDayOfWeek(date);
    this.firstDayOfInterval = firstDayOfWeek;
    this.lastDayOfInterval = lastDayOfWeek;

    this.loadShifts();
  }

  updateShiftsSignal() {
    this.shifts = [...this.shifts];
  }

  onWeekPickerChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) return;

    this.loadShiftsForDate(new Date(input.value + 'T00:00:00'));
  }
}
