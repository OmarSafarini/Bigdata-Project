// src/app/services/recommended-recipe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipes } from '../models/recipes.model';
export interface RecommendedRecipe {
  id: string;
  NER: string;
  title: string;
  direction: string;
  ingredients: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecommendedRecipeService {
  private apiUrl = 'http://localhost:3000/api/recommended';

  constructor(private http: HttpClient) {}

  getUserRecommendations(userId: string): Observable<Recipes[]> {
    return this.http.get<Recipes[]>(`${this.apiUrl}/user/${userId}`);
  }

  getRecipesByIngredient(userId: string, ingredient: string): Observable<Recipes[]> {
    return this.getUserRecommendations(userId);
  }
}
