import React from 'react'
import { assets } from '../assets/assets'
import {Link} from 'react-router-dom'

const NavBar = () => {
  return (
    <div className='flex items-center justify-between mx-4 py-3 lg:mx-44'>
      <Link to={'/'}>
        <img src={assets.logo} alt="Logo" className="h-8 sm:h-10" />
      </Link>
      <button className='bg-zinc-800 text-white flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full'>
        <span>Get Started</span>
        <img className='w-4 sm:w-5' src={assets.arrow_icon} alt="Arrow" />
      </button>
    </div>
  )
}

export default NavBar
