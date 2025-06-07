import React from 'react';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">Deals</h1>
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="Search" className="search-input" />
      </div>
      <div className="navbar-right">
        <button className="add-button">+ Deal</button>
        <div className="user-profile">
          <img src="/images/bear.jpg" alt="User" />
          <span>Desire Vargas</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;