import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import formatElectionDates from './DateTime';
import CandidateGrid from './CandidateGrid';
import {MousePointerClick} from 'lucide-react'

const PostDetails = () => {
  const location = useLocation();
  const {data}  = location.state  || {};
  const navigate = useNavigate();

  const handlenavigate  = (data)=>{
    sessionStorage.setItem("electionId" ,data.election_id);
    sessionStorage.setItem("postId" ,data.post_id);
    navigate('/voting')
  }

  if(!data) return null;

  return (
    <div className='pt-5'>
      <h2 className='text-2xl mb-2'>{data.post_name}</h2>
       {data.post_about && ( <p className='text-sm mb-9'>{data.post_about}</p>)}


        <p className='mt-6 text-sm font-semibold'> <span className='font-bold'>Post Name :</span> {data.post_name}</p>
        <p className='mt-2 text-sm font-semibold'> <span className='font-bold'>Post Category :</span> {data.post}</p>
        <p className='mt-2 text-sm font-semibold'> <span className='font-bold'>Organization Name :</span> {data.organization_name}</p>
        <p className='mt-2 text-sm '> <span className='font-bold'>
          Start Time :</span> {formatElectionDates(data.election_start)} </p>
        <p className='mt-2 text-sm '> <span className='font-bold'>
          End Time :</span> {formatElectionDates(data.election_end)} </p>
        <div className='mt-5  flex'>
       {data.active && (   <span className='bg-success text-white rounded-2xl px-3 py-1 text-xs '>Active</span>)}

       <button  onClick={()=> handlenavigate(data)} className='active ml-4 text-xs font-semibold bg-primary text-white py-1 px-3 rounded-3xl cursor-pointer flex gap-1'>Let's Vote <MousePointerClick size={17} className='text-xs' /></button>

        </div>

        <h3 className='mt-6 mb-6'>Candidates</h3>
        <CandidateGrid  candidates = {data.candidates}/>
    </div>
  )
}

export default PostDetails
