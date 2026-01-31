import React, { useEffect, useState } from "react";
import { Sun, MoonStar, MonitorCog } from "lucide-react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode) => {
      if (mode === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else if (mode === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", isDark);
        root.classList.toggle("light", !isDark);
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        root.classList.toggle("dark", e.matches);
        root.classList.toggle("light", !e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      {/* Icon buttons instead of select options */}
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-sm transition-all duration-300 ${
          theme === "light"
            ? "bg-primary text-white"
            : "hover:bg-[var(--color-gray)] text-[var(--color-text)]"
        }`}
        title="Light Mode"
      >
        <Sun size={18} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-sm transition-all duration-300 ${
          theme === "dark"
            ? "bg-primary text-alwaysWhite"
            : "hover:bg-[var(--color-gray)] text-[var(--color-text)]"
        }`}
        title="Dark Mode"
      >
        <MoonStar size={18} />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-sm transition-all duration-300 ${
          theme === "system"
            ? "bg-primary text-alwaysWhite"
            : "hover:bg-[var(--color-gray)] text-[var(--color-text)]"
        }`}
        title="System Default"
      >
        <MonitorCog size={18} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
