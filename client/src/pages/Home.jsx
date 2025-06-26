import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import BgSlider from '../components/BgSlider'
import Testimonials from '../components/Testimonials'
import Uploader from '../components/Uploader'

const Home = () => {
  return (
    <div>
      <Header />
      <Steps />
      <BgSlider />
      <Testimonials />
      <Uploader />
    </div>
  )
}

export default Home
