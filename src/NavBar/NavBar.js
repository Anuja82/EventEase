import React, { useState } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { MdAccountCircle, MdMenu, MdClose } from "react-icons/md";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search?query=${search}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="highlight">Event</span>Ease
      </div>

      {/* Hamburger button - mobile only */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
      </button>

      {/* Nav links */}
      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/shows" onClick={closeMenu}>Shows</Link></li>
        <li><Link to="/blog" onClick={closeMenu}>Blogs</Link></li>
        <li><Link to="/help" onClick={closeMenu}>Help</Link></li>
        <li className="nav-auth">
          <Link to="/auth" title="Login/Register" onClick={closeMenu}>
            <MdAccountCircle size={25} />
          </Link>
        </li>
      </ul>

      {/* Search */}
      <div className="navbar-search">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>
    </nav>
  );
};

export default NavBar;
