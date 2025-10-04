import React from 'react'
import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

const BackButton = () => {
    const navigate = useNavigate();
   
    
    const handlenavigate = ()=>{
        navigate(-1);
    }
  return (
    <div onClick={handlenavigate} className='active fixed top-2 left-2 bg-white w-15 h-10 rounded-xl cursor-pointer text-black flex items-center justify-center z-100'>
        <MoveLeft />
    </div>
  )
}

export default BackButton
