import { getResearchArticle, publishedResearchArticles } from './content/articles';

test('publishes the featured agentic validation study with a stable route', () => {
  const article = getResearchArticle('agentic-test-validation-model-comparison');

  expect(article).toMatchObject({
    slug: 'agentic-test-validation-model-comparison',
    featured: true,
    topic: 'Agentic Test & Validation',
    published: true,
  });
  expect(article.summary).toMatch(/task acceptance/i);
  expect(publishedResearchArticles).toHaveLength(1);
});

test('does not expose unknown or unpublished studies', () => {
  expect(getResearchArticle('not-a-study')).toBeUndefined();
});

