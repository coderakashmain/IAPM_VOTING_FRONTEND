import React, { useState } from 'react'
import Popup from '../Components/Popup'
import BackButton from '../Components/BackButton'
import { replace, useNavigate, useSearchParams } from 'react-router'
import { useApiPromise } from '../Hooks/useApi'
import { api } from '../APIs/apiService'
import AuthService from '../APIs/authService'

const VerifyOTP = () => {
    const navigate = useNavigate();
    const [OTP, setOTP] = useState();
    const [searchParams] = useSearchParams();
    const methode = searchParams.get('methode');
    const verifytoken = searchParams.get('token');
    const { loading, error, run } = useApiPromise();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await run(() =>
            api.post(`/auth/otpverify/${verifytoken}`, { OTP }, { token: false, retryOnAuthFail: false, withCredentials: true })
        );

        const token = res?.token;

        if (token) {
            AuthService.setAccessToken(token);
            if (res.data) AuthService.setUser(res.data);
        }

        navigate('/voting',{replace : true});


    };


    const handleChange = (e) => {
        const value = e.target.value;


        if (/^\d{0,6}$/.test(value)) {
            setOTP(value);
        }
    }
    return (
        <Popup>
            <BackButton replace={true} custumeNavigate={() => navigate('/login', { replace: true })} />
            <form onSubmit={handleSubmit}>
                <div className="lg:w-130 md:w-140 w-full min-h-55 max-h-100 text-black bg-white rounded-2xl p-5 py-6 flex flex-col justify-between">


                    <h2 className="text-xl mb-4 text-center">Enter OTP send to your registered {methode}</h2>
                    {error && <p className='text-center text-xs text-error'>{error}</p>}

                    <div className="flex  justify-center">

                        <input
                            type="number"
                            value={OTP}
                            onChange={handleChange}
                            placeholder="OTP"
                            className="w-full max-w-md px-4 py-2 border  text-black border-primary rounded-md focus:ring-2  focus:ring-blue-500 focus:outline-none"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={!OTP || loading}
                        className={`bg-primary btn text-white py-2 px-4 rounded  disabled:bg-gray-300 ${loading || !OTP ? 'disabled' : ''}`}
                    >
                        {loading ? "Verifing..." : "Submit"}
                    </button>
                </div>
            </form>

        </Popup>
    )
}

export default VerifyOTP
