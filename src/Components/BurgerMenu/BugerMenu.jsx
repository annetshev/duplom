import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BurgerMenu.scss";
import logo from "../../img/logo_white.png";
import Cookies from "js-cookie";

const BurgerMenu = () => {
  const [bar_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("userId");
    if (role) {
      setUserRole(role);
    }
    if (id) {
      setUserId(id);
    }
  }, []);

  const updateMenu = () => {
    if (!isMenuClicked) {
      setBurgerClass("burger-bar clicked");
      setMenuClass("menu visible");
    } else {
      setBurgerClass("burger-bar unclicked");
      setMenuClass("menu hidden");
    }
    setIsMenuClicked(!isMenuClicked);
  };

  const getCabinetLink = () => {
    switch (userRole) {
      case "cadet":
        return `/cadet-cabinet/${userId}`;
      case "science-officer":
        return `/science-officer-cabinet/${userId}`;
      case "officer":
        return `/officer-cabinet/${userId}`;
      default:
        return `/user-cabinet/${userId}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("jwt");
    Cookies.remove("jwt");
    navigate("/", { replace: true });
    window.history.replaceState(null, "", window.location.href);
  };

  return (
    <div className="burger__menu" onClick={updateMenu}>
      <div className={bar_class}></div>
      <div className={bar_class}></div>
      <div className={bar_class}></div>
      <div className={menu_class}>
        <div className="menu__nav">
          <img src={logo} className="menu__logo" alt="Logo"></img>
          <br />
          <Link to="/home">Головна</Link>
          <br />
          <Link to={getCabinetLink()}>Особистий кабінет</Link>
          <br />
          <Link to="/" onClick={handleLogout}>
            Вихід
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu;
