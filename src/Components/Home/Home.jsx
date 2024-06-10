import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.scss";
import zsu from "../../img/zsu";
import dzvon from "../../img/join_dz.jpg";
import logo from "../../img/logo_white.png";
import footer from "../../img/footer.png";
import footer_zsu from "../../img/footer_zsu.png";
import { FaArrowUp } from "react-icons/fa";

const Home = () => {
  const [userId, setUserId] = useState(null);
  const [position, setPosition] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const result =
      location.state?.result || JSON.parse(localStorage.getItem("result"));

    if (!result) {
      console.error("User data not found.");
      return;
    }

    setUserId(result.id);
    setPosition(result.position);
  }, [location.state]);

  useEffect(() => {
    const scrollFunction = () => {
      const scrollToTopBtn = document.getElementById("scrollToTopBtn");
      if (scrollToTopBtn) {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          scrollToTopBtn.style.display = "block";
        } else {
          scrollToTopBtn.style.display = "none";
        }
      }
    };

    window.addEventListener("scroll", scrollFunction);

    return () => {
      window.removeEventListener("scroll", scrollFunction);
    };
  }, []);

  return (
    <>
      <div className="lin"></div>
      <div className="jumbotron">
        <div className="container">
          <img src={logo} className="img_logo" alt="logo" />
          <h1 className="display-4">Наука</h1>
          <p className="lead">
            динамічна система достовірних, найбільш суттєвих знань про
            об'єктивні закони розвитку природи, суспільства та мислення
          </p>
        </div>
      </div>
      <div className="line"></div>

      <div className="page_block">
        {userId && position === "officer" && (
          <div className="img-container">
            <Link to={`/officer-cabinet/${userId}`}>
              <img src={zsu} alt="Особистий кабінет" className="imgs" />
            </Link>
            <div className="text-overlay">Особистий кабінет</div>
          </div>
        )}
        {userId && position === "cadet" && (
          <div className="img-container">
            <Link to={`/cadet-cabinet/${userId}`}>
              <img src={zsu} alt="Особистий кабінет" className="imgs" />
            </Link>
            <div className="text-overlay">Особистий кабінет</div>
          </div>
        )}
        {userId && position === "science-officer" && (
          <div className="img-container">
            <Link to={`/science-officer-cabinet/${userId}`}>
              <img src={zsu} alt="Особистий кабінет" className="imgs" />
            </Link>
            <div className="text-overlay">Особистий кабінет</div>
          </div>
        )}
        {userId && position === "user" && (
          <div className="img-container">
            <Link to={`/user-cabinet/${userId}`}>
              <img src={zsu} alt="Особистий кабінет" className="imgs" />
            </Link>
            <div className="text-overlay">Особистий кабінет</div>
          </div>
        )}
        <div className="img-container">
          <a href="#new-section">
            <img src={zsu} alt="Текст 2" className="imgs" />
          </a>
          <div className="text-overlay">Новини</div>
        </div>
        <div className="img-container">
          <a href="#news-section">
            <img src={zsu} alt="Текст 3" className="imgs" />
          </a>
          <div className="text-overlay">Закони</div>
        </div>
        <div className="img-container">
          <a href="#contacts-section">
            <img src={zsu} alt="Текст 4" className="imgs" />
          </a>
          <div className="text-overlay">Контакти</div>
        </div>
      </div>
      <div className="line"></div>
      <div className="lines"></div>

      <div className="page_stores">
        <div className="page_stores_info">
          <p>
            Наукова, науково-технічна діяльність у закладах вищої освіти є
            невід’ємною складовою освітньої діяльності і провадиться з метою
            інтеграції наукової, освітньої і виробничої діяльності в системі
            вищої освіти. Провадження наукової і науково-технічної діяльності є
            обов’язковим.
          </p>
        </div>
      </div>
      <div className="lines"></div>
      <div className="page">
        <div className="page-img-container">
          <img src={dzvon} className="page_imgs" alt="Дзвін" />
          <div className="news-overlay">
            <ul>
              <li>
                <a
                  href="https://dntb.gov.ua/news/v-ukrayini-stvoryty-yedynyy-perelik-priorytetnykh-napryamiv-nauky"
                  id="new-section"
                >
                  В Україні створять єдиний перелік пріоритетних напрямів науки
                </a>
              </li>
              <li>
                <a href="https://onua.edu.ua/ua/nauka-ua/novyny-ta-anonsy-naukovykh-zakhodiv">
                  Відбулася Всеукраїнська конференція здобувачів вищої освіти
                  «Українське суспільство та наука в умовах воєнного стану й
                  євроінтеграційних перетворень: виклики, напрями відновлення і
                  розвитку»
                </a>
              </li>
            </ul>
          </div>
        </div>
        <ul className="laws-list" id="news-section">
          <li>
            <a href="https://www.mil.gov.ua/diyalnist/vijskova-osvita-na-tauka/">
              Військова освіта та наука
            </a>
          </li>
          <li>
            <a href="https://zakon.rada.gov.ua/laws/show/848-19#Text">
              ЗАКОН УКРАЇНИ "Про наукову і науково-технічну діяльність"
            </a>
          </li>
          <li>
            <a href="https://ezpf.elit.sumdu.edu.ua/wp-content/uploads/2018/01/%D0%A2%D0%B5%D0%BC%D0%B02.pdf">
              Організація наукової діяльності у ВВНЗ
            </a>
          </li>
        </ul>
      </div>

      <footer className="footer">
        <div className="footer_distributed">
          <div className="footer_distributed_left">
            <h2>
              <img
                src={footer_zsu}
                alt="Міністерство оборони України"
                title="Міністерство оборони України"
                className="footer_distributed_left_img"
              />
            </h2>
            <p className="footer_company_name"></p>
          </div>
          <div className="footer_right">
            <div className="footer-center" id="contacts-section">
              <ul>
                <li>Телефон: +1 123 456 789</li>
                <li>Email: osvita@gmail.com</li>
                <li>Адреса: м.Київ</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer_img">
          <img
            src={footer}
            alt="Міністерство оборони України"
            title="Міністерство оборони України"
          />
          <button
            id="scrollToTopBtn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FaArrowUp className="arrow" />
          </button>
        </div>
      </footer>
    </>
  );
};

export default Home;
