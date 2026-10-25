import { Resend } from 'resend';

const getResendConfiguration = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
};

export const isEmailConfigured = () => Boolean(getResendConfiguration());

export const sendAdminPasswordResetCode = async (email, code, createClient = (apiKey) => new Resend(apiKey)) => {
  const configuration = getResendConfiguration();
  if (!configuration) {
    throw new Error('Resend configuration is incomplete');
  }

  const resend = createClient(configuration.apiKey);
  const { error } = await resend.emails.send({
    from: configuration.from,
    to: email,
    subject: 'One Call Service admin password reset',
    text: `Your admin password reset code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `<p>Your admin password reset code is <strong>${code}</strong>. It expires in 10 minutes. If you did not request this, ignore this email.</p>`,
  });

  if (error) {
    throw new Error('Resend email delivery failed');
  }
};
