import React from 'react'
import { assets } from '../assets/assets'
import {Link} from 'react-router-dom'
import {useClerk, UserButton, useUser} from '@clerk/clerk-react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useEffect } from 'react'

const NavBar = () => {

  const {openSignIn}=useClerk()
  const {isSignedIn,user}=useUser()
  const {credit,loadCreditData}=useContext(AppContext)

  useEffect(()=>{
    if(isSignedIn){
      loadCreditData()
    }
    console.log(credit);
  },[isSignedIn])

  return (
    <div className='flex items-center justify-between mx-4 py-3 lg:mx-44'>
      <Link to={'/'}>
        <img src={assets.logo} alt="Logo" className="h-8 sm:h-10" />
      </Link>
      {
        isSignedIn 
        ?<div className='flex items-center gap-2 sm:gap-3'>
          <button className='flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700'>
            <img className='w-5' src={assets.credit_icon} alt=''/>
            <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits: {credit}</p>
          </button>
          <p className='text-gray-600 max-sm:hidden'>Hi, {user.fullName}</p>
          <UserButton/>
        </div>
        :<button onClick={()=>openSignIn({})} className='bg-zinc-800 text-white flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full'>
        <span>Get Started</span>
        <img className='w-4 sm:w-5' src={assets.arrow_icon} alt="Arrow" />
      </button>
      }
      
    </div>
  )
}

export default NavBar
