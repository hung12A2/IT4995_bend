const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

export const sendEmail = async (email: any, subject: any, text: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: 'gmail',
      auth: {
        user: 'hung1311197820022@gmail.com',
        pass: 'mvza fmtv fbsc gsig',
      },
    });


    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve('./src/views/'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./src/views/'),
    };

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions));

    await transporter.sendMail({
      from: 'hung1311197820022@gmail.com',
      to: email,
      subject: subject,
      template: 'email', // the name of the template file i.e email.handlebars
      context: {
        link: text, // replace {{name}} with Adebola
      },
    });

    console.log('email sent sucessfully');
  } catch (error) {
    console.log(error, 'email not sent');
  }
};
