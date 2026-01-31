import React, { createContext, useContext, useEffect, useState } from "react";

const ScreenContext = createContext();

export const useScreen = () => useContext(ScreenContext);

const ScreenProvider = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const value = {
    width,
    isMobile: width < 576,
    isTablet: width >= 576 && width < 992,
    isSmallDesktop: width >= 992 && width < 1200,
    isLargeDesktop: width >= 1536,
  };

  return (
    <ScreenContext.Provider value={value}>
      {children}
    </ScreenContext.Provider>
  );
};

export default ScreenProvider;
