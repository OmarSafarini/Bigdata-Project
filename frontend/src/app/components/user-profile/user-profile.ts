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

  user!: User;

  ingredientForm = new FormGroup({
    frmIngredient: new FormControl('', Validators.required)
  });


  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.loadData()
  }

  loadData(): void {

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.userService.getUserById(userId).subscribe({
      next: data => {
          this.user = data;
      },
      error: err => {
        console.log(err);
      }
    })

  }

  addIngredient() {
    if (this.ingredientForm.invalid) {
      this.ingredientForm.markAllAsTouched();
      return;
    }

    const ingredientValue = this.ingredientForm.get('frmIngredient')?.value;

    if (ingredientValue != null) {
      this.user.ingredients.push(ingredientValue);

      this.userService.addIngredient(this.user._id, ingredientValue).subscribe({
        next: data => {
          this.user = { ...data };
          console.log(data);
          this.ingredientForm.reset();
        },
        error: error => {
          console.log(error);
        }
      })

    }
  }

  removeIngredient(ingredient: string) {

    this.user.ingredients = this.user.ingredients.filter(i => i !== ingredient);

    this.userService.removeIngredient(this.user._id, ingredient).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


}
