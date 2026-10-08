import React, { useMemo, useRef, useState } from "react";
import { FiChevronDown, FiPlus, FiX } from "react-icons/fi";
import { discoverPropertyPaths, PROPERTY_OPERATORS, searchPropertyPaths, UNIVERSAL_OPERATORS } from "./filterModel";

const LABELS = {
  equals: "equals", not_equals: "does not equal", contains: "contains",
  greater_than: "greater than", greater_or_equal: "greater than or equal to",
  less_than: "less than", less_or_equal: "less than or equal to",
  is_true: "is true", is_false: "is false", exists: "exists",
  not_exists: "does not exist", is_null: "is null",
};
const NO_VALUE = [...UNIVERSAL_OPERATORS, "is_true", "is_false"];

function describe(condition) {
  const operator = LABELS[condition.operator] || condition.operator;
  return NO_VALUE.includes(condition.operator)
    ? `${condition.path} ${operator}`
    : `${condition.path} ${operator} ${String(condition.value)}`;
}

export default function FilterPopover({
  events, filters, activeFilterId, conditions, onApply, onSave, onRename, onDelete, referenceCount,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [path, setPath] = useState("");
  const [kind, setKind] = useState("string");
  const [operator, setOperator] = useState("equals");
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saveName, setSaveName] = useState("");
  const [showSave, setShowSave] = useState(false);
  const triggerRef = useRef(null);
  const close = () => { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()); };
  const properties = useMemo(() => discoverPropertyPaths(events), [events]);
  const matches = useMemo(() => searchPropertyPaths(properties, search).slice(0, 8), [properties, search]);
  const discovered = properties.find((item) => item.path === path);
  const type = discovered && !["mixed", "null", "object"].includes(discovered.type)
    ? discovered.type
    : discovered && discovered.type !== "mixed" ? discovered.type : kind;
  const operators = [...UNIVERSAL_OPERATORS, ...(PROPERTY_OPERATORS[type] || PROPERTY_OPERATORS.string)];
  const selectedFilter = filters.find((filter) => filter.id === activeFilterId);
  const changed = selectedFilter && JSON.stringify(selectedFilter.conditions) !== JSON.stringify(conditions);
  const suggestions = [...new Set((discovered?.values || []).filter((item) => typeof item === "string"))].slice(0, 12);

  const choosePath = (nextPath) => {
    const found = properties.find((item) => item.path === nextPath);
    setPath(nextPath);
    setKind(found && ["string", "number", "boolean"].includes(found.type) ? found.type : "string");
    const nextType = found && ["string", "number", "boolean"].includes(found.type) ? found.type : "string";
    setOperator(found?.type === "null" || found?.type === "object" ? "exists" : PROPERTY_OPERATORS[nextType][0]);
    setValue("");
  };

  const edit = (condition) => {
    setOpen(true);
    setPath(condition.path);
    setKind(condition.valueType || "string");
    setOperator(condition.operator);
    setValue(condition.value ?? "");
    setEditingId(condition.id);
    setSearch(condition.path);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!path.trim()) return;
    const needsValue = !NO_VALUE.includes(operator);
    let nextValue = value;
    if (needsValue && type === "number") {
      nextValue = Number(value);
      if (value === "" || !Number.isFinite(nextValue)) return;
    }
    const condition = {
      id: editingId || `condition-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      path: path.trim(), operator,
      ...(needsValue ? { value: nextValue, valueType: type } : {}),
    };
    const next = editingId
      ? conditions.map((item) => item.id === editingId ? condition : item)
      : [...conditions, condition];
    onApply(next, activeFilterId);
    setPath(""); setValue(""); setEditingId(null); setSearch(""); close();
  };

  const saveCurrent = (event) => {
    event.preventDefault();
    const trimmed = saveName.trim();
    if (!trimmed) return;
    onSave(trimmed, conditions);
    setSaveName(""); setShowSave(false); close();
  };

  return (
    <div className="mvp-filter-control">
      <button ref={triggerRef} className={`sw-button mvp-filter-trigger ${conditions.length ? "has-filter" : ""}`} type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <FiPlus /> Filter <FiChevronDown />
      </button>
      {conditions.length > 0 && (
        <div className="mvp-filter-chips" aria-label="Active property filters">
          {conditions.map((condition) => (
            <span className="mvp-filter-chip" key={condition.id}>
              <button type="button" onClick={() => edit(condition)} aria-label={`Edit ${describe(condition)}`}>{describe(condition)}</button>
              <button type="button" aria-label={`Remove ${condition.path} filter`} onClick={() => onApply(conditions.filter((item) => item.id !== condition.id), activeFilterId)}><FiX /></button>
            </span>
          ))}
          <button className="sw-link mvp-filter-clear" type="button" onClick={() => onApply([], null)}>Clear</button>
        </div>
      )}
      {open && (
        <>
          <button className="mvp-popover-dismiss" tabIndex={-1} aria-label="Close filter menu" onClick={close} />
          <section className="mvp-filter-popover" role="dialog" aria-label="Filter events" onKeyDown={(event) => { if (event.key === "Escape") close(); }}>
            <div className="mvp-filter-popover-head">
              <strong>Filter events</strong>
              <button className="sw-icon-button" type="button" aria-label="Close filter menu" onClick={close}><FiX /></button>
            </div>
            {filters.length > 0 && (
              <label className="mvp-saved-filter-select">Saved filter
                <select value={activeFilterId || "temporary"} onChange={(event) => {
                  const filter = filters.find((item) => item.id === event.target.value);
                  onApply(filter?.conditions || [], filter?.id || null);
                }}>
                  <option value="temporary">Temporary filters</option>
                  {filters.map((filter) => <option key={filter.id} value={filter.id}>{filter.name}</option>)}
                </select>
              </label>
            )}
            {selectedFilter && (
              <details className="mvp-filter-manage">
                <summary>Saved filter options</summary>
                <div>
                  {changed && <button type="button" onClick={() => onSave(selectedFilter.name, conditions, selectedFilter.id)}>Update conditions</button>}
                  <button type="button" onClick={() => {
                    const name = window.prompt("Rename saved filter", selectedFilter.name);
                    if (name?.trim()) onRename(selectedFilter.id, name.trim());
                  }}>Rename</button>
                  <button type="button" className="danger" onClick={() => {
                    const refs = referenceCount(selectedFilter.id);
                    const warning = refs ? ` ${refs} dashboard widget${refs === 1 ? "" : "s"} will need a new filter.` : "";
                    if (window.confirm(`Delete “${selectedFilter.name}”?${warning}`)) onDelete(selectedFilter.id);
                  }}>Delete</button>
                </div>
              </details>
            )}
            <label className="mvp-property-search">Property
              <input type="search" autoFocus={!path} placeholder="Search properties…" value={path || search} onChange={(event) => {
                setPath(""); setSearch(event.target.value);
              }} />
            </label>
            {!path ? (
              <div className="mvp-property-options" role="listbox" aria-label="Discovered properties">
                {matches.map((item) => (
                  <button type="button" role="option" key={item.path} onClick={() => choosePath(item.path)}>
                    <code>{item.path}</code><small>{item.type}</small>
                  </button>
                ))}
                {search.trim() && !properties.some((item) => item.path === search.trim()) && (
                  <button type="button" role="option" className="manual" onClick={() => choosePath(search.trim())}><code>{search.trim()}</code><small>Use custom path</small></button>
                )}
                {!matches.length && !search.trim() && <p>Type to search or enter a custom property path.</p>}
              </div>
            ) : (
              <form className="mvp-condition-form" onSubmit={submit}>
                <div className="mvp-selected-property"><button type="button" onClick={() => { setPath(""); setValue(""); }}>{path} <small>{discovered?.type || "custom"} · change</small></button></div>
                {(!discovered || ["mixed", "null", "object"].includes(discovered.type)) && (
                  <label>Value type<select value={kind} onChange={(event) => { setKind(event.target.value); setOperator(PROPERTY_OPERATORS[event.target.value][0]); }}><option value="string">String</option><option value="number">Number</option><option value="boolean">Boolean</option></select></label>
                )}
                <label>Operator<select value={operator} onChange={(event) => setOperator(event.target.value)}>{operators.map((item) => <option key={item} value={item}>{LABELS[item]}</option>)}</select></label>
                {!NO_VALUE.includes(operator) && type === "number" && <label>Value<input autoFocus type="number" step="any" required value={value} onChange={(event) => setValue(event.target.value)} /></label>}
                {!NO_VALUE.includes(operator) && type === "string" && <label>Value<input autoFocus list="mvp-filter-values" value={value} onChange={(event) => setValue(event.target.value)} /><datalist id="mvp-filter-values">{suggestions.map((item) => <option key={item} value={item} />)}</datalist></label>}
                <div className="mvp-condition-actions"><button type="button" className="sw-link" onClick={() => { setPath(""); setEditingId(null); }}>Back</button><button className="sw-button sw-primary" type="submit">Apply</button></div>
              </form>
            )}
            <div className="mvp-filter-popover-foot">
              {conditions.length > 0 && <span>{conditions.length} condition{conditions.length === 1 ? "" : "s"} · AND</span>}
              {!showSave ? <button type="button" className="sw-link" disabled={!conditions.length} onClick={() => setShowSave(true)}>{activeFilterId ? "Save as new" : "Save filter"}</button> : (
                <form onSubmit={saveCurrent}><input aria-label="Saved filter name" autoFocus placeholder="Filter name" value={saveName} onChange={(event) => setSaveName(event.target.value)} required /><button type="submit">Save</button><button type="button" onClick={() => setShowSave(false)}>Cancel</button></form>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
