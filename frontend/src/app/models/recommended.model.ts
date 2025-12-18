export interface RecommendedRecipe {
  _id: string;
  userId: number;
  recipeId: string;
  recipe: {
    title: string;
    ingredients: string[];
    directions: string[];
    link: string;
    source: string;
    NER: string[];
  };
}
