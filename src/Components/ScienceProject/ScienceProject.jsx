import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./ScienceProject.scss";
import { CiSearch } from "react-icons/ci";
import { FaDownload } from "react-icons/fa";
import axios from "axios";
import { HiArrowsUpDown } from "react-icons/hi2";
import { IoHome } from "react-icons/io5";
import { AiFillFileText } from "react-icons/ai";
import LogoutIcon from "@mui/icons-material/Logout";
import { IoPersonCircleOutline } from "react-icons/io5";

import Cookies from "js-cookie";

const API_URL = "http://172.20.10.5:8000/works";
const API_UR = "http://172.20.10.5:8000/works/download";

const ScienceProject = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [documentType, setDocumentType] = useState("Наукова робота");
  const [kind, setKind] = useState("Всеукраїнські");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);
      determineUserPurpose(storedUserId);
    }
    fetchProjects();
  }, [documentType, kind, purpose]);

  const determineUserPurpose = (userId) => {
    if (userId.startsWith("1")) {
      setPurpose("курсант");
    } else if (userId.startsWith("2")) {
      setPurpose("офіцер");
    } else {
      setPurpose("науковець");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          type: "Наукова робота",
          kind: "Внутрішні",
        },
      });
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

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedProjects = projects.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const filteredProjects = sortedProjects.filter(
    (project) =>
      project.name &&
      project.author &&
      project.type &&
      project.type.includes("Наукова робота") &&
      project.kind &&
      project.kind.includes("Внутрішні") &&
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="main_science">
      <div className="title-bar">
        <h2>
          Список наукових проектів
          <div>
            <h3>Внутрішні</h3>
          </div>
        </h2>
        <div className="actions">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="search-button"
          >
            <CiSearch className="actions_pht" />
          </button>
          <button onClick={handleSortToggle} className="sort-button">
            <HiArrowsUpDown className="actions_sort" />
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

      <div className="projects-list">
        <ul>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <li key={project.id}>
                <span className="project-info">
                  {project.name} - {project.author}
                </span>
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

export default ScienceProject;
