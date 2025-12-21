import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from '../services/recipes.service';
import { CommonModule } from '@angular/common';
import { Recipe } from '../models/recipe.model';
import { ChangeDetectorRef } from '@angular/core';

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

  userId = "694436a53401ec747acebea6"; // مؤقت

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private cdr: ChangeDetectorRef
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

  setRating(value: number) {
    if (!this.recipe || this.hasRated) return; 

    const ratingPayload = {
      userId: this.userId,
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
