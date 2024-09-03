import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddShiftComponent } from './add-shift/add-shift.component';
import { ShiftService } from './shift.service';
import { AddShiftModel } from './add-shift/add-shift.model';
import { ShiftsComponent } from "./shifts/shifts.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddShiftComponent, ShiftsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private shiftService: ShiftService) {}

  onAddShift(shift: AddShiftModel) {
    this.shiftService.addShift(shift);
  }
}
