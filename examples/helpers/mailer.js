const nodemailer = require("nodemailer");

module.exports = mailer = async (emails, subject, text, html) => {
  let transporter = nodemailer.createTransport({
    host: "SMTP_CONFIG",
    port: "POSRT_CONFIG",
    secure: true, // true for 465, false for other ports
    auth: {
      user: "EMAIL_CONFIG",
      pass: "PASS_CONFIG",
    },
  });

  // send mail with defined transport object
  transporter.sendMail({
    from: '"LTD name" <"EMAIL_CONFIG">',
    to: emails,
    subject,
    text,
    html,
  });
};
