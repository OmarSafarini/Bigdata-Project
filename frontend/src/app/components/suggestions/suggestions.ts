// suggestions.component.ts
import { Component, OnInit } from '@angular/core';
import { RecommendedRecipeService, RecommendedRecipe } from '../../services/recommended-recipe.service';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.html',
  styleUrls: ['./suggestions.css'],
  imports: [CommonModule, RouterLink]
})
export class Suggestions implements OnInit {
  recipes: RecommendedRecipe[] = [];
  userId: string = '694436a53401ec747acebea4';

  constructor(private recommendedService: RecommendedRecipeService) {}



  ngOnInit() {
    this.recommendedService.getUserRecommendations(this.userId).subscribe(data => {

      this.recipes = data.map(r => ({
        ...r,
        direction: JSON.parse(r.direction),
        ingredients: JSON.parse(r.ingredients)
      }));
      console.log(this.recipes);
    });
  }


  truncateText(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

}
