import React, { useState } from "react";
import axios from "axios";
import api from "../../APIs/apiService";
import { useApiPromise } from "../../Hooks/useApi";
import { useLocation, useNavigate } from "react-router";

const AdminLogin = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const { loading, error, run } = useApiPromise();
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await run(() => api.post('/admin/login', { userId, password }, { withCredentials: true, token: false, retryOnAuthFail: false }))

            setMessage(res.data.message || "Login successful!");
            setTimeout(() => {
                navigate('/autherizedadminpanel');
                // window.location.href("/autherizedadminpanel")
            }, 500);
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed!";
            setMessage(msg);
        }
    };

    return (
        <section id="adminlogin" className="bg-bg  ">
            <div className="container min-h-screen w-full flex justify-center items-center">
                <div className="w-[380px] bg-white shadow rounded-2xl px-8 py-10">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 select-none">
                        Admin Login
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* User ID */}
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-600 mb-2 select-none">
                                User ID
                            </label>
                            <input
                                type="text"
                                id="userId"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your user ID"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2 select-none">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Message */}
                        {message && (
                            <div
                                className={`text-sm text-center ${message.toLowerCase().includes("success")
                                    ? "text-success"
                                    : "text-error"
                                    }`}
                            >
                                {message}
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`active w-full py-2 mt-2 rounded-sm font-medium text-white transition-all duration-200 ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-primary cursor-pointer"
                                }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AdminLogin;
