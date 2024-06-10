import React from "react";

const EditModal = ({ onSave, onCancel }) => {
  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <div className="card card-body">
          <label>Прізвище</label>
          <input type="text" placeholder="Прізвище" required />
          <label>Ім'я</label>
          <input type="text" placeholder="Ім'я" required />
          <label>Email</label>
          <input type="email" placeholder="Email" required />
          <label>Посада</label>
          <input type="text" placeholder="Посада" required />
        </div>
        <div className="edit-modal-buttons">
          <button className="btn btn-primary" onClick={onSave}>
            Зберегти
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
