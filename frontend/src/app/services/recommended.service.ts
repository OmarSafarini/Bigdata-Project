import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecommendedRecipe } from '../models/recommended.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendedService {
  private apiUrl = 'http://localhost:3000/api/recommended';

  constructor(private http: HttpClient) {}

  getUserRecommendations(userId: number): Observable<RecommendedRecipe[]> {
    return this.http.get<RecommendedRecipe[]>(`${this.apiUrl}/${userId}`);
  }
}
