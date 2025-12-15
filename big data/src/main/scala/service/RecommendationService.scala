package service

import models.Recipe

class RecommendationService(recipes: Seq[Recipe]) {

  def recommend(userIngredients: Set[String]): Seq[Recipe] =
    recipes.filter { recipe =>
      recipe.ingredients.forall(userIngredients.contains)
    }
}
