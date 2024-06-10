import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { AiFillFileText } from "react-icons/ai";
import LogoutIcon from "@mui/icons-material/Logout";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { BsCaretDown } from "react-icons/bs";
import Cookies from "js-cookie";
import axios from "axios";
import "./Cadet.scss";

const API_BASE_URL = "http://172.20.10.5:8000";

const Cadet = () => {
  const [personalDataCollapsed, setPersonalDataCollapsed] = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [userId, setUserId] = useState(null);
  const [initialData, setInitialData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [jwt, setJwt] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    text: "",
    file: null,
    documentType: "",
    shufr: "",
    reestr_nomer: "",
    cyprovid: "",
    vprovadgeno: "",
  });
  const [showAddProject, setShowAddProject] = useState(false);
  const [monthlyData, setMonthlyData] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);

  useEffect(() => {
    const result =
      location.state?.result || JSON.parse(localStorage.getItem("result"));
    if (!result) {
      console.error("User data not found.");
      navigate("/login", { replace: true });
      return;
    }
    setUserId(result.id);
    setLastName(result.lastName);
    setFirstName(result.firstName);
    setEmail(result.email);
    setPosition(result.position);
    setJwt(result.jwt || Cookies.get("jwt"));
    setInitialData({
      lastName: result.lastName,
      firstName: result.firstName,
      email: result.email,
      position: result.position,
    });

    if (result.firstName && result.lastName) {
      const authorFullName = `${result.firstName} ${result.lastName}`;
      fetchUserDocuments(authorFullName);
    } else {
      console.error("Ім'я або прізвище користувача відсутні.");
    }
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    fetchProjects();
  }, [location.state, navigate]);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  const handleSaveProject = async () => {
    if (
      !newProject.name ||
      !newProject.text ||
      !userId ||
      !newProject.file ||
      !newProject.documentType
    ) {
      alert(
        "Будь ласка, заповніть всі обов'язкові поля: назва, опис, тип документа, аудиторія та файл."
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", newProject.name);
    formData.append("text", newProject.text);
    formData.append("authorId", userId);
    formData.append("type", newProject.documentType);
    formData.append("shufr", newProject.shufr || "");
    formData.append("reestr_nomer", newProject.reestr_nomer || "");
    formData.append("cyprovid", newProject.cyprovid || "");
    formData.append("vprovadgeno", newProject.vprovadgeno || "");
    formData.append("extension", newProject.extension || "");
    formData.append("file", newProject.file);

    if (newProject.type !== "НДР") {
      formData.append("kind", newProject.kind || "");
    }

    let apiURL = "";
    switch (newProject.documentType) {
      case "НДР":
        apiURL = `${API_BASE_URL}/ndr`;
        break;
      case "Наукова робота":
        apiURL = `${API_BASE_URL}/scientific_materials`;
        break;
      case "Рецензія":
      case "Тези":
        apiURL = `${API_BASE_URL}/reviews_abstracts`;
        break;
      default:
        alert("Невідомий тип документа.");
        return;
    }

    console.log("FormData values:");
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response = await axios.post(apiURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Проект успішно додано:", response.data);
      setProjects([...projects, response.data]);
      resetForm();

      window.location.reload();
    } catch (error) {
      console.error(
        "Не вдалося додати проект:",
        error.response ? error.response.data : error
      );
      alert(
        "Не вдалося додати проект. Див. консоль для отримання додаткової інформації."
      );
    }
  };

  const resetForm = () => {
    setNewProject({
      name: "",
      text: "",
      file: null,
      documentType: "",
      shufr: "",
      reestr_nomer: "",
      cyprovid: "",
      vprovadgeno: "",
    });
    setShowAddProject(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file);

      const extension = file.name.split(".").pop();
      setNewProject({ ...newProject, file, extension });
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/works`);
      if (response.data && response.data.length > 0) {
        setProjects(response.data);
      } else {
        console.log("No projects found");
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      alert("Failed to fetch projects. See console for more information.");
    }
  };

  const fetchUserDocuments = async (authorFullName) => {
    console.log("Author full name:", authorFullName);
    try {
      const documentURLs = [
        `${API_BASE_URL}/ndr/search/${authorFullName}`,
        `${API_BASE_URL}/scientific_materials/search/${authorFullName}`,
        `${API_BASE_URL}/reviews_abstracts/search/${authorFullName}`,
      ];

      const requests = documentURLs.map(async (url) => {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          return response.data;
        } catch (error) {
          console.error("Failed to fetch documents from", url, ":", error);
          return [];
        }
      });

      const responses = await Promise.all(requests);
      const allDocuments = responses.flat();
      setDocuments(allDocuments);
      calculateMonthlyData(allDocuments);
    } catch (error) {
      console.error("Failed to fetch user documents:", error);
      if (error.response) {
        console.error("Server responded with status:", error.response.status);
        console.error("Error data:", error.response.data);
      }
    }
  };

  const calculateMonthlyData = (documents) => {
    const monthNames = [
      "Січень",
      "Лютий",
      "Березень",
      "Квітень",
      "Травень",
      "Червень",
      "Липень",
      "Серпень",
      "Вересень",
      "Жовтень",
      "Листопад",
      "Грудень",
    ];

    const documentCounts = Array(12).fill(0);

    documents.forEach((doc) => {
      const month = new Date(doc.createdAt).getMonth();
      documentCounts[month]++;
    });

    setMonthlyData({
      labels: monthNames,
      datasets: [
        {
          label: "Документи",
          data: documentCounts,
          backgroundColor: "#8BC34A",
          borderColor: "#388E3C",
          borderWidth: 1,
          barThickness: 20,
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          drawBorder: false,
          color: function (context) {
            if (context.tick.value > 0) {
              return "#E0E0E0";
            }
            return "#FFFFFF";
          },
        },
        ticks: {
          beginAtZero: true,
          stepSize: 5,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const handleLogout = async () => {
    try {
      Cookies.remove("jwt");
      localStorage.removeItem("jwt");
      localStorage.removeItem("result");

      setUserId(null);
      setLastName("");
      setFirstName("");
      setEmail("");
      setPosition("");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleTogglePersonalDataCollapse = () => {
    setPersonalDataCollapsed(!personalDataCollapsed);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setLastName(initialData.lastName);
    setFirstName(initialData.firstName);
    setEmail(initialData.email);
    setPosition(initialData.position);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      if (
        lastName !== undefined &&
        firstName !== undefined &&
        email !== undefined &&
        position !== undefined &&
        userId !== null &&
        jwt !== null
      ) {
        const requestBody = {
          jwt: jwt,
          updateUserDto: {
            lastName: lastName,
            firstName: firstName,
            email: email,
            position: position,
          },
        };
        console.log(
          "Sending PATCH request to:",
          `http://172.20.10.5:8000/api/user/${userId}`
        );
        console.log("Request body:", requestBody);

        const result = await axios.patch(
          `http://172.20.10.5:8000/api/user/${userId}`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (result.data && result.data.result) {
          const updatedUser = result.data.result;
          setLastName(updatedUser.lastName);
          setFirstName(updatedUser.firstName);
          setEmail(updatedUser.email);
          setPosition(updatedUser.position);
          console.log("Data saved:", result.data);
        } else {
          console.error("Invalid response structure:", result.data);
        }
      } else {
        console.error("Some data is missing. Cannot save.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      setDeleteLoading(true);
      setDocuments(documents.filter((document) => document.id !== documentId));
      await axios.delete(`${API_BASE_URL}/${documentId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditDocument = (document) => {
    console.log("Selected document for editing:", document);
    setEditingDocument(document);
    setNewTitle(document.name);
    setNewDescription(document.text);
  };

  const handleSaveChanges = async () => {
    if (!editingDocument) {
      alert("Не вибрано документ для редагування.");
      return;
    }

    if (!newTitle.trim() || !newDescription.trim()) {
      alert("Всі поля повинні бути заповнені.");
      return;
    }

    if (newFile && newFile.size > 1024 * 1024 * 5) {
      alert("Файл не повинен перевищувати 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newTitle);
    formData.append("text", newDescription);

    if (newFile) {
      formData.append("file", newFile, newFile.name);
    }

    console.log("Preparing to send FormData:");
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}: ${
          value instanceof Blob ? `${value.name}, size: ${value.size}` : value
        }`
      );
    }

    try {
      await sendUpdateRequest(formData);
    } catch (error) {
      console.error("Error updating document:", error);
      alert(
        `Error: ${error.response ? error.response.data.message : error.message}`
      );
    }
  };

  const sendUpdateRequest = async (formData) => {
    console.log(
      "Sending PATCH request to:",
      `${API_BASE_URL}/${editingDocument.id}`
    );
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/works/${editingDocument.id}`,
        formData
      );
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      setDocuments(
        documents.map((doc) =>
          doc.id === editingDocument.id ? response.data : doc
        )
      );
      setEditingDocument(null);
    } catch (error) {
      console.error("Error during HTTP request:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("No response from server");
      } else {
        console.error("Error message:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="user">
      <div className="user_head_line"></div>

      <div className="main">
        <div className="main_block">
          <div className="main_block_user">
            <div className="main_block_user_iconus">
              {firstName && lastName && (
                <>
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
                </>
              )}
            </div>
            {firstName && email && (
              <form>
                <label>{firstName}</label>
                <label>{email}</label>
              </form>
            )}
          </div>
          <ul>
            <IoHome className="main_block_icon" />
            <li>
              <Link to="/home">Головна</Link>
            </li>
          </ul>
          <ul onClick={toggleSubMenu}>
            <AiFillFileText className="main_block_icon" />
            <li>
              <Link to="#">Наукові матеріали</Link>
            </li>
          </ul>
          {showSubMenu && (
            <div className="sub-menu">
              <ul className="sub-menu__ul">
                <li className="sub-menu__ul__li">
                  <Link to="/science">
                    <a className="sub-menu__ul__li__a">Всеукраїнські </a>{" "}
                  </Link>
                </li>
                <li className="sub-menu__ul__li">
                  <Link to="/publications">
                    <a className="sub-menu__ul__li__a">Міжнародні</a>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <ul>
            <AiFillFileText className="main_block_icon" />
            <li>
              <Link to="/document">НДР</Link>
            </li>
          </ul>
          <ul>
            <AiFillFileText className="main_block_icon" />
            <li>
              <Link to="/documents">Рецензії та тези</Link>
            </li>
          </ul>
          <ul>
            <AiFillFileText className="main_block_icon" />
            <li>
              <Link to="/certificate">Свідоцтва</Link>
            </li>
          </ul>
          <ul>
            <AiFillFileText className="main_block_icon" />
            <li>
              <Link to="/calendar">Календар</Link>
            </li>
          </ul>

          <ul onClick={handleLogout}>
            <LogoutIcon className="main_block_icon" />
            <li>Вихід</li>
          </ul>
        </div>
        <div className="main_line"></div>

        <div className="main_page">
          <div className="main_page_hear">
            <h1>Особисті дані</h1>
          </div>
          <div className="main_page_form">
            <details open={personalDataCollapsed}>
              <summary
                className="personal_section"
                onClick={handleTogglePersonalDataCollapse}
              >
                <IoPersonCircleOutline className="personal_section_icon" />
                <h3>Особисті дані</h3>
                <p>
                  <a className="btn_btn-primary">
                    <BsCaretDown className="btn_btn-primary_icon" />
                  </a>
                </p>
              </summary>
              <div
                className={`collapse ${personalDataCollapsed ? "show" : ""}`}
              >
                <div className="card card-body">
                  <a>Прізвище</a>
                  <input
                    type="text"
                    placeholder="Прізвище"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    readOnly={!isEditing}
                    style={{ paddingLeft: "20px" }}
                  />
                  <a> Ім'я</a>
                  <input
                    type="text"
                    placeholder="Ім'я"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    readOnly={!isEditing}
                    style={{ paddingLeft: "20px" }}
                  />
                  <a>Email</a>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly={!isEditing}
                    style={{ paddingLeft: "20px" }}
                  />
                  <a>Посада</a>
                  <input
                    type="text"
                    placeholder="Посада"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    readOnly={!isEditing}
                    style={{ paddingLeft: "20px" }}
                  />
                </div>
                {isEditing ? (
                  <>
                    <button className="btn_btn-primary" onClick={handleSave}>
                      Зберегти
                    </button>
                    <button
                      className="btn_btn-primary"
                      onClick={handleCancelEdit}
                    >
                      Скасувати
                    </button>
                  </>
                ) : (
                  <button className="btn_btn-primary" onClick={handleEdit}>
                    Редагувати
                  </button>
                )}
              </div>
            </details>
          </div>

          <div className="documents-list">
            <div className="document-header">
              <h2 style={{ fontSize: "24px" }}>Ваші документи</h2>
              <button onClick={() => setShowAddProject(true)}>
                <FaPlus className="actions_pht" />
              </button>
            </div>

            <ul>
              {documents.length > 0 ? (
                documents.map((document) => (
                  <div key={document.id} className="document-item">
                    <li>
                      <span>{document.name}</span>
                      <div className="document-buttons">
                        <button onClick={() => handleEditDocument(document)}>
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(document.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    </li>
                    <hr className="document-separator" />
                    <br />
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "20px", fontStyle: "italic" }}></p>
              )}
            </ul>

            {showAddProject && (
              <div className="modal">
                <div className="modal-content">
                  <span
                    className="close"
                    onClick={() => setShowAddProject(false)}
                  >
                    &times;
                  </span>
                  <h3>Додати новий проект</h3>
                  <input
                    type="text"
                    placeholder="Назва проекту"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Опис проекту"
                    value={newProject.text}
                    onChange={(e) =>
                      setNewProject({ ...newProject, text: e.target.value })
                    }
                  />
                  <select
                    value={newProject.documentType}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        documentType: e.target.value,
                      })
                    }
                  >
                    <option value="">Оберіть тип документа</option>
                    <option value="НДР">НДР</option>
                    <option value="Рецензія">Рецензія</option>
                    <option value="Тези">Тези</option>
                    <option value="Наукова робота">Наукова робота</option>
                  </select>

                  {newProject.documentType === "Наукова робота" && (
                    <div>
                      <select
                        value={newProject.kind}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            kind: e.target.value,
                          })
                        }
                      >
                        <option value="">Оберіть підтип наукової роботи</option>
                        <option value="Всеукраїнські">Всеукраїнські</option>
                        <option value="Міжнародні">Міжнародні</option>
                      </select>
                    </div>
                  )}
                  {newProject.documentType === "НДР" && (
                    <div>
                      <input
                        type="text"
                        placeholder="Введіть шифр"
                        value={newProject.shufr}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            shufr: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Реєстраційна картка"
                        value={newProject.reestr_nomer}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            reestr_nomer: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Супровід"
                        value={newProject.cyprovid}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            cyprovid: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Коли впровадженно"
                        value={newProject.vprovadgeno}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            vprovadgeno: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  <input type="file" onChange={handleFileChange} />
                  <button onClick={handleSaveProject}>Додати</button>
                </div>
              </div>
            )}
          </div>

          {editingDocument && (
            <div className="modal">
              <div className="modal-content">
                <span
                  className="close"
                  onClick={() => setEditingDocument(null)}
                >
                  &times;
                </span>
                <h2>Редагувати документ</h2>
                <label>Назва</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <label>Опис</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                ></textarea>
                <label>Файл</label>
                <input
                  type="file"
                  onChange={(e) => setNewFile(e.target.files[0])}
                />
                <button onClick={handleSaveChanges}>Зберегти</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cadet;
