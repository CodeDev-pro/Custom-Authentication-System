const nodeMailer = require("nodemailer");
require("dotenv").config();
const { open, close, readFileSync, existsSync } = require("fs");
const htmlToText = require("html-to-text");
const ejs = require("ejs");
const juice = require("juice");

const transporter = nodeMailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure: false,
  auth: {
    user: "eb5e3e868570e05de2f3621e392002df",
    pass: "d476200347c636b1b2a904a31f80d220",
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const sendMail = async ({
  template: templateName,
  templateVars,
  ...others
}) => {
  const templatePath = `../views/mail.ejs`;
  const options = { ...others };
  if (templateName && existsSync(templatePath)) {
    const template = readFileSync(templatePath, "utf-8");
    const html = ejs.render(template, templateVars);
    const text = htmlToText.compile(html);
    const htmlWithStylesInlined = juice(html);
    options.html = htmlWithStylesInlined;
    options.text = text;
  }

  return transporter.sendMail(options);
};

const send = async () => {
  try {
    const result = await sendMail({
      to: "emmanuelstanley753@gmail.com",
      from: "codedev-pro@no-reply.com",
      subject: "test",
      template: "send_email",
      templateVars: {
        timestamp: Date.now(),
      },
    });
    console.log(result)
  } catch (error) {
    console.log(error);
  }
};

send()
