# Privacy policy

What we collect, why, and what you can do about it.  This notice covers plotune.net and the Plotune services, under the EU General Data Protection Regulation (GDPR) and the Turkish Law on the Protection of Personal Data (KVKK, no. 6698).

## Who we are

The data controller is Plotune, Aydınlı Mah., 34485 Tuzla/İstanbul, Türkiye. For anything about your personal data, write to contact@plotune.net.

This notice applies to visitors of plotune.net and to people who create an account or send us a form. When your organisation puts its own data into a Plotune workspace (requirements, test records, events from your systems), your organisation decides what that data is and why it is processed; we process it on its behalf to provide the service.

## Data we collect

- Account data.  Email address, a username, your password (stored only as a hash), sector and country, and that you accepted the terms. Your name and company if you add them. If you sign in with Google or GitHub, the profile details that provider sends us, such as your email address and name.

- Workspace content.  What you and your team put into a workspace: projects, requirements, test records, events and the people you invite.

- Payments.  We do not collect or store payment card details. You pay on the page of our payment provider (PayTR or Stripe), which processes your payment details under its own privacy policy.

- Forms.  What you enter when you contact us, request or order hardware, apply as a partner or take the AI readiness assessment: typically your name, email address, company and message or answers.

- Technical data.  IP address, browser and device type, and the pages requested, which our hosting provider logs to deliver and protect the site.

