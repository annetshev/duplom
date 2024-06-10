import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import "./Documents.scss";
import { FaDownload } from "react-icons/fa";
import { HiArrowsUpDown } from "react-icons/hi2";
import { IoHome } from "react-icons/io5";
import { AiFillFileText } from "react-icons/ai";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import Cookies from "js-cookie";

const API_URL = "http://172.20.10.5:8000/reviews_abstracts";
const API_UR = "http://172.20.10.5:8000/reviews_abstracts/download";
const Documents = () => {
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
          type: ["Рецензія", "Тези"],
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const filteredProjects = projects.filter(
    (project) =>
      project.name &&
      project.author &&
      project.type &&
      (project.type.includes("Рецензія") || project.type.includes("Тези")) &&
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="main_science">
      <div className="line"></div>
      <div className="title-bar">
        <h2>Рецензії та тези</h2>
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <ul>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <li key={project.id}>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    color: "black",
                  }}
                >
                  {project.name} - {project.author}
                </span>
                {" | "}
                <span
                  onClick={() =>
                    handleDownloadDocument(project.id, project.name)
                  }
                  style={{ cursor: "pointer", color: "black" }}
                >
                  <FaDownload />
                </span>
              </li>
            ))
          ) : (
            <p style={{ fontSize: "30px", fontStyle: "italic" }}>
              Документів не знайдено.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Documents;
