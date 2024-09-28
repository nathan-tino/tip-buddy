import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../shift.service';
import { ShiftComponent } from './shift/shift.component';
import { Shift } from '../models/shift.model';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [ShiftComponent],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit {
  shifts: any[] = [];

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts(): void {
    this.shiftService.getShifts().subscribe((shifts: Shift[]) => {
      this.shifts = shifts;
    });
    console.log('Shifts loaded:', this.shifts);
  }
}
