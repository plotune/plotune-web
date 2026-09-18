import { getResearchArticle, publishedResearchArticles } from './content/articles';
import { getSolutionSegment } from '../content/solutions';

test('publishes the featured agentic validation study with a stable route', () => {
  const article = getResearchArticle('agentic-test-validation-model-comparison');

  expect(article).toMatchObject({
    slug: 'agentic-test-validation-model-comparison',
    featured: true,
    topic: 'Agentic Test & Validation',
    published: true,
  });
  expect(article.summary).toMatch(/task acceptance/i);
  expect(publishedResearchArticles).toHaveLength(11);
});

test('does not expose unknown or unpublished studies', () => {
  expect(getResearchArticle('not-a-study')).toBeUndefined();
});

test('every segment-tagged article maps to a real solution page', () => {
  const segmentTagged = publishedResearchArticles.filter((article) => article.segment);
  expect(segmentTagged.length).toBeGreaterThan(0);
  segmentTagged.forEach((article) => {
    expect(getSolutionSegment(article.segment)).toBeDefined();
  });
});

test('every explicit-CTA article points to a real internal path', () => {
  const ctaArticles = publishedResearchArticles.filter((article) => article.cta);
  expect(ctaArticles.length).toBeGreaterThan(0);
  ctaArticles.forEach((article) => {
    expect(article.cta.path).toMatch(/^\//);
    expect(article.cta.summary).toBeTruthy();
    expect(article.cta.label).toBeTruthy();
  });
});

test('every article has exactly one funnel path: a segment, an explicit cta, or neither, never both', () => {
  publishedResearchArticles.forEach((article) => {
    expect(article.segment && article.cta).toBeFalsy();
  });
});

