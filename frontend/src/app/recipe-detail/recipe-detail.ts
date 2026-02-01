import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from '../services/recipes.service';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe.model';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.html',
  styleUrls: ['./recipe-detail.css'],
  imports : [CommonModule]
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;

  stars = [1, 2, 3, 4, 5];
  rating = 0;
  hoverRating = 0;
  hasRated = false;

  user! : User;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private userService : UserService

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.recipesService.getRecipeById(id).subscribe((data: Recipe) => {
          this.recipe = data;
          this.cdr.detectChanges();
        });
      }
    });
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

  setRating(value: number) {
    if (!this.recipe || this.hasRated) return;

    const ratingPayload = {
      userId: this.user._id,
      recipeId: this.recipe._id,
      rating: value
    };

    this.recipesService.rateRecipe(ratingPayload)
      .subscribe(res => {
        console.log('Saved rating', res);
        this.rating = value;
        this.hasRated = true;
      });
  }

  setHover(value: number) {
    if (!this.hasRated) {
      this.hoverRating = value;
    }
  }

  clearHover() {
    if (!this.hasRated) {
      this.hoverRating = 0;
    }
  }
}
