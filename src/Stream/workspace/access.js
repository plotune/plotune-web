import { createContext } from "react";

// Workspace roles as Stream applies them (contract section 4): Owner and Admin manage the capture
// key, webhooks and path rules; Member writes shared filters, dashboards and the catalog; Viewer
// only reads and sees no webhooks. The API enforces the same table; the UI hides what a role cannot use.
export const canManageStream = (role) => role === "Owner" || role === "Admin";
export const canWriteStream = (role) => ["Owner", "Admin", "Member"].includes(role);
export const canSeeWebhooks = (role) => role !== "Viewer";

// Provided by the Stream workspace: true for a Viewer, so shared-write controls are not offered.
export const ReadOnlyContext = createContext(false);
