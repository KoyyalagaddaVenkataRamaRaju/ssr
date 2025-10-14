import React from 'react'
import Navbar from '../components/Navbar'
import NewsScroller from '../components/NewsScroller'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'

function Home() {
  return (
    <div>
      <Navbar/>
      <NewsScroller/>
      <HeroSection/>
      <Footer/>
    </div>
  )
}

export default Home
