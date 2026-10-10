import fs from 'fs';
test('routing and every public Stream demo CTA use the dedicated route, preserving API deep links', () => {
 const app=fs.readFileSync('src/App.js','utf8'),landing=fs.readFileSync('src/pages/Stream.jsx','utf8'),shims=fs.readFileSync('scripts/generate-static-routes.cjs','utf8');
 expect(app).toContain('path="/stream/demo"'); expect(app).toContain('path="/stream/workspace" element={<LegacyStreamDemoRedirect />}');
 expect(landing).not.toContain('/stream/workspace'); expect(landing).toContain('/stream/demo?view=api'); expect(shims).toContain("'/stream/demo'");
});
