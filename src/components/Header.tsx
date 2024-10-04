import { NavLink } from "react-router-dom";

function Header() {
  return (
    <>
      <div className="header fixed top-0 left-0 w-full flex flex-row justify-between items-center px-5 h-14 z-40">
        <NavLink to="/" className="w-48 text-2xl font-serif mt-1">
          Chris Elliott
        </NavLink>
        <div className="hidden md:flex flex-row gap-5 sm:gap-8">
          <NavLink
            to="/"
            className={({ isActive }) => `link ${isActive && "border-b border-black/30"}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/gallery/all"
            className={({ isActive }) => `link ${isActive && "border-b border-black/30"}`}
          >
            Gallery
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `link ${isActive && "border-b border-black/30"}`}
          >
            About
          </NavLink>
        </div>
        <div className="w-48 hidden md:flex flex-row gap-5 justify-end sm:gap-8">
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `link border rounded px-4 py-1.5 ${isActive && "border-black/30"}`
            }
          >
            Contact
          </NavLink>
        </div>
        <div className="flex md:hidden flex-row gap-5 sm:gap-8">
          <NavLink
            to="/gallery/all"
            className={({ isActive }) => `link ${isActive && "border-b border-black/30"}`}
          >
            Gallery
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `link ${isActive && "border-b border-black/30"}`}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `link ${isActive && "border-b border-black/30"}`}
          >
            Contact
          </NavLink>
        </div>
      </div>
      <div className="blur fixed top-0 left-0 w-full h-28 z-30 pointer-events-none"></div>
    </>
  );
}

export default Header;
