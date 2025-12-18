package service

import bloomFilter.BloomFilterHelper

class IngredientValidationService(bloomFilter: BloomFilterHelper) {


  def shouldRunRecommendation(ingredient: String): Boolean =
    bloomFilter.isExists(ingredient)

}
