// Header.jsx
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useNavigate } from "react-router";

const Header = ({ oppositions = [] }) => {
  const navigate = useNavigate()

  const handleNavigate = ()=>{
    navigate('/');
  }
  return (
    <header className="   shadow-soft h-14 flex items-center sticky top-0 z-50 bg-white">
      <div className="container mx-auto flex items-center justify-between  px-4 md:px-0">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleNavigate}>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-alwaysWhite  font-bold">
            V
          </div>
          <span className="text-xl font-semibold text-text">VoteHub</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-text font-medium">
          {/* <a href="/" className="hover:text-primary transition-colors">Home</a>
          <a href="#oppositions" className="hover:text-primary transition-colors">Oppositions</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a> */}
        </nav>

        {/* Dropdown for oppositions (mobile or desktop) */}
        <div>
            <ThemeSwitcher/>

          
        </div>
      </div>
    </header>
  );
};

export default Header;
