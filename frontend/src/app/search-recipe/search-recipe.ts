import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { Recipes } from '../models/recipes.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search-recipe',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './search-recipe.html',
  styleUrls: ['./search-recipe.css'],  // صححت الاسم من styleUrl
  standalone: true,
})
export class SearchRecipe implements OnInit {

  isSearching: boolean = false;
  isLoading: boolean = false;

  recipes: Recipes[] = [];
  filteredRecipes: Recipes[] = [];
  page: number = 1;
  limit: number = 50;
  searchText: string = '';

  constructor(
    private recipesService: RecipesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.isLoading = true;
    this.recipesService.getRecipes(this.page, this.limit).subscribe({
      next: (data: Recipes[]) => {
        console.log('Data from backend:', data);
        this.recipes = [...this.recipes, ...data];
        this.filteredRecipes = [...this.recipes];
        this.page++;
        this.isLoading = false;

        this.cdr.detectChanges(); // 🔹 Force Angular to render immediately
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  loadFilteredRecipes(search: string) {
    this.isLoading = true;
    this.recipesService.getRecipesByIngredient(search, this.page, this.limit).subscribe({
      next: (data: Recipes[]) => {
        if (!data || data.length === 0) {
          this.isLoading = false;
          return;
        }

        this.filteredRecipes = [...this.filteredRecipes, ...data];
        this.page++;
        this.isLoading = false;
        this.cdr.detectChanges();
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

  filterRecipes() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.isSearching = false;
      this.filteredRecipes = [...this.recipes];
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
