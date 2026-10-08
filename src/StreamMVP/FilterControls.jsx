import React, { useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  discoverPropertyPaths,
  PROPERTY_OPERATORS,
  searchPropertyPaths,
  UNIVERSAL_OPERATORS,
} from "./filterModel";

const OPERATOR_LABELS = {
  equals: "equals",
  not_equals: "does not equal",
  contains: "contains",
  greater_than: "greater than",
  greater_or_equal: "greater than or equal",
  less_than: "less than",
  less_or_equal: "less than or equal",
  is_true: "is true",
  is_false: "is false",
  exists: "exists",
  not_exists: "does not exist",
  is_null: "is null",
};

function readableCondition(condition) {
  if (["is_true", "is_false", "exists", "not_exists", "is_null"].includes(condition.operator)) {
    return `${condition.path} ${OPERATOR_LABELS[condition.operator]}`;
  }
  return `${condition.path} ${OPERATOR_LABELS[condition.operator]} ${String(condition.value)}`;
}

export default function FilterControls({
  events,
  savedFilters,
  activeFilterId,
  conditions,
  onSelectFilter,
  onConditionsChange,
  onSaveNew,
  onSaveChanges,
  onRename,
  onDelete,
  referenceCount,
}) {
  const [expanded, setExpanded] = useState(false);
  const [propertySearch, setPropertySearch] = useState("");
  const [path, setPath] = useState("");
  const [manualType, setManualType] = useState("string");
  const [operator, setOperator] = useState("equals");
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [nameMode, setNameMode] = useState("");
  const [filterName, setFilterName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const properties = useMemo(() => discoverPropertyPaths(events), [events]);
  const visibleProperties = useMemo(() => searchPropertyPaths(properties, propertySearch).slice(0, 8), [properties, propertySearch]);
  const property = properties.find((item) => item.path === path.trim());
  const type = property && !["mixed", "null", "object"].includes(property.type)
    ? property.type
    : property?.type === "null" || property?.type === "object" ? property.type : manualType;
  const typedOperators = PROPERTY_OPERATORS[type] || PROPERTY_OPERATORS.string;
  const operators = [...UNIVERSAL_OPERATORS, ...typedOperators];
  const activeFilter = savedFilters.find((item) => item.id === activeFilterId);
  const isDirty = activeFilter && JSON.stringify(activeFilter.conditions) !== JSON.stringify(conditions);

  const resetEditor = () => {
    setPath("");
    setValue("");
    setOperator("equals");
    setEditingId(null);
    setPropertySearch("");
  };

  const choosePath = (nextPath) => {
    setPath(nextPath);
    const nextProperty = properties.find((item) => item.path === nextPath.trim());
    const nextType = nextProperty?.type;
    const controlType = nextType && !["mixed", "null", "object"].includes(nextType) ? nextType : "string";
    setManualType(controlType);
    setOperator(nextType === "null" || nextType === "object" ? "exists" : (PROPERTY_OPERATORS[controlType] || PROPERTY_OPERATORS.string)[0] || "exists");
    setValue("");
  };

  const editCondition = (condition) => {
    setExpanded(true);
    setEditingId(condition.id);
    setPath(condition.path);
    setManualType(condition.valueType || "string");
    setOperator(condition.operator);
    setValue(condition.value ?? "");
    setPropertySearch(condition.path);
  };

  const submitCondition = (event) => {
    event.preventDefault();
    const conditionPath = path.trim();
    if (!conditionPath) return;
    const requiresValue = ![...UNIVERSAL_OPERATORS, "is_true", "is_false"].includes(operator);
    let nextValue = value;
    if (requiresValue && type === "number") {
      nextValue = Number(value);
      if (value === "" || !Number.isFinite(nextValue)) return;
    }
    const nextCondition = {
      id: editingId || `condition-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      path: conditionPath,
      operator,
      ...(requiresValue ? { value: nextValue, valueType: type } : {}),
    };
    onConditionsChange(editingId
      ? conditions.map((condition) => condition.id === editingId ? nextCondition : condition)
      : [...conditions, nextCondition]);
    resetEditor();
  };

  const saveNamedFilter = (event) => {
    event.preventDefault();
    const nextName = filterName.trim();
    if (!nextName) return;
    if (nameMode === "rename" && activeFilter) onRename(activeFilter.id, nextName);
    if (nameMode === "create") onSaveNew(nextName, conditions);
    setFilterName("");
    setNameMode("");
  };

  const values = property?.values || [];
  const stringSuggestions = [...new Set(values.filter((item) => typeof item === "string"))].slice(0, 20);

  return (
    <section className="mvp-saved-filters" aria-label="Project filters">
      <div className="mvp-saved-filter-toolbar">
        <label>Saved Filter
          <select
            aria-label="Select saved filter"
            value={activeFilterId || "temporary"}
            onChange={(event) => onSelectFilter(event.target.value === "temporary" ? null : event.target.value)}
          >
            <option value="temporary">Temporary filters</option>
            {savedFilters.map((filter) => <option key={filter.id} value={filter.id}>{filter.name}</option>)}
          </select>
        </label>
        <button className="sw-button" type="button" onClick={() => setExpanded((current) => !current)}>
          <FiPlus /> {expanded ? "Close filters" : "Add filter"}
        </button>
        <button className="sw-link" type="button" onClick={() => { onSelectFilter(null); onConditionsChange([]); resetEditor(); }} disabled={!conditions.length && !activeFilterId}>
          Clear
        </button>
      </div>

      {conditions.length > 0 && (
        <div className="mvp-condition-list" aria-label="Active conditions">
          {conditions.map((condition, index) => (
            <React.Fragment key={condition.id}>
              {index > 0 && <span className="mvp-condition-and">AND</span>}
              <div className="mvp-condition-chip">
                <span>{readableCondition(condition)}</span>
                <button type="button" aria-label={`Edit ${condition.path} filter`} onClick={() => editCondition(condition)}><FiEdit2 /></button>
                <button type="button" aria-label={`Remove ${condition.path} filter`} onClick={() => onConditionsChange(conditions.filter((item) => item.id !== condition.id))}><FiTrash2 /></button>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      {activeFilter && (
        <div className="mvp-saved-filter-actions">
          {isDirty && <button className="sw-button sw-primary" type="button" onClick={onSaveChanges}>Save changes</button>}
          <button className="sw-link" type="button" onClick={() => { setNameMode("rename"); setFilterName(activeFilter.name); }}>Rename</button>
          <button className="sw-link mvp-danger-link" type="button" onClick={() => setConfirmDelete(true)}>Delete</button>
          {confirmDelete && (
            <div className="mvp-filter-confirm" role="alert">
              <span>Delete “{activeFilter.name}”? {referenceCount ? `${referenceCount} dashboard widget${referenceCount === 1 ? "" : "s"} will show no data until assigned another filter.` : "This cannot be undone in this preview."}</span>
              <button className="sw-button" type="button" onClick={() => setConfirmDelete(false)}>Keep filter</button>
              <button className="sw-button sw-danger" type="button" onClick={() => { onDelete(activeFilter.id); setConfirmDelete(false); }}>Delete filter</button>
            </div>
          )}
        </div>
      )}

      {nameMode && (
        <form className="mvp-filter-name-form" onSubmit={saveNamedFilter}>
          <label htmlFor="mvp-filter-name">{nameMode === "rename" ? "Filter name" : "Save temporary filter as"}</label>
          <input id="mvp-filter-name" autoFocus value={filterName} maxLength={48} onChange={(event) => setFilterName(event.target.value)} required />
          <button className="sw-button sw-primary" type="submit">{nameMode === "rename" ? "Save name" : "Save Filter"}</button>
          <button className="sw-button" type="button" onClick={() => setNameMode("")}>Cancel</button>
        </form>
      )}

      {expanded && (
        <div className="mvp-filter-editor">
          <form onSubmit={submitCondition}>
            <div className="mvp-filter-property-field">
              <label htmlFor="mvp-filter-property-search">Property</label>
              <input
                id="mvp-filter-property-search"
                type="search"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="mvp-filter-property-options"
                list="mvp-filter-property-options"
                placeholder="Search or enter a property path"
                value={path || propertySearch}
                onChange={(event) => {
                  const next = event.target.value;
                  setPath(next);
                  setPropertySearch(next);
                  const found = properties.find((item) => item.path === next.trim());
                  if (found) choosePath(found.path);
                }}
              />
              <datalist id="mvp-filter-property-options">
                {visibleProperties.map((item) => <option key={item.path} value={item.path}>{item.type}</option>)}
              </datalist>
              <span>{property ? `Detected ${property.type}` : "Custom property path · type this event has not sent yet"}</span>
            </div>
            {(!property || property.type === "mixed") && (
              <label>Value type
                <select value={manualType} onChange={(event) => { setManualType(event.target.value); setOperator((PROPERTY_OPERATORS[event.target.value] || [])[0] || "exists"); }}>
                  <option value="string">String</option><option value="number">Number</option><option value="boolean">Boolean</option>
                </select>
              </label>
            )}
            <label>Operator
              <select value={operator} onChange={(event) => setOperator(event.target.value)}>
                {operators.map((item) => <option key={item} value={item}>{OPERATOR_LABELS[item]}</option>)}
              </select>
            </label>
            {!([...UNIVERSAL_OPERATORS, "is_true", "is_false"].includes(operator)) && type === "string" && (
              <label>Value
                <input value={value} onChange={(event) => setValue(event.target.value)} list="mvp-filter-string-values" autoComplete="off" />
                <datalist id="mvp-filter-string-values">{stringSuggestions.map((item) => <option key={item} value={item} />)}</datalist>
              </label>
            )}
            {!([...UNIVERSAL_OPERATORS, "is_true", "is_false"].includes(operator)) && type === "number" && (
              <label>Value<input type="number" step="any" value={value} onChange={(event) => setValue(event.target.value)} required /></label>
            )}
            <button className="sw-button sw-primary" type="submit" disabled={!path.trim()}>{editingId ? "Update condition" : "Add condition"}</button>
            {editingId && <button className="sw-link" type="button" onClick={resetEditor}>Cancel edit</button>}
          </form>
          {conditions.length > 0 && <p className="mvp-filter-join-note">Conditions combine with AND.</p>}
        </div>
      )}

      {!activeFilterId && conditions.length > 0 && !nameMode && (
        <button className="sw-button" type="button" onClick={() => { setNameMode("create"); setFilterName(""); }}>Save Filter</button>
      )}
      {activeFilter && !isDirty && <span className="mvp-filter-shared-note">Project Saved Filter · browser preview storage</span>}
    </section>
  );
}
