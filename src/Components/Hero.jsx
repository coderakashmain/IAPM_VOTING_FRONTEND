import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import PostDetails from './PostDetails';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useApiPromise } from '../Hooks/useApi';
import { api } from '../APIs/apiService';
const Hero = () => {
    const { loading, error, run } = useApiPromise();
    const [electionList,setElectionList]  = useState([]);

    const navigate = useNavigate(); 


    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await run(() => api.get('/vote/getallvote', { token: false }));
              
                setElectionList(result)
            } catch (err) {
                console.error('API error', err);
            }
        };
        fetchData();
    }, [])

  
    const handleNavigate = (data) => {
        navigate(`/${data.post_name}`, { state: { data } });
    }


    return (
        <section id='hero' className='min-h-screen   w-full bg-bg'>

            <div className='container  flex relative  h-full  py-5 gap-10     '>
                <aside className='w-[420px] min-w-[420px]    h-full bg-white rounded-2xl p-5  '>


                    <h1 className='py-5  xl:text-2xl md:text-xl sm:text-xl text-md'>All Positions</h1>
                    <div className=' rounded-[5px] flex items-center p-[1.8px]  bg-primary overflow-hidden '>
                        <div className='p-2 flex bg-white rounded w-full'>

                            <Search className=' text-black pr-[4px]' />

                            <input type="text" className='   outline-none  ' />
                        </div>
                        <span className='px-3 cursor-pointer'><Search className=' text-white' /></span>


                    </div>
                    <ul className='mt-8'>
                        {electionList?.data?.length > 0 && electionList?.data?.map((position,index) => (
                            <li key={index} onClick={() => handleNavigate(position)} className='py-2 hover:bg-primary flex gap-3 cursor-pointer border-b-1 border-bg mb-1'>
                                <aside>
                                    <div className=' w-10 h-10 rounded-md bg-bg flex justify-center shadow items-center'>{index + 1}</div>
                                </aside>
                                <div>
                                    <h2 className='text-md mb-2'>{position.post_name}</h2>
                                    <p className='text-sm'>{position.post_about}</p>
                                     <div   className='flex justify-end  gap-2 items-center mt-5 '>
                                        <p className='text-xs font-bold'>By {position.organization_name}</p>
                                    <span className='bg-success text-white rounded-2xl px-2 py-1 text-xs '>{position.active && ("Active")}</span>
                                </div>
                                </div>
                               
                            </li>
                        ))}
                    </ul>
                </aside>
                <aside className='flex-grow p-5 bg-white h-full  rounded-2xl'>

                    <Outlet />

                </aside>



            </div>
        </section>
    )
}

export default Hero
