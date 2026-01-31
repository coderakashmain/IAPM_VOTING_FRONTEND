import React, { lazy, Suspense, useEffect } from 'react'
const Hero = lazy(() => import('../Components/Hero'))
import AuthService from '../APIs/authService'
import Loader from '../Components/Fallback/Loader'
import { Outlet } from 'react-router'


const Home = () => {
  useEffect(() => {
    AuthService.logout();
  }, [])
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Hero />
      </Suspense>
    </>
  )
}

export default Home