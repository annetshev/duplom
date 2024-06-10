import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import header_top_image from "../../img/R.png";

const Header = () => {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      console.log("Scroll event triggered");
      if (header) {
        console.log("Header element found");
        if (window.pageYOffset > 0) {
          header.classList.add("header-scroll");
        } else {
          header.classList.remove("header-scroll");
        }
      } else {
        console.log("Header element not found");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="header">
      <div className="header_top">
        <Link to="/">
          <img
            src={header_top_image}
            alt="Header Top"
            className="header_top_image"
          />
        </Link>
      </div>
    </div>
  );
};

export default Header;
