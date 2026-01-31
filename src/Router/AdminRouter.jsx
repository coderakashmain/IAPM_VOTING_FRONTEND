import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import api from '../APIs/apiService'
import { useApiPromise } from '../Hooks/useApi'
import Loader from '../Components/Fallback/Loader'
const AdminRouter = () => {
  const { run, loading, error } = useApiPromise();
  const [autherized,setAutherized] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {

    const getAdmin = async () => {
    const response =   await run(() =>
        api.get('/admin/autherizeCheck',{token : false,withCredentials: true,retryOnAuthFail : false})
      );
     
      if(response.status){
        setAutherized(true)
      }
      else{
        setAutherized(false)
      };

    };
    getAdmin();

  }, [])

useEffect(()=>{
  if(!autherized && error){
    navigate("/autherizedadminpanel/login",{replace : true});
  }

},[autherized,error]);

if(loading ){
 return  <Loader/>;
}

  return (
    <>
    {autherized &&(  <Outlet />)}
    </>
  )
}

export default AdminRouter
