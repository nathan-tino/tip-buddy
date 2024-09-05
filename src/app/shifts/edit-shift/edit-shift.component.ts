import { Component, input, output } from '@angular/core';

import { AddShiftComponent } from '../add-shift/add-shift.component';
import { ShiftModel } from '../shift/shift.model';

@Component({
  selector: 'app-edit-shift',
  standalone: true,
  imports: [AddShiftComponent],
  templateUrl: './edit-shift.component.html',
  styleUrl: './edit-shift.component.css'
})
export class EditShiftComponent {
  shift = input.required<ShiftModel>();
  close = output();

  onCancel() {
    this.close.emit();
  }
}
