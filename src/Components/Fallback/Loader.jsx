import React from 'react'
import './Loader.css'

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-ring">
        <span style={{color : 'black'}} className='relative text-[9px] select-none'>Loading...</span>
      </div>
    </div>
  )
}

export default Loader
