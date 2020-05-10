import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserGroupService } from '../../../services/user_group';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'app/services/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class UserCreateComponent implements OnInit {

  form: FormGroup;

  roles: any[] = [
    {label: 'Cashier', value: 3},
    {label: 'Personnel', value: 2},
    {label: 'Administrator', value: 1}
  ];

  groups: any = [];

  imageSrc = '/assets/images/img.png';
  imageFile: any = null;

  constructor(private userService: UserService,
              private userGroupService: UserGroupService,
              private router: Router,
              private toastrService: ToastrService,
              private http: HttpClient) {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      fullname: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      user_group_id: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    this.userGroupService.query().subscribe(
      data => {
        this.groups = data;
      }
    );
  }

  saveUser(){

    if (this.form.invalid) {
      return;
    }

    const form: FormData = new FormData();

    if (this.imageFile !== null) {
      form.append('profile_pic', this.imageFile);
    }

    for (const key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key)) {
        const element = this.form.controls[key];
        form.append(key, element.value);
      }
    }

    this.userService.create(form).subscribe(
      response => {
        if(response.message === 'ok'){

          if (this.imageFile !== null) {
            const form: FormData = new FormData();
            form.append('profile_pic', this.imageFile);
            this.http.post(`${environment.apiUrl}/upload-profile-pic/${response.user.id}`, form).subscribe(
              response => {
                this.toastrService.success('User account updated!');
                this.router.navigate(['/users']);
              }
            );
          } else {
            this.toastrService.success('User account updated!');
            this.router.navigate(['/users']);
          }



          // this.toastrService.success('New user account created!');
          // this.router.navigate(['/users']);
        }
      },
      errorReponse => {
        for (const key in errorReponse.error.errors) {
          if (this.form.controls[key]) {
            this.form.controls[key].setErrors(errorReponse.error.errors[key]);
          }
        }
      }
    )
  }


  openBrowseFile(event: any) {
    event.preventDefault();
    const element = document.getElementById('profile_pic') as HTMLElement;
    element.click();
  }

  onFileChange(event: any) {
    const files: any[] = event.target.files;
    if (files.length > 0) {
      this.imageFile = files[0];

      const reader = new FileReader();

      // tslint:disable-next-line: no-shadowed-variable
      reader.addEventListener('load', (event: any) => {
        this.imageSrc  = event.target.result;
      });

      reader.readAsDataURL(this.imageFile);

    } else {
      this.imageFile = null;
      this.imageSrc  = '/assets/images/img.png';
    }
  }

}
