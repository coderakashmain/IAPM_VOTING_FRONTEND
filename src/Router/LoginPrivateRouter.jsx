import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import api from '../APIs/apiService';
import { useApiPromise } from '../Hooks/useApi';
import Loader from '../Components/Fallback/Loader';
const SessionExpired = lazy(() => import('../Pages/SessionExpired'))

const LoginPrivateRouter = () => {
  const { run, error, loading } = useApiPromise();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await run(() =>
          api.get('/auth/checkloginstate', {
            token: false,
            retryOnAuthFail: false,
            withCredentials: true,
          })
        );
        if (res?.status) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error || isAuthenticated === false) {
    return <Suspense fallback={<Loader/>}><SessionExpired/></Suspense> ;
  }

  if (isAuthenticated === null) {
    return <Loader />;
  }

  return <Outlet />;
};

export default LoginPrivateRouter;
