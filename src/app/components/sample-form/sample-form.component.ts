// import { Component, OnInit } from '@angular/core';


// import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
// import {ErrorStateMatcher} from '@angular/material/core';


// /** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

// @Component({
//   selector: 'app-sample-form',
//   templateUrl: './sample-form.component.html',
//   styleUrls: ['./sample-form.component.scss']
// })
// export class SampleFormComponent implements OnInit {
//   sampleModel = {};
//   isChecked = false;

//   weekdaysOnly = (d: Date): boolean => {
//     const day = d.getDay();
//     // Prevent Saturday and Sunday from being selected.
//     return day !== 0 && day !== 6;
//   }

//   emailFormControl = new FormControl('', [
//     Validators.required,
//     Validators.email,
//   ]);

//   matcher = new MyErrorStateMatcher();

//   constructor() { }

//   ngOnInit() {
//   }

// }
