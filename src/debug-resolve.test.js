import { MemoryRouter } from 'react-router-dom';

test('debug: react-router-dom resolves from src root', () => {
  expect(MemoryRouter).toBeDefined();
});
