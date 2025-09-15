import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayComponent } from './day.component';
import { GetShiftDto } from '../../dtos/get-shift.dto';

describe('DayComponent', () => {
	let component: DayComponent;
	let fixture: ComponentFixture<DayComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DayComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(DayComponent);
		component = fixture.componentInstance;

		fixture.componentRef.setInput('date', new Date(2024, 6, 29));
		fixture.componentRef.setInput('shifts', []);
	});

	it('should emit addShift with the current date', () => {
		const testDate = new Date(2024, 6, 29);
		fixture.componentRef.setInput('date', testDate);
		fixture.detectChanges();

		spyOn(component.addShift, 'emit');

		component.onAddShift();

		expect(component.addShift.emit).toHaveBeenCalledOnceWith(testDate);
	});

	it('should emit editShift with the selected shift', () => {
		const shift: GetShiftDto = {
			id: '1',
			date: new Date(2024, 6, 28),
			creditTips: 100,
			cashTips: 50,
			tipout: 20,
			hoursWorked: 5
		};

		spyOn(component.editShift, 'emit');

		component.onEditShift(shift);

		expect(component.editShift.emit).toHaveBeenCalledOnceWith(shift);
	});

	it('should not emit editShift when shift is undefined', () => {
		spyOn(component.editShift, 'emit');

		component.onEditShift(undefined as any);

		expect(component.editShift.emit).not.toHaveBeenCalled();
	});

	it('should emit deleteShift with the correct ID', () => {
		spyOn(component.deleteShift, 'emit');

		component.onDeleteShift('123');

		expect(component.deleteShift.emit).toHaveBeenCalledOnceWith('123');
	});
});
