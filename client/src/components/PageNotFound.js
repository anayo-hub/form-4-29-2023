import React from 'react'

import { Link} from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div className="container h-screen">

    <div className='flex justify-center items-center h-screen'>

        <div className="title flex flex-col items-center">
          <h4 className='text-5xl font-bold'>Feeling Lost</h4>
          <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
             Please check your url or go back to homepage
          </span>
          This Page is not Avialble
                <div className="text-center py-4">
                <span className='text-gray-500'>Home<Link className='text-red-500' to="/"> Now</Link></span>
      </div>
        </div>
      </div>
    </div>
  )
}