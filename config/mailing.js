const nodeMailer = require("nodemailer");
require("dotenv").config();
const { open, close, readFileSync, existsSync } = require("fs");
const htmlToText = require("html-to-text");
const ejs = require("ejs");
const juice = require("juice");
const path = require('path');
const { createOtp } = require('./otp_authentication')
const Otp = require('../models/otp')

const transport = nodeMailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: process.env.MAIL_SERVICE_EMAIL,
    pass: process.env.MAIL_SERVICE_PASSWORD
  }
});


const createTemplate = async ({ templateVars, ...others }) => {
  const templatePath = path.join(__dirname, `../views/mail.ejs`);
  const options = { ...others };
  if (existsSync(templatePath)) {
    const template = readFileSync(templatePath, "utf-8");
    const html = ejs.render(template, templateVars);
    const text = htmlToText.compile()(html);
    const htmlWithStylesInlined = juice(html);
    options.html = htmlWithStylesInlined;
    options.text = text;

    return {
      text: text,
      html: htmlWithStylesInlined,
      options: { ...others }
    }
  } 
  throw Error("file does not exist")

};

async function sendMail(email) {

  const code = createOtp()
  const template = await createTemplate({ templateVars: { code } })

  try {
    const otp = await Otp.create({ code, email });
    transport.sendMail({
      to: email,
      from: 'Coded Developers <codeddeveloper@auth.com>',
      subject: 'Email Authentication',
      html: template.html,
    })
  } catch (error) {
    console.log(error.message);
    throw error
  }

}

module.exports.sendMail = sendMail;
