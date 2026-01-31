import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useElection } from '../Context/ElectionProvider';
import { useScreen } from '../Context/ScreenProvider';
import CircularLoader from './Fallback/CircularLoader';
const Hero = () => {

    const { electionList, loading } = useElection();
    const { width, isMobile } = useScreen();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResult, setSearchResult] = useState([]);
    const [searchvalue, setSearchvalue] = useState('');
    const activeId = sessionStorage.getItem("homeelectionId");
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (!searchvalue) {
            setSearchResult(electionList?.data);

        }
    }, [electionList, searchvalue]);

    const handleChange = (e) => {
        setSearchvalue(e.target.value);
    };

    const filterData = (searchText) => {
        if (!searchText) return electionList?.data;
        setSearchLoading(true);

        const lowercasedValue = searchText.toLowerCase().trim();
        const filteredData = electionList?.data?.filter(item => {
            return Object.keys(item).some(key =>
                typeof item[key] === "string" && item[key].toLowerCase().includes(lowercasedValue)
            );
        });
        setTimeout(() => { setSearchLoading(false); }, 500);
        return filteredData;
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchvalue) return setSearchResult(electionList?.data);
        const filtered = filterData(searchvalue);
        setSearchResult(filtered);
    }



    const handleNavigate = (data) => {
        if (width <= 1024) {
            navigate(`postdetails/m/${data.organization_name}`, { state: { data } });
        } else {
            navigate(`postdetails/${data.organization_name}`, { state: { data } });
        }


        sessionStorage.setItem('homeelectionId', data.election_id);
    };


    return (
        <section id='hero' className={`min-h-screen   w-full ${isMobile ? "bg-white" : 'bg-bg'} `}>

            <div className={`container  flex relative justify-center xl:justify-baseline  h-full  py-5 gap-10 `}>
                <aside className={`w-[full] sm:min-w-[420px] xl:w-[420px]    h-full bg-white rounded-xl ${isMobile ? "" : "shadow-sm p-5 "} `}>


                    <h1 className='pb-5  xl:text-2xl md:text-xl sm:text-xl text-md'>Elections</h1>
                    <form onSubmit={handleSearch}>

                        <div className=' rounded-[5px] flex items-center p-[1.8px]  bg-primary overflow-hidden '>
                            <div className='p-2 flex bg-white rounded w-full'>

                                <Search className=' text-black pr-[4px]' />

                                <input value={searchvalue} onChange={handleChange} type="text" className='   outline-none  ' />
                            </div>
                            <button  type='submit'  className='px-3 cursor-pointer active'><Search className=' text-white' /></button>


                        </div>
                    </form>
                    <ul className='mt-8 '>
                        {!loading || !searchLoading ? searchResult?.length > 0 ? searchResult?.map((position, index) => (
                            <li key={index}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-gray)')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}

                                onClick={() => handleNavigate(position)} className={`group py-2  transition-all duration-300 ${(position.election_id === Number(activeId) && location.pathname !== "/") ? "bg-gray" : ''}  ease-in-out  hover:px-2 px-1 rounded-xl  flex gap-3 cursor-pointer border-b-1 border-bg mb-1`}>

                                <aside >
                                    <div className='select-none bg-bg w-10 h-10 rounded-md  flex justify-center shadow items-center'>{index + 1}</div>
                                </aside>
                                <div className='flex-1'>
                                    <h2 className='text-md mb-2'>{position.organization_name}</h2>
                                    <p className='text-sm '>
                                        {position.about_organization.slice(0, 100)}{position.about_organization.length > 100 ? "..." : ""}
                                    </p>
                                    <div className='flex justify-end  gap-2 items-center mt-5 '>
                                        <p className='text-xs font-bold'>By {position.organization_name}</p>

                                        {position.active && (<div className='  rounded-2xl px-2 py-1 text-xs flex items-center gap-1'> <div className='h-2 w-2 rounded-full bg-success'></div> <span>Active</span></div>)}
                                    </div>
                                </div>

                            </li>
                        )) : (
                            <div className='flex items-center justify-center text-sm'>
                                No active Elections.
                            </div>
                        ) : (
                            <div className='flex items-center justify-center'>
                                <CircularLoader size='40px' />
                            </div>
                        )}
                    </ul>
                </aside>
                <aside className='flex-grow p-5 hidden xl:block   h-full  rounded-xl'>

                    <Outlet />

                </aside>



            </div>
        </section>
    )
}

export default Hero
