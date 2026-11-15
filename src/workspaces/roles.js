// What each workspace role may do on the website (contract section 4). The API enforces the
// same table; the site only hides or disables what a role cannot use, and still handles 403.
export const ROLES = ['Owner', 'Admin', 'Member', 'Viewer'];
export const ASSIGNABLE_ROLES = ['Admin', 'Member', 'Viewer'];

export const ROLE_DESCRIPTIONS = {
  Owner: 'Full control, including deleting the workspace and transferring ownership.',
  Admin: 'Manages projects, services and people. Cannot delete the workspace or change the owner.',
  Member: 'Works in the projects. Can look at settings but not change them.',
  Viewer: 'Read-only access everywhere.',
};

export const isKnownRole = (role) => ROLES.includes(role);

export const canManage = (role) => role === 'Owner' || role === 'Admin';
export const isOwner = (role) => role === 'Owner';

export const OWNER_ONLY_REASON = 'Only the workspace owner can do this.';
export const READ_ONLY_NOTICE = 'You can see this workspace but not change it. Ask an owner or admin to make changes.';

// Can the signed-in role change or remove this person (or pending invite)?
// Nobody changes the owner row; the owner changes it only by transferring ownership.
export function canEditPerson(actorRole, targetRole) {
  if (!canManage(actorRole)) return false;
  if (targetRole === 'Owner') return false;
  return isKnownRole(targetRole);
}
