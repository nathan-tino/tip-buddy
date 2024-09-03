import { Component } from '@angular/core';
import { ShiftService } from '../shift.service';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent {
  constructor(private shiftService: ShiftService) {}

  get shifts() {
    return this.shiftService.getShifts();
  }
}
