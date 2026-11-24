# Plotune MCP connector

[← Documentation](https://www.plotune.net/docs)

Connector



One MCP server that gives your AI app the tools of Plotune RMS, Stream and Nexus, with your own account and role.

## What it is

```
https://mcp.plotune.net/mcp
```

You only see the tools of products that are turned on in your projects.

| Product | Tools for |
| --- | --- |
| RMS | Requirements, test cases, verification, traceability and baselines. |
| Stream | Event history and analytics of your systems: queries, funnels, dashboards. |
| Nexus | Cloud test sessions on Nexus Edges and the devices attached to them (CAN, UART, XCP, DDS and more). |

## Connect

### Claude

Add a custom connector with the URL above, or add Plotune from the connector directory once it is listed there.

### Claude Code

```
claude mcp add --transport http plotune https://mcp.plotune.net/mcp
```

### ChatGPT

In developer mode, add a connector with the URL above.

### Other MCP clients

Any client that supports remote MCP servers over HTTP with OAuth sign-in can use the same URL.

## Sign in and access

- The first connection opens a Plotune sign-in. You sign in with your Plotune account; no API key is needed.

- You choose  Read only  (preselected) or  Full access . The choice applies to all your workspaces, including ones you join later.

- Your role in each workspace still limits every call. A Viewer can only read, even with Full access.

- A connection lasts up to 90 days; then you sign in again.

- To change or end it, open a workspace and go to  Connected apps : make it read-only, allow changes again, or revoke it.

## Projects

Start with `plotune_projects_list`. It lists your workspaces, projects, your role and the products of each project.

Every other tool takes `project_id`. You may leave it out only when exactly one of your projects has that product; with several, it is required for reads and changes alike.

## Safety

- Every tool is marked as read-only, changing data, or destructive. Tools that change data or control test hardware carry those marks, so your AI app can ask you before it runs them.

- A read-only connection is not offered any tool that changes data, and the products refuse changes from it.

- In RMS, every change made through the connector is recorded in the audit trail as an agent action on your behalf, with the connection that made it.

## Limits

- Tool calls are not charged credits. Work they start is metered as usual, for example Nexus session time.

- Per-workspace rate limits are being introduced. Once they apply, a call over a limit gets HTTP 429 with a `Retry-After` header in seconds.

## Troubleshooting

| You see | What to do |
| --- | --- |
| 401 or "authorization required" | The connection expired or was revoked. Reconnect and sign in again. |
| project_required | Several projects have that product. Pass one of the listed project_id values. |
| project_not_found | The id is wrong or not yours. Call plotune_projects_list again. |
| no_access | You lost access to that project or product. Ask a workspace Owner or Admin. |
| A tool is missing | The product is not turned on in any of your projects, or the connection is read-only. |
| unavailable | That product is temporarily down. Retry later; the other products keep working. |
| 429 | A rate limit was reached. Wait for the Retry-After seconds, then retry. |

## Support and privacy

Write to contact@plotune.net. What the connector stores and who receives it is in the [privacy policy](https://www.plotune.net/privacy#ai-apps).

Source: https://www.plotune.net/docs/mcp
