package models

case class Recipe(
                   id: String,
                   title: String,
                   directions : String,
                   ingredients : String,
                   NER: Seq[String]
                 )
