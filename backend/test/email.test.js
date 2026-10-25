import test from 'node:test';
import assert from 'node:assert/strict';
import { isEmailConfigured, sendAdminPasswordResetCode } from '../services/email.js';

const withEnvironment = async (values, callback) => {
  const originalEnvironment = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  };

  Object.assign(process.env, values);

  try {
    await callback();
  } finally {
    for (const [key, value] of Object.entries(originalEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
};

test('reports Resend as configured only when its API key and sender are set', async () => {
  await withEnvironment({ RESEND_API_KEY: '', RESEND_FROM_EMAIL: '' }, () => {
    assert.equal(isEmailConfigured(), false);
  });

  await withEnvironment(
    { RESEND_API_KEY: 'test-only-placeholder', RESEND_FROM_EMAIL: 'onboarding@resend.dev' },
    () => {
      assert.equal(isEmailConfigured(), true);
    }
  );
});

test('sends admin reset code through Resend using environment configuration', async () => {
  await withEnvironment(
    { RESEND_API_KEY: 'test-only-placeholder', RESEND_FROM_EMAIL: 'onboarding@resend.dev' },
    async () => {
      let receivedApiKey;
      let receivedMessage;
      await sendAdminPasswordResetCode('admin@example.com', '123456', (apiKey) => {
        receivedApiKey = apiKey;
        return {
          emails: {
            send: async (message) => {
              receivedMessage = message;
              return { data: { id: 'test-email-id' }, error: null };
            },
          },
        };
      });

      assert.equal(receivedApiKey, 'test-only-placeholder');
      assert.equal(receivedMessage.from, 'onboarding@resend.dev');
      assert.equal(receivedMessage.to, 'admin@example.com');
      assert.match(receivedMessage.text, /123456/);
      assert.match(receivedMessage.html, /123456/);
    }
  );
});

test('surfaces Resend API delivery errors', async () => {
  await withEnvironment(
    { RESEND_API_KEY: 'test-only-placeholder', RESEND_FROM_EMAIL: 'onboarding@resend.dev' },
    async () => {
      await assert.rejects(
        sendAdminPasswordResetCode('admin@example.com', '123456', () => ({
          emails: { send: async () => ({ data: null, error: { message: 'Rejected' } }) },
        })),
        /Resend email delivery failed/
      );
    }
  );
});
