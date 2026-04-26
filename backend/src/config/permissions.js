/**
 * =====================================================
 * 🔐 ROLES
 * =====================================================
 */
const ROLES = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  VIEWER: "VIEWER",
};

/**
 * =====================================================
 * 🔐 PERMISSIONS
 * =====================================================
 */
const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  CREATE_POST: "create_post",
  UPDATE_POST: "update_post",
  DELETE_POST: "delete_post",
  APPROVE_POST: "approve_post",
  VIEW_LEADS: "view_leads",
};

/**
 * =====================================================
 * 🔐 ROLE PERMISSIONS (RBAC)
 * =====================================================
 */
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),

  [ROLES.EDITOR]: [
    PERMISSIONS.CREATE_POST,
    PERMISSIONS.UPDATE_POST,
    PERMISSIONS.VIEW_DASHBOARD,
  ],

  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
  ],
};

/**
 * =====================================================
 * 📦 EXPORTAÇÃO CORRETA
 * =====================================================
 */
module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
};