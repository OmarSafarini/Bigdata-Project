import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { Recipes } from '../models/recipes.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-search-recipe',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './search-recipe.html',
  styleUrl: './search-recipe.css',
})
export class SearchRecipe implements OnInit {

 isSearching: boolean = false;
  recipes: Recipes[] = [];
  filteredRecipes: Recipes[] = [];
  page: number = 1 ;
  limit: number = 50;
  searchText: string = '';

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
  this.recipesService.getRecipes(this.page, this.limit).subscribe((data: Recipes[]) => {
    console.log('Data from backend:', data);  // ✅ بيانات تأتي من الباك
    this.recipes = [...this.recipes, ...data]; // نسخ جديد لتفعيل Angular change detection
    this.filteredRecipes = [...this.recipes];
    this.page++;
    console.log('Filtered recipes:', this.filteredRecipes);
  });
}

  loadFilteredRecipes(search: string) {
    this.recipesService
      .getRecipesByIngredient(search, this.page, this.limit)
      .subscribe((data: Recipes[]) => {
        if (data.length === 0) return;

        this.filteredRecipes = [...this.filteredRecipes, ...data];
        this.page++;
      });
  }

  truncateText(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  filterRecipes() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.isSearching = false;
      this.filteredRecipes = this.recipes;
      return;
    }

    this.isSearching = true;
    this.page = 1;
    this.filteredRecipes = [];

    this.loadFilteredRecipes(search);
  }

  onShowMore() {
    if (this.isSearching) {
      this.loadFilteredRecipes(this.searchText);
    } else {
      this.loadRecipes();
    }
  }
}
