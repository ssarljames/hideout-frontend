import { UserGroupService } from '../../../services/user_group';
import { VaultEntryService } from 'app/services/vault_entry';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class VaultCreateComponent implements OnInit {

  current_balance: any = {};

  types: any[] = [];
  groups: any[] = [];
  vault_entry: any;


  change_entry: any;

  constructor(private vaultEntryService: VaultEntryService,
              private userGroupService: UserGroupService,
              private toastr: ToastrService,
              private router: Router) {

        this.vault_entry = {
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
                              remarks: '',
                              group_id: ''
                            };

        this.change_entry = JSON.parse(JSON.stringify(this.vault_entry));
        this.change_entry.type = 9;

  }

  ngOnInit() {

    this.vaultEntryService.query({
      params: {
        count_total: 1
      }
    }).subscribe(
      data => {
        this.current_balance = this.vaultEntryService.getMeta().current_balance;

        this.vaultEntryService.getTypes().subscribe(
          data => {
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const element = data[key];
                this.types.push({name: element, value: key});
              }
            }
          }
        );

        this.userGroupService.query().subscribe(
          groups => {
            this.groups = groups;
          }
        )

      }
    )
  }

  save() {

    this.toastr.clear();

    const vault_entry = JSON.parse(JSON.stringify(this.vault_entry));


    let flag = false;

    for (const key in vault_entry) {
      if (vault_entry.hasOwnProperty(key)) {
        const element = vault_entry[key];
        if ( !this.isNormalInteger(element)  && key.search('d') > -1) {
          vault_entry[key] = 0;
        } else {
          if (key.search('d') > -1) {
            vault_entry[key] = Number(vault_entry[key]);

            if (vault_entry[key] > this.current_balance[key]) {
              flag = true;
            }

          }
        }
      }
    }


    if (vault_entry.type === null) {
      this.toastr.error('Type is required');
    } else if (flag && Number(vault_entry.type) !== 0) {
      this.toastr.error('Invalid denominations!');
    } else if (this.getTotal() <= 0) {
      this.toastr.error('Cash denominations required!');
    } else if (vault_entry.remarks === ''){
      this.toastr.error('Remarks is required');
    } else if (Number(vault_entry.type) === 8 && this.getTotal() !== this.getTotalChange() ){
      this.toastr.error('Cash In amount must be equal with Cash Out');
    } else {

          // if (!confirm('Proceed?')) {
          //   return;
          // }

          this.vaultEntryService.create(vault_entry).subscribe(
            data => {

              if ( Number(this.vault_entry.type) === 8) {


                    const change_entry = JSON.parse(JSON.stringify(this.change_entry));


                    for (const key in change_entry) {
                      if (change_entry.hasOwnProperty(key)) {
                        const element = change_entry[key];
                        if ( !this.isNormalInteger(element)  && key.search('d') > -1) {
                          change_entry[key] = 0;
                        } else {
                          change_entry[key] = Number(change_entry[key]);
                        }
                      }
                    }

                    change_entry.remarks = vault_entry.remarks;
                    this.vaultEntryService.create(change_entry).subscribe(
                        d => {
                          this.toastr.success('Transaction saved');
                          this.router.navigate(['/vault']);
                        },
                        f => {
                          console.log(f);
                        }
                    );

              } else {
                this.toastr.success('Transaction saved');
                this.router.navigate(['/vault']);
              }

            },
            failure => {
              console.log(failure);
            }
          );



    }
  }

  isWithdraw(): boolean{
    return !(Number(this.vault_entry.type) === 0 || Number(this.vault_entry.type) === 9);
  }



  isNormalInteger(str: any): boolean {
    return /^\+?(0|[1-9]\d*)$/.test(str);
  }

  getTotal(): number {

    const vault_entry = JSON.parse(JSON.stringify(this.vault_entry));


    for (const key in vault_entry) {
      if (vault_entry.hasOwnProperty(key)) {
        const element = vault_entry[key];
        if ( !this.isNormalInteger(element)  && key.search('d') > -1) {
          vault_entry[key] = 0;
        } else {
          vault_entry[key] = Number(vault_entry[key]);
        }
      }
    }

    return (vault_entry.d1000 * 1000) +
                (vault_entry.d500 * 500) +
                (vault_entry.d200 * 200) +
                (vault_entry.d100 * 100) +
                (vault_entry.d50 * 50) +
                (vault_entry.d20 * 20) +
                (vault_entry.d10 * 10) +
                (vault_entry.d5 * 5) +
                (vault_entry.d1) +
                (vault_entry.d25c * 0.25);


  }


  getTotalChange(): number {

    const change_entry = JSON.parse(JSON.stringify(this.change_entry));


    for (const key in change_entry) {
      if (change_entry.hasOwnProperty(key)) {
        const element = change_entry[key];
        if ( !this.isNormalInteger(element)  && key.search('d') > -1) {
          change_entry[key] = 0;
        } else {
          change_entry[key] = Number(change_entry[key]);
        }
      }
    }

    return (change_entry.d1000 * 1000) +
                (change_entry.d500 * 500) +
                (change_entry.d200 * 200) +
                (change_entry.d100 * 100) +
                (change_entry.d50 * 50) +
                (change_entry.d20 * 20) +
                (change_entry.d10 * 10) +
                (change_entry.d5 * 5) +
                (change_entry.d1) +
                (change_entry.d25c * 0.25);


  }
}
