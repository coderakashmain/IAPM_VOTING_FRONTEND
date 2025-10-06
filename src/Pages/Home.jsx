import React, { useEffect } from 'react'
import Header from '../Components/Header'
import Hero from '../Components/Hero'
import AuthService from '../APIs/authService'


const Home = () => {
  useEffect(()=>{
    AuthService.logout();
  },[])
  return (
    <>
      <Header />
      <Hero />
    </>
  )
}

export default Home