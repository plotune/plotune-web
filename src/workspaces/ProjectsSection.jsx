import React, { useId, useState } from 'react';
import client from './client';
import { ConfirmDialog } from './Dialog';
import NameDialog from './FormDialog';
import { SERVICES, serviceName } from './services';

const MAX_PROJECTS = 20;

// Each project is a card: its name, which services are on, and one action that opens the details.
// Turning a service on is one step; turning it off asks first because it revokes access.
export default function ProjectsSection({ workspace, canManage, run }) {
  const [open, setOpen] = useState(null);
  const [dialog, setDialog] = useState(null);
  const headingId = useId();
  const atLimit = workspace.projects.length >= MAX_PROJECTS;

  const close = () => setDialog(null);
  const toggleService = async (project, service, on) => {
    if (on) {
      const result = await run((revision) => client.enableService(workspace.id, project.id, service, revision), { success: `${serviceName(service)} is on for ${project.name}.` });
      return result;
    }
    setDialog({ type: 'disable', project, service });
    return { ok: true };
  };

  return (
    <section className="ws-section" aria-labelledby={headingId}>
      <div className="ws-section__head">
        <div>
          <h2 id={headingId}>Projects</h2>
          <p className="ws-muted">Each project switches on the products your team uses with it.</p>
        </div>
        {canManage && (
          <button type="button" className="design-button" onClick={() => setDialog({ type: 'create' })} disabled={atLimit} aria-describedby={atLimit ? `${headingId}-limit` : undefined}>New project</button>
        )}
      </div>
      {atLimit && <p id={`${headingId}-limit`} className="ws-hint">This workspace has reached its limit of {MAX_PROJECTS} projects.</p>}

      {workspace.projects.length === 0 ? (
        <div className="ws-empty" data-state="empty">
          <h3>No projects yet</h3>
          <p>{canManage ? 'Create a project, then switch on Stream or RMS for it.' : 'An owner or admin can create the first project.'}</p>
        </div>
      ) : (
        <ul className="ws-grid">
          {workspace.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canManage={canManage}
              expanded={open === project.id}
              onToggle={() => setOpen(open === project.id ? null : project.id)}
              onService={toggleService}
              onRename={() => setDialog({ type: 'rename', project })}
              onDelete={() => setDialog({ type: 'delete', project })}
            />
          ))}
        </ul>
      )}

      {dialog?.type === 'create' && (
        <NameDialog
          title="New project"
          label="Project name"
          hint="Up to 64 characters."
          submitLabel="Create project"
          busyLabel="Creating…"
          onClose={close}
          onSubmit={(name, extra) => run(
            (revision) => client.createProject(workspace.id, name, SERVICES.map((s) => s.id).filter((id) => extra.services?.[id]), revision),
            { success: `Created ${name}.` },
          )}
        >
          {({ extra, setExtra, busy }) => (
            <fieldset className="ws-fieldset" disabled={busy}>
              <legend>Turn on now (optional)</legend>
              {SERVICES.map((service) => (
                <label key={service.id} className="ws-check">
                  <input
                    type="checkbox"
                    checked={Boolean(extra.services?.[service.id])}
                    onChange={(event) => setExtra({ ...extra, services: { ...extra.services, [service.id]: event.target.checked } })}
                  />
                  <span><strong>{service.name}</strong><span>{service.description}</span></span>
                </label>
              ))}
              <p className="ws-hint">You can change this later.</p>
            </fieldset>
          )}
        </NameDialog>
      )}

      {dialog?.type === 'rename' && (
        <NameDialog
          title="Rename project"
          label="Project name"
          initial={dialog.project.name}
          submitLabel="Save name"
          onClose={close}
          onSubmit={(name) => run((revision) => client.renameProject(workspace.id, dialog.project.id, name, revision), { success: 'Project renamed.' })}
        />
      )}

      {dialog?.type === 'disable' && (
        <DisableServiceDialog
          project={dialog.project}
          service={dialog.service}
          onCancel={close}
          onConfirm={() => run((revision) => client.disableService(workspace.id, dialog.project.id, dialog.service, revision), { success: `${serviceName(dialog.service)} is off for ${dialog.project.name}.` })}
          onDone={close}
        />
      )}

      {dialog?.type === 'delete' && (
        <ProjectDeleteDialog
          project={dialog.project}
          onCancel={close}
          onConfirm={() => run((revision) => client.deleteProject(workspace.id, dialog.project.id, revision), { success: `Deleted ${dialog.project.name}.` })}
          onDone={() => { close(); setOpen(null); }}
        />
      )}
    </section>
  );
}

