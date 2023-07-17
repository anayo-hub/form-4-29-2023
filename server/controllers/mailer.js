import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import fs from 'fs';
import ENV from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  let config = {
    service: 'gmail',
    auth: {
      user: ENV.EMAIL,
      pass: ENV.PASSWORD
    }
  };

  let transporter = nodemailer.createTransport(config);

  const imagePath = join(__dirname, 'logo.png');

  // Read the image file and encode it as Base64
  const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "SonicDevs",
      link: 'https://mailgen.js/',
      // Custom product logo
      logo: {
        path: 'cid:logo-image',
        cid: 'logo-image'
      },
      // Custom logo height
      logoHeight: '60px'
    }
  });

  let response = {
    body: {
      name: username,
      intro: text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
      logo: {
        // Image block with the logo
        path: 'cid:logo-image',
        width: '100%',
        align: 'center'
      }
    }
  };

  let emailBody = MailGenerator.generate(response);

  let message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || "Signup Successful",
    html: emailBody,
    attachments: [{
      filename: 'logo.png',
      path: imagePath,
      cid: 'logo-image'
    }]
  };

  transporter.sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "You should receive an email from us."
      });
    })
    .catch(error => {
      return res.status(500).json({ error });
    });
};






// import nodemailer from 'nodemailer';
// import Mailgen from 'mailgen';
// import ENV from '../config.js';

// export const registerMail = async (req, res) => {

//     const { username, userEmail, text, subject } = req.body;

//     let config = {
//         service : 'gmail',
//         auth : {
//             user: ENV.EMAIL,
//             pass: ENV.PASSWORD
//         }
//     }

//     let transporter = nodemailer.createTransport(config);

//     let MailGenerator = new Mailgen({
//         theme: "default",
//         product : {
//             name: "SonicDevs",
//             link : 'https://mailgen.js/'
//         }
//     })

//     let response = {

//         body : {
//             name: username,
//             intro : text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
//             outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
//         }
//     }

//     let emailBody = MailGenerator.generate(response)

//     let message = {
//         from : ENV.EMAIL,
//         to : userEmail,
//         subject : subject || "Signup Successful",
//         html: emailBody
//     }

//     transporter.sendMail(message).then(() => {
//         return res.status(201).json({
//             msg: "You should receive an email from us."
//         })
//     }).catch(error => {
//         return res.status(500).json({ error })
//     })

// }




// // https://ethereal.email/create
// let nodeConfig = {
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: ENV.EMAIL, // generated ethereal user
//         pass: ENV.PASSWORD, // generated ethereal password
//     }
// }

// let transporter = nodemailer.createTransport(nodeConfig);

// let MailGenerator = new Mailgen({
//     theme: "default",
//     product : {
//         name: "Mailgen",
//         link: 'https://mailgen.js/'
//     }
// })

// /** POST: http://localhost:8080/api/registerMail
//  * @param: {
//   "username" : "example123",
//   "userEmail" : "admin123",
//   "text" : "",
//   "subject" : "",
// }
// */
// export const registerMail = async (req, res) => {
//     const { username, userEmail, text, subject } = req.body;

//     // body of the email
//     var email = {
//         body : {
//             name: username,
//             intro : text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
//             outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
//         }
//     }

//     var emailBody = MailGenerator.generate(email);

//     let message = {
//         from : ENV.EMAIL,
//         to: userEmail,
//         subject : subject || "Signup Successful",
//         html : emailBody
//     }

//     // send mail
//     transporter.sendMail(message)
//         .then(() => {
//             return res.status(200).send({ msg: "You should receive an email from us."})
//         })
//         .catch(error => res.status(500).send({ error }))

// }