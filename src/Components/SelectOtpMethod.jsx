import React, { useState } from "react";
import { api } from "../APIs/apiService";
import { useApiPromise } from "../Hooks/useApi";
const SelectOtpMethod = React.memo(({ resultData,memberId,electionId }) => {
    const [selectedMethod, setSelectedMethod] = useState("");
    const {loading,error,run} = useApiPromise();


    const handleChange = (e) => {
        setSelectedMethod(e.target.value);
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        if (!selectedMethod) {
            alert("Please select a method to receive OTP");
            return;
        }
      const result = await run(() =>
                  api.post('/auth/otpsend',{selectedMethod,memberId,electionId}, { token: false, retryOnAuthFail: false })
              );
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="lg:w-130 md:w-140 w-full min-h-55 max-h-100 text-black bg-white rounded-2xl p-5 py-6 flex flex-col justify-between">
         
                
                <h2 className="text-xl mb-4 text-center">Select from which you want OTP</h2>

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
                    className="bg-primary btn text-white py-2 px-4 rounded  disabled:bg-gray-300"
                >
                    Send OTP
                </button>
            </div>
        </form>
    );
});

export default SelectOtpMethod;
