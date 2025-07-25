import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AddEditShiftComponent } from './add-edit-shift.component';
import { ShiftService } from '../../services/shift.service';

describe('EditShiftComponent', () => {
  let component: AddEditShiftComponent;
  let fixture: ComponentFixture<AddEditShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditShiftComponent, HttpClientTestingModule],
      providers: [ShiftService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
