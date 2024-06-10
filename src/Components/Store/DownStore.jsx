import React, { useState, useEffect } from "react";
import "./DownStore.scss";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { AiFillFileText } from "react-icons/ai";

const DownStore = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    document.querySelector(".main_lin").style.height = `${pageHeight}px`;
  }, []);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newDocuments = Array.from(files).map((file) => {
      return {
        name: file.name,
        url: URL.createObjectURL(file),
      };
    });
    setDocuments((prevDocuments) => [...prevDocuments, ...newDocuments]);
  };

  return (
    <div className="down">
      <div className="main_block">
        <div className="main_block_user">
          <Link to="/user" className="main_block_user_iconus">
            <IoPerson />
          </Link>
          <form>
            <label>Name</label>
            <label>Email</label>
          </form>
        </div>
        <ul>
          <IoHome className="main_block_icon" />
          <li>
            <Link to="/">Головна</Link>
          </li>
        </ul>
        <ul>
          <AiFillFileText className="main_block_icon" />
          <li>
            <Link to="/science">Наукові проекти</Link>
          </li>
        </ul>
      </div>
      <div className="main_lin"></div>

      <div className="store_doc">
        <h3>Завантажені документи</h3>
        {documents.length > 0 && (
          <ul>
            {documents.map((document, index) => (
              <li key={index}>
                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {document.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DownStore;
