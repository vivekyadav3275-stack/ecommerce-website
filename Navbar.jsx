import "./Navbar.css";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar({ search, setSearch, cartCount }) {

  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo">
        Shop<span className="kart">Kart</span>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>

      {/* MENU */}
      <div className="menu">

        <Link to="/login" className="user">
          Hello, Log In
        </Link>

        <div className="cart">
          🛒 {cartCount}
        </div>

        <div 
          className="admin-toggle"
          onClick={() => setShowAdmin(!showAdmin)}
        >
          ☰
        </div>

      </div>

      {/* ADMIN PANEL */}
      {showAdmin && (
        <div className="admin-panel">
          <h3>Admin Panel</h3>

          <button>Add Product</button>
          <button>Delete Product</button>
          <button>Update Stock</button>
        </div>
      )}

    </nav>
  );
}

export default Navbar;
