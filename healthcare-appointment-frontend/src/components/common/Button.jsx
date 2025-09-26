// src/components/common/Button.jsx

import React from 'react';
import './Button.css'; // We will create this CSS file next

function Button({ children, type = 'button', onClick, variant = 'primary' }) {
  // Dynamically create the className based on the variant prop
  const buttonClassName = `btn btn-${variant}`;

  return (
    <button
      type={type}
      className={buttonClassName}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;