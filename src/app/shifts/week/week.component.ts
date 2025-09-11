import { Component, effect, input, output } from '@angular/core';
import { GetShiftDto } from '../../dtos/get-shift.dto';
import { DateService } from '../../services/date.service';
import { DayComponent } from '../day/day.component';

@Component({
	selector: 'app-week',
	standalone: true,
	imports: [DayComponent],
	templateUrl: './week.component.html',
	styleUrl: './week.component.css'
})
export class WeekComponent {
	firstDay = input.required<Date>();
	shifts = input.required<GetShiftDto[]>();
	addShift = output<Date>();
	editShift = output<GetShiftDto>();
	deleteShift = output<number>();

	daysOfWeek: number[] = [0, 1, 2, 3, 4, 5, 6];
	daysAndShifts: { date: Date, shifts: GetShiftDto[] }[] = [];

	constructor(private dateService: DateService) {
		effect(() => {
			this.populateDaysAndShifts();
		});
	}

	onAddShift(date: Date) {
		this.addShift.emit(date);
	}

	onEditShift(shift: GetShiftDto) {
		if (shift) {
			this.editShift.emit(shift);
		}
	}

	onDeleteShift(id: number) {
		this.deleteShift.emit(id);
	}

	trackByDate(item: { date: Date, shifts: GetShiftDto[] }): string {
		return item.date.toISOString();
	}

	private populateDaysAndShifts() {
		this.daysAndShifts = [];
		const shifts = this.shifts();

		for (let day of this.daysOfWeek) {
			const date = this.dateService.addDaysToDate(this.firstDay(), day);
			let shiftsOnThisDate = shifts.filter(s => s.date.toDateString() === date.toDateString());

			this.daysAndShifts.push({
				date: date,
				shifts: shiftsOnThisDate
			});
		}
	}
}
