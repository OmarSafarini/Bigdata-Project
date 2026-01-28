import { Component, OnInit } from '@angular/core';
import { RecommendedRecipeService, RecommendedRecipe } from '../../services/recommended-recipe.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Recipes } from '../../models/recipes.model';
import { ChangeDetectorRef } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
UserService
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
  isLoading: boolean = true;

  userId!: string;

  constructor(
    private recommendedService: RecommendedRecipeService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    await this.loadUserId();
    this.loadRecipes();
  }

  // Load user ID from auth service and backend
  async loadUserId(): Promise<void> {
    const idFromAuth = this.authService.getUserId();
    if (!idFromAuth) return;

    try {
      const user = await this.userService.getUserById(idFromAuth).toPromise();
      this.userId = user._id;
    } catch (err) {
      console.error('Failed to load user', err);
    }
  }

  loadRecipes(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.recommendedService.getUserRecommendations(this.userId).subscribe({
      next: (data: Recipes[]) => {
        this.recipes = [...this.recipes, ...data];
        this.filteredRecipes = [...this.recipes];
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

  onShowMore(): void {
    this.loadRecipes();
  }
}
