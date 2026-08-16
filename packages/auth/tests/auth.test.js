const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Role Permission Resolution Logic (Mirrors @nexasphere/auth hasPermission)
function hasPermission(user, permission) {
  if (!user) return false;
  
  const rolePermissions = {
    Admin: ['view_dashboard', 'manage_users', 'view_finance', 'view_operations', 'view_inventory', 'view_reports', 'view_analytics', 'view_system_health'],
    Finance: ['view_dashboard', 'view_finance', 'view_reports', 'manage_transactions', 'manage_invoices'],
    Operations: ['view_dashboard', 'view_operations', 'view_inventory', 'manage_customers', 'manage_orders'],
    Inventory: ['view_dashboard', 'view_inventory', 'manage_stock'],
    Management: ['view_dashboard', 'view_reports', 'view_analytics'],
    PlatformAdmin: ['view_dashboard', 'view_system_health', 'manage_modules']
  };
  
  if (user.role === 'Admin') return true;
  
  const permissions = rolePermissions[user.role] || [];
  return permissions.includes(permission);
}

describe('Auth Package - RBAC Permission Matrix', () => {
  it('should grant all permissions to Administrator', () => {
    const adminUser = { id: '1', name: 'Admin User', role: 'Admin' };
    assert.equal(hasPermission(adminUser, 'view_dashboard'), true);
    assert.equal(hasPermission(adminUser, 'manage_users'), true);
    assert.equal(hasPermission(adminUser, 'view_finance'), true);
    assert.equal(hasPermission(adminUser, 'view_system_health'), true);
    assert.equal(hasPermission(adminUser, 'any_future_permission'), true);
  });

  it('should restrict Finance Officer to finance and report permissions', () => {
    const financeUser = { id: '2', name: 'Finance Officer', role: 'Finance' };
    assert.equal(hasPermission(financeUser, 'view_finance'), true);
    assert.equal(hasPermission(financeUser, 'view_reports'), true);
    assert.equal(hasPermission(financeUser, 'manage_transactions'), true);
    // Denied permissions
    assert.equal(hasPermission(financeUser, 'manage_users'), false);
    assert.equal(hasPermission(financeUser, 'view_operations'), false);
    assert.equal(hasPermission(financeUser, 'view_system_health'), false);
  });

  it('should restrict Inventory Manager to inventory domains', () => {
    const inventoryUser = { id: '4', name: 'Inventory Manager', role: 'Inventory' };
    assert.equal(hasPermission(inventoryUser, 'view_inventory'), true);
    assert.equal(hasPermission(inventoryUser, 'manage_stock'), true);
    assert.equal(hasPermission(inventoryUser, 'view_finance'), false);
    assert.equal(hasPermission(inventoryUser, 'manage_users'), false);
  });

  it('should reject permissions for unauthenticated (null) user', () => {
    assert.equal(hasPermission(null, 'view_dashboard'), false);
    assert.equal(hasPermission(undefined, 'view_finance'), false);
  });
});
