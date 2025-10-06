import React from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

const BackButton = React.memo(({ replace = false, fallback = '/',custumeNavigate }) => {
  const navigate = useNavigate();


  const handleNavigate = () => {
    if (replace && typeof custumeNavigate === 'function') {
      custumeNavigate();
    } else {
      // if (window.history.length > 1) {
        navigate(-1);
      // } else {
      //   navigate(fallback);
      // }
    }

  };

  return (
    <div onClick={handleNavigate} className='active fixed top-2 left-2 bg-white w-15 h-10 rounded-xl cursor-pointer text-black flex items-center justify-center z-100'>
      <MoveLeft />
    </div>
  )
})

export default BackButton
