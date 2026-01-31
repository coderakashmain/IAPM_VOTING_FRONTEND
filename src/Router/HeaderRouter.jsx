import React from 'react'
import { Outlet } from 'react-router'
import Header from '../Components/Header'

const HeaderRouter = () => {
  return (
      <>
      <Header/>
      <Outlet/>
    </>
  )
}

export default HeaderRouter
