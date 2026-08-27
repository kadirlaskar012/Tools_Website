import { ARTICLE_LIST, calculateArticleBodyWordCount } from './src/lib/articles-registry.js';

console.log('==================================================');
console.log('ARTICLE WORD COUNT AUDIT (TARGET: 2,000+ WORDS)');
console.log('==================================================\n');

let below2000Count = 0;

ARTICLE_LIST.forEach((article, idx) => {
  const words = calculateArticleBodyWordCount(article);
  const status = words >= 2000 ? 'PASS (2,000+)' : 'BELOW 2,000 (NEEDS EXPANSION)';
  console.log(`${idx + 1}. [${words} words] ${article.slug}`);
  console.log(`   Status: ${status}`);
  if (words < 2000) below2000Count++;
});

console.log('\n==================================================');
console.log(`Total Articles: ${ARTICLE_LIST.length}`);
console.log(`Articles >= 2,000 Words: ${ARTICLE_LIST.length - below2000Count}`);
console.log(`Articles < 2,000 Words: ${below2000Count}`);
console.log('==================================================');
