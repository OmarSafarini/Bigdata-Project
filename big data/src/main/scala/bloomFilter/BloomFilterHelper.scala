package bloomFilter

import com.google.common.hash.{BloomFilter, Funnels}
import java.nio.charset.StandardCharsets

class BloomFilterHelper(expectedInsertions: Int = 100000, fpp: Double = 0.01) {

  private val bloom: BloomFilter[String] = BloomFilter.create[String](Funnels.stringFunnel(StandardCharsets.UTF_8), expectedInsertions, fpp)

  def add(item: String): Unit = {
    bloom.put(item.toLowerCase.trim)
  }

  def isExists(item: String): Boolean = {
    bloom.mightContain(item.toLowerCase.trim)
  }

  def addAll(items: Seq[String]): Unit = {
    items.foreach(add)
  }

}