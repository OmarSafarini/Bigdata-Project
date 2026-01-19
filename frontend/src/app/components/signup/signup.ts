import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  signupForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  constructor(private userService: UserService) {}

  get username() {
    return this.signupForm.get('username');
  }
  handleSubmit() {
    this.userService.addUser(this.signupForm).subscribe(
      data => {
        console.log(data);
      }

    )
  }
}
