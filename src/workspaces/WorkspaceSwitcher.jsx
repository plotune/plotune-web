import React, { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronDown, FiUsers } from 'react-icons/fi';
import { useWorkspaceList } from './hooks';
import { readSelection, subscribe, getSnapshot } from './store';

// Header entry for workspaces. It reads the list only when opened (once, then from memory) and
// remembers the last workspace in localStorage as a convenience, never as authority.
export default function WorkspaceSwitcher({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const root = useRef(null);
  const button = useRef(null);
  const location = useLocation();
  const { status, items, reload } = useWorkspaceList({ load: open });
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot); // re-render when the remembered workspace changes
  const selected = readSelection();
  const current = items.find((item) => item.id === selected?.workspaceId);
  const label = current?.name || selected?.workspaceName || '';

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus(); }
    };
    const onPointer = (event) => { if (root.current && !root.current.contains(event.target)) setOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointer);
    return () => { document.removeEventListener('keydown', onKeyDown); document.removeEventListener('mousedown', onPointer); };
  }, [open]);

  const go = () => { setOpen(false); onNavigate?.(); };
  const linkClass = 'flex min-h-[44px] items-center rounded-lg px-4 py-3 text-sm font-medium text-dark-text transition-colors duration-300 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

  return (
    <div className="relative" ref={root}>
      <button
        ref={button}
        type="button"
        className="ws-switcher__button flex min-h-[44px] items-center gap-2 rounded-lg font-medium text-base text-dark-text transition-colors duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        title={label || undefined}
      >
        <FiUsers aria-hidden="true" className="text-lg" />
        <span className="ws-switcher__label" translate="no">{label || 'Workspaces'}</span>
        {label && <span className="sr-only"> (change workspace)</span>}
        <FiChevronDown aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div id={menuId} hidden={!open} className="mt-2 xl:absolute xl:left-0 xl:top-full xl:mt-3 xl:min-w-64">
        <div className="min-w-56 max-w-[calc(100vw-40px)] rounded-sm border border-ink/15 bg-dark-surface p-3">
          {status === 'loading' || status === 'idle' ? <p className="px-4 py-3 text-sm text-gray-text" role="status">Loading workspaces…</p> : null}
          {status === 'error' && (
            <div className="px-4 py-3 text-sm text-gray-text">
              <p role="alert">We could not load your workspaces.</p>
              <button type="button" className="mt-2 min-h-[44px] font-medium text-primary underline" onClick={reload}>Try again</button>
            </div>
          )}
          {status === 'ready' && items.length === 0 && <p className="px-4 py-3 text-sm text-gray-text">No workspaces yet.</p>}
          {status === 'ready' && items.length > 0 && (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/workspaces/${encodeURIComponent(item.id)}`}
                    className={linkClass}
                    aria-current={item.id === selected?.workspaceId ? 'true' : undefined}
                    onClick={go}
                  >
                    <span className="min-w-0 flex-1 truncate" translate="no">{item.name}</span>
                    <span className="ml-3 text-xs text-gray-text">{item.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link to="/workspaces" className={`${linkClass} mt-1 border-t border-ink/10 font-semibold text-primary`} onClick={go}>All workspaces</Link>
        </div>
      </div>
    </div>
  );
}
