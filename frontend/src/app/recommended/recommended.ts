// recommended.component.ts
import { Component, OnInit } from '@angular/core';
import { RecommendedService } from '../services/recommended.service';
import { RecommendedRecipe } from '../models/recommended.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.html',
  styleUrls: ['./recommended.css'],
  imports : [CommonModule,FormsModule]
})
export class RecommendedComponent implements OnInit {

  recommendations: RecommendedRecipe[] = [];
  filteredRecommendations: RecommendedRecipe[] = [];
  searchText: string = '';
  userId: number = 1; // مؤقت، ممكن تجيبه من auth أو route

  constructor(private recommendedService: RecommendedService) {}

  ngOnInit(): void {
    this.recommendedService.getUserRecommendations(this.userId)
      .subscribe(data => {
        this.recommendations = data;
        this.filteredRecommendations = data;
      });
  }

  filterRecipes(): void {
    const search = this.searchText.toLowerCase();
    this.filteredRecommendations = this.recommendations.filter(r =>
      r.recipe.NER.some(ing => ing.toLowerCase().includes(search))
    );
  }
}
