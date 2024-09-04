import { Component } from '@angular/core';
import { ShiftService } from '../shift.service';
import { ShiftComponent } from "./shift/shift.component";

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [ShiftComponent],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent {
  constructor(private shiftService: ShiftService) {}

  get shifts() {
    return this.shiftService.getShifts();
  }
}
