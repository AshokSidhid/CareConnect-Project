// src/components/common/Input.jsx

import React from 'react';
import './Input.css'; // We will create this CSS file next

function Input({ label, type = 'text', name, value, onChange, placeholder }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        required
      />
    </div>
  );
}

export default Input;