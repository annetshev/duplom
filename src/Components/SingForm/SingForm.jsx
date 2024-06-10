import React, { useState } from "react";
import "./SingForm.scss";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const SingForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [position, setPosition] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateName = (name) => {
    const re = /^[А-Яа-яЁёҐґІіЇїЄєA-Za-z]+$/;
    return re.test(name);
  };

  const handleFirstNameChange = (e) => {
    const { value } = e.target;
    setFirstName(value);
  };

  const handleLastNameChange = (e) => {
    const { value } = e.target;
    setLastName(value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const handleSignUp = () => {
    setSubmitted(true);
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFirstNameError("");
    setLastNameError("");

    if (!validateEmail(email)) {
      setEmailError("Будь ласка, введіть правильний email.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Паролі не співпадають.");
      return;
    }

    if (!validateName(firstName)) {
      setFirstNameError("Ім'я має містити лише літери.");
      return;
    }

    if (!validateName(lastName)) {
      setLastNameError("Прізвище має містити лише літери.");
      return;
    }

    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      position: position,
    };

    fetch("http://172.20.10.5:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Реєстрація пройшла успішно!");
          navigate("/");
        } else {
          console.error("Помилка реєстрації:", response.statusText);
          alert("Помилка реєстрації. Будь ласка, спробуйте ще раз.");
        }
      })
      .catch((error) => {
        console.error("Помилка відправки запиту:", error);
      });
  };

  return (
    <div className="wrapperes">
      <div className="wrapper">
        <form>
          <h1>Реєстрація</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="   Ім'я"
              required
              value={firstName}
              onChange={handleFirstNameChange}
              style={{ paddingLeft: "20px" }}
            />
            <FaUserAlt className="icon" />
          </div>
          {submitted && firstNameError && (
            <p className="error-message">{firstNameError}</p>
          )}
          <div className="input-box">
            <input
              type="text"
              placeholder="   Прізвище"
              required
              value={lastName}
              onChange={handleLastNameChange}
              style={{ paddingLeft: "20px" }}
            />
            <FaUserAlt className="icon" />
          </div>
          {submitted && lastNameError && (
            <p className="error-message">{lastNameError}</p>
          )}
          <div className="input-box">
            <input
              type="email"
              placeholder="   Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: "20px" }}
            />
            <FaUserAlt className="icon" />
          </div>
          {emailError && <p className="error-message">{emailError}</p>}
          <div className="input-box">
            <input
              type="password"
              placeholder="   Пароль"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: "20px" }}
            />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="   Підтвердіть пароль"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ paddingLeft: "20px" }}
            />
            <FaLock className="icon" />
          </div>
          {confirmPasswordError && (
            <p className="error-message">{confirmPasswordError}</p>
          )}
          <div className="input-box">
            <label htmlFor="position"> Оберіть посаду:</label>
            <select
              id="position"
              name="position"
              required
              value={position}
              onChange={handlePositionChange}
            >
              <option value="">Оберіть позицію</option>
              <option value="officer">ОФіцер відділу НДР</option>
              <option value="science">Ад'юнкт</option>
              <option value="science-officer">Науковий працівник</option>
              <option value="cadet">Курсант</option>
            </select>
          </div>
          <button type="button" onClick={handleSignUp}>
            Зареєструватись
          </button>
          <p>
            Уже зареєстровані? <Link to="/">Увійти</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SingForm;
