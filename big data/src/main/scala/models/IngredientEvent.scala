package models

case class IngredientEvent(userId: String, ingredient: String, action: String)

// action = ADD | REMOVE