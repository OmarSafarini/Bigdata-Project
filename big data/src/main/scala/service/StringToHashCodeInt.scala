package service

object StringToHashCodeInt {
  def stringToPositiveIntId(s: String): Int = {
    val hash = s.hashCode
    if (hash < 0) -hash else hash
  }
}
