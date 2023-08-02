// from register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';

import styles from '../styles/Username.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState('');

  const formik = useFormik({
    initialValues: {
      email: 'doyol56239@cnogs.com',
      username: 'example123',
      password: 'admin@123',
    },
    validate: registerValidation,
    onSubmit: async (values) => {
      values.profile = file;
      const registerPromise = registerUser(values);

      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: 'Register Successfully...!',
        error: 'Could not Register.',
      });

      try {
        await registerPromise;
        navigate('/');
      } catch (error) {
        // Handle specific errors if needed
      }
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  const onUpload = async (e) => {
    try {
      const base64 = await convertToBase64(e.target.files[0]);
      setFile(base64);
    } catch (error) {
      toast.error('Error uploading image.');
      setFile('');
    }
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: '45%', paddingTop: '3em' }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">Happy to join you!</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>

              <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps('email')}
                className={styles.textbox}
                type="text"
                placeholder="Email*"
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-500">{formik.errors.email}</span>
              )}

              <input
                {...formik.getFieldProps('username')}
                className={styles.textbox}
                type="text"
                placeholder="Username*"
              />
              {formik.touched.username && formik.errors.username && (
                <span className="text-red-500">{formik.errors.username}</span>
              )}

              <input
                {...formik.getFieldProps('password')}
                className={styles.textbox}
                type="password"
                placeholder="Password*"
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-500">{formik.errors.password}</span>
              )}

              <button className={styles.btn} type="submit">
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered?{' '}
                <Link className="text-red-500" to="/">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


// { registerValidation } from validate.js
/** validate reset password */
export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values);

    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error("Password not match...!");
    }

    return errors;
}

// convertToBase64 from convert.js
/** image onto base64 */
export default function convertToBase64(file){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}

// { registerUser }  from helper.js
/**  register user function */
export async function registerUser(credentials){
    try {
        const { data : { msg }, status } = await axios.post(`/api/register`, credentials);

        let { username, email } = credentials;

        /** send email */
        if(status === 201){
            await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
        }

        return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({ error })
    }
}


// backend

// Server.js

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors()); // Allow requests from all origins. Replace with allowedOrigins configuration if needed.
app.use(morgan('tiny'));
app.disable('x-powered-by');

// CORS setup
const allowedOrigins = ['http://localhost:3000']; // Add your frontend origin here
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
};

app.use(cors(corsOptions));

// HTTP GET Request
app.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// API routes
app.use('/api', router);

const port = 8080;

// Connect to the database and start the server
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Invalid database connection...!");
  });


// from route.js
/** POST Methods */
router.route('/register').post(controller.register); // register user

// from appController.js
export async function register(req, res) {
    try {
      const { username, password, profile, email } = req.body;

      // check the existing user
      const existUsername = await UserModel.findOne({ username });
      //if there is a similar user
      if (existUsername) {
        return res.status(400).send({ error: "Please use unique username" });
      }

      // check for existing email
      const existEmail = await UserModel.findOne({ email });
      if (existEmail) {
        return res.status(400).send({ error: "Please use unique Email" });
      }

      // hash the password
      if(!password){
        return res.status(400).send({ error: "Please enter an email" });
      } else{
        //encript the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // then create a mongodb user model
        const user = new UserModel({
          username,
          password: hashedPassword,
          profile: profile || '',
          email
        });
        // save the user details
        const result = await user.save();
        // show that a user was created
        console.log(result);

        return res.status(201).send({ msg: "User Register Successfully" });
      }

    } catch (error) {
      return res.status(500).send({ error: "Internal Server Error" });
    }
}

// from usermodel
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required : [true, "Please provide unique Username"],
        unique: [true, "Username Exist"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique : false,
    },
    email: {
        type: String,
        required : [true, "Please provide a unique email"],
        unique: true,
    },
    firstName: { type: String},
    lastName: { type: String},
    mobile : { type : Number},
    address: { type: String},
    profile: { type: String}
});

export default mongoose.model.Users || mongoose.model('User', UserSchema);