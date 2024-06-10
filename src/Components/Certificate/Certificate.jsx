import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoHome } from "react-icons/io5";
import { AiFillFileText } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import "./Certificate.scss";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";
import Collapsible from "react-collapsible";

const API_URL = "http://172.20.10.5:8000/certificate";

const API_UR = "http://172.20.10.5:8000/works/download";

const Certificate = () => {
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
  const [certificates, setCertificates] = useState([]);

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
    fetchCertificates();
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
          type: "Свідоцтво",
        },
      });
      console.log("Projects from server:", response.data);
      if (response.data && response.data.length > 0) {
        setProjects(response.data);
        console.log(response.data);
      } else {
        console.log("No projects found");
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      alert("Failed to fetch projects. See console for more information.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const fetchCertificates = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log("Certificates from server:", response.data);
      if (response.data && response.data.length > 0) {
        setCertificates(response.data);
      } else {
        console.log("No certificates found");
      }
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
      alert("Failed to fetch certificates. See console for more information.");
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

  const filteredCertificates = certificates.filter(
    (certificate) =>
      certificate.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      certificate.singned_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.issned_by.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Link to="/science">
                  <a className="sub-menu__ul__li__a">Всеукраїнські</a>
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
      <div className="line"></div>
      <div className="main_scien">
        <div className="title-bar">
          <h2>Свідоцтва</h2>
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

        <div className="project-list">
          {filteredCertificates.map((certificate) => (
            <Collapsible
              key={certificate.id}
              trigger={
                <div className="project-summary">
                  <img
                    src={`${API_URL}/img/${certificate.id}`}
                    className="project-image-fulls"
                  />
                  <span className="project-image-name">
                    {certificate.number}
                  </span>
                </div>
              }
            >
              <div className="project-details">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src={`${API_URL}/img/${certificate.id}`}
                          className="project-image-full"
                        />
                      </td>
                      <td>
                        <p className="project-description">
                          {certificate.description}
                        </p>
                        <p className="project-signed-by">
                          {certificate.singned_by}
                        </p>
                        <p className="project-issued-by">
                          {certificate.issned_by}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
