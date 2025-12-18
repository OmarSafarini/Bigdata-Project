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

  truncateText(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  filterRecipes() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.filteredRecipes = this.recipes;
      return;
    }

    this.filteredRecipes = this.recipes.filter(recipe => {
      try {
        const nerArray = JSON.parse(recipe.NER as unknown as string) as string[];
        return nerArray.some(ingredient => ingredient.toLowerCase().includes(search));
      } catch {
        return false;
      }
    });
  }
}
