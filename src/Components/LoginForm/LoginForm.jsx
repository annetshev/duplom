import React, { useState } from "react";
import "./LoginForm.scss";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch("http://172.20.10.5:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const result = data.result;
        const jwt = data.jwt;
        localStorage.setItem("result", JSON.stringify(result));
        localStorage.setItem("jwt", jwt);
        Cookies.set("jwt", jwt, { expires: 1, path: "/", sameSite: "lax" });
        console.log("Вхід пройшов успішно!");
        console.log("Отримані дані користувача з сервера:", data);
        localStorage.setItem("userId", result.id);
        localStorage.setItem("userRole", result.position);

        switch (result.position) {
          case "cadet":
            console.log("Перенаправлення на сторінку курсанта");
            navigate("/cadet", { state: { result } });
            break;
          case "science-officer":
            console.log("Перенаправлення на сторінку наукового працівника");
            navigate("/science-officer", {
              state: { result },
            });
            break;
          case "officer":
            console.log("Перенаправлення на сторінку офіцера");
            navigate("/officer", {
              state: { result },
            });
            break;
          default:
            console.log("Перенаправлення на сторінку ад'юнкта");
            navigate("/user", {
              state: { result },
            });
        }
      } else {
        if (response.status === 401 || response.status === 400) {
          setError("Неправильний email або пароль.");
        } else {
          const errorMessage = await response.text();
          setError(errorMessage);
          console.error("Помилка входу:", errorMessage);
        }
      }
    } catch (error) {
      console.error("Сталася помилка при відправці запиту:", error);
      setError("Сталася помилка при відправці запиту. Спробуйте ще раз.");
    }
  };

  return (
    <div className="wrappers">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Вхід</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="   Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: "20px" }}
              required
            />
            <FaUserAlt className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="   Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: "20px" }}
              required
            />
            <FaLock className="icon" />{" "}
          </div>
          <div className="remember-forgot">
            {" "}
            <label>
              <input type="checkbox" />
              Запам'ятати
            </label>
            <a href="#">Забули пароль?</a>
          </div>
          <button type="submit">Ввійти</button>
          {error && <div className="error-message">{error}</div>}
          <div className="register-link">
            <p>
              Не маєте акаунту?<Link to="/singin">Реєстрація</Link>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
