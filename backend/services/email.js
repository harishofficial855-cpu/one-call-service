import nodemailer from 'nodemailer';

const getSmtpConfiguration = () => {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;

  if (!host || !Number.isInteger(port) || port < 1 || port > 65535 || !user || !password) {
    return null;
  }

  return { host, port, user, password };
};

export const isEmailConfigured = () => Boolean(getSmtpConfiguration());

export const sendAdminPasswordResetCode = async (email, code) => {
  const configuration = getSmtpConfiguration();
  if (!configuration) {
    throw new Error('SMTP configuration is incomplete');
  }

  const transporter = nodemailer.createTransport({
    host: configuration.host,
    port: configuration.port,
    secure: configuration.port === 465,
    requireTLS: configuration.port !== 465,
    auth: { user: configuration.user, pass: configuration.password },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  await transporter.sendMail({
    from: configuration.user,
    to: email,
    subject: 'One Call Service admin password reset',
    text: `Your admin password reset code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
  });
};
