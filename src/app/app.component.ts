import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AddShiftComponent } from './shifts/add-shift/add-shift.component';
import { ShiftsComponent } from "./shifts/shifts.component";
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddShiftComponent, ShiftsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
