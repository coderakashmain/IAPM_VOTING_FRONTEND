import React from 'react'

const Popup = ({children}) => {
  return (
    <section id='popup' className='fixed text-white top-0 left-0 h-screen w-full z-1000 bg-lightColor flex items-center justify-center'>
        {children}
    </section>
  )
}

export default Popup
