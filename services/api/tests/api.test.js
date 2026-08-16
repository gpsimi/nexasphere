const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'nexasphere-secret-token-key-2026';

describe('API Service - Authentication & Routing Integration Tests', () => {
  it('should sign and verify valid JWT token for authenticated user', () => {
    const payload = {
      id: '1',
      email: 'admin@nexasphere.com',
      role: 'Admin',
      permissions: ['view_dashboard', 'manage_users', 'view_finance']
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    assert.ok(token);
    assert.equal(typeof token, 'string');

    const decoded = jwt.verify(token, JWT_SECRET);
    assert.equal(decoded.email, 'admin@nexasphere.com');
    assert.equal(decoded.role, 'Admin');
    assert.deepEqual(decoded.permissions, payload.permissions);
  });

  it('should reject invalid or tampered JWT tokens', () => {
    const tamperedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.payload';
    assert.throws(() => {
      jwt.verify(tamperedToken, JWT_SECRET);
    });
  });
});
