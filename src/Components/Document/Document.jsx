import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoHome } from "react-icons/io5";
import { AiFillFileText } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import "./Document.scss";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";

const API_URL = "http://172.20.10.5:8000/ndr";
const API_UR = "http://172.20.10.5:8000/ndr/download";

const Document = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [jwt, setJwt] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [userId, setUserId] = useState(null);
  const [initialData, setInitialData] = useState({});
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("userId");
    if (role) {
      setUserRole(role);
    }
    if (id) {
      setUserId(id);
    }
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
    setJwt(result.jwt || Cookies.get("jwt"));
    setInitialData({
      lastName: result.lastName,
      firstName: result.firstName,
      email: result.email,
    });

    fetchProjects();
  }, [location.state, navigate]);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
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

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          type: "НДР",
        },
      });
      console.log("Projects from server:", response.data);
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

  const downloadFile = async (projectId, fileName) => {
    try {
      const response = await axios.get(`${API_UR}/${projectId}`, {
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];
      let extension;
      if (contentType.includes("pdf")) {
        extension = "pdf";
      } else if (contentType.includes("word")) {
        extension = "docx";
      } else {
        extension = "unknown";
      }

      const fullFileName = `${fileName}.${extension}`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fullFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download document:", error);
      alert("Failed to download document. See console for more information.");
    }
  };

  const handleDownloadDocument = async (projectId, fileName) => {
    await downloadFile(projectId, fileName);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name &&
      project.shufr &&
      project.reestr_nomer &&
      project.cyprovid &&
      project.vprovadgeno &&
      project.type === "НДР" &&
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shufr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.reestr_nomer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
  const handleUserClick = () => {
    const link = getCabinetLink();
    navigate(link);
  };

  return (
    <div className="document-container">
      <div className="main_block">
        <div className="main_block_user" onClick={handleUserClick}>
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
                <Link to="/science">Всеукраїнські</Link>
              </li>
              <li className="sub-menu__ul__li">
                <Link to="/publications">Міжнародні</Link>
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
      <div className="line"></div>
      <div className="main_scien">
        <div className="title-bar">
          <h2>НДР</h2>
          <div className="actions">
            <button onClick={() => setShowSearch(!showSearch)}>
              <CiSearch className="actions_pht" />
            </button>
          </div>
        </div>
        {showSearch && (
          <input
            type="text"
            placeholder="Пошук"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        )}

        <div className="projects-container">
          <table>
            <thead>
              <tr>
                <th>Номер</th>
                <th>Назва НДР</th>
                <th>Шифр</th>
                <th>Реєстраційна карта</th>
                <th>Супровід</th>
                <th>Впроваджено</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>{project.shufr}</td>
                    <td>{project.reestr_nomer}</td>
                    <td>{project.cyprovid}</td>
                    <td>{project.vprovadgeno}</td>
                    <td>
                      <FaDownload
                        onClick={() =>
                          handleDownloadDocument(project.id, project.name)
                        }
                        style={{ cursor: "pointer", color: "black" }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Document;
