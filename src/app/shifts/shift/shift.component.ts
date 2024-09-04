import { Component, input } from '@angular/core';
import { ShiftModel } from './shift.model';
import { ShiftService } from '../../shift.service';

@Component({
  selector: 'app-shift',
  standalone: true,
  imports: [],
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
