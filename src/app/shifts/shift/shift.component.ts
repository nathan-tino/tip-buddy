import { Component, input, output } from '@angular/core';

import { GetShiftDto } from '../../dtos/get-shift.dto';
import { AddEditShiftComponent } from '../add-edit-shift/add-edit-shift.component';
import { CardComponent } from "../../shared/card/card.component";

@Component({
  selector: 'app-shift',
  standalone: true,
  imports: [AddEditShiftComponent, CardComponent],
  templateUrl: './shift.component.html',
  styleUrl: './shift.component.css'
})
export class ShiftComponent {
  shift = input.required<GetShiftDto>();
  editShift = output<GetShiftDto>();
  deleteShift = output<number>();

  onEditShift() {
    this.editShift.emit(this.shift());
  }

  onDeleteShift() {
    console.log('shift component delete shift: ' + this.shift().id);
    this.deleteShift.emit(this.shift().id);
  }
}
