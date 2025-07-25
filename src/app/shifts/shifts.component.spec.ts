import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsComponent } from './shifts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShiftService } from '../services/shift.service';

describe('ShiftsComponent', () => {
  let component: ShiftsComponent;
  let fixture: ComponentFixture<ShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftsComponent, HttpClientTestingModule],
      providers: [ShiftService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
