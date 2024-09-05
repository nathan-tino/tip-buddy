import { Component, input } from '@angular/core';
import { ShiftModel } from './shift.model';
import { ShiftService } from '../../shift.service';
import { EditShiftComponent } from '../edit-shift/edit-shift.component';

@Component({
  selector: 'app-shift',
  standalone: true,
  imports: [EditShiftComponent],
  templateUrl: './shift.component.html',
  styleUrl: './shift.component.css'
})
export class ShiftComponent {
  shift = input.required<ShiftModel>();
  isEditingShift = false;

  constructor(private shiftService: ShiftService) { }

  onDeleteShift() {
    this.shiftService.deleteShift(this.shift().id);
  }

  onEditShift() {
    this.isEditingShift = true;
  }

  onFinishEditShift() {
    this.isEditingShift = false;
  }
}
