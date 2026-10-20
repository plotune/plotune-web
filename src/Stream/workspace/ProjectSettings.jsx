import React, { useEffect, useState } from "react";
import { Panel } from "../../StreamWorkspace/WorkspaceUI";
import { Failure } from "./LiveExplorer";

export default function ProjectSettings({ client, metadata }) {
  const { project, members, role, mutate, busy } = metadata;
  const [name, setName] = useState(project.name);
  const [baseRevision, setBaseRevision] = useState(project.revision);
  const [nameDirty, setNameDirty] = useState(false);
  const [pendingNameRebase, setPendingNameRebase] = useState(false);
  useEffect(() => {
    if (!nameDirty) {
      setName(project.name);
      setBaseRevision(project.revision);
      setPendingNameRebase(false);
    } else if (pendingNameRebase && project.revision !== baseRevision) {
      setBaseRevision(project.revision);
      setPendingNameRebase(false);
    }
  }, [nameDirty, pendingNameRebase, project.name, project.revision, baseRevision]);
  const [email, setEmail] = useState("");
  const [memberRole, setMemberRole] = useState("Member");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const admin = role !== "Member";
  const perform = async (operation, done, rename = false) => {
    setError(null);
    setMessage("");
    try {
      await mutate(operation);
      if (!rename) setPendingNameRebase(true);
      done?.();
    } catch (cause) {
      if (rename && cause.status === 409) setPendingNameRebase(true);
      setError(cause);
    }
  };
  return (
    <>
      <Failure
        error={error}
        retry={async () => {
          try {
            const refreshed = await metadata.reload(undefined, true);
            if (refreshed) {
              setBaseRevision(refreshed.revision);
              setPendingNameRebase(false);
            }
            setError(null);
          } catch (cause) {
            setError(cause);
          }
        }}
      />
      {message && <p role="status">{message}</p>}
      <Panel title="Project" meta={role}>
        <form
          className="st-settings-form"
          onSubmit={(e) => {
            e.preventDefault();
            perform(
              () => client.renameProject(project.id, name.trim(), baseRevision),
              () => {
                setPendingNameRebase(false);
                setBaseRevision(null);
                setNameDirty(false);
                setMessage("Project name saved.");
              },
              true,
            );
          }}
        >
          <label>
            Project name
            <input
              required
              maxLength={64}
              disabled={!admin}
              value={name}
              onChange={(e) => {
                if (baseRevision === null) setBaseRevision(project.revision);
                setNameDirty(e.target.value !== project.name);
                setName(e.target.value);
              }}
            />
          </label>
          <p>
            Event properties remain unrestricted. Shared filters and dashboards
            belong to this project.
          </p>
          {admin && (
            <button
              className="sw-button sw-primary"
              disabled={busy || !name.trim() || name.trim() === project.name}
            >
              Save name
            </button>
          )}
        </form>
      </Panel>
      <Panel title="Project members">
        <div className="live-pad">
          {admin ? (
            <>
              <form
                className="st-invite-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  perform(
                    () =>
                      client.member(
                        project.id,
                        email.trim().toLowerCase(),
                        memberRole,
                        project.revision,
                      ),
                    () => {
                      setEmail("");
                      setMessage(
                        "Project access added. No invitation email was sent.",
                      );
                    },
                  );
                }}
              >
                <label>
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label>
                  Role
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                  >
                    <option>Member</option>
                    <option>Admin</option>
                  </select>
                </label>
                <button className="sw-button sw-primary" disabled={busy}>
                  Add colleague
                </button>
              </form>
              <p className="st-muted">
                Use your colleague's verified Plotune account email. This adds
                access; it does not send an invitation.
              </p>
              <RoleGuide />
              <div className="st-member-list">
                {members.map((m) => (
                  <div key={m.email}>
                    <strong>{m.email}</strong>
                    {m.role === "Owner" ? (
                      <span>Owner</span>
                    ) : (
                      <>
                        <select
                          aria-label={`Role for ${m.email}`}
                          value={m.role}
                          disabled={busy}
                          onChange={(e) =>
                            perform(() =>
                              client.member(
                                project.id,
                                m.email,
                                e.target.value,
                                project.revision,
                              ),
                            )
                          }
                        >
                          <option>Admin</option>
                          <option>Member</option>
                        </select>
                        <button
                          className="sw-link"
                          disabled={busy}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Remove project access for ${m.email}?`,
                              )
                            )
                              perform(() =>
                                client.member(
                                  project.id,
                                  m.email,
                                  null,
                                  project.revision,
                                  true,
                                ),
                              );
                          }}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p>
                Owners and admins manage membership and project settings. Members
                can investigate events and save shared filters and dashboards.
              </p>
              <RoleGuide />
            </>
          )}
        </div>
      </Panel>
    </>
  );
}

// The three fixed roles, as the Stream API enforces them (roles_list over MCP).
const ROLE_GUIDE = [
  ["Owner", "Everything an Admin can do, plus reading usage. Credits come from this account, and this role can't be changed."],
  ["Admin", "Everything a Member can do, plus adding and removing people, renaming the project, rotating its key, and changing webhooks and path rules."],
  ["Member", "Reading events, dashboards, the catalog and webhooks, and saving filters, dashboards and catalog descriptions."],
];
function RoleGuide() {
  return (
    <details className="st-role-guide">
      <summary>What can each role do?</summary>
      <dl>
        {ROLE_GUIDE.map(([name, text]) => (
          <React.Fragment key={name}>
            <dt>{name}</dt>
            <dd>{text}</dd>
          </React.Fragment>
        ))}
      </dl>
    </details>
  );
}
