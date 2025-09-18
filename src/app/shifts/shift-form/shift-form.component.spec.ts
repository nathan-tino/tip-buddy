import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ShiftFormComponent } from './shift-form.component';
import { ShiftFormModel } from './shift-form.model';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ShiftFormComponent', () => {
    let component: ShiftFormComponent;
    let fixture: ComponentFixture<ShiftFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ShiftFormComponent, ReactiveFormsModule, NoopAnimationsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(ShiftFormComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with input values', () => {
        component.dateInput = new Date('2023-08-28T14:30:00Z');
        component.timeInput = new Date('2023-08-28T14:30:00Z');
        component.creditTipsInput = 100;
        component.cashTipsInput = 50;
        component.tipoutInput = 20;
        component.hoursWorkedInput = 8;

        fixture.detectChanges();

        // Assuming the component uses these inputs directly
        expect(component.dateInput).toEqual(new Date('2023-08-28T14:30:00Z'));
        expect(component.timeInput).toEqual(new Date('2023-08-28T14:30:00Z'));
        expect(component.creditTipsInput).toBe(100);
        expect(component.cashTipsInput).toBe(50);
        expect(component.tipoutInput).toBe(20);
        expect(component.hoursWorkedInput).toBe(8);
    });

    it('should emit submitted with form model on submit', () => {
        component.dateInput = new Date('2023-08-28');
        component.timeInput = new Date('1970-01-01T14:30:00Z');
        component.creditTipsInput = 100;
        component.cashTipsInput = 50;
        component.tipoutInput = 20;
        component.hoursWorkedInput = 8;

        fixture.detectChanges();

        spyOn(component.submitted, 'emit');

        component.onSubmit();

        const expectedModel: ShiftFormModel = {
            date: new Date('2023-08-28'),
            time: new Date('1970-01-01T14:30:00Z'),
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
        // Select the actual button inside the p-button component
        // Note: this is a workoaround due to the way PrimeNG renders buttons. There is no id on the button itself,
        // not sure if it's due to a bug or not. I have an active question on their GitHub
        const cancelButton = fixture.debugElement.query(By.css('.cancel-button button'));
        cancelButton.nativeElement.click();

        expect(component.cancel.emit).toHaveBeenCalled();
    });
});