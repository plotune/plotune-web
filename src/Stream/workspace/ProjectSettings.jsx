import React from "react";
import { Link } from "react-router-dom";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";

// Project names, people and services belong to the workspace (api.plotune.net); this page only
// explains the role the signed-in person has in Stream and points to where those are managed.
export default function ProjectSettings({ metadata, workspaceId }) {
  const { project, role } = metadata;
  const manage = workspaceId ? `/workspaces/${encodeURIComponent(workspaceId)}` : "/workspaces";
  return (
    <>
      <Panel title="Project" meta={role}>
        <div className="live-pad">
          <p>
            <strong>{project.name}</strong>
          </p>
          <p>
            Its name, the people who can use it and which products are switched on are managed in your workspace.
            Event properties remain unrestricted. Shared filters and dashboards belong to this project.
          </p>
          <Link className="sw-button sw-primary" to={manage}>Manage in workspace</Link>
        </div>
      </Panel>
      <Panel title="Your role">
        <div className="live-pad">
          <RoleGuide current={role} />
        </div>
      </Panel>
    </>
  );
}

// The four workspace roles, as the Stream API enforces them.
const ROLE_GUIDE = [
  ["Owner", "Everything an Admin can do. Credits come from this account, and this role can only change by transferring ownership."],
  ["Admin", "Everything a Member can do, plus creating and replacing the capture key, and changing webhooks and path rules."],
  ["Member", "Reading events, dashboards, the catalog and webhooks, and saving filters, dashboards and catalog descriptions."],
  ["Viewer", "Read-only: events, dashboards, filters and the catalog. No webhooks, and no changes."],
];
function RoleGuide({ current }) {
  return (
    <details className="st-role-guide" open>
      <summary>What can each role do?</summary>
      <dl>
        {ROLE_GUIDE.map(([name, text]) => (
          <React.Fragment key={name}>
            <dt>{name}{name === current ? " (you)" : ""}</dt>
            <dd>{text}</dd>
          </React.Fragment>
        ))}
      </dl>
    </details>
  );
}
