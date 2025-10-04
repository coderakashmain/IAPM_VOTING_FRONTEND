import React from 'react'

const Loader = () => {
  return (
    <div className='fixed top-0 left-0 h-screen w-full z-1000 bg-lightColor flex items-center justify-center'>
      <p className='text-white text-sm'>Loading....</p>
    </div>
  )
}

export default Loader
