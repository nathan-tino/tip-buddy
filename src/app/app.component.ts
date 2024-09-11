import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ShiftsComponent } from "./shifts/shifts.component";
import { HeaderComponent } from './header/header.component';
import { AddEditShiftComponent } from "./shifts/add-edit-shift/add-edit-shift.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShiftsComponent, HeaderComponent, AddEditShiftComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAddingShift = false;

  onAddShift() {
    this.isAddingShift = true;
  }

  onFinishAddShift() {
    this.isAddingShift = false;
  }
}
