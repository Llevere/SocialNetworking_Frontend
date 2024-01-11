import React, { useState } from 'react';

const CustomAlert = ({ message }) => {
  const [showModal, setShowModal] = useState(true);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    showModal && (
      <div className="custom-alert">
        <div className="alert-content">
          <p>{message}</p>
          <button onClick={closeModal}>OK</button>
        </div>
      </div>
    )
  );
};

export default CustomAlert;