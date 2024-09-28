import { Component, output } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ShiftsComponent } from "./shifts/shifts.component";
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShiftsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
