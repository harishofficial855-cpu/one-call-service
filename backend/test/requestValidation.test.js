import test from 'node:test';
import assert from 'node:assert/strict';
import { hasOnlyAllowedFields } from '../utils/requestValidation.js';

test('accepts request objects containing only allowed fields', () => {
  assert.equal(hasOnlyAllowedFields({ email: 'admin@example.com' }, ['email']), true);
});

test('rejects field names that are not explicitly allowed', () => {
  assert.equal(hasOnlyAllowedFields({ email: 'admin@example.com', extra: true }, ['email']), false);
  assert.equal(hasOnlyAllowedFields({ 'email.': 'admin@example.com' }, ['email']), false);
  assert.equal(hasOnlyAllowedFields({ 'email.value': 'admin@example.com' }, ['email']), false);
  assert.equal(hasOnlyAllowedFields({ '$set': { passwordHash: 'not-used' } }, ['email']), false);
  assert.equal(
    hasOnlyAllowedFields(
      { email: 'admin@example.com', code: '123456', 'newPassword.': 'not-used' },
      ['email', 'code', 'newPassword']
    ),
    false
  );
});

test('rejects non-object and non-plain request bodies', () => {
  assert.equal(hasOnlyAllowedFields(null, ['email']), false);
  assert.equal(hasOnlyAllowedFields([], ['email']), false);
  assert.equal(hasOnlyAllowedFields('admin@example.com', ['email']), false);
  assert.equal(hasOnlyAllowedFields(Object.create({ email: 'admin@example.com' }), ['email']), false);
});
