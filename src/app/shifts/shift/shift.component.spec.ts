import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShiftComponent } from './shift.component';
import { GetShiftDto } from '../../dtos/get-shift.dto';

describe('ShiftComponent', () => {
  let component: ShiftComponent;
  let fixture: ComponentFixture<ShiftComponent>;
  const mockShift: GetShiftDto = {
    id: 1,
    date: new Date(),
    creditTips: 100,
    cashTips: 50,
    tipout: 20,
    hoursWorked: 8
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShiftComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('shift', mockShift);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editShift with shift data', () => {
    spyOn(component.editShift, 'emit');
    component.onEditShift();
    expect(component.editShift.emit).toHaveBeenCalledWith(mockShift);
  });

  it('should emit deleteShift with shift id', () => {
    spyOn(component.deleteShift, 'emit');
    component.onDeleteShift();
    expect(component.deleteShift.emit).toHaveBeenCalledWith(mockShift.id);
  });
});
