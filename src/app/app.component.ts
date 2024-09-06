import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AddShiftComponent } from './shifts/add-shift/add-shift.component';
import { ShiftsComponent } from "./shifts/shifts.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddShiftComponent, ShiftsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
