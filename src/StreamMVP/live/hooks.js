import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { resourceData, uiConditions } from "./client";

const empty = {
  project: null,
  role: null,
  filters: [],
  dashboards: [],
  webhooks: [],
  members: [],
};
export function useWorkspaceMetadata(client, projectId) {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [detail, setDetail] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [keys, setKeys] = useState({});
  const selected = useRef(projectId);
  selected.current = projectId;
  const generation = useRef(0),
    mounted = useRef(true);
  const verification = useMemo(() => ({ client, projectId, pending: 0 }), [client, projectId]);
  const invalidate = useCallback(() => {
    generation.current++;
  }, []);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const loadProjects = useCallback(
    async (signal) => {
      try {
        const result = await client.projects(signal);
        if (!signal?.aborted && mounted.current) setProjects(result.items);
      } catch (cause) {
        if (cause.name !== "AbortError" && mounted.current) setError(cause);
      } finally {
        if (!signal?.aborted && mounted.current) setProjectsLoading(false);
      }
    },
    [client],
  );
  useEffect(() => {
    const abort = new AbortController();
    loadProjects(abort.signal);
    return () => abort.abort();
  }, [loadProjects]);
  const reload = useCallback(
    async (signal, propagateFailure = false) => {
      if (!projectId || selected.current !== projectId || !mounted.current)
        return;
      // Background refresh must not supersede verification of a completed write.
      if (!propagateFailure && verification.pending) return;
      if (propagateFailure) verification.pending++;
      const request = ++generation.current;
      try {
        const result = await client.project(projectId, signal);
        const admin = result.membership.role !== "Member";
        const [filters, dashboards, webhooks, members] = await Promise.all([
          client.resources(projectId, "filters", signal),
          client.resources(projectId, "dashboards", signal),
          admin
            ? client.resources(projectId, "webhooks", signal)
            : { items: [] },
          admin ? client.members(projectId, signal) : { items: [] },
        ]);
        if (
          request !== generation.current ||
          selected.current !== projectId ||
          signal?.aborted ||
          !mounted.current
        ) {
          if (propagateFailure) throw new Error("Workspace changed while refreshing the saved resource. Refresh before retrying.");
          return;
        }
        setDetail({
          project: result.project,
          role: result.membership.role,
          filters: filters.items.map((r) => ({
            ...resourceData(r),
            conditions: uiConditions(r.data.conditions),
          })),
          dashboards: dashboards.items.map(resourceData),
          webhooks: webhooks.items.map(resourceData),
          members: members.items,
        });
        setProjects((current) =>
          current.map((p) => (p.id === projectId ? result.project : p)),
        );
        setError(null);
        return result.project;
      } catch (cause) {
        if (
          cause.name !== "AbortError" &&
          request === generation.current &&
          mounted.current
        ) {
          setError(cause);
          if ([401, 403, 404].includes(cause.status)) setDetail(empty);
        }
        if (propagateFailure) throw cause;
      } finally {
        if (propagateFailure) verification.pending--;
        if (request === generation.current && mounted.current)
          setLoading(false);
      }
    },
    [client, projectId, verification],
  );
  useEffect(() => {
    setDetail(empty);
    setError(null);
    if (!projectId) return undefined;
    setLoading(true);
    const abort = new AbortController();
    reload(abort.signal);
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") reload(abort.signal);
    }, 60000);
    const focused = () => {
      if (document.visibilityState === "visible") reload(abort.signal);
    };
    window.addEventListener("focus", focused);
    // This sequence counter intentionally invalidates all outstanding requests.
    return () => {
      abort.abort();
      clearInterval(interval);
      window.removeEventListener("focus", focused);
      invalidate();
    };
  }, [projectId, reload, invalidate]);
  const mutate = useCallback(
    async (operation) => {
      setBusy(true);
      setError(null);
      try {
        const result = await operation();
        if (mounted.current) await reload(undefined, true);
        return result;
      } catch (cause) {
        if (mounted.current && selected.current === projectId) setError(cause);
        throw cause;
      } finally {
        if (mounted.current) setBusy(false);
      }
    },
    [reload, projectId],
  );
  const create = async (name) => {
    setBusy(true);
    setError(null);
    try {
      const result = await client.createProject(name);
      if (mounted.current) {
        setProjects((current) => [...current, result.project]);
        setKeys((current) => ({
          ...current,
          [result.project.id]: result.api_key,
        }));
      }
      return result.project;
    } catch (cause) {
      if (mounted.current) setError(cause);
      throw cause;
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const rotate = async () => {
    const id = projectId;
    return mutate(async () => {
      const result = await client.rotateKey(id, detail.project.revision);
      if (mounted.current)
        setKeys((current) => ({ ...current, [id]: result.api_key }));
      return result;
    });
  };
  return {
    ...detail,
    projects,
    projectsLoading,
    loading,
    error,
    busy,
    keys,
    reload,
    loadProjects,
    mutate,
    create,
    rotate,
    setError,
  };
}

export function useExplorer(client, projectId, query, filterRevision) {
  const key = JSON.stringify({ projectId, query, filterRevision });
  const [state, setState] = useState({
    key: "",
    pages: [],
    index: 0,
    loading: false,
    error: null,
  });
  const generation = useRef(0),
    currentKey = useRef(key);
  currentKey.current = key;
  const invalidate = useCallback(() => {
    generation.current++;
  }, []);
  const abort = useRef(null),
    queryRef = useRef(query);
  queryRef.current = query;
  const load = useCallback(
    async (index = 0, cursor = null, anchor = null) => {
      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;
      const version = ++generation.current;
      setState((old) => ({
        ...(old.key === currentKey.current ? old : { pages: [], index: 0 }),
        key: currentKey.current,
        loading: true,
        error: null,
      }));
      try {
        const page = await client.query(
          projectId,
          {
            ...queryRef.current,
            ...(cursor ? { cursor } : {}),
            ...(anchor ? { now: anchor } : {}),
          },
          { signal: controller.signal },
        );
        if (!controller.signal.aborted && version === generation.current)
          setState((old) => ({
            key: currentKey.current,
            pages: [...old.pages.slice(0, index), page],
            index,
            loading: false,
            error: null,
          }));
      } catch (error) {
        if (error.name !== "AbortError" && version === generation.current)
          setState((old) => ({ ...old, loading: false, error }));
      }
    },
    [client, projectId],
  );
  useEffect(() => {
    setState({ key, pages: [], index: 0, loading: !!projectId, error: null });
    if (!projectId) return undefined;
    const timer = setTimeout(() => load(), 200);
    // This is a request sequence counter, not a DOM ref.
    return () => {
      clearTimeout(timer);
      abort.current?.abort();
      invalidate();
    };
  }, [key, projectId, load, invalidate]);
  const active =
    state.key === key
      ? state
      : { pages: [], index: 0, loading: !!projectId, error: null };
  const page = active.pages[active.index] || {
    items: [],
    nextCursor: null,
    now: null,
  };
  return {
    page,
    loading: active.loading,
    error: active.error,
    index: active.index,
    refresh: () => load(),
    next: () =>
      page.nextCursor &&
      load(active.index + 1, page.nextCursor, active.pages[0]?.now),
    previous: () =>
      setState((old) => ({ ...old, index: Math.max(0, old.index - 1) })),
  };
}

export function useRealtime(client, projectId, scope) {
  const [state, setState] = useState({
    scope: "",
    ids: [],
    reset: false,
    error: null,
  });
  const restart = useRef(null);
  useEffect(() => {
    setState({ scope, ids: [], reset: false, error: null });
    if (!projectId) return undefined;
    const controller = new AbortController();
    let after = "",
      timer,
      epoch = 0;
    const poll = async () => {
      const version = epoch;
      try {
        const result = await client.realtime(
          projectId,
          after,
          controller.signal,
        );
        if (!controller.signal.aborted && version === epoch) {
          after = result.cursor;
          setState((old) => ({
            scope,
            ids: [...new Set([...old.ids, ...result.ids])].slice(0, 1000),
            reset: old.reset || result.reset,
            error: null,
          }));
        }
      } catch (error) {
        if (
          error.name !== "AbortError" &&
          !controller.signal.aborted &&
          version === epoch
        )
          setState((old) => ({ ...old, error }));
      }
      if (!controller.signal.aborted)
        timer = setTimeout(
          poll,
          document.visibilityState === "visible" ? 5000 : 30000,
        );
    };
    restart.current = () => {
      epoch++;
      after = "";
      setState({ scope, ids: [], reset: false, error: null });
    };
    poll();
    return () => {
      controller.abort();
      clearTimeout(timer);
      restart.current = null;
    };
  }, [client, projectId, scope]);
  return {
    ...(state.scope === scope ? state : { ids: [], reset: false, error: null }),
    clear: () => restart.current?.(),
  };
}
