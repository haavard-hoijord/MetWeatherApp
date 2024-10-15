import React, { useState } from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ onToggle }: any) => {
  const [isToggled, setIsToggled] = useState(true);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    onToggle(!isToggled);
  };

  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isToggled} onChange={handleToggle} />
      <span className="slider"></span>
    </label>
  );
};

export default ToggleSwitch;
