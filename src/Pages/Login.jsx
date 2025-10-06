import React, { useEffect, useState } from 'react'
import Popup from '../Components/Popup'
import BackButton from '../Components/BackButton'
import { useApiPromise } from '../Hooks/useApi'
import { api } from '../APIs/apiService'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router';
import AuthService from '../APIs/authService'

const Login = () => {
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState('');
    const location = useLocation();
    const { loading, error, run } = useApiPromise();
    

    const election_id = sessionStorage.getItem("electionId")  ;
    const post_id = sessionStorage.getItem("postId")  ;

    useEffect(() => {
        AuthService.logout();
    }, []);


    const handlesubmit = async (e) => {
        e.preventDefault();

        const result = await run(() =>
            api.post('/auth/memberid', { memberId, electionId: election_id,post_id }, { token: false, retryOnAuthFail: false })
        );
        navigate({
            pathname: "/login/verification",
            search: `?${createSearchParams({ token: result.token })}`

        },
            {
                state: { resultData: result.data }
            }
            ,

        );
    }





    // if (!election_id) return null;

    return (
        <Popup>
            <BackButton />
            
                <div className='lg:w-130 md:w-140 w-100%  min-h-75 max-h-100  bg-white rounded-2xl p-5 flex flex-col justify-between'>

                    <div>

                        <h2 className='text-center xl:text-2xl md:text-xl sm:text:xl text-xl py-6'> Enter Your Member ID</h2>

                        <p className="text-center text-sm">
                            We need to verify your identity before you proceed.
                        </p>
                        {error && <p className='text-center text-xs text-error'>{error}</p>}
                    </div>

                    <form onSubmit={handlesubmit}>
                        <div className="flex flex-col items-center mt-4">
                            <input
                                type="text"
                                value={memberId}

                                onChange={(e) => setMemberId(e.target.value)}
                                placeholder="Enter Member ID"
                                className="w-full max-w-md px-4 py-2 border  text-black border-primary rounded-md focus:ring-2  focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={memberId.length === 0 || loading}
                                className={`btn ${memberId.length === 0 || loading ? 'disabled' : ''}  cursor-pointer active mt-4 w-full max-w-md bg-primary text-white py-2 rounded-lg  transition`}
                            >
                                {loading ? "Verifing..." : "Verify"}
                            </button>
                        </div>
                    </form>
                </div>
        
        </Popup>
    )
}

export default Login
