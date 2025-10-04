// Header.jsx
import React from "react";

const Header = ({ oppositions = [] }) => {
  return (
    <header className="   shadow-soft h-14 flex items-center sticky top-0 z-50 bg-white">
      <div className="container mx-auto flex items-center justify-between  px-4 md:px-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            V
          </div>
          <span className="text-xl font-semibold text-text">VoteHub</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-text font-medium">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <a href="#oppositions" className="hover:text-primary transition-colors">Oppositions</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
        </nav>

        {/* Dropdown for oppositions (mobile or desktop) */}
        <div className="relative">
          <button className="px-3 py-2 bg-primary text-white rounded-md md:hidden">
            Lists
          </button>
          {/* Desktop Dropdown */}
          {oppositions.length > 0 && (
            <ul className="hidden md:absolute right-0 mt-2 w-48 bg-bg shadow-card rounded-md overflow-hidden">
              {oppositions.map((opp) => (
                <li key={opp.id}>
                  <a
                    href={`/opposition/${opp.id}`}
                    className="block px-4 py-2 text-text hover:bg-primary/10 transition-colors"
                  >
                    {opp.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
