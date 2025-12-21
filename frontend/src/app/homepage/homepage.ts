import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { Recipes } from '../models/recipes.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class Homepage implements OnInit {

  isSearching: boolean = false;
  recipes: Recipes[] = [];
  filteredRecipes: Recipes[] = [];
  page: number = 1;        
  limit: number = 10;     
  searchText: string = ''; 

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipesService.getRecipes(this.page, this.limit).subscribe((data: Recipes[]) => {
      this.recipes = this.recipes.concat(data); 
      this.filteredRecipes = this.recipes; // بشكل افتراضي كل الوصفات تظهر
      this.page++; 
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
