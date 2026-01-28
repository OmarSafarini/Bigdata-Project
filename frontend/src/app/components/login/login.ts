import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  submitted = false;

  constructor(private userService: UserService, private authService: AuthService,private router: Router) {}

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;


    this.userService.login(email!, password!).subscribe({next: data => {
        console.log(data)
        this.authService.setUserId(data.userId);
        this.router.navigate(['/home']);
      },
    error: error => {
      console.log(error);
      alert("Invalid login");
    }})

  }


  get f() {
    return this.loginForm.controls;

  }
}
