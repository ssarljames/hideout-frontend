import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserGroupService } from 'app/services/user_group';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class UserEditComponent implements OnInit {

  user: any = {};
  isFetching = true;

  form: FormGroup = null;

  roles: any[] = [
    {label: 'Cashier', value: 3},
    {label: 'Personnel', value: 2},
    {label: 'Administrator', value: 1}
  ];

  groups: any = [];

  imageSrc = '/assets/images/img.png';
  imageFile: any = null;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private userGroupService: UserGroupService,
              private toastrService: ToastrService,
              private router: Router,
              private http: HttpClient) {


              }

  ngOnInit() {
    this.userGroupService.query().subscribe(
      data => {
        this.groups = data;
      }
    );
    const id = this.route.snapshot.params['id'];

    this.isFetching = true;
    this.userService.read(id).subscribe(
      data => {
        this.user = data;
        this.isFetching = false;

        this.imageSrc = data.profile_picture_path;

        this.form = new FormGroup({
          id: new FormControl(id),
          username: new FormControl(data.username, Validators.required),
          fullname: new FormControl(data.fullname, Validators.required),
          role: new FormControl( data.role, Validators.required),
          user_group_id: new FormControl( data.user_group_id, Validators.required),
          reset_password: new FormControl(false),
        });
      }
    );
  }

  saveUser(){

    if (this.form.invalid) {
      return;
    }

    this.userService.update({
      id: this.form.controls.id.value,
      username: this.form.controls.username.value,
      fullname: this.form.controls.fullname.value,
      user_group_id: this.form.controls.user_group_id.value,
      role: this.form.controls.role.value,
      reset_password: this.form.controls.reset_password.value
    }).subscribe(
      response => {
        if (response.message === 'ok'){
          this.uploadProfilePicture() ;

        }
      },
      errorReponse => {
        for (const key in errorReponse.error.errors) {
          if (this.form.controls[key]) {
            this.form.controls[key].setErrors(errorReponse.error.errors[key]);
          }
        }

      }
    );
  }

  uploadProfilePicture() {


    if (this.imageFile !== null) {
      const form: FormData = new FormData();
      form.append('profile_pic', this.imageFile);
      this.http.post(`${environment.apiUrl}/upload-profile-pic/${this.form.controls.id.value}`, form).subscribe(
        response => {
          this.toastrService.success('User account updated!');
          this.router.navigate(['/users']);
        }
      );
    } else {
      this.toastrService.success('User account updated!');
      this.router.navigate(['/users']);
    }

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
