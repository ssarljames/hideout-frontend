import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CashCountService } from 'app/services/cash_count';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CashCountCreateComponent implements OnInit {

  form: FormGroup;

  cash_count = {
    d1000: '',
    d500: '',
    d200: '',
    d100: '',
    d50: '',
    d20: '',
    d10: '',
    d5: '',
    d1: '',
    d25c: '',
    type: null,
    remarks: ''
  }

  types: any[] = [];

  saving = false;

  constructor(private cashCountService: CashCountService,
              private router: Router,
              private toastr: ToastrService) {

  }

  ngOnInit() {
    this.cashCountService.getTypes().subscribe(
      data => {
        for (const key in data) {
          if (data.hasOwnProperty(key) && Number(key) !== 9) {
            const element = data[key];
            this.types.push({name: element, value: key})
          }
        }
        console.log(this.types);

      }
    );
  }

  getTotal() {
    const cash_count_copy: any = JSON.parse(JSON.stringify(this.cash_count));

    for (const key in cash_count_copy) {
      if (cash_count_copy.hasOwnProperty(key)) {
        const element = cash_count_copy[key];
        if ( !this.isNormalInteger(element) && key.search('d') > -1) {
          cash_count_copy[key] = 0;
        }
      }
    }

    const total = (cash_count_copy.d1000 * 1000) +
                (cash_count_copy.d500 * 500) +
                (cash_count_copy.d200 * 200) +
                (cash_count_copy.d100 * 100) +
                (cash_count_copy.d50 * 50) +
                (cash_count_copy.d20 * 20) +
                (cash_count_copy.d10 * 10) +
                (cash_count_copy.d5 * 5) +
                (cash_count_copy.d1) +
                (cash_count_copy.d25c * 0.25);

    return total;
  }

  save(){
    // console.log(this.cash_count);
    const cash_count = this.cash_count;

    const cash_count_copy: any = JSON.parse(JSON.stringify(this.cash_count));

    for (const key in cash_count_copy) {
      if (cash_count_copy.hasOwnProperty(key)) {
        const element = cash_count_copy[key];
        if ( !this.isNormalInteger(element)  && key.search('d') > -1) {
          cash_count_copy[key] = 0;
        }
      }
    }

    const total = (cash_count_copy.d1000 * 1000) +
                (cash_count_copy.d500 * 500) +
                (cash_count_copy.d200 * 200) +
                (cash_count_copy.d100 * 100) +
                (cash_count_copy.d50 * 50) +
                (cash_count_copy.d20 * 20) +
                (cash_count_copy.d10 * 10) +
                (cash_count_copy.d5 * 5) +
                (cash_count_copy.d1) +
                (cash_count_copy.d25c * 0.25);

    const type = Number(cash_count_copy.type);

    console.log(cash_count);

    if(cash_count_copy.type == null){
      this.toastr.error('Cash count type required!');
      this.saving = false;
    } else if (total <= 0) {
      this.toastr.error('Cash denominations required!');
      this.saving = false;
    } else if ((type !==  4 && type !== 1) && cash_count.remarks === ''){
      this.toastr.error('Remarks is required for this type');
      this.saving = false;
    } else {
      // if (!confirm('Proceed?')) {
      //   return;
      // }


      this.cashCountService.create(cash_count_copy).subscribe(
        data => {
          this.saving = false;
          console.log(data);
          this.router.navigate(['/cash-counts']);
          this.toastr.success('Cash count saved!');
        },
        () => {
          this.saving = false;
        }
      );
    }

  }

  isNormalInteger(str: any) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
  }
}
