import React, { lazy, Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import AuthService from "../APIs/authService";




const PrivateRouter = () => {

  const navigate = useNavigate();
  const token = AuthService.getAccessToken();


useEffect(()=>{
  if(!token){
    navigate('/login',{replace : true});
  }

},[token])
  return (
    <>
      {token && (
        <Outlet />
      )}
    </>
  );
};

export default PrivateRouter;
