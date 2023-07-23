import { fileURLToPath } from 'url';  // Importing 'fileURLToPath' function from the 'url' module
import { dirname, join } from 'path';  // Importing 'dirname' and 'join' functions from the 'path' module
import nodemailer from 'nodemailer';  // Importing 'nodemailer' package
import Mailgen from 'mailgen';  // Importing 'mailgen' package
import fs from 'fs';  // Importing 'fs' module for file system operations
import ENV from '../config.js';  // Importing the configuration file

const __filename = fileURLToPath(import.meta.url);  // Get the current file path
const __dirname = dirname(__filename);  // Get the current directory path

export const registerMail = async (req, res) => {  // Defining an asynchronous function 'registerMail' with 'req' and 'res' parameters
  const { username, userEmail, text, subject } = req.body;  // Extracting properties from the request body

  let config = {
    service: 'gmail',
    auth: {
      user: ENV.EMAIL,
      pass: ENV.PASSWORD
    }
  };  // Email service configuration object

  let transporter = nodemailer.createTransport(config);  // Creating a transporter object for sending emails

  const imagePath = join(__dirname, 'logo.png');  // Path to the logo image file

  const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });  // Read the image file and encode it as Base64

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "SonicDevs",
      link: 'https://mailgen.js/',
      logo: {
        path: 'cid:logo-image',
        content: imageBase64
      },
      logoHeight: '60px'
    }
  });  // Creating a new instance of Mailgen and configuring it

  let response = {
    body: {
      name: username,
      intro: `<div style="text-align: center;">
              <img src="cid:logo-image" alt="Company Logo" style="display: block; margin: 0 auto; max-width: 200px; max-height: 200px; margin-bottom: 20px;">
              </div>
              ${text || 'Welcome to Sonic devs! We\'re very excited to have you on board.'}`,
      outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  };  // Email body content

  let emailBody = MailGenerator.generate(response);  // Generate the HTML body of the email

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
  };  // Email message details

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