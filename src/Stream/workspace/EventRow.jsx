import React from "react";
import { FiChevronRight } from "react-icons/fi";

export function eventTime(timestamp) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toISOString().slice(11, 23);
}

function preview(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return `${value.length} ${value.length === 1 ? "item" : "items"}`;
  if (typeof value === "object") {
    const count = Object.keys(value).length;
    return `${count} ${count === 1 ? "field" : "fields"}`;
  }
  return String(value);
}

// A catalog unit is a label next to the stored value; the value itself is never converted.
const withUnit = (value, definition) => (definition?.unit && typeof value === "number" ? `${preview(value)} ${definition.unit}` : preview(value));

export default function EventRow({ event, onInspect, definitions }) {
  const date = new Date(event.timestamp);
  const properties = Object.entries(event.properties || {});
  return (
    <tr>
      <td>
        <button className="st-time-button" onClick={onInspect} title={event.timestamp}>
          <time dateTime={event.timestamp}>{eventTime(event.timestamp)}</time>
          <small>{Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" })}</small>
        </button>
      </td>
      <td><button className="sw-link sw-mono" onClick={onInspect}>{event.event}</button></td>
      <td>
        <div className="st-property-preview">
          {event.device_id || event.session_id ? (
            <div className="st-event-context">
              <span>Device <b>{event.device_id || "Unspecified"}</b></span>
              <span>Session <b>{event.session_id || "Unspecified"}</b></span>
            </div>
          ) : <span className="st-event-context-unspecified">Context unspecified</span>}
          {properties.slice(0, 3).map(([name, value]) => (
            <span key={name} title={`${name}: ${preview(value)}${definitions?.get(name)?.description ? ` — ${definitions.get(name).description}` : ""}`}><em>{name}</em><b>{withUnit(value, definitions?.get(name))}</b></span>
          ))}
          {properties.length > 3 && <button className="st-more-properties" aria-label={`Show all properties for ${event.event} at ${eventTime(event.timestamp)}`} onClick={onInspect}>+{properties.length - 3}</button>}
          {!properties.length && <span className="st-no-properties">No properties</span>}
        </div>
      </td>
      <td><button className="sw-icon-button" aria-label={`Inspect ${event.event} at ${eventTime(event.timestamp)}`} onClick={onInspect}><FiChevronRight /></button></td>
    </tr>
  );
}
