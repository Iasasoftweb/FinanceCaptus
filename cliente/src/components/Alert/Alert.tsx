import React from 'react';
import { Alert } from 'react-bootstrap';

const CustomAlert = ({ show, message, variant, onClose }) => {
  return (
    <Alert
      show={show}
      variant={variant}
      onClose={onClose}
      dismissible
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px'
      }}
    >
      {message}
    </Alert>
  );
};

export default CustomAlert;
