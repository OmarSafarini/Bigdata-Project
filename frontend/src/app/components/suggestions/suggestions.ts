import { Component, OnInit } from '@angular/core';
import { RecommendedRecipeService, RecommendedRecipe } from '../../services/recommended-recipe.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Recipes } from '../../models/recipes.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.html',
  styleUrls: ['./suggestions.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class Suggestions implements OnInit {

  recipes: Recipes[] = [];
  filteredRecipes: Recipes[] = [];
  page: number = 1;
  limit: number = 50;
  searchText: string = '';
  isSearching: boolean = false;
  userId: string = '694436a53401ec747acebea4';  

constructor(private recommendedService: RecommendedRecipeService, private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.loadRecipes();
  }

  isLoading: boolean = true;

loadRecipes() {
  this.isLoading = true;
  this.recommendedService.getUserRecommendations(this.userId).subscribe({
    next: (data) => {
      this.recipes = [...this.recipes, ...data];
      this.filteredRecipes = [...this.recipes];
      this.isLoading = false;

      this.cdr.detectChanges(); // 🔹 Force Angular to update view
    },
    error: (err) => {
      console.error(err);
      this.isLoading = false;
    }
  });
}

  truncateText(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  onShowMore() {
    this.loadRecipes();
  }
}
