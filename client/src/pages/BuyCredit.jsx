import React from 'react'
import { assets, plans } from '../assets/assets'

const BuyCredit = () => {
  return (
    <div className="min-h-[80vh] pt-14 mb-16 text-center px-4 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <button className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-2 rounded-full text-sm mb-6 shadow-md hover:shadow-lg transition">
        Our Plans
      </button>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent leading-tight mb-10">
        Choose the plan that's right for you
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((item, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full sm:w-[300px] md:w-[320px] hover:scale-105 transition-transform duration-500"
          >
            <img src={assets.logo_icon} alt="Logo" width={40} className="mb-4" />
            
            <p className="font-semibold text-lg text-gray-800 mb-1">{item.id}</p>
            <p className="text-sm text-gray-600">{item.desc}</p>

            <div className="mt-6 text-gray-800">
              <span className="text-3xl font-bold">${item.price}</span>
              <span className="text-sm text-gray-500"> / {item.credits} credits</span>
            </div>

            <button className="w-full bg-gray-900 text-white text-sm rounded-md py-2.5 mt-6 hover:bg-gray-800 transition">
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuyCredit
