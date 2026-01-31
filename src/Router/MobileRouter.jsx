import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useScreen } from '../Context/ScreenProvider'
const MobileRouter = () => {
    const {width} = useScreen();
    const navigate = useNavigate();
    useEffect(()=>{
        if(width > 1024){
            navigate("/",{replace : true})
        }
    },[width])

  return (
    <>
      <Outlet/>
    </>
  )
}

export default MobileRouter
