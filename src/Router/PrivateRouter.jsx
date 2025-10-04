import React, { lazy, Suspense } from "react";
import { Outlet } from "react-router";
import { Loader } from "lucide-react";
import AuthService from "../APIs/authService";
import { useAutoLogout } from "../Hooks/useAutoLogout";

const Login = lazy(() => import("../Pages/Login"));

const PrivateRouter = () => {
  useAutoLogout(); 

  const token = AuthService.getAccessToken();

  if (!token) {
    AuthService.logout();
  }

  return (
    <>
      {token ? (
        <Outlet />
      ) : (
        <Suspense fallback={<Loader />}>
          <Login />
        </Suspense>
      )}
    </>
  );
};

export default PrivateRouter;
