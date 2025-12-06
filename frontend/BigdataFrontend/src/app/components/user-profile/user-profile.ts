import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';
import {User} from '../../models/user.model'
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  imports: [
    FormsModule
  ]
})
export class UserProfileComponent implements OnInit {

  user: User | undefined;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserById('6932c445a283bf301c59bcd8').subscribe({
      next: data => {
        this.user = data;
      },
      error: error => {
        console.log(error);
      }
    })
  }
}
