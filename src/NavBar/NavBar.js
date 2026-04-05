
import React, { useState } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";

const NavBar = () => {

const [search, setSearch] = useState("");
const navigate = useNavigate();

const handleSearch = (e) => {
e.preventDefault();


if (search.trim() !== "") {
  navigate(`/search?query=${search}`);
  setSearch("");
}


};

return ( <nav className="navbar"> <div className="navbar-logo"> <span className="highlight">Event</span>Ease </div>

  <ul className="navbar-links">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/about">About</Link></li>
    <li><Link to="/shows">Shows</Link></li>
    <li><Link to="/event">Event</Link></li>
    <li><Link to="/blog">Blogs</Link></li>

    <li className="nav-auth">
      <Link to="/auth" title="Login/Register">
        <MdAccountCircle size={25}/>
      </Link>
    </li>
    <li><Link to="/help">Help</Link></li>
  </ul>

  <div className="navbar-search">
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  </div>

</nav>


);
};

export default NavBar;
