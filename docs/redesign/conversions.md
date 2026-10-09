# Conversion and dependency preservation matrix

Source snapshot before implementation. Static source inventory supplements the browser CTA crawl. All existing handlers, payloads, service endpoints, event names, attribution and redirect semantics must survive.

| Source | Line | Behavior / destination / instrumentation |
|---|---:|---|
| src/App.js | 75 | return <Navigate to={/solutions/agentic-test-development${location.search}} replace />; |
| src/App.js | 91 | to="/" |
| src/App.js | 97 | to="/docs" |
| src/StreamMVP/StreamMVP.jsx | 1050 | <a className="sw-brand" href="/stream/workspace/"> |
| src/StreamWorkspace/StreamWorkspace.jsx | 379 | <button className="sw-link" onClick={() => navigate("Runs")}> |
| src/StreamWorkspace/StreamWorkspace.jsx | 394 | <button className="sw-link" onClick={() => navigate("Alarms")}> |
| src/StreamWorkspace/StreamWorkspace.jsx | 421 | onClick={() => navigate("Measurements")} |
| src/StreamWorkspace/StreamWorkspace.jsx | 443 | <button className="sw-link" onClick={() => navigate("Sources")}> |
| src/StreamWorkspace/StreamWorkspace.jsx | 472 | <button className="sw-link" onClick={() => navigate("Events")}> |
| src/StreamWorkspace/StreamWorkspace.jsx | 496 | <button className="sw-button" onClick={() => navigate("Processors")}> |
| src/StreamWorkspace/StreamWorkspace.jsx | 1791 | <a className="sw-brand" href="/stream/prototypes/vision"> |
| src/StreamWorkspace/StreamWorkspace.jsx | 1867 | onClick={() => navigate(name)} |
| src/StreamWorkspace/StreamWorkspace.jsx | 1880 | onClick={() => navigate("Project Settings")} |
| src/StreamWorkspace/StreamWorkspace.jsx | 1893 | <a href="/streams"> |
| src/StreamWorkspace/StreamWorkspace.jsx | 1947 | onClick={() => navigate("Sources")} |
| src/agents/webmcp.js | 2 | export function createPublicContentTools(fetchContent = (...args) => fetch(...args)) { |
| src/aiReadiness/AiReadinessPage.jsx | 78 | navigate(${location.pathname}${location.search}, { state: { alStep: next }, replace }); |
| src/aiReadiness/AiReadinessPage.jsx | 179 | navigate(-1); |
| src/aiReadiness/AiReadinessPage.jsx | 196 | navigate(introIdxRef.current - currentIdx); |
| src/aiReadiness/AiReadinessPage.jsx | 262 | to={withFunnelParams('/nexus')} |
| src/aiReadiness/AiReadinessPage.jsx | 346 | nexusTo={withFunnelParams('/nexus')} |
| src/aiReadiness/EmailCapture.jsx | 93 | to={nexusTo} |
| src/aiReadiness/EmailCapture.jsx | 186 | <a href="mailto:contact@plotune.net" className="underline underline-offset-2 hover:text-light-text">contact@plotune.net</a>. |
| src/aiReadiness/EmailCapture.jsx | 188 | <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-light-text"> |
| src/aiReadiness/analytics.js | 28 | posthog.capture(event, { |
| src/components/AboutHero.jsx | 27 | href="/partners" |
| src/components/AboutHero.jsx | 36 | href="/about#mission" |
| src/components/ContactForm.jsx | 31 | posthog.capture(event, { ...getFunnelContext(), path: window.location.pathname, ...properties }); |
| src/components/ContactForm.jsx | 162 | to={withFunnelParams('/ai-readiness')} |
| src/components/ContactForm.jsx | 170 | to="/nexus" |
| src/components/ContactForm.jsx | 278 | <a href={mailto:${CONTACT_EMAIL}} className="underline underline-offset-2">{CONTACT_EMAIL}</a>. |
| src/components/ContactForm.jsx | 294 | <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-light-text">Privacy</a> |
| src/components/Cta.jsx | 14 | to="/download" |
| src/components/Cta.jsx | 20 | to="/contact" |
| src/components/DownloadSection.jsx | 31 | const response = await fetch('https://api.github.com/repos/plotune/plotune-dl/releases/latest'); |
| src/components/DownloadSection.jsx | 235 | href="https://github.com/plotune/plotune-dl/releases" |
| src/components/DownloadSection.jsx | 312 | href={download.getDownloadUrl()} |
| src/components/DownloadSection.jsx | 323 | href="https://plotune.net/install.sh" |
| src/components/DownloadSection.jsx | 335 | href="https://snapcraft.io/docs" |
| src/components/DownloadSection.jsx | 347 | href="https://wiki.archlinux.org/title/Arch_User_Repository" |
| src/components/DownloadSection.jsx | 382 | href={latestRelease.html_url} |
| src/components/DownloadSection.jsx | 408 | href="https://github.com/plotune/plotune-dl/releases" |
| src/components/DownloadSection.jsx | 422 | <a href="/docs" className="text-primary hover:underline">documentation</a>{' '} |
| src/components/DownloadSection.jsx | 424 | <a href="https://discord.gg/plotune" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer"> |
| src/components/FaqSection.jsx | 66 | <Link to="/contact" className="text-primary hover:underline"> |
| src/components/Features.jsx | 113 | to="/contact" |
| src/components/Footer.jsx | 14 | <Link to="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Plotune home"> |
| src/components/Footer.jsx | 25 | <li><Link to="/#features" className={linkClass('/')}>Features</Link></li> |
| src/components/Footer.jsx | 26 | <li><Link to="/nexus" aria-current={location.pathname === '/nexus' ? 'page' : undefined} className={linkClass('/nexus')}>Nexus</Link></li> |
| src/components/Footer.jsx | 27 | <li><Link to="/extensions" aria-current={location.pathname === '/extensions' ? 'page' : undefined} className={linkClass('/extensions')}>Extensions</Link></li> |
| src/components/Footer.jsx | 28 | <li><Link to="/download" aria-current={location.pathname === '/download' ? 'page' : undefined} className={linkClass('/download')}>Download</Link></li> |
| src/components/Footer.jsx | 35 | <li><Link to="/docs" aria-current={location.pathname === '/docs' ? 'page' : undefined} className={linkClass('/docs')}>Documentation</Link></li> |
| src/components/Footer.jsx | 36 | <li><Link to="/faq" aria-current={location.pathname === '/faq' ? 'page' : undefined} className={linkClass('/faq')}>FAQ</Link></li> |
| src/components/Footer.jsx | 39 | href="https://github.com/plotune/plotune-web/discussions" |
| src/components/Footer.jsx | 55 | <li><Link to="/about" aria-current={location.pathname === '/about' ? 'page' : undefined} className={linkClass('/about')}>About Us</Link></li> |
| src/components/Footer.jsx | 56 | <li><Link to="/partners" aria-current={location.pathname === '/partners' ? 'page' : undefined} className={linkClass('/partners')}>Partnership</Link></li> |
| src/components/Footer.jsx | 57 | <li><Link to="/contact" aria-current={location.pathname === '/contact' ? 'page' : undefined} className={linkClass('/contact')}>Contact</Link></li> |
| src/components/Footer.jsx | 58 | <li><Link to="/careers" aria-current={location.pathname === '/careers' ? 'page' : undefined} className={linkClass('/careers')}>Careers</Link></li> |
| src/components/Footer.jsx | 59 | <li><Link to="/legal" aria-current={location.pathname === '/legal' ? 'page' : undefined} className={linkClass('/legal')}>Legal</Link></li> |
| src/components/Header.jsx | 116 | href={item.to} |
| src/components/Header.jsx | 136 | to={item.to} |
| src/components/Header.jsx | 159 | to={child.to} |
| src/components/Header.jsx | 176 | to={item.to} |
| src/components/Header.jsx | 192 | <Link to="/" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"> |
| src/components/Header.jsx | 225 | to="/login" |
| src/components/Header.jsx | 235 | to="/register" |
| src/components/Header.jsx | 261 | to="/login" |
| src/components/Header.jsx | 268 | to="/register" |
| src/components/Hero.jsx | 22 | to="/contact" |
| src/components/Hero.jsx | 28 | to="/nexus" |
| src/components/Mission.jsx | 103 | href="/contact" |
| src/components/MoreFromPlotune.jsx | 32 | to={item.to} |
| src/components/NexusShowcase.jsx | 115 | to="/nexus/use-cases" |
| src/components/NexusUseCasesTeaser.jsx | 53 | to="/nexus/use-cases" |
| src/components/NexusUseCasesTeaser.jsx | 65 | to={page.to} |
| src/components/ScrollDepthTracker.jsx | 40 | posthog.capture('scroll_depth', { |
| src/components/Seo.jsx | 21 | <link rel="canonical" href={url} /> |
| src/components/Seo.jsx | 22 | <link rel="alternate" type="text/markdown" href={${SITE}${path === "/" ? "" : path}/index.md} /> |
| src/components/TalentPool.jsx | 28 | href={mailto:${email}?subject=Talent Pool Interest &#124; Plotune} |
| src/components/TalentPool.jsx | 49 | href="/contact" |
| src/components/networks/PlotuneNetworks.jsx | 63 | const response = await api.get(/auth/stream?q=${cacheBuster}&user=${user?.username}, { |
| src/components/streams/PlotuneStreams.jsx | 39 | const response = await api.get('/user/premium', { |
| src/components/streams/PlotuneStreams.jsx | 54 | const response = await api.get(/auth/stream?q=${cacheBuster}&user=${user?.username}, { |
| src/components/streams/StreamCard.jsx | 89 | to="/streams/connect" |
| src/components/streams/StreamCard.jsx | 273 | to="/streams/connect" |
| src/components/streams/StreamManagementModal.jsx | 177 | href={mailto:${isShared ? stream.owner_email : user?.email}} |
| src/components/streams/StreamOverviewPage.jsx | 66 | onClick={() => navigate('/streams')} |
| src/components/streams/StreamOverviewPage.jsx | 116 | onClick={() => navigate('/streams')} |
| src/context/AuthContext.js | 16 | const isProduction = window.location.protocol === 'https:'; |
| src/context/AuthContext.js | 56 | const profileResponse = await api.get('/profile', { |
| src/context/AuthContext.js | 99 | const validateResponse = await api.post('/auth/validate', {}, { |
| src/context/AuthContext.js | 178 | window.location.href = '/login'; |
| src/pages/AgenticTestDevelopmentPage.jsx | 62 | to={withFunnelParams(/solutions/${slug})} |
| src/pages/AgenticTestDevelopmentPage.jsx | 86 | <Link to={withFunnelParams('/nexus')} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-6 py-3 font-semibold text-light-text transition-all duration-300 hover:bg-white/[0.1]"> |
| src/pages/AgenticTestDevelopmentPage.jsx | 89 | <Link to={withFunnelParams('/contact')} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"> |
| src/pages/Contact.jsx | 103 | to={withFunnelParams('/ai-readiness')} |
| src/pages/Contact.jsx | 104 | onClick={() => posthog.capture('contact_assessment_clicked', { ...getFunnelContext(), path: '/contact', topic })} |
| src/pages/Contact.jsx | 132 | <a href={mailto} className="inline-flex min-h-[44px] items-center font-medium text-light-text underline underline-offset-4 hover:text-primary"> |
| src/pages/Contact.jsx | 146 | href={channel.link} |
| src/pages/Dashboard.jsx | 80 | const premiumResponse = await api.get('/user/premium', { |
| src/pages/Dashboard.jsx | 85 | const statsResponse = await api.get('/user/stats', { |
| src/pages/Dashboard.jsx | 168 | to="/extensions" |
| src/pages/Dashboard.jsx | 182 | to="/download" |
| src/pages/Dashboard.jsx | 196 | to="/streams" |
| src/pages/Dashboard.jsx | 221 | href={link.link} |
| src/pages/Dashboard.jsx | 236 | to={link.link} |
| src/pages/DnsPage.jsx | 71 | to="/partners" |
| src/pages/Docs.jsx | 135 | <Link key={tab.id} to={tab.href} className={baseCls}> |
| src/pages/Embeddings.jsx | 36 | to="/login" |
| src/pages/Embeddings.jsx | 45 | to="/docs" |
| src/pages/Extensions.jsx | 188 | const response = await fetch(apiUrl); |
| src/pages/Extensions.jsx | 380 | href={extension.deployment} |
| src/pages/Faq.jsx | 199 | to="/nexus" |
| src/pages/Faq.jsx | 205 | to="/contact" |
| src/pages/ForgotPassword.jsx | 112 | await api.post('/auth/forgot-password', { email }); |
| src/pages/ForgotPassword.jsx | 135 | await api.post('/auth/verify-reset-code', { email, code }); |
| src/pages/ForgotPassword.jsx | 152 | await api.post('/auth/reset-password', { |
| src/pages/ForgotPassword.jsx | 158 | navigate('/login'); |
| src/pages/ForgotPassword.jsx | 172 | await api.post('/auth/forgot-password', { email }); |
| src/pages/ForgotPassword.jsx | 286 | <Link to="/login" className="text-primary hover:underline text-sm"> |
| src/pages/ForgotPassword.jsx | 521 | <Link to="/login" className="text-primary hover:underline text-sm"> |
| src/pages/Home.jsx | 23 | to="/contact" |
| src/pages/Home.jsx | 29 | to="/nexus" |
| src/pages/Legal.jsx | 47 | to={item.id} |
| src/pages/Legal.jsx | 87 | to="/privacy" |
| src/pages/Login.jsx | 21 | const queryParams = new URLSearchParams(window.location.search); |
| src/pages/Login.jsx | 25 | const clean = window.location.origin + window.location.pathname + window.location.hash.split('?')[0]; |
| src/pages/Login.jsx | 31 | const hash = window.location.hash &#124;&#124; ''; |
| src/pages/Login.jsx | 39 | const clean = window.location.origin + window.location.pathname + cleanHash; |
| src/pages/Login.jsx | 60 | const userResponse = await api.post('/auth/validate', {}, { |
| src/pages/Login.jsx | 69 | navigate('/dashboard'); |
| src/pages/Login.jsx | 138 | const response = await api.post('/login', { |
| src/pages/Login.jsx | 145 | const userResponse = await api.post('/auth/validate', {}, { |
| src/pages/Login.jsx | 154 | navigate('/dashboard'); |
| src/pages/Login.jsx | 166 | const res = await api.get('/login/github'); |
| src/pages/Login.jsx | 167 | window.location.href = res.data.auth_url; |
| src/pages/Login.jsx | 181 | {new URLSearchParams(window.location.search).get('expired') && ( |
| src/pages/Login.jsx | 287 | <Link to="/reset-password" className="text-primary hover:underline text-sm">Forgot password?</Link> |
| src/pages/Login.jsx | 346 | Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Register</Link> |
| src/pages/Nexus.jsx | 68 | const heroAssessmentCta = useCtaTracking('nexus_hero_assessment'); |
| src/pages/Nexus.jsx | 69 | const bottomContactCta = useCtaTracking('nexus_bottom_contact'); |
| src/pages/Nexus.jsx | 96 | to={withFunnelParams('/ai-readiness')} |
| src/pages/Nexus.jsx | 98 | onClick={() => posthog.capture('nexus_assessment_clicked', { ...getFunnelContext(), path: '/nexus' })} |
| src/pages/Nexus.jsx | 107 | to="/nexus/connectivity" |
| src/pages/Nexus.jsx | 236 | to="/nexus/use-cases" |
| src/pages/Nexus.jsx | 242 | to="/contact" |
| src/pages/Nexus.jsx | 254 | <Link to="/docs/nexus" className="font-semibold text-primary hover:text-primary-dark"> |
| src/pages/NexusConnectivity.jsx | 99 | <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"> |
| src/pages/NexusConnectivity.jsx | 103 | <Link to="/nexus/use-cases" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10"> |
| src/pages/NexusConnectivity.jsx | 208 | <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"> |
| src/pages/NexusConnectivity.jsx | 212 | <Link to="/nexus/use-cases" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10"> |
| src/pages/NexusDocPage.jsx | 31 | <Link to="/docs/nexus" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"> |
| src/pages/NexusDocPage.jsx | 46 | <Link to="/docs/nexus" className="text-sm text-gray-text transition-colors hover:text-primary"> |
| src/pages/NexusDocPage.jsx | 78 | to={withFunnelParams(doc.cta.path, { article: doc.slug })} |
| src/pages/NexusDocPage.jsx | 96 | to={/docs/nexus/${other.slug}} |
| src/pages/NexusDocsOverview.jsx | 32 | to={/docs/nexus/${doc.slug}} |
| src/pages/NexusStream.jsx | 85 | <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"> |
| src/pages/NexusStream.jsx | 89 | <Link to="/nexus/connectivity" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3 font-semibold text-light-text transition-all duration-300 hover:border-primary hover:bg-primary/10"> |
| src/pages/NexusStream.jsx | 205 | <Link to="/contact" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"> |
| src/pages/NexusUseCases.jsx | 1072 | if (event.origin !== window.location.origin) return; |
| src/pages/NexusUseCases.jsx | 1130 | href={contactMailto('Plotune Nexus')} |
| src/pages/NexusUseCases.jsx | 1139 | href="#runtime" |
| src/pages/NexusUseCases.jsx | 1145 | href="#artifacts" |
| src/pages/NexusUseCases.jsx | 1151 | href="#industries" |
| src/pages/NexusUseCases.jsx | 1268 | href={contactMailto(activeIndustryConfig.label)} |
| src/pages/NexusUseCases.jsx | 1306 | href={contactMailto('Plotune Nexus')} |
| src/pages/PartnerApplication.jsx | 11 | to="/partners" |
| src/pages/PartnerApplication.jsx | 43 | href="https://docs.google.com/forms/d/e/1FAIpQLSc2xQCMnvMH-_nHptO7cBudN5c9GrX79FpowISPhtp5puihHw/viewform" |
| src/pages/PartnerApplication.jsx | 58 | <a href="mailto:contact@plotune.net" className="text-primary hover:underline"> |
| src/pages/PartnerPortal.jsx | 246 | Contact <a href="mailto:contact@plotune.net" className="text-primary hover:underline">contact@plotune.net</a> for custom solutions. |
| src/pages/PartnerPortal.jsx | 362 | <a href="mailto:contact@plotune.net" className="text-primary hover:underline">contact@plotune.net</a>{' '} |
| src/pages/Partnership.jsx | 77 | to="/partners/apply" |
| src/pages/Partnership.jsx | 183 | to="/partners/apply" |
| src/pages/Partnership.jsx | 189 | to="/contact" |
| src/pages/Privacy.jsx | 53 | to={item.id} |
| src/pages/Privacy.jsx | 153 | To exercise these rights, contact us at <a href="mailto:contact@plotune.net" className="text-primary hover:underline">contact@plotune.net</a>. |
| src/pages/Privacy.jsx | 180 | Email: <a href="mailto:contact@plotune.net" className="text-primary hover:underline">contact@plotune.net</a> |
| src/pages/Profile.jsx | 38 | const profileResponse = await api.get(/profile?cb=${cachebuster}, { |
| src/pages/Profile.jsx | 44 | const premiumResponse = await api.get( |
| src/pages/Profile.jsx | 64 | await api.put('/profile', userData, { |
| src/pages/Profile.jsx | 90 | const response = await api.post('/generate-api-token', {}, { |
| src/pages/Profile.jsx | 226 | href="https://gravatar.com" |
| src/pages/Profile.jsx | 335 | to="/docs" |
| src/pages/Profile.jsx | 354 | to="/reset-password" |
| src/pages/RedirectPage.jsx | 14 | window.location.href = url; |
| src/pages/RedirectPage.jsx | 27 | href={url} |
| src/pages/Register.jsx | 164 | const response = await api.post('/register', { |
| src/pages/Register.jsx | 178 | navigate('/verify-email', { state: { email: formData.email } }); |
| src/pages/Register.jsx | 522 | I agree to the <Link to="/legal" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link> (GDPR/KVKK compliant) |
| src/pages/Register.jsx | 570 | const res = await api.get('/login/github'); |
| src/pages/Register.jsx | 571 | window.location.href = res.data.auth_url; |
| src/pages/Register.jsx | 586 | Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link> |
| src/pages/SolutionPage.jsx | 19 | if (renamedTo) return <Navigate to={/solutions/${renamedTo}${location.search}} replace />; |
| src/pages/SolutionPage.jsx | 20 | return <Navigate to="/nexus" replace />; |
| src/pages/SolutionPage.jsx | 29 | <Link to="/research" className="mb-10 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-gray-text transition-colors hover:text-primary"> |
| src/pages/SolutionPage.jsx | 38 | <Link to={withFunnelParams('/contact', { segment: config.slug, solution: config.slug })} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"> |
| src/pages/SolutionPage.jsx | 41 | <Link to={withFunnelParams('/nexus', { segment: config.slug, solution: config.slug })} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-6 py-3 font-semibold text-light-text transition-all duration-300 hover:bg-white/[0.1]"> |
| src/pages/SolutionPage.jsx | 114 | <Link to={withFunnelParams('/contact', { segment: config.slug, solution: config.slug })} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark"> |
| src/pages/StorageManager.jsx | 86 | const filesResponse = await api.get(/s3/user/files?cb=${cachebuster}, { |
| src/pages/StorageManager.jsx | 91 | const usageResponse = await api.get(/s3/user/total_usage?cb=${cachebuster}, { |
| src/pages/StorageManager.jsx | 131 | const urlResponse = await api.get('/s3/user/upload_url', { |
| src/pages/StorageManager.jsx | 143 | const response = await fetch(urlResponse.data.upload_url, { |
| src/pages/StorageManager.jsx | 172 | const response = await api.get('/s3/user/download_url', { |
| src/pages/StorageManager.jsx | 194 | await api.delete('/s3/user/file', { |
| src/pages/StorageManager.jsx | 522 | <Link to="/extensions" className="text-primary hover:underline">Extensions</Link> or{' '} |
| src/pages/StorageManager.jsx | 523 | <Link to="/streams" className="text-primary hover:underline">Stream Nodes</Link> for better performance. |
| src/pages/VerifyEmail.jsx | 22 | navigate('/login'); |
| src/pages/VerifyEmail.jsx | 41 | const response = await api.get(/auth/verify-email?token=${token}); |
| src/pages/VerifyEmail.jsx | 128 | to="/login" |
| src/pages/VerifyEmail.jsx | 134 | to="/" |
| src/pages/VerifyEmail.jsx | 162 | href={mailto:support@plotune.net?subject=${encodeURIComponent('Resend verification email')}${email ? &body=${encodeURIComponent(Please resend the verification link for: ${email})} : ''}} |
| src/pages/VerifyEmail.jsx | 169 | to="/login" |
| src/pages/VerifyEmail.jsx | 183 | <a href="mailto:support@plotune.net" className="text-primary hover:underline"> |
| src/pages/docs_pages/Calculations/Aggregations.jsx | 16 | Use with <a href="?page=components-statistical">Statistical component</a>. |
| src/pages/docs_pages/Calculations/Mathematical.jsx | 16 | See <a href="?page=calculations-aggregations">Aggregations</a> for summary stats. |
| src/pages/docs_pages/Calculations/Plotunex.jsx | 397 | <a href="/docs?page=components-recorder" className="group"> |
| src/pages/docs_pages/Calculations/Plotunex.jsx | 411 | <a href="/docs?page=extensions-offline" className="group"> |
| src/pages/docs_pages/Calculations/Plotunex.jsx | 425 | <a href="/docs?page=components-oscilloscope" className="group"> |
| src/pages/docs_pages/Components/Bridge.jsx | 250 | <a href="/docs?page=components-oscilloscope" className="group"> |
| src/pages/docs_pages/Components/Bridge.jsx | 264 | <a href="/docs?page=components-scatter" className="group"> |
| src/pages/docs_pages/Components/Bridge.jsx | 278 | <a href="/docs?page=extensions-bridging" className="group"> |
| src/pages/docs_pages/Components/Oscilloscope.jsx | 330 | <a href="/docs?page=components-scatter" className="group"> |
| src/pages/docs_pages/Components/Oscilloscope.jsx | 344 | <a href="/docs?page=extensions-online" className="group"> |
| src/pages/docs_pages/Components/Oscilloscope.jsx | 358 | <a href="/docs?page=sdk" className="group"> |
| src/pages/docs_pages/Components/Recorder.jsx | 360 | <a href="/docs?page=extensions-offline" className="group"> |
| src/pages/docs_pages/Components/Recorder.jsx | 374 | <a href="/docs?page=components-oscilloscope" className="group"> |
| src/pages/docs_pages/Components/Recorder.jsx | 388 | <a href="/docs?page=components-statistical" className="group"> |
| src/pages/docs_pages/Components/Scatter.jsx | 201 | <a href="/docs?page=components-oscilloscope" className="group"> |
| src/pages/docs_pages/Components/Scatter.jsx | 213 | <a href="/docs?page=components-statistical" className="group"> |
| src/pages/docs_pages/Components/Scatter.jsx | 225 | <a href="/docs?page=calculations-aggregations" className="group"> |
| src/pages/docs_pages/Components/Statistical.jsx | 202 | <a href="/docs?page=components-oscilloscope" className="group"> |
| src/pages/docs_pages/Components/Statistical.jsx | 214 | <a href="/docs?page=components-scatter" className="group"> |
| src/pages/docs_pages/Components/Statistical.jsx | 226 | <a href="/docs?page=calculations-aggregations" className="group"> |
| src/pages/docs_pages/Components/Video.jsx | 16 | Explore <a href="?page=general">General</a> for integration tips. |
| src/pages/docs_pages/Extensions/Bridging.jsx | 16 | Pair with <a href="?page=components-bridge">Bridge component</a>. |
| src/pages/docs_pages/Extensions/Simulation.jsx | 16 | Useful with <a href="?page=components-oscilloscope">Oscilloscope</a>. |
| src/posthog.js | 20 | const onAssessment = isAssessmentPath(window.location.pathname); |
| src/posthog.js | 63 | // Exposed so other modules (e.g. ScrollDepthTracker) can call posthog.capture() against the |
| src/research/ResearchArticle.jsx | 9 | const ResearchArticle=()=>{const{slug}=useParams();const article=getResearchArticle(slug);const[Content,setContent]=useState(null);const[loadError,setLoadError]=useState(false);const[attempt,setAttempt]=useState(0);const cta=article&&resolveCta(article);const tag=article&&resolveTag(article);const ctaImpression=useCtaTracking('research_article_solution',{article:article&&article.slug,segment:article&&article.segment&#124;&#124;null,destination:cta?cta.path:null});useEffect(()=>{if(!article)return;setLoadError(false);article.loader().then(module=>setContent(()=>module.default)).catch(()=>setLoadError(true));},[article,attempt]);useEffect(()=>{if(!article)return;captureFunnelTouch({article:article.slug,segment:article.segment});window.dataLayer=window.dataLayer&#124;&#124;[];window.dataLayer.push({event:'research_article_view',tag,segment:article.segment&#124;&#124;null,article:article.slug});},[article,tag]);if(!article)return <section className="research-page-head"><h1>Study not found</h1><p>This study doesn’t exist or is no longer available.</p></section>;const components={Insight,ResearchPlot,FlowDiagram,StatFigure,ChartLegend};return <><Seo title={${article.title} &#124; Plotune Research} description={article.summary} path={/research/articles/${article.slug}} tag={tag}/><article className="research-article" data-plotune-tag={tag&#124;&#124;undefined}><header><p>{article.topic}</p><h1>{article.title}</h1><StudyMeta article={article}/></header>{Content?<MDXProvider components={components}><Content article={article}/></MDXProvider>:loadError?<div className="research-load-error" role="alert"><p>We couldn’t load this study. Check your connection and try again.</p><button type="button" onClick={()=>setAttempt(a=>a+1)}>Retry</button></div>:<p role="status">Loading study…</p>}{Content&&cta&&<div className="research-article-cta" ref={ctaImpression.ref}><p>{cta.summary}</p><Link to={withFunnelParams(cta.path,{article:article.slug,segment:article.segment})}>{cta.label} →</Link></div>}</article></>};export default ResearchArticle; |
| src/research/ResearchLayout.jsx | 18 | const rssUrl = ${window.location.origin}/research/rss.xml; |
| src/research/ResearchLayout.jsx | 50 | return <div className="research-site"><header className="research-header"><Link className="research-brand" to="/research" aria-label="Plotune Research home"><span>Plotune</span><strong>Research</strong></Link><button className="research-menu" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button><nav className={open ? 'is-open' : ''}>{nav.map(([to, label]) => <Link key={to} to={to} className={location.pathname === to ? 'active' : ''} onClick={() => setOpen(false)}>{label}</Link>)}<div className="rss-control"><button className="rss-button" onClick={() => setRssOpen(!rssOpen)} aria-label="RSS options" aria-expanded={rssOpen}><RssIcon /></button>{rssOpen && <div className="rss-popover"><strong>Follow this research</strong><a href={https://feedly.com/i/subscription/feed/${encodeURIComponent(rssUrl)}} target="_blank" rel="noreferrer">Open in Feedly</a><button onClick={copyFeed}>{copyState === 'copied' ? 'Feed link copied' : copyState === 'failed' ? 'Copy unavailable: select the link below' : 'Copy feed link'}</button>{copyState === 'failed' && <input readOnly value={rssUrl} onFocus={(e) => e.target.select()} aria-label="RSS feed link" />}</div>}</div><a className="research-brand-home" href="https://www.plotune.net/" onClick={() => setOpen(false)}>Plotune.net</a>{isLoading ? null : user ? <><Link className="research-login" to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link><button type="button" className="research-logout" onClick={() => { setOpen(false); logout(); }}>Log out</button></> : <><Link className="research-login" to="/login" onClick={() => setOpen(false)}>Log in</Link><Link className="research-register" to="/register" onClick={() => setOpen(false)}>Register</Link></>}</nav></header><main>{children}</main><footer className="research-footer"><span>(c) {new Date().getFullYear()} Plotune Research</span><a href="/research/rss.xml">RSS feed</a></footer></div>; |
| src/research/ResearchMethodology.jsx | 5 | const ResearchMethodology = () => <section className="research-page methodology-page"><Seo title="Methodology &#124; Plotune Research" description="Agentic Test and Validation Protocol." path="/research/methodology" /><header className="page-heading"><span className="section-label">Methodology</span><h1>Agentic Test &amp; Validation Protocol</h1><p>A repeatable way to evaluate an agent completing an engineering task through fixed interfaces, observable acceptance criteria, and reviewable evidence.</p></header><div className="protocol-flow"><span>Restore fixture</span><i>1</i><span>Acquire interface</span><i>2</i><span>Capture baseline</span><i>3</i><span>Apply permitted action</span><i>4</i><span>Verify observed result</span><i>5</i><span>Release and package evidence</span></div><div className="methodology-grid"><aside className="methodology-nav"><a href="#scope">What is evaluated</a><a href="#environment">Test environment</a><a href="#families">Task families</a><a href="#scoring">Metrics and scoring</a><a href="#releases">Monthly releases</a></aside><div className="methodology-copy"><section id="scope"><h2>What is evaluated</h2><p>The unit of evaluation is a complete task, not a written answer. A task is successful only when the required observed state, acceptance checks, and supporting evidence are present.</p></section><section id="environment"><h2>Test environment</h2><p>Every attempt pins the fixture revision, simulator or hardware configuration, interface adapter, schema revision, tool version, and acceptance checks. The initial state is restored before an attempt. Simulated and physical-bench outcomes are reported separately.</p></section><section id="families"><h2>Task families</h2><div className="family-grid"><article><h3>Industrial data analysis</h3><p>Find a seeded deviation, quantify it correctly, and cite the relevant signal window.</p></article><article><h3>Connecting test benches</h3><p>Discover the interface, establish a session, capture a valid sample, and close cleanly.</p></article><article><h3>Automated validation</h3><p>Turn a requirement into a bounded sequence and produce an independently checked verdict.</p></article><article><h3>Diagnostics and root cause</h3><p>Capture a reproducible fault window and separate observations from hypotheses.</p></article><article><h3>Calibration and updates</h3><p>Inspect baseline state, apply an allowed change, verify readback, and restore.</p></article><article><h3>Stream validation and evidence</h3><p>Detect a defined threshold or sequence and preserve a trace another engineer can review.</p></article></div></section><section id="scoring"><h2>Metrics and scoring</h2><div className="method-list"><div><strong>Performance</strong><span>Family score equals passed attempts divided by scheduled attempts. The overall index is the mean of family scores so a large family cannot dominate.</span></div><div><strong>Cost</strong><span>Recorded model and execution charges are summed across successful, failed, and retried work. Cost per attempted and successful task are kept distinct.</span></div><div><strong>Time</strong><span>Wall time runs from task dispatch through verdict and required cleanup. Detailed releases report median and p95 alongside the headline statistic.</span></div><div><strong>Reliability</strong><span>Scheduled attempts that complete with a valid terminal result and cleanup, separated from whether the answer was correct.</span></div></div></section><section id="releases"><h2>Monthly releases</h2><p>Each release freezes its task manifest, model and provider configuration, prompt and tool versions, retry policy, resource limits, and acceptance checks. Run records retain timestamps, tool calls, artifact hashes, verdicts, and failure categories. Comparisons between months are made only on compatible task and protocol versions.</p><p className="provenance">Data provenance: the current interface is an example release format. Published monthly reports will be based on recorded run records and versioned task manifests.</p></section></div></div><Link className="detail-back" to="/research/reports">Browse research reports</Link></section>; |
| src/research/ResearchOverview.jsx | 66 | <p className="results-next-step"><Link to="/research/reports">Read the latest report →</Link></p> |
| src/research/ResearchReports.jsx | 111 | <Link className="report-row" to={/research/articles/${article.slug}} key={article.slug}> |
| src/research/ResearchResults.jsx | 5 | return <Navigate to={/research${location.search}} replace />; |
| src/services/api.js | 56 | window.location.href = '/login?expired=1'; |
| src/utils/attribution.js | 44 | export const captureAttribution = (loc = typeof window !== 'undefined' ? window.location : null) => { |
| src/utils/ctaTracking.js | 38 | posthog.capture('cta_impression', { cta_id: ctaId, path: pathname, ...getFunnelContext(), ...propertiesRef.current }); |
| src/utils/funnel.js | 24 | const params = new URLSearchParams(window.location.search); |
| src/utils/funnel.js | 36 | return referrerHost === window.location.hostname ? 'internal' : referrerHost; |
| src/utils/leadSubmission.js | 41 | const params = new URLSearchParams(window.location.search); |
| src/utils/leadSubmission.js | 48 | landing_path: window.location.pathname, |
| src/utils/leadSubmission.js | 67 | const response = await fetch(ENDPOINT, { |
| src/utils/leadSubmission.js | 89 | page: window.location.pathname, |
