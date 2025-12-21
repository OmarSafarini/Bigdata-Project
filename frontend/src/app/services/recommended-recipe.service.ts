// src/app/services/recommended-recipe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getUserRecommendations(userId: string): Observable<RecommendedRecipe[]> {
    return this.http.get<RecommendedRecipe[]>(`${this.apiUrl}/user/${userId}`);
  }

  getRecipesByIngredient(userId: string, ingredient: string): Observable<RecommendedRecipe[]> {

    return this.getUserRecommendations(userId);
  }
}
