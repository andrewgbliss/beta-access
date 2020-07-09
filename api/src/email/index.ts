import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';

const HOST = process.env.HOST;

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY || 'abc123',
    domain: process.env.MAILGUN_DOMAIN || 'localhost',
  },
};

const transporter = nodemailer.createTransport(mg(auth));

function sendMail(options) {
  return new Promise((resolve) => {
    transporter.sendMail(options, () => {
      return resolve();
    });
  });
}

const from = '"Support" <support@gmail.com>';

export default {
  register(to, hash) {
    const link = `${HOST}/register/complete/${hash}`;
    const options = {
      from,
      to,
      subject: 'Welcome To Website! Confirm Your Email',
      text: `Go here to confirm ${link}`,
      html: `<a href="${link}">Click here to confirm</a>`,
    };
    return sendMail(options);
  },
  resetPassword(to, hash) {
    const link = `${HOST}/reset-password/verify/${hash}`;
    const options = {
      from,
      to,
      subject: 'Reset Your Password',
      text: `Go here to reset your password ${link}`,
      html: `<a href="${link}">Click here to reset your password</a>`,
    };
    return sendMail(options);
  },
};
