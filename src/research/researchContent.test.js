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
  expect(publishedResearchArticles).toHaveLength(4);
});

test('does not expose unknown or unpublished studies', () => {
  expect(getResearchArticle('not-a-study')).toBeUndefined();
});

test('publishes the three segment-tagged articles with matching solution segments', () => {
  expect(getResearchArticle('automating-can-ecu-tests-with-ai-agents')).toMatchObject({
    segment: 'can-testing',
    published: true,
  });
  expect(getResearchArticle('running-unattended-ros2-hardware-tests')).toMatchObject({
    segment: 'ros2-dds-testing',
    published: true,
  });
  expect(getResearchArticle('test-automation-engineer-in-the-loop')).toMatchObject({
    segment: 'test-orchestration',
    published: true,
  });
});

