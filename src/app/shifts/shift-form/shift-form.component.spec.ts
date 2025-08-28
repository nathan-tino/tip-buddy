import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ShiftFormComponent } from './shift-form.component';
import { ShiftFormModel } from './shift-form.model';
import { By } from '@angular/platform-browser';

describe('ShiftFormComponent', () => {
    let component: ShiftFormComponent;
    let fixture: ComponentFixture<ShiftFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ShiftFormComponent, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(ShiftFormComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with input values', () => {
        component.dateInput = '2023-08-28';
        component.timeInput = '14:30:00';
        component.creditTipsInput = 100;
        component.cashTipsInput = 50;
        component.tipoutInput = 20;
        component.hoursWorkedInput = 8;

        fixture.detectChanges();

        // Assuming the component uses these inputs directly
        expect(component.dateInput).toBe('2023-08-28');
        expect(component.timeInput).toBe('14:30:00');
        expect(component.creditTipsInput).toBe(100);
        expect(component.cashTipsInput).toBe(50);
        expect(component.tipoutInput).toBe(20);
        expect(component.hoursWorkedInput).toBe(8);
    });

    it('should emit submitted with form model on submit', () => {
        component.dateInput = '2023-08-28';
        component.timeInput = '14:30:00';
        component.creditTipsInput = 100;
        component.cashTipsInput = 50;
        component.tipoutInput = 20;
        component.hoursWorkedInput = 8;

        fixture.detectChanges();

        spyOn(component.submitted, 'emit');

        component.onSubmit();

        const expectedModel: ShiftFormModel = {
            date: '2023-08-28',
            time: '14:30:00',
            creditTips: 100,
            cashTips: 50,
            tipout: 20,
            hoursWorked: 8
        };

        expect(component.submitted.emit).toHaveBeenCalledWith(expectedModel);
    });

    it('should emit cancel on cancel button click', () => {
        spyOn(component.cancel, 'emit');

        fixture.detectChanges();
        const cancelButton = fixture.debugElement.query(By.css('#cancelButton'));
        cancelButton.nativeElement.click();

        expect(component.cancel.emit).toHaveBeenCalled();
    });
});