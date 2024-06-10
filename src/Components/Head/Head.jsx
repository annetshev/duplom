import React from "react";
import { Link } from "react-router-dom";
import "./Head.scss";
import header_top_image from "../../img/R.png";
import BurgerMenu from "../BurgerMenu/BugerMenu";

const Head = () => {
  return (
    <div className="head">
      <div className="head_top">
        <Link to="/home">
          <img src={header_top_image} alt="" className="head_top_image" />
        </Link>
        <nav className="navbar">
          <ul className="nav-list">
            <BurgerMenu />
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Head;
