import React, { useState } from "react";
import { api } from "../APIs/apiService";
import { useApiPromise } from "../Hooks/useApi";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router";
import Popup from "./Popup";
import BackButton from "./BackButton";
const SelectOtpMethod = React.memo(() => {
    const [selectedMethod, setSelectedMethod] = useState("");
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const {resultData} = location?.state;
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { loading, error, run } = useApiPromise();

   

    if(!resultData) return null;

    const handleChange = (e) => {
        setSelectedMethod(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMethod) {
            alert("Please select a method to receive OTP");
            return;
        }
        const result = await run(() =>
            api.post(`/auth/otpsend/${token}`, { selectedMethod }, { token: false, retryOnAuthFail: false ,withCredentials:true})
        );
        
        navigate({
            pathname : '/login/verification/verifyOTP',
            search : `?${createSearchParams({
                token,
                methode : selectedMethod
            })}`
        });

    };

    return (
        <Popup>
            <BackButton replace={true}  custumeNavigate={()=>{ 
                navigate('/login',{replace : true})}} />
        <form onSubmit={handleSubmit}>
            <div className="lg:w-130 md:w-140 w-full min-h-55 max-h-100 text-black bg-white rounded-2xl p-5 py-6 flex flex-col justify-between">


                <h2 className="text-xl mb-4 text-center">Select from which you want OTP</h2>
                {error && <p className='text-center text-xs text-error'>{error}</p>}

                <div className="flex justify-center gap-3 items-center text-sm">


                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="phoneno"
                            name="otpMethod"
                            value="phone"
                            checked={selectedMethod === "phone"}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="phoneno" className="text-black select-none">{resultData[0]?.member_primary_mobile}</label>
                    </div>

                    <div className="flex items-center mb-4">
                        <input
                            type="radio"
                            id="email"
                            name="otpMethod"
                            value="email"
                            checked={selectedMethod === "email"}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label htmlFor="email" className="select-none">{resultData[0]?.member_email}</label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!selectedMethod}
                    className={`bg-primary btn text-white py-2 px-4 rounded  disabled:bg-gray-300 ${ loading ? 'disabled' : ''}`}
                >
                   {loading ? "Sending..." : "Send OTP"}
                </button>
            </div>
        </form>
        </Popup>
    );
});

export default SelectOtpMethod;
