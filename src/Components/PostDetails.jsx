import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import formatElectionDates from './DateTime';
import CandidateGrid from './CandidateGrid';
import { MousePointerClick } from 'lucide-react'
import { useScreen } from '../Context/ScreenProvider';
const PostDetails = () => {
  const location = useLocation();
  const { data } = location.state || {};
  const navigate = useNavigate();
  const { width } = useScreen();
  const handlenavigate = (data) => {

    sessionStorage.setItem("electionId", data.election_id);
    sessionStorage.setItem("postId", data.post_id);
    navigate('/voting')
  }


  if (!data) return null;

  return (
    <div className={` ${width <= 1024 ? " container pt-8" : 'pt-0'}`}>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl md:text-2xl mb-2'>{data.organization_name} </h2>


      </div>
      <p className='mt-2 text-sm mb-4'> <span className='font-bold'></span> {data.about_organization}</p>
      <p className='mt-2 text-sm '> <span className='font-bold'>
        Start Time :</span> {formatElectionDates(data.election_start)} </p>
      <p className='mt-2 text-sm '> <span className='font-bold'>
        End Time :</span> {formatElectionDates(data.election_end)} </p>


      <h3 className='mt-6 text-md mb-5  '>Active Positions</h3>
      {data?.posts?.length > 0 && data?.posts?.map((post, index) => (
        <div key={index} className={`rounded-xl ${width > 1024 ? "shadow-md border border-bg" : ''} p-5 pt-8 mb-10 bg-white `}>
          <div className='flex items-center gap-4 mb-8 justify-between'>
            <div className='flex items-center gap-4'>

              <div className='bg-primary h-8 w-8 flex justify-center items-center rounded-sm text-alwaysWhite font-bold text-sm md:text-md xl:text-lg'>
                {index + 1}
              </div>
              <p className=' text-md md:text-xl font-semibold'> {post.post_name}</p>
            </div>
            {data.active && (<div className='   border-2 border-primary bg-white text-primary select-none  rounded-2xl px-2 py-1 text-xs flex items-center gap-1'> <div className='h-2 w-2 rounded-full bg-primary'></div> <span >Active</span></div>)}
          </div>
          <p className='mt-2 text-sm text-gray-50 '> <span className='font-bold'>Post Category :</span> {post.post}</p>
          {post.post_about && (<p className='text-xs md:text-sm mb-9 mt-2'>{post.post_about}</p>)}

          <div className='mt-5  flex'>

            <button onClick={() => handlenavigate(post)} className='active btn  !text-xs !rounded-md font-semibold bg-primary text-white py-1 px-3  cursor-pointer flex gap-1'>Let's Vote <MousePointerClick size={17} className='text-xs' /></button>

          </div>

          <h3 className='mt-6 mb-6'>Candidates</h3>
          <CandidateGrid candidates={post.candidates} />
        </div>
      ))}

    </div>
  )
}

export default PostDetails