- Connections from AI apps.  When you connect an AI app to Plotune: which app, what you allowed it and a log of its sign-ins. Described under [Connections from AI apps](https://www.plotune.net/privacy/#ai-apps).

- Analytics and advertising data.  Described under [Cookies and analytics](https://www.plotune.net/privacy/#cookies).

We do not ask for special categories of personal data, and the services are not intended for children. We do not make decisions about you by automated means alone.

You give us most of this data yourself. Creating an account needs the account data marked above; without it we cannot open one. Everything else is optional.

## Why we use it, and on what legal basis

| Purpose | Data | Legal basis |
| --- | --- | --- |
| Create and run your account and workspaces | Account data, workspace content | Performance of a contract (GDPR 6(1)(b); KVKK 5/2-c) |
| Connect the AI apps you authorise (MCP connectors) and run their tool calls as you | Connection records, workspace content the calls read or change, see below | Performance of a contract (GDPR 6(1)(b); KVKK 5/2-c) |
| Send account email: verification, password reset, service notices | Email address | Performance of a contract (GDPR 6(1)(b); KVKK 5/2-c) |
| Answer contact, order, partner and assessment requests | What you enter in the form | Steps taken at your request before a contract; our legitimate interest in answering (GDPR 6(1)(b), (f); KVKK 5/2-c, 5/2-f) |
| Keep the service secure and prevent abuse | IP address, technical logs | Legitimate interest (GDPR 6(1)(f); KVKK 5/2-f) |
| Count page views without cookies | Page address, referrer, browser type, approximate location from the IP address | Legitimate interest (GDPR 6(1)(f); KVKK 5/2-f) |
| Analytics with identifiers and session replay | Analytics data, see below | Your consent (GDPR 6(1)(a); KVKK 5/1) |
| Measure our advertising | Advertising identifiers, see below | Your consent (GDPR 6(1)(a); KVKK 5/1) |
| Newsletter and product updates | Email address | Your consent (GDPR 6(1)(a); KVKK 5/1) |
| Meet legal obligations | What the law requires in each case | Legal obligation (GDPR 6(1)(c); KVKK 5/2-ç) |

Where we rely on consent you can withdraw it at any time; this does not affect what was done before. Where we rely on legitimate interest you can object, see [Your rights](https://www.plotune.net/privacy/#user-rights).

## Cookies and analytics

The banner asks about two kinds of optional storage, separately. Nothing optional is stored before you choose, your choice is remembered (if you refuse everything, we ask once more after six months), and you can change it at any time: .

- Necessary, always on.  A sign-in cookie (`auth_token`) while you are logged in, your cookie choice, and interface preferences such as the selected workspace, kept in your browser's storage. During a visit we also keep which link or advertisement brought you, in session storage that is cleared when you close the tab.

- Analytics, only with your consent.  PostHog stores an identifier on your device so that visits can be told apart, records clicks and scrolling, and records session replays: a reconstruction of what happened on the page, in which the fields you type into are masked.

- Advertising, only with your consent.  The Google tag stores advertising cookies to measure whether a visit that started from an advertisement led to a message or a sign-up. The LinkedIn Insight Tag is loaded and does the same for LinkedIn campaigns; if you are a LinkedIn member, LinkedIn may link this to your account under its own privacy policy.

Without your consent,  one thing still happens: each page view is counted. PostHog receives the page address, the referring page, your browser type and your IP address, from which it derives an approximate location. No identifier is stored on your device, so page views are not linked into a visit or to you, and clicks and session replays are not recorded. The Google tag stays in its consent-denied mode, where it sets no cookies and sends Google only cookieless signals; the LinkedIn tag is not loaded.

You can also block or delete cookies in your browser settings.

## Connections from AI apps

You can connect an AI app such as Claude or ChatGPT to Plotune through our MCP server (`mcp.plotune.net`, see the [connector documentation](https://www.plotune.net/docs/mcp)) or through the endpoints of each product (`rms.plotune.net`, `stream.plotune.net`, `nexus.plotune.net`). Nothing is connected unless you sign in and approve it.

### What we store for a connection

| Record | Contents | Kept |
| --- | --- | --- |
| The app | The name the app gives itself and the addresses it returns you to after sign-in. An app that identifies itself by a web address is stored under a code derived from that address. | While a connection uses it; an app nobody approved, 24 hours |
| App registrations | How many apps were registered from one network address that day, with the address stored only as a one-way digest | Until the day ends |
| Sign-in code | A one-time code, stored only as a digest, with your account, the app and what you approved | 2 minutes, or until used |
| The connection | Your account, the app, the workspace or "all workspaces", the products, Read only or Full access, the permissions granted, its status and dates | 90 days from approval, also after you revoke it |
| Refresh tokens | Stored only as digests, so we cannot read them | 14 days if unused, at most 90 days; deleted when you revoke |
| Connection log | Time and kind of event: approved or refused, signed in, token renewed, access changed, revoked. No tokens and no call contents. | 90 days, and at most the last 50 entries of each connection |

A daily job deletes records whose period has ended, so a deletion happens within a day after the period ends. Access tokens are signed and not stored; they carry your account number and email address, and the app holds them. Our MCP server stores nothing on disk: it reuses your verified sign-in, your list of workspaces and projects and short-lived product tokens from memory for at most 15 minutes, and its logs record only the kind of an error, never what a call contained.

### What a tool call does

- The product (RMS, Stream or Nexus) runs the call as you, with your current role in that workspace, and sends the result back to the app. A read-only connection cannot change anything.

- What a call creates or changes is workspace content. In RMS, each change is recorded in the audit trail as an agent action on your behalf, with the connection and app that made it and, if the app reports one, the name of its AI model, which we do not verify.

- Work a call starts that we meter, such as Nexus session time, is recorded in the workspace's usage records with you and the connection as its cause. Tool calls themselves are not charged.

- To apply rate limits, calls are counted per workspace in memory; the log lines this produces contain the plan, the kind of call and a random key, not your identity or your workspace.

### Who receives it

The AI app you connect, and the company that provides it, receive the results of the tool calls it makes: whatever your role and the connection allow it to read, including names and email addresses of people in your workspaces where a tool returns them. What that company does with it is governed by its own terms and privacy policy, not this one; it may process the data outside Türkiye and the European Economic Area. Cloudflare hosts the servers and databases involved, as for the rest of the service.

### Your controls

- Read only or Full access  when you approve. Read only is preselected. Either way your workspace role limits every call.

- Connected apps , on any of your workspace pages: revoke a connection, or make a connection to all your workspaces read-only and allow changes again. A revoked connection stops working within moments; switching to read-only takes effect within 15 minutes.

- A workspace Owner or Admin who removes you from a workspace also ends every connection's access to it; deleting a workspace revokes the connections made for it.

- A connection ends on its own after 90 days. To have your account and its connection records deleted, write to contact@plotune.net.

## Who receives your data

We do not sell personal data. We use the following providers to run the website and the services; each receives only what its task needs.

| Provider | What for | Data |
| --- | --- | --- |
| Cloudflare | Hosting, databases and network security for the website and services | Account data, workspace content, connection records, technical logs |
| Hostingdünyam | Our servers in Türkiye: password checks at sign-in, Stream event processing, Nexus cloud test sessions and file downloads | Passwords while they are checked (never stored in readable form), workspace content, technical logs |
| Google | Sending account email; storing form submissions; Google sign-in if you choose it; advertising measurement if you allow it | Email address, form content, sign-in profile, advertising identifiers |
| PostHog | Website analytics, on its United States cloud | Page views; with consent, identifiers, clicks and session replays |
| LinkedIn | Advertising measurement, only if you allow it | Advertising identifiers |
| GitHub | Sign-in, if you choose it | Sign-in profile |
| PayTR and Stripe | Payment processing when you pay us | The payment details you enter on their payment page |

When you connect an AI app, that app and its provider receive what its tool calls return, as described under [Connections from AI apps](https://www.plotune.net/privacy/#ai-apps). You choose that recipient; it is not our provider.

We also disclose data when the law requires it, for example to a court or authority with a lawful request, and to the people in your own workspace, who can see your name and email address there.

## Transfers abroad

Our own servers are in Türkiye, with Hostingdünyam. The other providers above operate internationally, mainly from the United States and the European Union, so your data is also processed outside Türkiye and may be processed outside the European Economic Area. Analytics and advertising data is sent abroad only if you allow those categories in the cookie banner, apart from the cookieless page view described above. For the rest, the transfer is needed to provide the service you asked for. You can ask us which safeguards apply to a particular transfer.

## How long we keep it

- Account data and workspace content:  for as long as the account or workspace exists. When you ask us to delete your account we delete or anonymise it, except what the law obliges us to keep.

- Form submissions:  for as long as we need to answer and follow up the request, and afterwards only while a legal claim could arise from it.

- Analytics and advertising data:  for the periods set by the provider, or until you withdraw consent, whichever comes first for data stored on your device.

- Connections from AI apps:  as listed under [Connections from AI apps](https://www.plotune.net/privacy/#ai-apps); a connection lasts at most 90 days.

- Technical logs:  for a short period needed for security and troubleshooting.

## Your rights

Under GDPR (Articles 15 to 22) and KVKK (Article 11) you can:

- learn whether we process your personal data, and ask for a copy and for information about it;

- learn why it is processed, whether it is used for that purpose, and to whom it is transferred in Türkiye or abroad;

- have inaccurate or incomplete data corrected;

- have your data deleted, destroyed or anonymised when the reason for processing no longer exists, and have this passed on to those who received it;

- restrict processing, or object to processing based on legitimate interest and to direct marketing;

- receive the data you gave us in a machine-readable format;

- object to a result against you that arises from processing by automated means alone;

- withdraw a consent you gave;

- claim compensation if you suffer damage because of unlawful processing.

To use a right, write to contact@plotune.net from the email address of your account, or by post to the address above. We answer free of charge within 30 days.

If you are not satisfied with our answer you can complain to the Personal Data Protection Board in Türkiye (Kişisel Verileri Koruma Kurulu, kvkk.gov.tr) or, in the European Union, to the data protection authority of the country where you live or work.

## Security

Connections to the website and services are encrypted in transit, passwords are stored only as hashes, and access to personal data is limited to the people who need it for their work. No system is completely secure. If a breach affects your data, we notify the authorities and you as the law requires.

## Contact and changes

Plotune, Aydınlı Mah., 34485 Tuzla/İstanbul, Türkiye. Email: contact@plotune.net

When we change this notice we publish the new version here with its date. If a change affects how we use data you already gave us, we tell you by email or in the service.

Last updated:  November 24, 2026

Source: https://www.plotune.net/privacy
