import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipes } from '../models/recipes.model';
import { Recipe } from '../models/recipe.model';
import { Rating } from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private apiUrl = 'http://localhost:3000/api/recipes';
  private ratingsUrl = 'http://localhost:3000/api/ratings';

  constructor(private http: HttpClient) {}

  getRecipes(page: number, limit: number): Observable<Recipes[]> {
    return this.http.get<Recipes[]>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  getRecipeById(id: string) {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  rateRecipe(payload: Rating) {
    return this.http.post(this.ratingsUrl, payload);
  }

  getRecipesByIngredient(search: string, page: number, limit: number): Observable<Recipes[]> {
    return this.http.get<Recipes[]>(
      `${this.apiUrl}?ingredient=${search}&page=${page}&limit=${limit}`
    );
}

}
