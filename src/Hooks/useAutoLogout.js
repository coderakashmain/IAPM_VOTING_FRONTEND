
import { useEffect } from "react";
import AuthService from "../APIs/authService";

export function useAutoLogout() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      AuthService.logout(); 
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
