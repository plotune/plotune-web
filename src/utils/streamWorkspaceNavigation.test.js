import { streamWorkspaceReturn, streamWorkspaceLogin } from './streamWorkspaceNavigation';
test('login preserves shared resource navigation while dropping secrets and unrelated query parameters', () => {
  expect(streamWorkspaceReturn('/stream/workspace?project=p&view=dashboards&dashboard=d&filter=f&token=secret')).toBe('/stream/workspace?project=p&view=dashboards&dashboard=d&filter=f');
  expect(streamWorkspaceLogin('?project=p&dashboard=d')).toBe('/login?next=%2Fstream%2Fworkspace%3Fproject%3Dp%26dashboard%3Dd');
});
test('the MCP consent route carries only its signed request blob through login', () => {
  expect(streamWorkspaceReturn('/stream/authorize?request=abc.def&state=client-controlled')).toBe('/stream/authorize?request=abc.def');
  expect(streamWorkspaceReturn('/stream/authorize')).toBe('/stream/authorize');
});
test.each(['//evil.test', 'https://evil.test/stream/workspace', '/stream/workspace-other', '/stream/authorize-other?request=x', '/dashboard', null])('rejects a non-workspace return target %s', value => {
  expect(streamWorkspaceReturn(value)).toBeNull();
});
