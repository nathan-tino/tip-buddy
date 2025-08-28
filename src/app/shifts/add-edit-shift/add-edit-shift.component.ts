// // ...existing code...
// // AddShiftComponent
// import { Component, input, output, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { GetShiftDto } from '../../dtos/get-shift.dto';
// import { ShiftService } from '../../services/shift.service';
// import { CardComponent } from "../../shared/card/card.component";
// import { DateService } from '../../services/date.service';

// @Component({
//   selector: 'app-add-shift',
//   standalone: true,
//   imports: [FormsModule, CardComponent],
//   templateUrl: './add-edit-shift.component.html',
//   styleUrl: './add-edit-shift.component.css'
// })
// export class AddShiftComponent implements OnInit {
//   date = input<Date | undefined>();
//   close = output<GetShiftDto | undefined>();

//   creditTipsInput!: number;
//   cashTipsInput!: number;
//   tipoutInput!: number;
//   dateInput!: string;
//   hoursWorkedInput?: number;

//   constructor(private shiftService: ShiftService, private dateService: DateService) { }

//   ngOnInit() {
//     if (this.date()) {
//       this.dateInput = this.date()!.toLocaleDateString('en-CA');
//     }
//   }

//   onCancel() {
//     this.close.emit(undefined);
//   }

//   onSubmit() {
//     this.shiftService.addShift({
//       date: this.getDateInputWithTime()!,
//       creditTips: this.creditTipsInput,
//       cashTips: this.cashTipsInput,
//       tipout: this.tipoutInput,
//       hoursWorked: this.hoursWorkedInput !== undefined && this.hoursWorkedInput > 0 ? this.hoursWorkedInput : undefined
//     }).subscribe({
//       next: (response) => {
//         this.close.emit(response);
//       },
//       error: (e) => console.error(e)
//     });
//   }

//   getDateInputWithTime(): Date | null {
//     return this.dateService.convertStringToUtcDate(this.dateInput + 'T08:00:00');
//   }
// }

// // EditShiftComponent
// import { Component as ComponentEdit, Input, Output, EventEmitter, OnInit as OnInitEdit } from '@angular/core';
// import { FormsModule as FormsModuleEdit } from '@angular/forms';
// import { GetShiftDto as GetShiftDtoEdit } from '../../dtos/get-shift.dto';
// import { ShiftService as ShiftServiceEdit } from '../../services/shift.service';
// import { CardComponent as CardComponentEdit } from "../../shared/card/card.component";
// import { DateService as DateServiceEdit } from '../../services/date.service';

// @ComponentEdit({
//   selector: 'app-edit-shift',
//   standalone: true,
//   imports: [FormsModuleEdit, CardComponentEdit],
//   templateUrl: './add-edit-shift.component.html',
//   styleUrl: './add-edit-shift.component.css'
// })
//   @Input() shift!: GetShiftDtoEdit;
//   @Output() close = new EventEmitter<GetShiftDtoEdit | undefined>();

//   creditTipsInput!: number;
//   cashTipsInput!: number;
//   tipoutInput!: number;
//   dateInput!: string;
//   hoursWorkedInput?: number;

//   constructor(private shiftService: ShiftServiceEdit, private dateService: DateServiceEdit) { }

//   ngOnInit() {
//     if (this.shift) {
//       const dateValue = new Date(this.shift.date);
//       this.creditTipsInput = this.shift.creditTips;
//       this.cashTipsInput = this.shift.cashTips;
//       this.tipoutInput = this.shift.tipout;
//       this.dateInput = dateValue.toISOString().slice(0, 10);
//       this.hoursWorkedInput = this.shift.hoursWorked;
//     }
//   }

//   onCancel() {
//     this.close.emit(undefined);
//   }

//   onSubmit() {
//     const updatedShift = {
//       id: this.shift.id,
//       creditTips: this.creditTipsInput,
//       cashTips: this.cashTipsInput,
//       tipout: this.tipoutInput,
//       date: this.getDateInputWithTime()!,
//       hoursWorked: this.hoursWorkedInput
//     };
//     this.shiftService.editShift(this.shift.id, updatedShift)
//       .subscribe({
//         next: (response) => {
//           this.close.emit(updatedShift);
//         },
//         error: (e) => console.error(e)
//       });
//   }

//   getDateInputWithTime(): Date | null {
//     return this.dateService.convertStringToUtcDate(this.dateInput + 'T08:00:00');
//   }
// }
