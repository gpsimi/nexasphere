const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// EventBus implementation for Node / Browser test harness
class MicroFrontendEventBus {
  constructor() {
    this.listeners = new Map();
  }

  publish(event, data) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const handlers = this.listeners.get(event) || [];
      this.listeners.set(event, handlers.filter(h => h !== callback));
    };
  }
}

function formatCurrency(amount, currency = 'NGN') {
  if (typeof amount !== 'number' || isNaN(amount)) return '₦0.00';
  return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

describe('Utils Package - EventBus & Helpers', () => {
  it('should deliver notifications across decoupled micro-frontends via EventBus', () => {
    const bus = new MicroFrontendEventBus();
    let receivedPayload = null;

    // Shell subscribes to NOTIFICATION_RECEIVED
    const unsubscribe = bus.subscribe('NOTIFICATION_RECEIVED', (payload) => {
      receivedPayload = payload;
    });

    // Finance MFE publishes transaction event
    bus.publish('NOTIFICATION_RECEIVED', {
      message: 'Invoice TXN-88092 created',
      type: 'Success',
      amount: 145000
    });

    assert.deepEqual(receivedPayload, {
      message: 'Invoice TXN-88092 created',
      type: 'Success',
      amount: 145000
    });

    // Clean up subscription
    unsubscribe();
    receivedPayload = null;
    bus.publish('NOTIFICATION_RECEIVED', { message: 'After unsubscribe' });
    assert.equal(receivedPayload, null);
  });

  it('should format enterprise financial currency correctly', () => {
    assert.equal(formatCurrency(145000), '₦145,000.00');
    assert.equal(formatCurrency(1200000), '₦1,200,000.00');
    assert.equal(formatCurrency(0), '₦0.00');
    assert.equal(formatCurrency(null), '₦0.00');
  });
});
