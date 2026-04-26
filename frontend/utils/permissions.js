/**
 * =====================================================
 * 🔐 RBAC HELPERS
 * =====================================================
 */

/**
 * 🔹 Verificar role
 */
export function hasRole(user, roles = []) {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * 🔹 Verificar permissão
 */
export function hasPermission(user, permission) {
  if (!user) return false;
  return user.permissions?.includes(permission);
}