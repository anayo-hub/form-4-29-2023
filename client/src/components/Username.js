import React from 'react';
import { Link } from 'react-router-dom';
import avatar from '../asset/profile.png';
import styles from '../styles/Username.module.css';
//form lib
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate';

//form middlewares

function Username() {

  const formik = useFormik({
    initialValues:{
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values =>{
      console.log(values);
    }
  })


  return (

    <div className="flex h-screen items-center justify-center">
      <div className={`${styles.glass} my-8`}>
      <Toaster position='top-center' reverseOrder={false} containerStyle={{
              position: 'relative',
            }}
            toastOptions={{
              // Define default options
              className: '',
              duration: 2000,
              style: {
                background: '#991b1b',
                color: '#fff',
              }
            }} ></Toaster>
        <div className="title flex flex-col items-center">
          <h4 className='text-5xl font-bold'>Hello Again!</h4>
          <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
            Explore More by connecting with us.
          </span>
        </div>
        <form className='py-1' onSubmit={formik.handleSubmit}>
          <div className='profile flex justify-center py-4'>
            <img src={avatar} alt="avatar" className="h-32 w-32 rounded-full" />
          </div>
          <div className="textbox flex flex-col items-center gap-6">
            <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username' />
            <button className={styles.btn} type='submit'>Let's Go</button>
          </div>

          <div className="text-center py-4">
            <span className='text-gray-500'>Not a Member <Link className='text-red-500' to="/register">Register Now</Link></span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Username;