function ProjectCard({ project, canManage, expanded, onToggle, onService, onRename, onDelete }) {
  const id = useId();
  const [busyService, setBusyService] = useState('');
  const [error, setError] = useState('');
  const on = (service) => project.services.includes(service);

  const change = async (service, turnOn) => {
    setBusyService(service); setError('');
    const result = await onService(project, service, turnOn);
    setBusyService('');
    if (!result.ok) setError(result.message);
  };

  return (
    <li className="ws-card">
      <div className="ws-card__head">
        <h3 id={`${id}-name`}>{project.name}</h3>
        <button type="button" className="ws-link-button" aria-expanded={expanded} aria-controls={`${id}-panel`} onClick={onToggle}>
          {canManage ? 'Manage' : 'Details'}<span className="sr-only"> {project.name}</span>
        </button>
      </div>
      <ul className="ws-chips" aria-label={`Services in ${project.name}`}>
        {SERVICES.map((service) => (
          <li key={service.id} className={`ws-chip${on(service.id) ? ' is-on' : ''}`}>
            <span className="ws-chip__dot" aria-hidden="true" />{service.name}<span className="ws-chip__state">{on(service.id) ? 'On' : 'Off'}</span>
          </li>
        ))}
      </ul>

      {expanded && (
        <div id={`${id}-panel`} className="ws-card__panel" role="group" aria-labelledby={`${id}-name`}>
          <ul className="ws-rows ws-rows--flush">
            {SERVICES.map((service) => (
              <li key={service.id} className="ws-row">
                <div className="ws-row__main">
                  <strong>{service.name}</strong>
                  <span className="ws-muted">{service.description}</span>
                </div>
                <div className="ws-row__side">
                  <span className="ws-state-text">{on(service.id) ? 'On' : 'Off'}</span>
                  {canManage && (
                    <button
                      type="button"
                      className={`design-button secondary ws-small${on(service.id) ? ' ws-danger-outline' : ''}`}
                      disabled={Boolean(busyService)}
                      aria-busy={busyService === service.id}
                      onClick={() => change(service.id, !on(service.id))}
                    >
                      {on(service.id) ? 'Turn off' : 'Turn on'}<span className="sr-only"> {service.name} for {project.name}</span>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {error && <p className="ws-error" role="alert">{error}</p>}
          {canManage ? (
            <div className="ws-card__tools">
              <button type="button" className="design-button secondary ws-small" onClick={onRename}>Rename<span className="sr-only"> {project.name}</span></button>
              <button type="button" className="design-button secondary ws-small ws-danger-outline" onClick={onDelete}>Delete<span className="sr-only"> {project.name}</span></button>
            </div>
          ) : (
            <p className="ws-hint">Only owners and admins can change projects.</p>
          )}
        </div>
      )}
    </li>
  );
}

// Both confirmations run their request, show a failure inside the dialog and close on success.
function useConfirm(onConfirm, onDone) {
  const [state, setState] = useState({ busy: false, error: '' });
  const confirm = async () => {
    setState({ busy: true, error: '' });
    const result = await onConfirm();
    if (result.ok) onDone(); else setState({ busy: false, error: result.message });
  };
  return [state, confirm];
}

function DisableServiceDialog({ project, service, onConfirm, onCancel, onDone }) {
  const [{ busy, error }, confirm] = useConfirm(onConfirm, onDone);
  const name = serviceName(service);
  return (
    <ConfirmDialog
      title={`Turn off ${name} for ${project.name}?`}
      confirmLabel={`Turn off ${name}`}
      busyLabel="Turning off…"
      danger
      busy={busy}
      error={error}
      onConfirm={confirm}
      onCancel={onCancel}
    >
      <p>Everyone in this workspace loses access to {name} in this project, and connected apps stop working with it. This takes effect within moments.</p>
      <p>Nothing is deleted. You can turn {name} on again later.</p>
    </ConfirmDialog>
  );
}

function ProjectDeleteDialog({ project, onConfirm, onCancel, onDone }) {
  const [{ busy, error }, confirm] = useConfirm(onConfirm, onDone);
  return (
    <ConfirmDialog
      title={`Delete ${project.name}?`}
      confirmLabel="Delete project"
      busyLabel="Deleting…"
      danger
      busy={busy}
      error={error}
      onConfirm={confirm}
      onCancel={onCancel}
    >
      <p>Everyone loses access to this project and its services, and connected apps stop working with it. This cannot be undone.</p>
    </ConfirmDialog>
  );
}
