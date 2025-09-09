import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

import { ShiftService } from '../services/shift.service';
import { GetShiftDto } from '../dtos/get-shift.dto';
import { ShiftsSummaryDto } from '../dtos/shifts-summary.dto';
import { DateService } from '../services/date.service';
import { WeekComponent } from "./week/week.component";
import { AddShiftComponent } from './add-shift/add-shift.component';
import { EditShiftComponent } from './edit-shift/edit-shift.component';

import { Chart, ChartTypeRegistry } from 'chart.js';

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

Chart.register({
  id: 'doughnutCenterText',
  afterDraw: function(chart) {
    if (chart.config && chart.config.options && chart.config.options.plugins && chart.config.options.plugins.doughnutCenterText?.display) {
      const { ctx, chartArea } = chart;
      const centerConfig = chart.config.options.plugins.doughnutCenterText;
      ctx.save();
      const fontConfig = centerConfig.font ?? { size: 16, weight: 'normal' };
      ctx.font = `${fontConfig.weight} ${fontConfig.size}px sans-serif`;
      ctx.fillStyle = centerConfig.color ?? '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        centerConfig.text ?? '',
        (chartArea.left + chartArea.right) / 2,
        (chartArea.top + chartArea.bottom) / 2
      );
      ctx.restore();
    }
  }
});

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [AddShiftComponent, BaseChartDirective, EditShiftComponent, DatePipe, DecimalPipe, CurrencyPipe, WeekComponent],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit {
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

  constructor(private shiftService: ShiftService, private dateService: DateService) { }

  ngOnInit(): void {
    this.loadShiftsForDate();
  }

  loadShifts(): void {
    this.shiftService.getShiftsSummary(this.firstDayOfInterval!, this.lastDayOfInterval!)
      .subscribe((summary: ShiftsSummaryDto) => {
        this.shifts = Array.isArray(summary.shifts)
          ? summary.shifts.sort(this.shiftService.sortByDateAscending)
          : [];

        this.summaryData = summary;
        // Update chart data
        this.doughnutChartData = {
          labels: [
            `Cash Tips (${this.summaryData.cashTipsPercentage.toFixed(1)}%)`,
            `Credit Tips (${this.summaryData.creditTipsPercentage.toFixed(1)}%)`
          ],
          datasets: [
            {
              data: [summary.cashTipsTotal, summary.creditTipsTotal],
              backgroundColor: ['#4caf50', '#2196f3']
            }
          ]
        };
        // Dynamically update center text value
        this.doughnutChartOptions.plugins.doughnutCenterText.text = `$${summary.totalTips?.toLocaleString() || '0'}`;
      });
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
        const index = this.shifts.findIndex(shift => shift.id === id);
        if (index !== -1) {
          this.shifts.splice(index, 1);
        }

        this.updateShiftsSignal();
      },
      error: (err) => {
        console.error('Error deleting shift', err);
        // TODO: Handle error scenario, like showing an error message
      }
    });
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
