import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';
import {User} from '../../models/user.model'
import {FormControl, Validators, FormsModule, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UserProfileComponent implements OnInit {

  user: User | null = null;

  ingredientForm = new FormGroup({
  frmIngredient: new FormControl('', Validators.required)
  });


  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    const userId = this.authService.getUserId();
    // const id = '69651d65b74e1679a3ec05fb';
    if (userId) {
      this.loadData(userId);
    }

  }

  loadData(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: data => {
        this.user = data;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  addIngredient() {
    if (this.ingredientForm.invalid) {
      this.ingredientForm.markAllAsTouched();
      return;
    }

    const ingredientValue = this.ingredientForm.get('frmIngredient')?.value;

    if (ingredientValue && this.user) {
      this.user.ingredients.push(ingredientValue);

      this.userService.addIngredient(this.user._id, ingredientValue).subscribe({
        next: data => {
          console.log(data);
          this.ingredientForm.reset();
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

  removeIngredient(ingredient: string) {
    if (!this.user) return;

    this.user.ingredients = this.user.ingredients.filter(i => i !== ingredient);

    this.userService.removeIngredient(this.user._id, ingredient).subscribe({
      next: data => console.log(data),
      error: err => console.error(err)
    });
  }


}
